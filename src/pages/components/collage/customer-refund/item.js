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
			let columns = [{
				title: "公司名称",
				key: "contract_company_name",
				minWidth: 220,
				fixed: "left",
				render: (h, params) => {
					return (
						<AutoToolTip 
							content={params.row.contract_company_name}
							width="180px"
							theme="dark"
							placement="bottom" 
							labelClass="g-c-blue-mid g-pointer"
						/>
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
				width: 150
			},
			{
				title: "退款金额",
				key: "refund_amount",
				minWidth: 100
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
					align: 'center',
					width: 160,
					render: (h, params) => {
						return (
							<div class="g-flex g-pointer" style="color: #2397F9;">
								{
									this.$auth[123]
										? <div
											class="g-m-r-10"
											onClick={(e) => { this.handleOperate("1", params, e); }}
										>
												通过申请
										</div>
										: null
								}
								{
									this.$auth[123] && this.$auth[124]
										? <div class="g-m-r-10">|</div>
										: null
								}
								{
									this.$auth[124]
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
			}

			return columns;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('COLLAGE_CUSTOMER_REFUND_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('COLLAGE_CUSTOMER_REFUND_LIST_RESET', {
				type: this.type
			});
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleOperate(name, params, e) {
			e.stopPropagation(); 

			AuditModal.popup({
				name,
				refund_id: params.row.refund_id
			}).then(res => {
				res && this.$store.commit('COLLAGE_CUSTOMER_REFUND_LIST_RESET', {
					type: ""
				});
			});
		},

		handleOpenDrawer(row) {
			DetailDrawer.popup({
				type: this.type,
				refund_id: Number(row.refund_id),
				contract_id: Number(row.contract_id)
			}).then(res => {
				if (res) {
					this.$store.commit("COLLAGE_CUSTOMER_REFUND_LIST_RESET", {
						type: 1
					});
				}

				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};