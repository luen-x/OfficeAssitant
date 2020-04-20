<template>
	<div :style="style" :class="'v-callmodal-container g-prevent-portal '+ (minify? '':'_plus')">
		<div v-if="!minify" class="_movebar g-fs-14" style="cursor:move" @mousedown="handlePressMoveBar($event)">拨打电话</div>
		<span v-if="!minify" class="_icon-close">
			<span @click="handleMinify">
				<i v-if="canClose" class="iconfont icon-close g-pointer"/>
				<i v-else class="iconfont icon-suoxiao g-pointer"/>
			</span>
		</span>
		<div
			v-if="minify"
			class="__mini g-flex"
			@mousedown="handlePressMoveBar($event)"
			@click="handleMinify"
		>
			<div style="display:inline-block;width:330px;padding:5px;">
				<div class="g-flex g-jc-sb" style=" padding:5px 10px;">
					<span>{{ callModal.callingPhone || '--' }}</span>
					<span>{{ time }}</span>
				</div>
				<div style=" padding: 0px 10px 10px 10px;" class="g-oneline">
					{{ customerInfo.customer_name || '未知客户' }}
				</div>
			</div>
			<div class="__mini-right">
				<div style="text-align: center">
					<i class="iconfont icon-calling1" style="font-size:21px"/>
				</div>
				<div style="text-align: center">{{ statusName }}</div>
			</div>
		</div>
		<div v-else-if="isCalling" class="g-m-t-30">
			<div>
				<div class="g-flex g-flex-cc">
					
					<i v-if="status === '1' " class="iconfont icon-calling _icon-phone"/>
					<i v-else-if="status === '2' " class="iconfont icon-calling1 _icon-phone"/>
					<i v-else-if="status === '3' " class="iconfont icon-end-call _icon-phone"/>
					<div class="g-c-black2  g-m-l-5 " style="font-size:13px" >{{ callModal.callingPhone }}</div>
					
				</div>
				<div class="g-flex g-flex-cc">
					<div class="g-c-blue-mid" style="font-size:13px">{{ statusName }}</div>
				</div>
				<div class="g-flex g-flex-cc g-m-t-5 ">
					<span class="g-c-black2 g-m-r-10 " style="font-size:13px">{{ time }}</span>
					<div>
						<i-button v-if="status === '1' && false" style="padding: 0px 8px 2px;;" type="primary" @click="handleHangUp">取消</i-button>
						<i-button v-else-if="status==='2'" style="padding: 0px 8px 2px;;" type="primary" @click="handleHangUp">挂断</i-button>
						<i-button v-if="status === '3'" style="padding: 0px 8px 2px;;" type="primary" @click="handleCallOut(inputPhone)">重拨</i-button>
					</div>
				</div>
			</div>
			<div >
				<oa-sale-customer-info ref="customerInfo" :show-bottom-tel="false" />
				<i-form
					v-if="firstDepartName=='sale'"
					ref="form"
					:model="formData"
					:rules="rule"
					:label-width="79"
					class="g-m-t-10"	
				>
					<i-form-item label="接通状态：" prop="connect_status" style="margin-bottom:10px !important;width:134px ;   display: inline-block;">
						<i-select v-model="formData.connect_status" placeholder="请选择接通状态" style="width:65px" >
							<i-option :value="1">已接</i-option>
							<i-option :value="2">未接</i-option>
							<i-option :value="3">拒接</i-option>
							<i-option :value="4">空号</i-option>
							<i-option :value="5">微信</i-option>
						</i-select>
					</i-form-item>
					<i-form-item 
						v-if="formData.connect_status===1 || formData.connect_status===5" 
						label="客户意向:" 
						prop="customer_intention" 
						style="margin-bottom:10px !important;width:160px;display: inline-block;margin-left:5px"
					>
						<i-select v-model="formData.customer_intention" placeholder="请选择接客户意向" style="width:77px" >
							<i-option :value="1">无意向</i-option>
							<i-option :value="2">待联系</i-option>
							<i-option :value="3">跟进中</i-option>
						</i-select>
					</i-form-item>
					<i-form-item ref="remark" label="备注：" prop="remark">
						<oa-limit-words
							v-model="formData.remark"
							:max="500"
							placeholder="请输入备注内容"
							style="width: 220px"
						/>
					</i-form-item>
					<i-checkbox 
						v-if="actualCallTime>10 && customerInfo.link_id && customerInfo.can_sign" 
						v-model="formData.sign_error" 
						class="g-c-blue-mid" 
						style="margin-left: 78px;"
						@click.native="handleSignError"
					>
						标记错误联系方式
					</i-checkbox>
				</i-form>
				<div v-if="status === '3' || status === '4'" class="g-flex g-jc-fe g-m-t-15 g-pd-r-10">
					<i-button class="g-m-r-10" type="text" @click="handleClose">取消</i-button>
					<i-button :loading="submitLoading" type="primary" @click="handleSubmit">提交</i-button>
				</div>
			</div>
		</div>
		<div v-else-if="isDailing" class="g-m-t-30">
			<div >
				<div class="g-m-t-5 g-flex">
					<span style="width:70px;line-height: 30px;" class="g-tr">客户号码：</span>
					<i-input
						v-model="inputPhone" 
						style="width: 220px" 
						class="g-m-l-10" 
						placeholder="请输入客户号码"
						clearable
						@on-change="handleInputPhoneChange"
					/>
				</div>
				<oa-sale-customer-info ref="customerInfo" show-sign-time />
				<div class="g-flex g-jc-fe g-m-t-15 g-pd-r-10 ">
					<i-button class="g-m-r-10" type="text" @click="handleClose">取消</i-button>
					<i-button type="primary" @click="handleCallOut(inputPhone)">拨打</i-button>
				</div>
			</div>
		</div>
		<div v-else-if="isComming" class="g-m-t-30 ">
			<div class="g-flex g-flex-cc g-m-t-10">
				<i class="iconfont icon-calling _icon-phone"/>
			</div>
			<div class="g-flex g-flex-cc">
				<div class="g-c-black2 g-fs-16 ">{{ callModal.callingPhone }}</div>
			</div>
			<div class="g-flex g-flex-cc">
				<div class="g-c-blue-mid g-fs-16">{{ statusName }}</div>
			</div>
			<oa-sale-customer-info ref="customerInfo"/>
		</div>
	</div>

