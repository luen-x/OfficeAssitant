import Explain from '@components/_common/explain/explain';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					width: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_status, staff_name } = params.row;
						return <div class="g-flex-ac">
							{ staff_status === 4 && <div class="g-m-r-5 g-remark">离</div>}
							{ staff_status !== 4 && <div class="g-m-r-5 g-remark" style="opacity: 0">离</div>}
							<router-link
								class="g-c-blue-mid g-pointer"
								style={{ display: 'block', width: '100%' }}
								to={this.handleLinkTo(params)}
							>
								{staff_name}
							</router-link>
						</div>;
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					fixed: 'left',
					width: 120
				},
				{
					title: '工号',
					key: 'staff_number',
					minWidth: 150
				},
				{
					title: '入职日期',
					key: 'entry_date',
					minWidth: 160
				},
				{
					title: '转正日期',
					key: 'regular_time',
					minWidth: 160
				},
				{
					title: '工龄',
					key: 'wage_age',
					width: 100
				},
				{
					title: '签订次数',
					key: 'contract_count',
					minWidth: 120,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								签订次数
								<Explain
									style={{ marginLeft: '2px' }}
									title="指员工签订合同的次数"
									content="例如，员工A签了一次合同，到期后又续签一次，那么该员工的签订次数就为2"
								/>
							</div>
						);
					}
				},
				{
					title: '合同到期日',
					key: 'contract_indate',
					minWidth: 160
				},
				{
					title: '距合同到期天数',
					key: 'sign_count',
					minWidth: 160
				},
				{
					title: '合同状态',
					key: 'status',
					minWidth: 120
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_RELATION_PACT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_RELATION_PACT_LIST_RESET', { type: this.type });
		},
		handleLinkTo(params) {
			// this.$router.push({
			// 	path: '/hr/employee/summary/details',
			// 	query: {
			// 		staff_id: params.row.staff_id,
			// 		staff_name: params.row.staff_name,
			// 		type: 4
			// 	}
			// });
			return getHashUrl('/hr/employee/summary/details', {
				staff_id: params.row.staff_id,
				staff_name: params.row.staff_name,
				staff_status: params.row.staff_status,
				...this.$route.query,
				list_type: this.type === '1' ? 2 : 3,
				type: 4
			});
		},
	}
};

