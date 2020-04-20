import net from "@utils/net";
import { CALL_WEBSOCKET } from "@constants/constants";
import { Socket } from "wya-socket";
import { EventStore } from 'wya-ps';
import API_ROOT from "@stores/apis/root";
import { Message } from "iview";
// eslint-disable-next-line import/no-cycle
import { getCallTab, mousePosition, handleCopyPhone, handleMouseMove, getCallTabs, setCallTabs, getFirstDepartName } from "./util";

const xmlParser = require("fast-xml-parser");

let staffInfo = {
	agentno: "",
	exten: "",
	pstnnumber: "",
	agentstatus: "-1",
	method: "",
	callee: ""
};
const config = {
	timeoutSec: 30,
	loseHeartbeat: 0,
	heartbeatId: -1,
	call_id: undefined
};
let autoResignin = true;
let inCalling = false;
let tabId;
let needReconnect = true;
let connectClosed = true;
let popType = ""; // 1 commonIn  ,2 commonOut ,3 innnerIn ,4 innerOut 。。
const callEmitter = new EventStore();
const callService = {
	version: 1.0,
	storeName: 'call_tabs',
	socket: undefined,
	callEmitter,
	store: {
		modalPosition: undefined,
		customer_id: null,
		fixCustomerInfo: {},
		canAddRecord: false
	},
	baseErrorLog: {},
	getSocket() {
		return this.socket && this.socket.socket;
	},
	send(method, agentstatus) {
		if (method == 'manualCallout') this.store.canAddRecord = true;
		staffInfo.method = method;
		if (agentstatus) staffInfo.agentstatus = agentstatus;
		const str = JSON.stringify(staffInfo);

		this.socket.send(str);
	},
	init(staffInfo_) {
		 this.baseErrorLog = {
			version: _global.version,
			staff_id: _global.staff.staff_id,
			staff_name: _global.staff.staff_name,
			pstn_number: _global.staff.pstn_number,
			seat_number: _global.staff.seat_number,
			call_tabs: [],
			tab_id: '',
			time: '',
			error_msg: '',
			socket_res: ''
		};
		staffInfo = {
			...staffInfo,
			...staffInfo_
		};
		this.version = _global.version;
		this.storeName = 'call_tabs' + this.version;
		this.socket = new Socket();
		this.socket.connect(CALL_WEBSOCKET);
		this.socket.on("open", () => {
			connectClosed = false;
			let callTabsArr = getCallTabs();
			if (callTabsArr.length === 0) {
				tabId = 0;
				setCallTabs([{ id: tabId, signin: false }]);
				this.signIn();
			} else if (tabId === undefined || !callTabsArr.find(i => i.tabId == tabId)) {
				// 第一次连接
				tabId = callTabsArr[callTabsArr.length - 1].id + 1;
				callTabsArr.push({ id: tabId, signin: false });
				setCallTabs(callTabsArr);
				let index = callTabsArr.findIndex(item => item.signin);
				if (index === -1) {
					this.signIn();
				}
			} else {
				// 重连时，tabId会在第一次连接建立成功时创建，如果已经存在tabId代表现在是在重连
				// 在断网后socket不再能收到签出的信息，因此不会消除签入状态，因此强制进行一次签入
				this.signIn();
			}
			let loseCount = 0;
			let failCount = 0;
			const tempTimer = setInterval(() => {
				let _callTabsArr = getCallTabs();
				if (!_callTabsArr || _callTabsArr.length == 0 || !_global.staff.staff_id) {
					clearInterval(tempTimer);
					return;
				}
				if (failCount > 2) {
					clearInterval(tempTimer);
				}
				let index = _callTabsArr.findIndex(item => item.signin);
				// 防止同时签入，让最后一个签入就行
				if (index === -1 && _callTabsArr[_callTabsArr.length - 1].id === tabId) {
					if (loseCount >= 1) {
						this.signIn();
						failCount++;
						loseCount = 0;
					} else {
						loseCount++;
					}
				}
			}, 3000);
		});
		this.socket.on('close', res => {
			connectClosed = true;
			clearInterval(config.heartbeatId);
			console.error('连接断开');
		});
		this.socket.on('message', _res => {
			// 对 xml 的处理
			if (_res.data.charAt(0) === "<") {
				const json = xmlParser.parse(_res.data);
				const jsonObj = json.event;
				const jsonObjRes = json.response;

				if (jsonObj) {
					switch (jsonObj.cmdType) {
						case "hangup": {
							inCalling = false;
							this.setInCalling(false);
							app.$store.commit("CALL_MODAL_CHANGE_STATUS", {
								status: "3"
							});
							break;
						}
						case "answer": {
							if (popType === "1" || popType === "3") {
								app.$store.commit(
									"CALL_MODAL_CHANGE_STATUS",
									{
										status: "2"
									}
								);
							}
							break;
						}
						case "callee_answer": {
							app.$store.commit("CALL_MODAL_CHANGE_STATUS", {
								status: "2"
							});
							break;
						}
						default:
							break;
					}
				} else if (jsonObjRes) {
					switch (jsonObjRes.cmdType) {
						case "signout":
							if (
								jsonObjRes.retCode == 0
									|| jsonObjRes.retCode == -7
							) {
								if (config.heartbeatId >= 0) {
									clearInterval(config.heartbeatId);
									config.heartbeatId = -1;
								}
								// if (self.props.callSocket.signIn) {
								// message.success("签出成功");
								callEmitter.emit("SALE_CALL_SIGNOUT_SUCCESS");
								const callTabsArr = getCallTabs();
								const tab = callTabsArr.find(
									item => item.id == tabId
								);
								tab.signin = false;
								setCallTabs(callTabsArr);
							}
							break;
						default:
							break;
					}
				}
				return;
			}
			// 对json的处理；
			let data;
			try {
				data = JSON.parse(_res.data);
			} catch (e) {
				return;
			}
			if (!data) return;
			if (data.type === "event") {
				switch (data.method) {
					case "signin":
						if (data.retCode == "0") {
							// 通话结束后座席状态默认空闲
							this.send("setAcsType", "1");
							if (config.heartbeatId >= 0) {
								clearInterval(config.heartbeatId);
								config.heartbeatId = -1;
							}
							config.heartbeatId = setInterval(
								() => this.heartbeat(),
								config.timeoutSec * 1000
							); // 获取座席权限
							this.send("getDefinedRoleRights");
						} else if (data.retCode == "-53") {
							Message.error("用户名或密码错误，签入失败");
							this.addErrorLog('用户名或密码错误，签入失败', _res.data);
						} else {
							Message.error("网络异常");
							this.addErrorLog('网络异常', _res.data);
						}
						break;
					case "signout":
						if (data.retCode == "0") {
							if (config.heartbeatId >= 0) {
								clearInterval(config.heartbeatId);
								config.heartbeatId = -1;
							}
						}
						break;
					case "disconnect":
						// 连接断开

						if (config.heartbeatId >= 0) {
							clearInterval(config.heartbeatId);
							config.heartbeatId = -1;
						}
						break;
					case "agent_status_change": // 座席状态被改变
						staffInfo.agentstatus = data.status;
						if (data.status === "0") { callEmitter.emit("SALE_CALL_AGENT_STATUS_CHANGE_0"); }
						if (
							staffInfo.agentstatus === "4"
								|| staffInfo.agentstatus === "6"
						) { this.changeStatus("0"); }
						break;
					case "common_callin_bridge_ring": // 呼入弹屏
						if (getFirstDepartName() == 'sale') {
							popType = "1";
							inCalling = true;
							this.setInCalling(true);

							//  获取客户信息
							// if (data.customerNum.charAt(0) === "0") {
							// 	data.customerNum = formatFixdPhone(data.customerNum);
							// }
							this.loadCustomerInfo(data.customerNum).then(
								res => {
									const agentId = data.agentUuid;

									const customerId = (res.data.info && res.data.info.relation_id) || "0";
									// 添加通话记录
									this.store.canAddRecord = true; // 呼入时允许添加通话记录
									this.addRecord(
										agentId,
										"1",
										data.customerNum
									);
								}
							);
							// 弹出通话弹窗
							app.$store.commit("CALL_MODAL_CHANGE_STATUS", {
								status: "6"
							});
							app.$store.commit("CALL_MODAL_SHOW", {
								show: true,
								phone: data.customerNum,

							});
						}
						break;
						
					case "manual_callout_agent_ring": {
						// 呼出弹屏
						popType = "2";
						inCalling = true;
						this.setInCalling(true);
						const agentId = data.agentUuid;
						this.addRecord(agentId, "2", data.customerNum);
						app.$store.commit("CALL_MODAL_CHANGE_STATUS", {
							status: "1"
						});
						app.$store.commit("CALL_MODAL_SHOW", {
							show: true,
							phone: data.customerNum
						});
						break;
					}
					default:
						break;
				}
			} else if (data.type === "response") {
				// 主要用于提示
				const code = data.retCode;
				switch (data.method) {
					case "signin": {
						if (code == "0") {
							// autoResignin = true;
							// message.success("签入成功");
							callEmitter.emit("SALE_CALL_SIGNIN_SUCCESS");
							const callTabsArr = getCallTabs();
							callTabsArr.forEach(
								item => (item.signin = false)
							);
							const tab = callTabsArr.find(
								item => item.id == tabId
							);
							tab.signin = true;
							setCallTabs(callTabsArr);
						} else if (code == "-6") {
							Message.error("请不要重复签入");
							this.addErrorLog('请不要重复签入', _res.data);
						} else if (code == "-11") {
							Message.error("分机不在线或正在通话中");
							this.addErrorLog('分机不在线或正在通话中', _res.data);
							// Message.error("正在通话中");
						} else if (code == "-12") {
							Message.error("分机已被其他座席绑定，签入失败");
							this.addErrorLog('分机已被其他座席绑定，签入失败', _res.data);
						} else if (code != "0") {
							Message.error("网络异常");
							this.addErrorLog('网络异常', _res.data);
						}
						break;
					}
					case "manual_callout": {
						// 外呼
						if (code == "-19" || code == "-22") {
							Message.error("接入号不正确，呼叫失败");
							this.addErrorLog('接入号不正确，呼叫失败', _res.data);
						} else if (code == "-24" || code == "-31") {
							Message.error("座席非空闲状态，呼叫失败");
							this.addErrorLog('座席非空闲状态，呼叫失败', _res.data);
						} else if (code == "-23") {
							// Message.error("请先签入");
							console.error('请先签入');
							this.addErrorLog('请先签入', _res.data);
							this.signIn();
						} else if (code == "-32") {
							Message.error("对方正在通话中");
							this.addErrorLog('对方正在通话中', _res.data);
						} else if (code != "0") {
							Message.error("网络异常");
							this.addErrorLog('网络异常', _res.data);
						}
						break;
					}
					case "heartbeat":
						if (code == "0") {
							config.loseHeartbeat = 0;
						}
						break;
					case "internal_call":
						if (code == "0") {
							break;
						} else if (code == "-30") {
							Message.error("被叫座席不在线，呼叫失败");
						} else if (code == "-24" || code == "-31") {
							Message.error("座席非空闲状态，呼叫失败");
						} else if (code == "-32") {
							Message.error("对方正在通话中");
						} else if (code == "-28") {
							Message.error("不能拨打电话给自己");
						} else if (code != "0") {
							Message.error("网络异常");
						}
						break;
					default:
						break;
				}
			}
		});
		this.socket.on('error', err => {
			console.error("onerror:网络异常 --- callSocket", err);
		});
		this.addListener();
	},		
	addListener() {
		getFirstDepartName() == 'sale' && document.body.addEventListener("copy", handleCopyPhone);
		document.body.addEventListener("mousemove", handleMouseMove);
		app.$store.commit("CALL_MODAL_CHANGE_AUTH", { auth: true });
	},
	removeListener() {
		getFirstDepartName() == 'sale' && document.body.removeEventListener("copy", handleCopyPhone);
		document.body.removeEventListener("mousemove", handleMouseMove);
		app.$store.commit("CALL_MODAL_CHANGE_AUTH", { auth: false });
	},
	addRecord(agent_id = "0", type = "1", tel = '') {
		if (!this.store.canAddRecord) {
			console.log('不是自己呼出的电话，不添加通话记录');
			return;
		}
		this.store.canAddRecord = false;
		let params = {};
		const firstDepartName = getFirstDepartName();
		
		if (firstDepartName == 'sale') {
			const customerList = app.$store.state.saleCallModal.customerList;
			const selectedRelationId = app.$store.state.saleCallModal.selectedRelationId;
			let customerInfo = customerList.find(i => i.relation_id === selectedRelationId) || {};
			params = {
				relation_id: selectedRelationId || 0, //    关联的ID
				agent_id, // uuid
				relation_type: this.store.fixCustomerInfo.relation_type || customerInfo.relation_type || 0, // 关联类型 1 合同ID 2 客户ID 3 员工ID,
				type, // 通话类型 1呼入2手动呼出3内线呼入4内线呼出
				tel,
			};
		} else if (firstDepartName == 'sc' || firstDepartName == 'bs') {
			const listTypeMap = { sc: 2, bs: 3 };
			params = {
				list_type: listTypeMap[firstDepartName],
				relation_id: app.$store.state.saleCallModal.selectedRelationId || 0,
				relation_type: 1,
				agent_id,
				type,
				tel
			};
		} else {

			// eslint-disable-next-line prefer-promise-reject-errors
			return Promise.reject({ msg: '只有立客户和销售可以打电话', status: 0 });
		}
		return net.ajax({
			url: API_ROOT._SALE_DIALING__RECORDING_ADD_CALL_RECORD_POST,
			type: "POST",
			param: params
		}).then(res => {
			// 保存call_id 为接下来的addRemark做准备，清除customer_id，防止下一次如果加载失败的话将记录添加到上一次的客户上
			config.call_id = res.data.call_id;
			
		}).catch(res => {
			Message.error("网络异常");
		});
	},
	updateRecord(relationId) {
		const customerList = app.$store.state.saleCallModal.customerList;
		if (popType == '1' && customerList.length > 1 && relationId) {
			const customerInfo = customerList.find(i => i.relation_id === relationId);
			if (!customerInfo) return console.error('找不到客户');
			net.ajax({
				url: "_SALE_CUSTOMER_DIALING_UPDATE_RECORD_POST",
				type: "POST",
				param: {
					"call_id": config.call_id, // 主键
					"relation_id": relationId, // 关联ID
					"relation_type": customerInfo.relation_type, // 关联类型 0 未知 1 合同ID 2 客户ID
					"tel": customerInfo.tel // 呼入的电话
				},
				loading: false,
			}).then(res => {}).catch((res) => {
				console.error(res);
				app.$Message.error(res.msg);
			});
		}
	},
	addRemark(formData) {
		return net.ajax({
			url: API_ROOT._SALE_DIALING_RECORDING_ADD_REMARK_POST,
			type: "POST",
			param: {
				call_id: config.call_id,
				...formData
			}
		});
	},
	loadCustomerInfo(tel) {
		return net.ajax({
			url: API_ROOT._SALE_DIALING_RECORDING_GET_CUSTOMER_INFO_GET,
			type: "GET",
			loading: false,
			param: {
				tel,
				exception: 0
			}
		}).then(res => {
			if (!Array.isArray(res.data)) {
				res.data = [];
			}
			app.$store.commit("CALL_MODAL_CHANGE_INFO", {
				customerList: res.data,
			});
			app.$store.commit('CALL_MODAL_CHANGE_PHONE', { phone: tel });
			let relationId;
			const callModal = app.$store.state.saleCallModal;
			if (callModal.customerList.length == 1) {
				relationId = callModal.customerList[0].relation_id;
			} else {
				relationId = 0;
			}
			app.$store.commit('CALL_MOADL_CHANGE_RELATION_ID', { relation_id: relationId });
			return res;
		}).catch(res => {
			app.$store.commit("CALL_MODAL_CHANGE_INFO", {
				customerList: [],
			});
			app.$store.commit('CALL_MODAL_CHANGE_PHONE', { phone: '' });
			console.error(res);
			return res;
		});
	},
	heartbeat() {
		if (config.loseHeartbeat === 0) {
			config.loseHeartbeat++;
			this.socket.send(
				"{'method':'heartbeat','agentno':'" + staffInfo.agentno + "'}"
			);
		} else {
			clearInterval(config.heartbeatId);
		}
	},
	signIn() {
		this.signOut();
		const tabArr = getCallTabs();
		const index = tabArr.findIndex(item => item.id == tabId);
		// 立刻改变状态，2表示正在签入还没签入成功，防止另一个页面在此时检查到没有一个页面签入而进行签入
		tabArr[index].signin = 2;
		setCallTabs(tabArr);
		setTimeout(() => {
			this.socket.send(
				JSON.stringify({
					...staffInfo,
					method: "signin",
					agentstatus: "0",
					password: "qq1245"
				})
			);
		}, 300);
	},
	signOut() {
		if (inCalling) {
			Message.warning("当前状态不能拨打电话");
			return;
		}
		this.socket.send(
			JSON.stringify({
				...staffInfo,
				method: "signout",
				agentstatus: "1",
				password: "qq1245"
			})
		);

		if (config.heartbeatId >= 0) {
			clearInterval(config.heartbeatId);
			config.heartbeatId = -1;
		}
		// message.success("签出成功");
	},
	changeStatus(state) {
		this.send("changeStatus", state);
	},
	// 外呼
	async callOut(phone) {
		const check = await this.checkCanCall();
		if (!check.status) return;
		const firstDepartName = getFirstDepartName();
		
		if (firstDepartName == 'sale') {
			const modal = app.$store.state.saleCallModal;
			if (phone === modal.callingPhone) {
				if (modal.customerList.length == 0) {
					staffInfo.callee = phone.replace(/-/g, "");
					this.send("manualCallout");
					return;
				}
				const exist = modal.customerList.find(customer => customer.relation_id === modal.selectedRelationId);
				if (exist) {
					if (exist.tips) {
						Message.error(exist.tips);
					} else {
						staffInfo.callee = phone.replace(/-/g, "");
						this.send("manualCallout");
						return;
					}
				} else {
					Message.error('请先选择公司再拨打电话');
				}
			} else {
				this.loadCustomerInfo(phone).then((res) => {
					if (res.status == 0) return;
					if (res.data.length > 1) {
					// 如果有多个客户则阻止拨打
						Message.error('请先选择公司再拨打电话');
					} else if (res.data.length == 1) {
						if (res.data[0].tips) {
							Message.error(res.data[0].tips);
						}
					} else {
						staffInfo.callee = phone.replace(/-/g, "");
						this.send("manualCallout");
					}
				});
			}
		} else if (firstDepartName == 'sc' || firstDepartName == 'bs') {
			app.$store.commit('CALL_MODAL_CHANGE_PHONE', { phone }); 
			staffInfo.callee = phone.replace(/-/g, "");
			this.send("manualCallout");
		} else {
			console.error('只有销售，立客户，商学院可以拨打电话，当前主部门为 ' + firstDepartName);
		}
	},

	async prepareToCallOut(phone, option = {}) {
		const res = await this.checkCanCall();
		if (!res.status) return;

		const firstDepartName = getFirstDepartName();
		if (firstDepartName == 'sale') {
			this.loadCustomerInfo(phone).then(res_ => {
				this.store.modalPosition = mousePosition;
				app.$store.commit("CALL_MODAL_CHANGE_STATUS", { status: "-1" });
				app.$store.commit("CALL_MODAL_SHOW", {
					show: true,
					phone
				});
			});
		} else if (firstDepartName == 'sc' || firstDepartName == 'bs') {
			const { customer } = option;
			if (!customer.contract_company_id) {
				console.error('立客户，商学院打电话必须传 contract_company_id');
				return;

			}
			const customerInfo = {
				relation_id: customer.contract_company_id, // 关联主键
				relation_type: 1,
				company_name: customer.contract_company_name || customer.company_name, // 公司名称或部门名称
				customer_name: customer.customer_name, // 客户姓名或员工姓名
				tel: customer.tel, // 客户电话或员工电话
			};
			// service 里也保存一份，因为vuex的数据可能不同步,关键是为了保存customer_id为接下来的添加通话记录做准备
			app.$store.commit("CALL_MODAL_CHANGE_INFO", {
				customerList: [customerInfo],
				// callType: 1,
				// tips: {}
			});
			app.$store.commit('CALL_MOADL_CHANGE_RELATION_ID', { relation_id: customerInfo.relation_id });
			this.store.modalPosition = mousePosition;
			app.$store.commit("CALL_MODAL_CHANGE_STATUS", { status: "-1" });
			app.$store.commit("CALL_MODAL_SHOW", {
				show: true,
				phone
			});


		} else {
			console.error('first depart name 必须是 sale 或 sc或bs, 现在是' + firstDepartName);
		}
		return 1;
	},
	once(event, func1, time, func2) {
		this.callEmitter.once(event, func1);
		setTimeout(() => {
			if (this.callEmitter.__events__[event] && this.callEmitter.__events__[event].length > 0) {
				this.callEmitter.off(event);
				func2();
			}
		}, time);
	},
	checkConnect() {
		return new Promise(resolve => {
			if (connectClosed && needReconnect) {
				this.socket = undefined;
				this.init();

				this.once(
					"SALE_CALL_SIGNIN_SUCCESS",
					() => resolve({ status: 1 }),
					1000,
					() => {
						console.error('checkConnect faild');
						Message.warning("网络不稳定，请稍后再试");

						resolve({ status: 0 });
					}
				);
			} else {
				resolve({ status: 1 });
			}
		});
		

	},
	checkSignin() {
		return new Promise(resolve => {
			const tab = getCallTab(tabId);
			if (!tab) {
				console.error('获取tab失败 id= ' + tabId);
				resolve({ status: 0 });
			} else if (!tab.signin) {
				this.signIn();
				this.once(
					"SALE_CALL_SIGNIN_SUCCESS",
					() => resolve({ status: 1 }),
					1000,
					() => {
						console.error('checkSignin failed');
						resolve({ status: 0 });
					}
				);
				
			} else {
				resolve({ status: 1 });
			}

		});
		

	},
	checkInCalling() {
		return new Promise(resolve => {
			if (this.getInCalling()) {
				Message.warning("正在通话中不能拨打电话");
				resolve({ status: 0 });
			} else {
				resolve({ status: 1 });
			}

		});
		

	},
	checkCallStatus() {
		return new Promise(resolve => {
			// 如果状态不对
			if (
				staffInfo.agentstatus === "4"
			|| staffInfo.agentstatus === "6"
			|| staffInfo.agentstatus === "-1"
			|| staffInfo.agentstatus === "7"
			) {
				this.changeStatus("0");
				this.once(
					"SALE_CALL_AGENT_STATUS_CHANGE_0",
					() => resolve({ status: 1 }),
					1000,
					() => {
						console.error('修改状态失败， staffInfo.agentstatus=' + staffInfo.agentstatus);
						Message.error('当前状态不能拨打电话，请稍后再试');
						resolve({ status: 0 });
					}
				);
			} else {
				resolve({ status: 1 });
			}
		});

	},
	checkCount() {
		return new Promise(resolve => {
			if (!_global.staff.seat_number || !_global.staff.pstn_number) {
				Message.error("此账户没有坐席号或外线号，请找人事专员添加坐席号后再拨打");
				console.error('checkCount failed');
				resolve({ status: 0 });
			} else {
				resolve({ status: 1 });
			}

		});
	},
	async checkCanCall() {
		let res;
		res = await this.checkCount();
		if (res.status) {
			console.log('checkCount success'); 
		} else {
			console.log('checkCount failed'); 
			return Promise.resolve({ status: 0 });
		} 

		res = await this.checkInCalling();
		if (res.status) {
			console.log('checkInCalling success'); 
		} else {
			console.log('checkInCalling failed'); 
			return Promise.resolve({ status: 0 });
		} 
		
		res = await this.checkConnect();
		if (res.status) {
			console.log('checkConnect success'); 
		} else {
			console.log('checkConnect failed'); 
			return Promise.resolve({ status: 0 });
		} 
		
		res = await this.checkSignin();
		if (res.status) {
			console.log('checkSignin success'); 
		} else {
			console.log('checkSignin failed'); 
			return Promise.resolve({ status: 0 });
		} 
	 
		res = await this.checkCallStatus();
		if (res.status) {
			console.log('checkCallStatus success'); 
		} else {
			console.log('checkCallStatus failed'); 
			return Promise.resolve({ status: 0 });
		}
		console.log('check over');
		return Promise.resolve({ status: 1 });
	},
	// 内呼
	internalCall(phone) {
		staffInfo.callee = phone;
		this.socket.send(
			"{'method':'internalCall','agentno':'"
				+ staffInfo.agentno
				+ "','callee':'"
				+ phone
				+ "'}"
		);
	},
	setInCalling(bool) {
		const tabArr = getCallTabs();
		const index = tabArr.findIndex(item => {
			return item.id === tabId;
		});
		if (index > -1) {
			tabArr[index].inCalling = bool;
			setCallTabs(tabArr);
		}
	},
	// 挂断
	hangUp() {
		this.send("hangup");
	},
	// 保持
	hold() {
		this.send("hold");
	},
	// 解除保持
	unHold() {
		this.send("unhold");
	},
	// 转接坐席
	blindTransfer(callee) {
		staffInfo.callee = callee;
		this.send("blindTransfer");
	},
	// 	三方
	threeway(callee) {
		staffInfo.callee = callee;
		this.send("threeway");
	},
	close() {
		needReconnect = false;
		this.removeListener();
		app.$store.commit("CALL_MODAL_SHOW", {
			show: false,
			phone: ""
		});
		if (this.socket != null) {
			if (inCalling) this.hangUp();
			// if (getCallTab(tabId).signin) this.signOut();
			this.setInCalling(false);
			this.socket.close();
			this.socket = undefined;
		}
	},
	getInCalling() {
		if (inCalling) return true;
		const tabArr = getCallTabs();
		const index = tabArr.findIndex(item => {
			return item.inCalling;
		});
		if (index > -1) {
			return true;
		} else {
			return false;
		}
	},
	addErrorLog(msg, res = '') {
		const errLog = { ...this.baseErrorLog };
		errLog.time = (new Date()).toLocaleString();
		errLog.tab_id = tabId;
		errLog.call_tabs = JSON.stringify(getCallTabs());
		errLog.error_msg = msg;
		errLog.socket_res = res;
		net.ajax({
			url: API_ROOT._SALE_CALL_ADD_LOG_POST,
			type: "POST",
			loading: false,
			param: errLog
		}).catch((err) => console.error(err));
	},
	fixCustomerInfo(customer) {
		this.store.fixCustomerInfo = customer;
	},
	clearFixCustomerInfo() {
		this.store.fixCustomerInfo = {};
	}
};
window.addEventListener('beforeunload', function () {
	const callTabsArr = getCallTabs();
	let index = callTabsArr.findIndex(item => item.id === tabId);
	if (index > -1) {
		callTabsArr.splice(index, 1);
		setCallTabs(callTabsArr); 
	}
	if (callService.getSocket()) callService.close();
});

export default callService;