</template>
<script>
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';
import LimitWords from "@common/limit-words/limit-words";
import { services } from '@stores/services/sale';
import moment from 'moment';
import { getItem, setItem } from '@utils/utils'; 
import { Confirm } from '@common/confirm/confirm.vue';
import { getTime, validatePhone, getFirstDepartName } from './util';
import callService from './service';
import iview from '../../_common/iview';
import CustomerInfo from './customer-info';
import { RemarkTip } from './remark-tip';

const modalStatus = {
	// 弹出框状态
	"-1": "输入电话",
	"0": "空闲",
	"1": "接通中...",
	"2": "通话中...",
	"3": "通话结束",
	"4": "未接通",
	"5": "已拒接",
	"6": "有来电...",
};
const callTypeNames = {
	// 电话类型
	"0": "系统外部客户号码",
	"1": "系统内部客户号码",
	"2": "员工号码"
};
const inComingStatus = ["5", "6"]; // 来电页面状态
const callOutStatus = ["0", "1", "2", "3", "4"]; // 呼出页面状态
const needRecountArr = ["-1,1", "1,2", "6,2", "3,1", "3,6"];
let countTimer;
export default {
	name: "v-call-modal",
	components: {
		'oa-limit-words': LimitWords,
		'oa-sale-customer-info': CustomerInfo,
	},
	mixins: [iview, services.otherConfig()],
	props: {
		data: Object
	},
	data() {
		// let relationId;
		// const callModal = app.$store.state.saleCallModal;
		// if (callModal.customerList.length == 1) {
		// 	relationId = callModal.customerList[0].relation_id;
		// 	app.$store.commit('CALL_MOADL_CHANGE_RELATION_ID', { relation_id: relationId });
		// } else {
		// 	relationId = 0;
		// 	app.$store.commit('CALL_MOADL_CHANGE_RELATION_ID', { relation_id: 0 });
		// }
		return {
			call_last_time: 0,
			actualCallTime: 0, // 实际接通时长
			inputPhone: app.$store.state.saleCallModal.callingPhone,
			formData: {
				connect_status: 2,
				customer_intention: 1,
				remark: '',
				sign_error: false
			},
			
			rule: {
				remark: [{ required: false, type: 'string', message: "请填写备注", trigger: "blur" }]
			},
			// remark: '',
			minify: false,
			position: { top: 0, left: 0, },
			positionMini: { top: 0, left: 0, },
			moved: false,
			styleC: {
				transform: 'scale(0.8)',
				opacity: 0,
				transition: 'all 0.5s ease'
			},
			firstDepartName: getFirstDepartName(),
			submitLoading: false,
			// relationId

		};
	},
	computed: {
		callModal() {
			return app.$store.state.saleCallModal;
		},
		isComming() {
			return inComingStatus.includes(this.callModal.status);
		},
		isDailing() {
			return this.callModal.status == "-1";
		},
		isCalling() {
			return callOutStatus.includes(this.callModal.status);
		},
		canClose() {
			const status = this.callModal.status;
			return status === "3" || status === "-1";
		},
		customerList() {
			return this.$store.state.saleCallModal.customerList || [];

		},
		customerInfo() {
			return this.customerList.find(customer => customer.relation_id === this.callModal.selectedRelationId) || {};
		},
		status() {
			return this.callModal.status;
		},
		statusName() {
			return modalStatus[this.callModal.status];
		},
		time() {
			return getTime(this.call_last_time);
		},
		callTypeName() {
			return callTypeNames[this.callModal.callType];
		},
		style() {
			if (this.minify) {
				return { top: this.positionMini.top + 'px', left: this.positionMini.left + 'px', ...this.styleC };
			} else {
				return { top: this.position.top + 'px', left: this.position.left + 'px', ...this.styleC };
			}
		},
		callingPhone() {
			return this.callModal.callingPhone;
		},
		requireRemark() {
			return this.actualCallTime >= this.otherConfig.call_time;

		}
	},
	watch: {
		status(s1, s0) {
			const countType = s0 + "," + s1;
			if (s1 === "3") {
				countTimer && clearInterval(countTimer);
				this.minify = false;
			} else if (needRecountArr.includes(countType)) {
				this.startCount(countType);
			}
		},
		callingPhone(s1, s0) {
			if (s1 != s0) {
				this.inputPhone = s1;
			}
		},
		requireRemark(val) {
			this.rule.remark[0].required = !!val;
			this.$refs.remark.setRules();
		}
	},
	created() {
		document.body.addEventListener('keyup', this.handleKeyup, this);
		this.inputPhone = this.callModal.callingPhone;
		const modalPosition = callService.store.modalPosition;
		let top;
		let left;
		let winWidth;
		let winHeight;
		// 获取窗口宽度
		if (window.innerWidth) winWidth = window.innerWidth;
		else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth;
		// 获取窗口高度
		if (window.innerHeight) winHeight = window.innerHeight;
		else if (document.body && document.body.clientHeight) winHeight = document.body.clientHeight;
		if (modalPosition) {

			top = modalPosition.y;
			left = modalPosition.x;
		} else {
			top = 300;
			left = 300;
		}
		// setTimeout(() => {
		if (top > winHeight - 400) {
			top = winHeight - 400;

		}
		this.position.top = top;
		this.position.left = left;

		// }, 100);
		const s0 = this.callModal.status;
		if (s0 === "1" || s0 === "6") {
			this.startCount();
		}
		setTimeout(() => {
			this.styleC.transform = 'scale(1)';
			this.styleC.opacity = 1;

		}, 100);
		setTimeout(() => {
			this.styleC.transition = '';
		}, 600);
	},
	beforeDestroy() {
		callService.updateRecord();

		// 清除vuex的客户数据，防止华为那边有消息推送
		this.$store.commit("CALL_MODAL_CHANGE_INFO", {
			customerList: [],
		});
		this.$store.commit('CALL_MOADL_CHANGE_RELATION_ID', { relation_id: 0 });
		callService.store.canAddRecord = false;
	},
	destroyed() {
		document.body.removeEventListener('keyup', this.handleKeyup, this);
		callService.clearFixCustomerInfo();
	},
	methods: {
		handleKeyup(event) {
			if (event.keyCode == 27) {
				this.canClose && this.handleClose();
			}
		},
		handlePressMoveBar(event) {
			event.preventDefault();
			event.stopPropagation();
			let position;
			if (this.minify) {
				position = this.positionMini;

			} else {
				position = this.position;
			}
			const x1 = event.clientX;
			const y1 = event.clientY;
			const top0 = position.top;
			const left0 = position.left;
			const windowWidth = document.body.clientWidth;
			const windowHeight = document.body.clientHeight;
			document.onmousemove = oevent => {
		
				const x2 = oevent.clientX;
				const y2 = oevent.clientY;
				let top = top0 - y1 + y2;
				let left = left0 - x1 + x2;
				let paddingRight = 330;
				let paddingBottom = 30;
				if (this.minify) {
					paddingRight = 330;
					paddingBottom = 70;
				}
				if (top > windowHeight - paddingBottom) {
					top = windowHeight - paddingBottom;
				}
				if (top < 0) {
					top = 0;
				}
				if (left > windowWidth - paddingRight) {
					left = windowWidth - paddingRight;
				}
				if (left < 0) {
					left = 0;
				}

				position.top = top;
				position.left = left;
			};
			document.onmouseup = oevent => {
				const x2 = oevent.clientX;
				const y2 = oevent.clientY;
				if ((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2) > 2) {
					this.moved = true;
				} else {
					this.moved = false;
				}
				document.onmousemove = null;
				document.onmouseup = null;
			};
		},
		startCount(countType) {
			if (countTimer) {
				clearInterval(countTimer);
				countTimer = undefined;
			}
			this.call_last_time = 0;
			if (countType == '1,2') this.actualCallTime = 0;
			countTimer = setInterval(() => {
				this.call_last_time = this.call_last_time + 1;
				if (countType == '1,2') {
					this.actualCallTime += 1;
				}
			}, 1000);
		},
		handleClose() {
			if (callService.store.saleRecord) callService.store.saleRecord = undefined;
			this.styleC.transition = 'all 0.5s ease';
			this.styleC.opacity = 0;
			this.styleC.transform = 'scale(0.8)';
			
			setTimeout(() => {
				app.$store.commit("CALL_MODAL_SHOW", { show: false });
				this.$emit('sure');
			}, 500);
		},
		handleMinify() {
			if (this.minify) {
				if (this.moved) return;
				this.styleC.transition = 'all 0.5s ease';
				this.minify = false;
				setTimeout(() => {
					this.styleC.transition = '';
				}, 600);
			} else if (this.canClose) this.handleClose();
			else {
				this.styleC.transition = 'all 0.5s ease';
				setTimeout(() => {
					this.styleC.transition = '';
				}, 600);
				this.minify = true;
				const windowWidth = document.body.clientWidth;
				const windowHeight = document.body.clientHeight;
				this.positionMini = {
					top: windowHeight - 80,
					left: windowWidth - 340,
				};
			}
		},

		// 挂断
		handleHangUp() {
			callService.hangUp();
			if (countTimer) {
				clearInterval(countTimer);
				countTimer = undefined;
			}
		},
		// 呼出
		handleCallOut: debounce(function (phone) {
			if (validatePhone(phone)) {
				callService.callOut(phone);
			} else {
				this.$Message.error("请输入有效的电话号码");
			}
		}, 300),
		async handleSubmit() {
			if (this.firstDepartName == 'sale') {
				const curDate = moment().format('YYYY-MM-DD');
				const lastTipTime =	getItem('tipMarkErrorLinkTime_' + this.$global.version);
				if (curDate != lastTipTime && this.formData.remark) {
					const ok = await RemarkTip.popup().then(() => 1).catch(e => e && console.error(e));
					if (!ok) return; 
				}
				this.submitLoading = true;
				this.$refs.form.validate(valid => {
					if (valid) {
						const temp = { ...this.formData };
						if (temp.connect_status !== 1 && temp.connect_status !== 5) {
							temp.customer_intention = '';
						}
						temp.sign_error = (this.customerInfo.link_id && temp.sign_error) ? 1 : 0;
						temp.link_id = this.customerInfo.link_id || '';
						callService.addRemark(temp).then(() => {
							this.$Message.success("提交成功");
							callService.callEmitter.emit('add-record');
							this.handleClose();
						}).catch(err => {
							console.error(err);
							this.submitLoading = false;
							this.$Message.warning(err.msg);
						});

					} else {
						this.submitLoading = false;
					}
				});
			} else {
				setTimeout(() => {
					this.handleClose(); 
				}, 500);
			}
			
		},
		handleInputPhoneChange(event) {
			const tel = event.target.value;
			if (validatePhone(tel) && this.callModal.callingPhone !== tel) {
				
				if (this.firstDepartName == 'sale') {
					callService.loadCustomerInfo(tel);
				} else if (this.firstDepartName == 'sc' || this.firstDepartName == 'bs') {
					// 
				} else {
					console.error('部门错误，当前为 ' + this.firstDepartName);
				}
				
			}
		},
		handleSignError(event) {
			event.preventDefault();
			if (this.formData.sign_error) {
				this.formData.sign_error = false;
				return;
			}
			Confirm.popup({
				title: '温馨提示',
				renderContent: (h) => {
					return (
						<div class="g-c-red-mid"> 
						标记错误联系方式后，会将你此次通话录音作为凭证提交给管理员审核。如果核实为虚假标记，将会被扣除微币，请如实举报。
						</div>
					);
				},
				cancelText: ''
			}).then(() => {
				this.formData.sign_error = true;
			}).catch(e => e && console.error(e));
			
		}
	}
};
export const CallModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-callmodal-container {
	width: 330px;
	position: fixed !important;
	display: block;
	z-index: 3000;
	transform:scale(1);
	&._plus {
		background: white;
		padding: 10px;
		padding-top: 12px;
		border: 1px lightgray solid;
		border-radius: 5px;
	}
	.__mini {
		cursor: pointer;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 16px;
		width: 330px;
		height: 70px;
		border-radius: 5px;
		.__mini-right {
			display: inline-block;
			width: 100px;
			margin-left: 2px;
			margin-top: 7px;
			border-left: 1px white solid;
			height: 57px;
		}
	}
	._call-btn {
		background-color: limegreen;
		color: white;
		border: none;
		&:hover {
			background-color: rgb(103, 224, 103);
			color: white;
			border: none;
		}

		&:focus {
			background-color: limegreen;
			color: white;
			border: none;
		}
	}
	._title-container {
		margin: -20px;
		margin-bottom: 0;
		background: lightgray;
		.__title {
		padding: 5px;
		}
	}
	._icon-phone {
		font-size: 28px;
		color: dodgerblue;
		margin: -10px 0 -9px 0;
	}
	._refuse-btn {
		background-color: rgba(224, 36, 36, 1);
		color: white;
		border: none;
		&:hover {
			background-color: rgb(224, 81, 81);
			color: white;
			border: none;
		}
		&:focus {
			background-color: rgb(224, 36, 36);
			color: white;
			border: none;
		}
	}
	._icon-close {
		display: inline-block;
		position: absolute;
		right: 8px;
		top: 5px;
	}
	._movebar {
		position: absolute;
		height: 30px;
		top: 0px;
		left: 0px;
		width: 100%;
		background: #f5f5f6;
		border-bottom: 1px lightgray solid;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	// &.ivu-tooltip-popper {
	// 	z-index: 110000!important;
	// }
}
</style>