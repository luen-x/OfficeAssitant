import { Dropdown, DropdownMenu, DropdownItem, Poptip, Tag, Tooltip } from "iview";
import API from "@stores/apis/root";
import { getHashUrl } from "wya-utils";
import { Confirm } from "@common/confirm/confirm";
import { ContractDetail } from "../_common/customer/popup/index";
import { PayLeft } from "../_common/customer/pay-left";
import { ApplyRefund } from "../_common/customer/apply-refund";
import { getAuth, saleDataStore } from '../_common/util';
import Explain from '../../_common/explain/explain';

const operationNames = {
	0: { add: '下单', cancel: "撤回下单", readd: '重新下单' },
	1: { add: '下单', cancel: "撤回下单", readd: '重新下单' },
	2: { add: '下单', cancel: "撤回下单", readd: '重新下单' },
	3: { add: '续费', cancel: "撤回续费", readd: "重新续费" },
	4: { add: "更换产品", cancel: "撤回更换", readd: "重换产品" }
};
export default {
	data() {
		return {
			colomnStore: {},
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					fixed: "left",
					width: 250,
					render: (h, { row }) => {
						const name = row.contract_company_name;
						const maxLength = row.contract_type == 3 ? 12 : 15;
						return (
							<div
								class="g-dp-ib g-operation"
								style="width:100%;"
							>
								{name.length <= maxLength && (
									<span>
										{
											row.contract_type == 3 && (
												<span class="_supply">续费</span>
											)
										}
										{name}</span>)
								}
								{name.length > maxLength && (

									<Tooltip
										transfer
										maxWidth={220}
										content={name}
									>
										{
											row.contract_type == 3 && (
												<span class="_supply">续费</span>
											)
										}
										{name.substr(0, maxLength) + '...'}
									</Tooltip>
								)
								}

							</div>
						);
					}
				},
				{
					title: "合同编号",
					key: "contract_num",
					minWidth: 200,
				},
				{
					title: "下单产品",
					key: "project",
					minWidth: 200,
					render: (h, { row }) => {
						const str = row.project.map(item => {
							return item.product_name;
						}).join("/");
						if (str.length <= 12) {
							return (
								<span>{str}</span>
							);
						} else {
							return (
								<Tooltip transfer content={str} maxWidth={210}>
									{str.substr(0, 12) + '...'}
								</Tooltip>
							);
						}
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100,
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 130,
				},
				{
					title: "应付金额",
					key: "need_amount",
					minWidth: 130,
					renderHeader: (h, { row }) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								应付金额
								<Explain
									style={{ marginLeft: '2px' }}
									title="客户应该付款的金额"
									content="举例：微商系统合同的标准金额是13.98万，销售给客户优惠后的价格是10万，优惠后的金额即应付金额，即应付金额是10万"
								/>
							</div>
						);
					}
				},

				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 130,
					renderHeader: (h, { row }) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实付金额
								<Explain
									style={{ marginLeft: '2px' }}
									title="客户实际支付的金额"
									content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
								/>
							</div>
						);
					}
				},
				{
					title: "剩余尾款",
					key: "last_amount",
					minWidth: 130,
					renderHeader: (h, { row }) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								剩余尾款
								<Explain
									style={{ marginLeft: '2px' }}
									title="客户合作后还未付清的费用"
									content="举例：假如产品A需要10万，客户下单支付8万，则剩余尾款为2万"
								/>
							</div>
						);
					}
				},
				{
					title: "实扣成本",
					key: "total_cost_amount",
					minWidth: 130,
					renderHeader: (h, { row }) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实扣成本
								<Explain
									style={{ marginLeft: '2px' }}
									title="扣除的产品成本"
									content="举例：微商系统是10万，成本为10%，则扣除成本是1万"
								/>
							</div>
						);
					}
				},
				{
					title: "提成业绩",
					key: "commission_performance",
					minWidth: 130,
					renderHeader: (h, { row }) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								提成业绩
								<Explain
									style={{ marginLeft: '2px' }}
									title="当月可以算提成的业绩"
									content="举例：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万"
								/>
							</div>
						);
					}
				},
				{
					title: "服务提成",
					key: "service_amount",
					minWidth: 100,
				},
				{
					title: "合同类型",
					key: "contract_type_name",
					minWidth: 100,
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 130,
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 130,
				},
				{
					title: "下单人",
					key: "staff_name",
					minWidth: 130,
				},
				{
					title: "下单时间",
					key: "create_time",
					minWidth: 200,
				}
			],
			extraColumns: {
				"1": {
					title: "操作",
					key: "-",
					width: 160,
					fixed: 'right',
					className: '_full-colum',
					renderHeader: (h, { row }) => {
						return <div style="font-weight: normal;">
							操作
						</div>;
					},
					render: (h, { row }) => {
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(row.is_own == 1, 425, 432) && <span
									class={row.show_option ? "g-operation " : 'g-operation-disable'}
									onClick={() => this.handleEdit(row)}
								>
									重新编辑
								</span>
								}
								{getAuth(row.is_own == 1, 425, 432) && getAuth(row.is_own == 1, 426, 433) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable')} >|</span>
								)}
								{getAuth(row.is_own == 1, 426, 433) && <span
									class={row.show_option ? "g-operation " : 'g-operation-disable'}
									onClick={() => this.handleDrawBack(row)}
								>
									{operationNames[row.contract_type].cancel}
								</span>
								}
							</div>
						);
					}
				},
				"2": {
					title: "操作",
					key: "-",
					minWidth: 80,
					fixed: 'right',
					className: '_full-colum',
					renderHeader: (h, { row }) => {
						return <div style="font-weight: normal;">
							操作
						</div>;
					},
					render: (h, { row }) => {
						const isOwn = row.is_own == 1;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{/* {parseFloat(row.last_amount, 10) > 0 && getAuth(isOwn, 428, 435) && (
									<span
										class={row.show_option ? "g-operation " : 'g-operation-disable'}
										onClick={() => this.handleSupply(row)}
									>补交尾款</span>
								)}
								{parseFloat(row.last_amount, 10) > 0 && getAuth(isOwn, 428, 435) 
									&& (row.show_option && _global.auth[1006] && row.is_own == 1) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable')} >|</span>
								)}
								{(row.show_option && _global.auth[1006] && row.is_own == 1) && (
									<span
										class={row.show_option ? "g-operation " : 'g-operation-disable'}
										onClick={() => this.handleApplyTicket(row)}
									>申请开票</span>
								)} */}
								<Dropdown 
									trigger="hover" 
									placement="left-start" 
									width="112" 
									transfer
									onOn-click={(name) => row.show_option && this[name](row)}
								>
									<div style="width: 100%;height: 100%;">
										<i class="iconfont icon-point" style="font-size: 18px;" />
									</div>
									<DropdownMenu slot="list" style="text-align: left;">
										{getAuth(isOwn, 427, 434) && (
											<DropdownItem name="handleRefund" disabled={!row.show_option || !!row.has_refund || !!row.is_supply}>
														申请退款
											</DropdownItem>
										)}
										{/* {getAuth(isOwn, 713, 715) && (
											<DropdownItem 
												name="handleChangeProduct"
												disabled={!row.show_option || !!row.has_refund || !!row.is_supply} 
											>
														更换产品
											</DropdownItem>
										)} */}
										{parseFloat(row.last_amount, 10) > 0 && getAuth(isOwn, 428, 435) && (
											<DropdownItem name="handleSupply" disabled={!row.show_option} >
														补交尾款
											</DropdownItem>
										)}
										
										{(row.show_option && _global.auth[1006] && row.is_own == 1) && (
											<DropdownItem name="handleApplyTicket" class="g-pointer" disabled={!row.show_option} >
														申请开票
											</DropdownItem>
										)
										}
									</DropdownMenu>
								</Dropdown>
							</div>
						);
					}
				},
				"3": {
					title: "操作",
					key: "-",
					width: 130,
					fixed: 'right',
					className: '_full-colum',
					renderHeader: (h, { row }) => {
						return <div style="font-weight: normal;">
							操作
						</div>;
					},
					render: (h, { row }) => this.renderReadd(h, row)
				},
				"4": {
					title: "操作",
					key: "-",
					width: 60,
					fixed: 'right',
					className: '_full-colum',
					renderHeader: (h, { row }) => {
						return <div style="font-weight: normal;">
							操作
						</div>;
					},
					render: (h, { row }) => {
						return (
							<div class={row.show_option ? "g-operation " : 'g-operation-disable'}
								onClick={() => {
									window.event.stopPropagation();
									this.handleDelete(row);
								}}
							>
								删除
							</div>
						);
					}
				}
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_CUSTOMER_DEAL_CONTRACT_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_CONTRACT_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		getColumns(type) {
			if (this.colomnStore[type]) {
				return this.colomnStore[type];
			} else {
				const columnsCopy = [...this.columns];
				if (type == '1' && (this.$auth[425] || this.$auth[432] || this.$auth[426] || this.$auth[433])) {
					columnsCopy.push(this.extraColumns[type]);
				} else if (type == '2' && (this.$auth[428] || this.$auth[435] || this.$auth[427] || this.$auth[434])) {
					columnsCopy.push(this.extraColumns[type]);
				} else if (type == '3' && (
					this.$auth[430]
					|| this.$auth[437]
					|| this.$auth[429]
					|| this.$auth[436]
					|| this.$auth[713]
					|| this.$auth[715]
					|| this.$auth[722]
					|| this.$auth[723]
				)) {
					columnsCopy.push(this.extraColumns[type]);
				} else if (type == '4' && (this.$auth[722] || this.$auth[723])) {
					columnsCopy.push(this.extraColumns[type]);
				}
				this.colomnStore[type] = columnsCopy;
				return columnsCopy;
			}
		},
		handleOpenDrawer(row) {
			if (!getAuth(row.is_own == 1, 431, 438)) return;
			ContractDetail.popup({
				data: {
					...row,
					show_apply: +row.status + 1 == 2 && row.is_own == 1,
					last_amount: parseFloat(row.last_amount),
					type: +row.status + 1,
					is_own: row.is_own == 1,
					show_footer: row.show_option
				},
				router: this.$router
			}).then(err => {

			}).catch(err => {
				err && console.error(err);
			}).finally(() => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			});
		},
		handleDelete(row) {
			if (!row.show_option) return Promise.resolve(0);
			return Confirm.popup({ msg: "确认删除该条记录吗？", title: "删除提示" }).then(() => {
				return this.$request({
					url: "_SALE_CONTRACT_DELETE_POST",
					type: "POST",
					param: {
						contract_id: row.contract_id,
						type: 1
					},
					loading: false,
				}).then(res => {
					this.handleResetCur();
					this.$Message.success(res.msg);
					return 1;
				}).catch((res) => {
					this.$Message.error(res.msg);
					return 0;
				});
			});
		},
		renderReadd(h, row) {
			return (
				<div onClick={() => window.event.stopPropagation()}>
					{getAuth(row.is_own == 1, 430, 437) && (
						<span
							class={(row.show_option && !row.is_again) ? "g-operation " : 'g-operation-disable'}
							onClick={() => this.handleReadd(row)}
						>重新下单</span>
					)}
					{getAuth(row.is_own == 1, 430, 437) && getAuth(row.is_own == 1, 722, 723) && (
						<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable')} >|</span>
					)}
					{(getAuth(row.is_own == 1, 722, 723)) && (
						<span
							class={row.show_option ? "g-operation " : 'g-operation-disable'}
							onClick={() => this.handleDelete(row)}
						>删除</span>
					)}
				</div>

			);
			
		},
		handleReadd(row) {
			if (!row.show_option || row.is_again) return;
			const param = {
				contract_id: row.contract_id,
				contract_company_id: row.contract_company_id,
				customer_id: row.customer_id,
				contract_type: row.contract_type,
				action: 'readd'
			};
			
			this.$router.push(getHashUrl('/sale/customer/deal/contract/order', param));
			
		},
		handleEdit(row) {
			if (!row.show_option) return;
			this.$request({
				url: "_SALE_CONTRACT_CONTRACT_HAS_AUDIT",
				type: "GET",
				param: {
					contract_id: row.contract_id
				}
			}).then((res) => {
				const param = {
					contract_id: row.contract_id,
					contract_company_id: row.contract_company_id,
					customer_id: row.customer_id,
					contract_type: row.contract_type,
					action: 'update'
				};
				
				this.$router.push(getHashUrl('/sale/customer/deal/contract/order', param));
				
			}).catch(res => {
				this.$Message.error(res.msg);
			});

		},
		handleDrawBack(row) {
			if (!row.show_option) return Promise.resolve(0);
			return new Promise(resolve => {
				Confirm.popup({
					title: "撤回下单提示",
					msg: "撤回后填写的信息将无法恢复，确认撤回本次下单？"
				}).then(() => {
					this.$request({
						url: API._SALE_SALE_CONTRACT_DELETE_POST,
						type: "POST",
						loading: false,
						param: {
							contract_id: row.contract_id,
							type: 2
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.handleResetCur();
						resolve(1);
					}).catch(res => {
						resolve(0);
						this.$Message.error(res.msg);
					});
				});

			});
		},
		handleRefund(row) {
			if (!row.show_option) return;
			if (row.has_refund) {
				this.$Message.error("该合同退款已申请，请勿重复提交");
				return;
			}
			if (row.is_supply) {
				this.$Message.error("该合同存在待审核的补款申请，暂时不能退款");
				return;
			}
			ApplyRefund.popup({
				data: {
					title: "申请退款",
					action: 'add',
					contract_company_id: row.contract_company_id,
					contract_id: row.contract_id,
					refund_type: 1,
					projects: row.project
				}
			}).then((res) => {
				saleDataStore.refund_id = res.refund_id;
				this.$router.push({
					path: '/sale/customer/deal/refund',
					
				});
			}).catch(err => err && console.error(err));
		},
		handleSupply(row) {
			if (!row.show_option) return Promise.reject();
			return PayLeft.popup({
				data: {
					contract_id: row.contract_id,
					contract_company_id: row.contract_company_id,
					action: 'add'
				}
			}).then(amount => {
				// this.handleResetCur();
				return true;
			}).catch(() => { });
		},
		handleApplyTicket(row) {
			this.$router.push({ path: '/sale/ticket/apply', query: { type: 'sale', ...row } });
		},
		handleChangeProduct(row) {
			if (row.has_refund) {
				this.$Message.error("该合同退款已申请，请勿重复提交");
				return;
			}
			if (row.is_supply) {
				this.$Message.error("该合同存在待审核的补款申请，暂时不能退款");
				return;
			}
			ApplyRefund.popup({
				data: {
					title: "更换产品",
					action: 'add',
					contract_company_id: row.contract_company_id,
					contract_id: row.contract_id,
					refund_type: 2,
					projects: row.project
				}
			}).then((res) => {
				saleDataStore.refund_id = res.refund_id;
				this.$router.push({
					path: '/sale/customer/deal/refund',
					
				});
			}).catch(err => err && console.error(err));

		}
	}
};
