import Explain from "@components/_common/explain/explain";
import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from "iview";
import { AccountDetail } from '@components/sale/achievement-staff/popup/detail';
import { refundDetail } from '@components/sale/achievement-staff/popup/refund-detail';
import { orderDetail } from '@components/sale/achievement-staff/popup/order-detail';
import { productRefund } from '@components/sale/achievement-staff/popup/product-refund';
import { DetailDrawer } from "../customer-achi/popup/detail.vue";
import { FinanceDetail } from "../_common";
import { StatusModal } from "./popup/status";
import { PrelectionModal } from "./popup/prelection-modal.vue";



export default {
	computed: {
		getColumns() {
			switch (this.type) {
				case "1":
					return this.accountColumns();
				case "2":
					return this.orderColumns();
				case "3":
					return this.fillingColumns();
				case "4":
					return this.refundColumns();
				default:
					break;
			}
		}
	},
	methods: {
		accountColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const {
							payment_id,
							contract_company_name,
							contract_company_id
						} = params.row;

						return (
							<div
								// onClick={() => DetailDrawer.popup({
								// 	type: "2",
								// 	payment_id,
								// 	contract_company_name,
								// 	contract_company_id
								// }).then(res => {})
								// }
								// class="g-operation"
								style="display: block"
							>
								{contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{contract_company_name.substr(
												0,
												15
											) + "..."}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 150
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实付金额
								<Explain
									style={{ marginLeft: "2px" }}
									title="客户实际支付的金额"
									content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
								/>
							</div>
						);
					}
				},
				{
					title: "分单后业绩",
					key: "after_share_performance",
					minWidth: 150
				},
				{
					title: "分单金额",
					key: "share_performance",
					minWidth: 150
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 250
				},
				{
					title: "操作",
					key: "title",
					width: 100,
					render: (h, params) => {
						return this.$auth['736'] || this.$auth['737'] || this.$auth['738'] ? h(
							Dropdown,
							{
								props: {
									transfer: true,
									placement: "left-start"
								},
								on: {
									"on-click": name => this.handleClick(name, params)
								}
							},
							[
								h("i", {
									class: "iconfont icon-point",
									style: "font-size: 20px"
								}),
								h(
									DropdownMenu,
									{
										slot: "list"
									},
									[
										this.$auth['736'] && h(
											DropdownItem,
											{
												props: {
													name: "0"
												}
											},
											"查看详情"
										),
										this.$auth['737'] && h(
											DropdownItem,
											{
												props: {
													name: "1"
												}
											},
											"修改业绩"
										),
										this.$auth['738'] && h(
											DropdownItem,
											{
												props: {
													name: "2"
												}
											},
											"修改记录"
										)
									]
								)
							]
						) : '';
					}
				}
			];
		},
		orderColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const {
							contract_company_name,
							contract_id,
							project,
							status,
							contract_company_id
						} = params.row;
						return (
							<div
								// onClick={() => FinanceDetail.popup({
								// 	type: status == 3 ? "4" : "2",
								// 	name: "contract",
								// 	contract_id,
								// 	contract_company_id,
								// 	project
								// }).then(res => {})
								// }
								// class="g-operation"
								style="display: block"
							>
								{contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{contract_company_name.substr(0, 15) + "..."}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 150
				},
				{
					title: "合同编号",
					key: "contract_num",
					minWidth: 150
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实付金额
								<Explain
									style={{ marginLeft: "2px" }}
									title="客户实际支付的金额"
									content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
								/>
							</div>
						);
					}
				},
				{
					title: "实扣成本",
					key: "cost_amount",
					minWidth: 150,
				},
				{
					title: "提成业绩",
					key: "minus_performance",
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								提成业绩
								<Explain
									style={{ marginLeft: "2px" }}
									title="当月可以算提成的业绩"
									content="如：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万"
								/>
							</div>
						);
					}
				},
				{
					title: "合同类型",
					key: "contract_type_name",
					minWidth: 150
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 250
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							this.$auth['736'] ? <div class="g-operation _name ">
								<span onClick={() => this.handleOrderDetail(params.row)}>
									查看详情
								</span>
							</div> : ''
						);
					}
				}
			];
		},
		fillingColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const {
							payment_id,
							contract_company_name,
							contract_id,
							contract_company_id
						} = params.row;
						return (
							<div
								// onClick={() => FinanceDetail.popup({
								// 	type: "2",
								// 	name: "contract",
								// 	contract_id,
								// 	contract_company_id
								// }).then(res => {})
								// }
								// class="g-operation"
								style="display: block"
							>
								{contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{" "}
											{contract_company_name.substr(0, 15) + "..."}{" "}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 150
				},
				{
					title: "合同编号",
					key: "contract_num",
					minWidth: 150
				},
				{
					title: "补款金额",
					key: "payment_amount",
					minWidth: 150
				},
				{
					title: "实扣成本",
					key: "cost_amount",
					minWidth: 150
				},

				{
					title: "提成业绩",
					key: "minus_performance",
					minWidth: 150
				},
				{
					title: "合同类型",
					key: "contract_type_name",
					minWidth: 150
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 250
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							this.$auth['736'] ? <div class="g-operation _name ">
								<span onClick={() => this.handleRefundDetail(params.row)}>
									查看详情
								</span>
							</div> : ''
						);
					}
				}
			];
		},
		refundColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const {
							contract_company_name,
							contract_num,
							refund_id,
							contract_id,
							refund_type,
							contract_company_id
						} = params.row;
						return (
							<div
								// onClick={() => FinanceDetail.popup({
								// 	type: "2",
								// 	name: "refund",
								// 	refund_id,
								// 	contract_id,
								// 	refund_type,
								// 	contract_company_name,
								// 	contract_company_id,
								// 	contract_num
								// }).then(res => {})
								// }
								// class="g-operation"
								style="display: block"
							>
								{contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{" "}
											{contract_company_name.substr(0, 15)
												+ "..."}{" "}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 150
				},
				{
					title: "退款金额",
					key: "refund_amount",
					minWidth: 150
				},
				{
					title: "退还成本",
					key: "refund_cost",
					minWidth: 150
				},
				{
					title: "应扣回提成",
					key: "deduction_commission",
					minWidth: 150
				},
				{
					title: "退款类型",
					key: "refund_type_name",
					minWidth: 150
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 250
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							this.$auth['736'] ? <div class="g-operation _name ">
								<span onClick={() => this.handleProductRefund(params.row)}>
									查看详情
								</span>
							</div> : ''
						);
					}
				}
			];
			
		},
		handleResetFirst() {
			this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleClick(name, params) {
			switch (name) {
				case "0":
					AccountDetail.popup({
						data: { 
							payment_id: params.row.payment_id,
							contract_company_name: params.row.contract_company_name
						}
					}).then(() => { });
					break;
				case "1":
					PrelectionModal.popup({
						payment_id: params.row.payment_id 
					}).then(() => { 
						if (this.$route.path.includes('/collage/salary/month')) {
							this.$store.commit("COLLAGE_SALARY_MONTH_LIST_INIT");
						} else {
							this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
						}
					});
					break;
				case "2":
					StatusModal.popup({
						payment_id: params.row.payment_id
					}).then(res => {
						if (this.$route.path.includes('/collage/salary/month')) {
							this.$store.commit("COLLAGE_SALARY_MONTH_LIST_INIT");
						} else {
							this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
						}
					});
					break;
				default:
					break;
			}
		},
		handleOrderDetail(row) {
			orderDetail.popup({
				data: {
					contract_id: row.contract_id,
				}
			}).then(() => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		},
		handleRefundDetail(row) {
			refundDetail.popup({
				data: {
					supply_id: row.supply_id
				}
			}).then(() => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		},
		handleProductRefund(row) {
			productRefund.popup({
				data: {
					refund_id: row.refund_id,
					refund_type: row.refund_type,
					contract_company_name: row.contract_company_name
				 }
			}).then(() => {}).catch(ele => {});
		},
	}
};
