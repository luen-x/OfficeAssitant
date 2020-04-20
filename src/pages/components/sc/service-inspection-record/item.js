import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from "../_common/service-manage-detail/detail.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "company_name",
					minWidth: 220,
					render: (h, { row }) => {		
						return (
							<div class="g-flex-ac">
								<AutoToolTip 
									content={row.company_name}
									theme="dark"
									placement="bottom" 
									labelClass={this.$auth[341] ? "" : ""}
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
					title: "下单产品",
					key: "product_items",
					minWidth: 200,
					render: (h, params) => {
						let product_items = params.row.product_items && params.row.product_items.join("、");
	
						return (
							<AutoToolTip 
								content={product_items}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "分配人",
					key: "assign_person_name",
					minWidth: 100
				},
				{
					title: "分配时间",
					key: "assign_time",
					minWidth: 160
				},
				{
					title: "质检人",
					key: "quality_staff_name",
					minWidth: 100
				},
				{
					title: "质检时间",
					key: "create_time",
					minWidth: 160
				},
				{
					title: "接通情况",
					key: "call_status",
					minWidth: 100
				},
				{
					title: "客户评分",
					key: "score",
					minWidth: 100
				},
				{
					title: "回款金额（万）",
					key: "return_money",
					minWidth: 120
				},
				{
					title: "代理人数（人）",
					key: "agent_num",
					minWidth: 120
				},
				{
					title: "启动招商会",
					key: "attract_meet",
					minWidth: 100,
					render: (h, params) => {
						let attract_meet = ["", "是", "否", "不知道"][params.row.attract_meet];

						return (
							<div>{attract_meet}</div>
						);
					}
				},
				{
					title: "启动内训",
					key: "inner_training",
					minWidth: 100,
					render: (h, params) => {
						let inner_training = ["", "是", "否", "不知道"][params.row.inner_training];

						return (
							<div>{inner_training}</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleOpenDrawer(row) {
			DetailDrawer.popup({
				type: this.type,
				quality_id: Number(row.quality_id),
				contract_company_id: Number(row.contract_company_id),
				name: 'serviceInspectionRecord',
				flag: 3
			}).then(res => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},

		handleResetFirst() {
			this.$store.commit('SC_SERVICE_INSPECTION_RECORD_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_SERVICE_INSPECTION_RECORD_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		}
	}
};