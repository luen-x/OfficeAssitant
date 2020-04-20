import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from "iview";
import { Confirm } from '@common/confirm/confirm';
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { RefundDetail } from "../_common/customer/popup";
import { ConfirmWithRemark } from "../_common/customer/confirm-remark";
import { ApplyRefund } from "../_common/customer/apply-refund";
import { ApplyLeftRefund } from "../_common/customer/apply-left-refund";
import { getAuth } from '../_common/util';

const columnStore = {};
export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 250,
					fixed: 'left',
					render: (h, params) => {
						const name = params.row.contract_company_name;
						return (
							<div
								class="g-dp-ib g-operation"
								style="width:100%;"
							>
								{name.length <= 15 && name}
								{name.length > 15 && (
									<Tooltip
										transfer
										content={name}
										maxWidth={250}
									>
										{name.substr(0, 15) + '...'}
									</Tooltip>
								)
								}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 120,
					ellipsis: true
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 130
				},
				{
					title: "退款金额",
					key: "refund_amount",
					minWidth: 130
				},
				{
					title: "退款类型",
					key: "refund_type_name",
					minWidth: 130
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 100,
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 130,
				},
				{
					title: "申请人",
					key: "staff_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.staff_name}
								theme="dark"
								placement="bottom"
								labelClass="g-pointer"
							/>
						);
					}
				},
				{
					title: "申请时间",
					key: "create_time",
					width: 200,
				}
				// {
				// 	title: "账户",
				// 	key: "bank_account",
				// 	minWidth: 200,
				// 	ellipsis: true
				// },
				// {
				// 	title: "开户行",
				// 	key: "open_bank",
				// 	minWidth: 130,
				// 	ellipsis: true
				// },
				
				
				
				// {
				// 	title: "部门",
				// 	key: "invite_depart_name",
				// 	minWidth: 130,
				// }
				

			],
			extraColumns: {
				"1": {
					title: "操作",
					key: "link",
					width: 150,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						if (!params.row.show_option) return null;
						const isOwn = params.row.is_own == 1;
						const row = params.row;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(isOwn, 458, 463) && (
									<span 
										class={row.show_option ? "g-operation " : 'g-operation-disable'} 
										onClick={() => this.popupDetail(row, "编辑退款", 'update')}
									>
									编辑退款
									</span>
								)}
								{getAuth(isOwn, 458, 463) && getAuth(isOwn, 457, 462) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(isOwn, 457, 462) && (
									<span 
										class={row.show_option ? 'g-operation' : 'g-operation-disable'}
										onClick={() => this.handleDrawBack(row)}
									>
									取消申请
									</span>
								)}
							

							</div>
						);
					}
				},
				"3": {
					title: "操作",
					key: "link",
					width: 130,
					fixed: 'right',
					render: (h, params) => {
						const row = params.row;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{/* 移除产品退款和换产品退款 */}
								{getAuth(params.row.is_own == 1, 461, 466) && row.refund_type == 3 && (
									<span 
										class={params.row.show_option && !params.row.is_again ? 'g-operation' : 'g-operation-disable'}
										onClick={() => this.popupDetail(params.row, "重新申请", 'readd')}
									>
									重新申请
									</span>
								)}
								{getAuth(row.is_own == 1, 461, 466) && row.refund_type == 3 && getAuth(row.is_own == 1, 724, 725) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(row.is_own == 1, 724, 725) && (
									<span 
										class={params.row.show_option ? "g-operation " : 'g-operation-disable'} 
										onClick={() => this.handleDelete(row)}
									>
									删除
									</span>
								)}

							</div>
						);
					}
				},
				"4": {
					title: "操作",
					key: "link",
					width: 130,
					fixed: 'right',
					render: (h, params) => {
						const row = params.row;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(row.is_own == 1, 461, 466) && row.refund_type == 3 && (
									<span 
										class={params.row.show_option && !params.row.is_again ? 'g-operation' : 'g-operation-disable'}
										onClick={() => this.popupDetail(row, "重新申请", 'readd')}
									>
									重新申请
									</span>
								)}
								{getAuth(row.is_own == 1, 461, 466) && row.refund_type == 3 && getAuth(row.is_own == 1, 724, 725) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(row.is_own == 1, 724, 725) && (
									<span 
										class={row.show_option ? "g-operation " : 'g-operation-disable'} 
										onClick={() => this.handleDelete(row)}
									>
									删除
									</span>
								)}

							</div>
						);
					}
				},
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_CUSTOMER_DEAL_REFUND_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_REFUND_LIST_RESET", {
				type: this.type
			});
		},
		getColumns(type) {
			if (columnStore[type]) {
				return columnStore[type];
			} else {
				const columnsCopy = [...this.columns];
				if (this.extraColumns[type]) {
					if ((type == '3' || type == '4') && (this.$auth[461] || this.$auth[466] || this.$auth[724] || this.$auth[725])) {
						columnsCopy.push(this.extraColumns[type]);
					} else if (type == '1') {
						// 只要有一个操作权限就展示该列
						if (this.$auth[457] || this.$auth[462] || this.$auth[458] || this.$auth[463]
						) {
							columnsCopy.push(this.extraColumns[type]);
						}

					} else { columnsCopy.push(this.extraColumns[type]); }
				}
				columnStore[type] = columnsCopy;
				return columnsCopy;
			}
		},
		showPass(row) {
			if (row.refund_type == 3) return false; // 余额更改销售自己没有通过和驳回
			if (!row.allow_audit) return false;
			return true;
		},
		async popupDetail(row, title, action) {
			if (!row.show_option) return {};
			if (action == 'readd' && row.is_again) return {};
			if (action == 'update' && row.is_audit) {
				this.$Message.error("退款已进入审核流程，不能进行编辑了哦！");
				return {};
			}
			if (action == 'update') {
				const ok = await this.$request({
					url: "_SALE_REFUND_HAS_AUDIT_GET",
					type: "GET",
					param: {
						refund_id: row.refund_id
					},
					loading: false,
				}).then(res => {
					return 1;
				}).catch((res) => {
					this.$Message.error(res.msg);
					this.handleResetCur();
					return 0;
				});
				if (!ok) return { has_audit: true };
			}

			let modal;
			if (row.refund_type === 3) {
				modal = ApplyLeftRefund;
			} else {
				modal = ApplyRefund;
			 }
			return modal.popup({
				data: {
					title,
					refund_id: row.refund_id,
					payment_id: row.payment_id,
					contract_company_id: row.contract_company_id,
					contract_id: row.contract_id,
					refund_type: row.refund_type,
					action,
				},
			}).then(res => {
				this.handleResetCur();
				return { has_update: true };
			}).catch((err) => {
				err && console.error('catch');
				return {};
			});
		},
		handleDelete(row) {
			if (!row.show_option) return Promise.resolve(0);
			return Confirm.popup({ msg: "确认删除该条记录吗？", title: "删除提示" }).then(() => {
				return this.$request({
					url: "_SALE_REFUND_DELETE_POST",
					type: "POST",
					param: {
						refund_id: row.refund_id,
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
		handleOpenDrawer(row) {
			if (!getAuth(row.is_own == 1, 644, 645)) return;
			RefundDetail.popup({
				data: {
					...row,
					is_own: row.is_own == 1,
					show_footer: row.show_option
				},
			}).then(err => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			}).catch(err => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			});
		},
		handlePass(row) {
			return ConfirmWithRemark.popup({
				title: "通过申请",
				label: "通过说明:",
				palceholder: "请输入通过说明",
				maxLength: 200,
				okCallback: remark => {
					return this.$request({
						url: "_SALE_REFUND_AUDIT_POST",
						type: "POST",
						param: {
							refund_id: row.refund_id, // 退款ID
							audit_remark: remark, // 审核备注
							status: 2 // 审核状态 2已通过 3 已驳回})
						},
						loading: false,
					}).then(res => {
						this.$Message.success(res.msg);
						return res;

					}).catch((res) => {
						this.$Message.error(res.msg);
						return res;
					});
					
				}
			}).then(() => {
				this.handleResetCur();
				return 1;
			}).catch(() => { return 0; });

		},
		handleRefuse(row) {
			return ConfirmWithRemark.popup({
				title: "驳回申请",
				label: "驳回原因:",
				palceholder: "请填写驳回原因",
				maxLength: 200,
				okCallback: remark => {
					return this.$request({
						url: "_SALE_REFUND_AUDIT_POST",
						type: "POST",
						param: {
							refund_id: row.refund_id, // 退款ID
							audit_remark: remark, // 审核备注
							status: 3 // 审核状态 2已通过 3 已驳回})
						},
						loading: false,
					}).then(res => {
						this.$Message.success(res.msg);
						return res;
					}).catch((res) => {
						this.$Message.error(res.msg);
						return res;
					});
					
				}
			}).then(() => {
				this.handleResetCur();
				return 1;
			}).catch((err) => {
				err && console.error('err');
				return 0;
			});

		},
		handleDrawBack(row) {
			return new Promise((resolve, reject) => {
				Confirm.popup({
					title: "取消申请",
					msg: "退款申请已经进入审核流程，取消后需重新申请，确认取消？"
				}).then(remark => {
					this.$request({
						url: "_SALE_REFUND_CANCEL_POST",
						type: "POST",
						param: {
							refund_id: row.refund_id, // 退款ID
							type: 3 // 1 删除 2 撤回 3 取消
						},
						loading: false,
					}).then(res => {
						this.$Message.success(res.msg);
						this.handleResetCur();
						resolve(1);
					}).catch((res) => {
						this.$Message.error(res.msg);
						resolve(0);
					});
	
				}).catch(() => {
					resolve(0);
				});
			});
		}
	}
};
