import { Tooltip } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from "./popup/detail.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					fixed: "left",
					minWidth: 220,
					render: (h, params) => {
						return (
							<div>
								<AutoToolTip 
									content={params.row.contract_company_name}
									width="170px"
									theme="dark"
									placement="bottom" 
									labelClass={this.$auth[837] ? "g-c-blue-mid g-pointer" : ""}
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
					title: "客户电话",
					key: "phone",
					minWidth: 150
				},
				{
					title: "产品名称",
					key: "product_name",
					minWidth: 220,
					render: (h, params) => {
						return (
							<div>
								<AutoToolTip 
									content={params.row.product_name}
									width="170px"
									theme="dark"
									placement="bottom" 
									labelClass=""
								/>
							</div>
						);
					}
				},
				{
					title: "录入时间",
					key: "create_time",
					minWidth: 160
				},
				{
					title: "成交时间",
					key: "deal_time",
					minWidth: 160
				}, {
					title: "制作部门",
					key: "make_depart_name",
					minWidth: 150
				}
			],
		};
	},

	computed: {
		getColumns() {
			let columns = this.columns;

			if (this.type === "1") {
				columns.length === 11 && columns.splice(5, 4);
				columns.length === 7 && columns.push({
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								<AutoToolTip 
									content={params.row.invite_staff_name}
									width="90px"
									theme="dark"
									placement="bottom" 
									labelClass=""
								/>
							</div>
						);
					}
				});
			} else {
				columns.length === 8 && columns.splice(7, 1);
				columns.length === 7 && columns.push({
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								<AutoToolTip 
									content={params.row.invite_staff_name}
									width="90px"
									theme="dark"
									placement="bottom" 
									labelClass=""
								/>
							</div>
						);
					}
				}, {
					title: "主负责人",
					key: "main_person",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div>
								<AutoToolTip 
									content={params.row.main_person}
									width="120px"
									theme="dark"
									placement="bottom" 
									labelClass=""
								/>
							</div>
						);
					}
				}, {
					title: "负责人",
					key: "child_person",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div>
								<AutoToolTip 
									content={params.row.child_person}
									width="120px"
									theme="dark"
									placement="bottom" 
									labelClass=""
								/>
							</div>
						);
					}
				}, {
					title: "分配时间",
					key: "update_time",
					minWidth: 160
				});
			}

			return columns;
		}
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('SC_CUSTOMER_PREDISTRIBUTE_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_PREDISTRIBUTE_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleOpenDrawer(row) {
			this.$auth[837] && DetailDrawer.popup({
				type: this.type,
				order_product_id: Number(row.order_product_id)
			}).then(res => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};