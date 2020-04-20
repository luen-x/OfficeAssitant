import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { CustomerDetail } from "../_common/customer/popup/index";


export default {
	data() {
		return {
			columns: [
				{
					title: '关联公司名称',
					key: 'company_name',
					width: 250,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip
									content={params.row.company_name}
									theme="dark"
									placement="bottom"
									labelClass="g-operation"
								/>
							</div>
						);
					}
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100
				},
				{
					title: '客户电话',
					key: 'tel',
					minWidth: 120
				},
				{
					title: '客户等级',
					key: 'level',
					minWidth: 120
				},
				{
					title: '负责人',
					key: 'staff_name',
					minWidth: 100
				}
			]
		};
	},
	methods: {
		handleOpenDrawer(row) {
			CustomerDetail.popup({
				mode: 'relate',
				data: {
					own_id: row.own_id,
					staff_id: row.staff_id, // 负责人
					staff_name: row.staff_name,
					customer_id: row.customer_id,
					deal_status: row.deal_status || 2, // 合同公司成交状态 1已成交 2 未成交，
					contract_company_id: row.contract_company_id,
					customer_name: row.customer_name,
					is_own: row.is_own == '1',
					readOnly: true,
					hideOption: true
				},
				showContacts: true,
				showCall: false,
				store: this.$store
			}).then(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				this.openIndex = -1;
			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				this.openIndex = -1;
			});
		},

	}
};

