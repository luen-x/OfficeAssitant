import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { ServiceDetail } from "@components/sale/_common/service/detail";
import { ServiceExamine } from '@components/sale/service-customer-application/popup/service-examine';
import { ServiceInfo } from '@components/sale/service-customer-application/popup/service-info';

export default {
	data() {
		return {
			indexMap: { '1': 0, '2': 1, '3': 2 },
			columns: this.getColumns()
		};
	},
	methods: {
		handleOpenDrawer(row) {
			ServiceDetail.popup({
				fromOther: true,
				customerServiceId: row.customer_service_id,
				contractCompanyId: row.contract_company_id,
				applyId: row.apply_id,
				pathName: 'sale-service-customer-do'
			}).then(res => {
				if (res.status == 1) {
					this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
					this.$store.commit('FINANCE_CUSTOMER_COMPLAIN_LIST_RESET', { type: this.type });
				}
			}).catch(error => {
				this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
			});
		},
		getColumns() {
			return [
				{
					title: '公司名称',
					key: 'contract_company_name',
					width: 250,
					fixed: "left",
					// render: (h, { row }) => {
					// 	return (
					// 		<div>
					// 			<AutoTooltip 
					// 				content={row.contract_company_name}
					// 				theme="dark"
					// 				placement="bottom"
					// 				labelClass="g-operation"
					// 			/>
					// 		</div>
					// 	);
					// }
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100
				},
				{
					title: '客户手机号',
					key: 'phone',
					minWidth: 120
				},
				{
					title: '申请类型',
					key: 'apply_type_name',
					minWidth: 120
				},
				{
					title: '服务人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '申请人',
					key: 'apply_staff_name',
					minWidth: 100
				},
				{
					title: '申请时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '申请理由',
					key: 'reason',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.reason}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '审核进度',
					key: 'audit_name',
					minWidth: 120
				},
				{
					title: '操作',
					key: 'optional',
					fixed: "right",
					width: 100,
					render: (h, { row }) => {
						return (
							<div class="g-operation">
								{
									this.type == '1' && <span 
										onClick={(e) => {
											e.stopPropagation();
											this.handleExamine(row);
										}}
									>
								审核
									</span>
								}
								{
									this.type != '1' && <span
										onClick={(e) => {
											e.stopPropagation();
											this.handleViewInfo(row);
										}}
									>
									查看
									</span>
								}
							</div>
						);
					}
				}
			];
		},
		/**
		 * 审核
		 */
		handleExamine(row) {
			ServiceExamine.popup({
				applyId: row.apply_id,
				auditType: 2
			}).then(() => {
				this.$store.commit('FINANCE_CUSTOMER_COMPLAIN_LIST_RESET', { type: this.type });
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 查看
		 */
		handleViewInfo(row) {
			ServiceInfo.popup({
				applyId: row.apply_id
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

