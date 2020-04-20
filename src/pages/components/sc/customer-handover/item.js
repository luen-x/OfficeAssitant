import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { AuditModal } from "./popup/audit";
import { DetailDrawer } from "./popup/detail";

export default {
	data() {
		return {
			columns: []
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
									labelClass="g-c-blue-mid g-pointer"
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
				}, {
					title: "合同编号",
					key: "contract_num",
					minWidth: 140
				}, {
					title: "下单产品",
					key: "product_name",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.product_name}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				}, {
					title: "下单时间",
					key: "create_time",
					minWidth: 160
				}, {
					title: "上传时间",
					key: "upload_time",
					minWidth: 160
				}, {
					title: "上传人",
					key: "staff_name",
					minWidth: 200
				}
			];

			if (this.type == 1) {
				columns.push({
					title: "操作",
					key: "title",
					minWidth: 200,
					fixed: "right",
					render: (h, params) => {
						return (
							<div class="g-flex" style="color: #2397F9;">
								<div 
									class="g-pointer" 
									onClick={(e) => this.handleOperate(e, "1", params)}
								>
									审核通过
								</div>
								<div class="g-m-lr-10">|</div>
								<div 
									class="g-pointer" 
									onClick={(e) => this.handleOperate(e, "2", params)}
								>
									审核驳回
								</div>
							</div>
						);
					}
				});
			} else {
				columns.push({
					title: "审核人",
					key: "audit_staff_name",
					minWidth: 160
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
			this.$store.commit('SC_CUSTOMER_HANDOVER_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_HANDOVER_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(e, v, params) {
			e.stopPropagation();
			
			AuditModal.popup({
				name: v,
				project_id: Number(params.row.project_id),
				project_delivery_id: Number(params.row.project_delivery_id)
			}).then(res => {
				res && this.handleResetCur();
			});
		},
		handleOpenDrawer(row) {
			DetailDrawer.popup({
				type: this.type,
				contract_id: Number(row.contract_id),
				project_id: Number(row.project_id),
				project_delivery_id: Number(row.project_delivery_id)
			}).then(res => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};