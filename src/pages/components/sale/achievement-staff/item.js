import { Tooltip } from 'iview';
import { AccountDetail } from './popup/detail';
import { orderDetail } from './popup/order-detail';
import { refundDetail } from './popup/refund-detail';
import { productRefund } from './popup/product-refund';
import { AccountRecord, ContractDetail } from "../_common/customer/popup/index"; // 到账记录审核通过;

export default {
	data() {
		return {
			columns1: [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 250,
					render: (h, params) => {
						return (
							<div>
								{params.row.contract_company_name.length <= 15 && params.row.contract_company_name}
								{params.row.contract_company_name.length > 15 && (
									<Tooltip transfer content={params.row.contract_company_name} maxWidth={250}>
										{params.row.contract_company_name.substr(0, 15) + "..."}
									</Tooltip>
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 100
				},

				{
					title: "分单后业绩",
					key: "after_share_performance",
					minWidth: 100
				},
				{
					title: "分单金额",
					key: "share_performance",
					minWidth: 160
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 160
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							<div class="g-operation _name ">
								<span onClick={() => this.handleAccountDetail(params.row)}>
									查看详情
								</span>
							</div>
						);
					}
				}
			],
			// 下单记录
			columns2: [
				{
					title: "公司名称",
					key: "contract_company_name ",
					width: 250,
					fixed: "left",
					render: (h, params) => {
						return (
							<div class="_name ">
								<span>
									{params.row.contract_company_name.length <= 15 && params.row.contract_company_name}
									{params.row.contract_company_name.length > 15 && (
										<Tooltip transfer content={params.row.contract_company_name} maxWidth={250}>
											{params.row.contract_company_name.substr(0, 15) + "..."}
										</Tooltip>
									)}
								</span>
							</div>
						);
					}
				},
				{
					title: "客户名称",
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
					minWidth: 150
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							<div class="g-operation _name ">
								<span onClick={() => this.handleOrderDetail(params.row)}>
									查看详情
								</span>
							</div>
						);
					}
				}
			],
			columns3: [
				{
					title: "公司名称",
					key: "contract_company_name ",
					width: 250,
					fixed: "left",
					render: (h, params) => {
						return (
							<div>
								<span onClick={() => this.handleContract(params.row)}>
									{params.row.contract_company_name.length <= 15 && params.row.contract_company_name}
									{params.row.contract_company_name.length > 15 && (
										<Tooltip transfer content={params.row.contract_company_name} maxWidth={250}>
											{params.row.contract_company_name.substr(0, 15) + "..."}
										</Tooltip>
									)}
								</span>
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
					minWidth: 150
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							<div class="g-operation _name ">
								<span onClick={() => this.handleRefundDetail(params.row)}>
									查看详情
								</span>
							</div>
						);
					}
				}
			],
			columns4: [
				{
					title: "公司名称",
					key: "contract_company_name ",
					width: 250,
					fixed: "left",
					render: (h, params) => {
						return (
							<div>
								{params.row.contract_company_name.length <= 15 && params.row.contract_company_name}
								{params.row.contract_company_name.length > 15 && (
									<Tooltip transfer content={params.row.contract_company_name} maxWidth={250}>
										{params.row.contract_company_name.substr(0, 15) + "..."}
									</Tooltip>
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
					minWidth: 150
				},
				{
					title: "操作",
					key: "audit_time",
					width: 160,
					render: (h, params) => {
						return (
							<div class="g-operation _name ">
								<span onClick={() => this.handleProductRefund(params.row)}>
									查看详情
								</span>
							</div>
						);
					}
				}
			]
		};
	},
	computed: {
		columns() {
			if (this.type == 2) {
				return this.columns2;
			} else if (this.type == 3) {
				return this.columns3;
			} else if (this.type == 4) {
				return this.columns4;
			} else {
			 return this.columns1;
			}
		}
	},
	methods: {
		handleOrderDetail(row) {
			orderDetail.popup({
				data: {
					contract_id: row.contract_id,
					contract_company_name: row.contract_company_name
				}
			}).then(() => {});
		},
		handleResetFirst() {
			this.$store.commit("SALE_ACHIEVEMENT_STAFF_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_ACHIEVEMENT_STAFF_LIST_RESET", { type: this.type });
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		getColumn(type) {
			return this["columns" + type];
		},
		handleAccountDetail(row) {
			AccountDetail.popup({
				data: {
					payment_id: row.payment_id,
					contract_company_name: row.contract_company_name
				}
			}).then(() => {}).catch(ele => {});
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
		handleContract(row) {
			ContractDetail.popup({
				data: {
					...row,
					last_amount: parseFloat(row.last_amount),
					type: '2',
					is_achieve: "1",
					is_own: row.is_own == 1,
					show_footer: row.show_option,

				}
			}).then(res => {
				let n = this.type || 0;
				this.$refs.tableTarget[n].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				let n = this.type || 0;
				this.$refs.tableTarget[n].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleRefundDetail(row) {
			refundDetail.popup({
				data: {
					supply_id: row.supply_id,
					contract_company_name: row.contract_company_name
				}
			}).then(() => {});
		},
		handleRowDetail(row) {

		},
	}
};
