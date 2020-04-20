import {
	AccountRecord,
	ContractDetail,
	RefundDetail,
	CustomerDetail
} from "@components/sale/_common/customer/popup";
import { getHashUrl } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Dropdown, DropdownMenu, DropdownItem, Poptip, Tag, Tooltip } from "iview";
import { PayLeft } from "../_common/customer/pay-left";
import { ApplyRefund } from "../_common/customer/apply-refund";
import { getAuth, saleDataStore } from '../_common/util';

// 成交客户下的列表数据都当做自己的客户处理
export default {
	data() {
		return {
			columns1: [
				{
					title: "实付金额",
					key: "payment_amount",
					width: 130,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div
								class="g-operation"
							>
								{params.row.payment_amount}
							</div>
						);
					}
				},
				{
					title: "成交月份",
					key: "deal_month",
					minWidth: 200
				},
				{
					title: "分单后业绩",
					key: "after_share_performance",
					minWidth: 130
				},
				{
					title: "到账金额",
					key: "received_amount",
					minWidth: 130
				},
				{
					title: "手续费",
					key: "poundage",
					minWidth: 100
				},
				{
					title: "收款公司",
					key: "received_company_name",
					minWidth: 200,
					render: (h, { row }) => {
						return (
							<AutoTooltip content={row.received_company_name} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: "录入人",
					key: "staff_name",
					minWidth: 100,
				},
				{
					title: "录入时间",
					key: "create_time",
					minWidth: 200,
				}
			],
			columns2: [
				{
					title: "合同编号",
					key: "contract_num",
					width: 150,
					fixed: 'left',
					render: (h, params) => {
						
						return (
							<div
								class="g-dp-ib g-operation"
								style="width:100%;"
							>
								{params.row.contract_num}
							</div>
						);
					}
				},
				{
					title: "下单产品",
					key: "project",
					minWidth: 200,
					render: (h, params) => {
						const products = params.row.project.map(it => it.product_name).join() || '--';

						return (
							<div>
								<AutoTooltip
									content={products}
									theme="dark"
									placement="bottom"
									labelClass="g-c-balck3"
								/>
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 120,
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 130
				},
				{
					title: "应付金额",
					key: "need_amount",
					minWidth: 130
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 130
				},
				{
					title: "剩余尾款",
					key: "last_amount",
					minWidth: 130
				},
				{
					title: "实扣成本",
					key: "total_cost_amount",
					minWidth: 130
				},
				{
					title: "提成业绩",
					key: "commission_performance",
					minWidth: 130
				},
				{
					title: "服务提成",
					key: "service_amount",
					minWidth: 130
				},
				{
					title: "合同类型",
					key: "contract_type_name",
					minWidth: 130
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 130,
					ellipsis: true
				},
				{
					title: "下单人",
					key: "staff_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "下单时间",
					key: "create_time",
					minWidth: 200
				},
				{
					title: "操作",
					key: "-",
					width: 100,
					fixed: 'right',
					align: 'center',
					render: (h, params) => {
						return (
							((parseFloat(params.row.last_amount, 10) != 0 && getAuth(this, 428, 435)) || getAuth(this, 427, 434)) && (
								<Dropdown
									onOn-click={(name) => this[name](params.row)}
									transfer
									placement="left-start"
								>
									<div onClick={(e) => { e.stopPropagation(); }}>
										<i
											class="iconfont icon-point g-pointer "
											style="font-size: 20px"
										/>
									</div>
									<DropdownMenu slot="list">
										{parseFloat(params.row.last_amount, 10) != 0 && getAuth(this, 428, 435) && (
											<DropdownItem name="handleSupply">
												补交尾款
											</DropdownItem>
										)
										}
										{/* {getAuth(this, 427, 434) && (
											<DropdownItem name="handleRefund">
												申请退款
											</DropdownItem>
										)
										} */}
										{/* 只有自己的客户才能申请开票 */}
										{
											<DropdownItem name="handleApplyTicket">
												申请开票
											</DropdownItem>
										}
									</DropdownMenu>
								</Dropdown>
							)
						);
					}
				}
			],
			columns3: [
				{
					title: "退款金额",
					key: "refund_amount",
					width: 130,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div
								style="width:100%;"
								class="g-operation"
							>
								{params.row.refund_amount}
							</div>
						);
					}
				},
				{
					title: "提成扣除月份",
					key: "minus_month",
					minWidth: 130,
					ellipsis: true
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
					ellipsis: true
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 130,
					ellipsis: true
				},
				{
					title: "申请人",
					key: "staff_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "申请时间",
					key: "create_time",
					minWidth: 200
				}
			],
			columns4: [
				{
					title: "客户公司名称",
					key: "company_name",
					width: 250,
					fixed: 'left',
					render: (h, params) => {
						const name = params.row.company_name;
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
					title: "客户电话",
					key: "tel",
					minWidth: 130,
				},
				{
					title: "客户等级",
					key: "level_name",
					minWidth: 100,
				},
				{
					title: "状态",
					key: "deal_status_name",
					minWidth: 130,
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120,
					ellipsis: true
				}
			]
		};
	},

	methods: {
		handleResetFirst(num) {
			this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST" + num + "_INIT");
		},
		handleResetCur(num) {
			this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST" + num + "_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		getColumns(type) {
			return this["columns" + type] || this.columns1;
		},
		showPass(params) {
			if (params.row.refund_type == 3) return false;
			if (!params.row.allow_audit) return false;
			return true;
		},
		handleApplyTicket(row) {
			this.$router.push({ path: '/sale/ticket/apply', query: { type: 'sale', ...row } });
		},
		handleOpenDrawer(row, value) {
			this.$vc.emit('SALE_CLOSE_CUSTOMER_DETAIL');
			switch (value) {
				case '1':
					// if (!getAuth(this, 418, 422)) return;
					AccountRecord.popup({
						router: this.$router,
						data: {
							payment_id: row.payment_id,
							type: row.status + 1 + '',
							contract_company_id: row.contract_company_id,
							contract_company_name: row.contract_company_name,
							customer_id: row.customer_id,
							deal_status: row.deal_status,
							staff_id: row.staff_id,
							staff_name: row.staff_name,
							is_own: this.isOwn,
							show_option: true,
							show_footer: true
						},
						condition: "deal-detail",
						showContacts: true,
					}).then(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					}).catch(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					});
					break;
				case '2':
					// if (!getAuth(this, 431, 438)) return;
					ContractDetail.popup({
						data: {
							contract_id: row.contract_id,
							contract_num: row.contract_num,
							contract_company_id: row.contract_company_id,
							type: row.status + 1 + '',
							contract_type: row.contract_type,
							last_amount: parseFloat(row.last_amount),
							payment_amount: row.payment_amount,
							has_refund: row.has_refund,
							is_own: this.isOwn,
							show_option: true,
							show_footer: true
						},
						showContacts: true,
						router: this.$router
					}).then(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					}).catch(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					});
					break;
				case '3':
					// if (!getAuth(this, 644, 645)) return;
					RefundDetail.popup({
						data: {
							refund_id: row.refund_id,
							contract_company_id: row.contract_company_id,
							contract_id: row.contract_id,
							refund_type: row.refund_type,
							status: row.status,
							show_pass: this.showPass({ row }),
							is_own: this.isOwn,
							show_footer: true,
							show_option: true,
						},
						showContacts: true,
					}).then(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					}).catch(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					});
					break;
				case '4':
					CustomerDetail.popup({
						router: this.$router,
						data: {
							...row,
							is_own: this.isOwn,
							// 成交客户的合同公司已经成交了不需要指派也没有删除等操作，只能录入到账
							hideOption: true,
						},
						showContacts: true,
						readOnly: false,
						store: this.$store,
					}).then(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					}).catch(err => {
						this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
					});
					break;
				default: break;
			}
		},
		handleRefund(row) {
			if (row.has_refund) {
				this.$Message.error("该合同退款已申请，请勿重复提交");
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
				// this.handleResetCur();
			}).catch(res => { });
		},
		handleSupply(row) {
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
	}
};
