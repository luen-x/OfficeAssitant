import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { WhiteCompanyDetail } from "./popup/company-detail";

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50
				},
				{
					title: '公司名称',
					key: 'company_name',
					width: 250,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip
									content={row.company_name}
									theme="dark"
									placement="bottom"
									labelClass="g-operation"
								/>
							</div>
						);
					}
				},
				{
					title: '客户名称',
					key: 'customer_name',
					minWidth: 100
				},
				{
					title: '客户电话',
					key: 'tel',
					minWidth: 120
				},
				{
					title: '加入时间',
					key: 'create_time',
					minWidth: 160
				},

				{
					title: '操作',
					key: 'optional',
					align: "center",
					width: 100,
					render: (h, { row }) => {
						return (
							<div
								class="g-operation"
								onClick={(e) => {
									e.stopPropagation();
									this.handleSingleReset(row.white_id);
								}}
							>
								恢复
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleOpenDrawer(row) {
			WhiteCompanyDetail.popup({
				customerId: row.customer_id,
				whiteId: row.white_id,
				type: row.type
			}).then(res => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			}).catch(error => {
				error && console.error(error);
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};

