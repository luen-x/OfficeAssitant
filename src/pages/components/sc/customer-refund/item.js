import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from "./popup/detail.vue";
import { AuditModal } from "./popup/audit.vue";

export default {
	data() {
		return {
			columns: [],
		};
	},
	computed: {
		getColumns() {
			let columns = [
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<div class="g-flex-ac">
								<AutoToolTip 
									content={params.row.contract_company_name}
									width="160px"
									theme="dark"
									placement="bottom" 
									labelClass={this.$auth[324] ? "g-c-blue-mid g-pointer" : ""}
								/>
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
					title: "客户手机号",
					key: "phone",
					minWidth: 120
				},
				{
					title: "退款金额",
					key: "refund_amount",
					minWidth: 100
				},
				{
					title: "退款类型",
					key: "refund_type",
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{["产品退款", "换产品退款", "余额退款"][params.row.refund_type * 1 - 1]}</div>
						);
					}
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 100
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 100
				},
				{
					title: "申请人",
					key: "staff_name",
					minWidth: 100
				},
				{
					title: "申请时间",
					key: "create_time",
					minWidth: 160
				}];

			if (this.type == 1) {
				columns.push({
					title: "操作",
					key: "title",
					fixed: "right",
					align: "center",
					width: 160,
					render: (h, params) => {
						return (
							<div class="g-flex g-pointer" style="color: #2397F9;">
								{
									this.$auth[353]
										? <div
											class="g-m-r-10"
											onClick={(e) => { this.handleOperate("1", params, e); }}
										>
												通过申请
										</div>
										: null
								}
								{
									this.$auth[321]
										? <div 
											onClick={(e) => { this.handleOperate("2", params, e); }}
										>
												驳回申请
										</div>
										: null
								}
							</div>
						);
					}
				});
			} else {
				columns.push({
					title: "审核人",
					key: "audit_staff_name",
					minWidth: 100
				}, {
					title: "审核时间",
					key: "audit_time",
					minWidth: 160
				});
			}
			
			return columns;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_CUSTOMER_REFUND_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_REFUND_LIST_RESET', {
				type: this.type
			});
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleOpenDrawer(row) {
			DetailDrawer.popup({
				type: this.type,
				refund_id: Number(row.refund_id),
				contract_id: Number(row.contract_id),
				contract_company_id: Number(row.contract_company_id),
				refund_type: Number(row.refund_type)
			}).then(res => {
				res && 	this.$store.commit("SC_CUSTOMER_COOPERATE_LIST_RESET", {
					type: 1
				});

				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		},

		handleOperate(name, params, e) {
			e.stopPropagation(); 
			
			AuditModal.popup({
				name,
				refund_id: params.row.refund_id,
				refund_type: Number(params.row.refund_type),
				contract_id: Number(params.row.contract_id)
			}).then(res => {
				res && this.$store.commit('SC_CUSTOMER_REFUND_LIST_RESET', { type: "" });
			});
		}
	}
};