import { PersonalService } from './popup/personal-service';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 180,
					fixed: 'left',
					key: 'title',
					render: (h, { row }) => {
						return (<span class="g-operation" onClick={() => this.handleDrawer(row.staff_id)}>{ row.staff_name }</span>);
					}
				},
				{
					title: '手机号码',
					minWidth: 120,
					fixed: 'left',
					key: 'mobile'
				},
				{
					title: '服务人部门',
					minWidth: 180,
					key: 'depart_name'
				},
				{
					title: '职位',
					minWidth: 120,
					key: 'position_name'
				},
				{
					title: '待确认服务',
					minWidth: 120,
					key: 'count',
					render: (h, { row }) => {
						return <span>{row.count}（个）</span>;
					},
					sortable: 'custom'
				},
				{
					title: '总服务积分',
					minWidth: 120,
					key: 'total_point',
					sortable: 'custom'
				},
				{
					title: '服务公司数',
					minWidth: 120,
					key: 'contract_company_count'
				},
				{
					title: '最近提交时间',
					minWidth: 180,
					key: 'service_time'
				}
			],
		};
	},
	methods: {
		handleDrawer(staff_id) {
			// this.$auth[861] &&
			PersonalService.popup({
				name: '积分',
				cate: "1",
				staff_id
			}).then(res => {

			}).catch(err => {

			});
		},
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

