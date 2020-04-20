import { HrDrawer } from '@components/hr/_common/employee-credit-integration/audit/popup/drawer';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 180,
					fixed: 'left',
					key: 'staff_name',
					render: (h, { row }) => {
						return (
							<span 
								class="g-operation" 
								onClick={() => this.handleDrawer(row.staff_id)}>{row.staff_name}</span>
						);
					}
				},
				{
					title: '手机号码',
					minWidth: 120,
					fixed: 'left',
					key: 'mobile'
				},
				{
					title: '工号',
					minWidth: 120,
					key: 'staff_number'
				},
				{
					title: '部门',
					minWidth: 180,
					key: 'depart_name'
				},
				{
					title: '职位',
					minWidth: 120,
					key: 'position_name'
				},
				{
					title: '待审核学分项',
					minWidth: 120,
					key: 'count'
				},
				{
					title: '审核学分',
					minWidth: 120,
					key: 'point'
				}
			],
		};
	},
	methods: {
		handleDrawer(staff_id) {
			this.$auth[875] && HrDrawer.popup({
				name: '学分',
				cate: '2',
				staff_id
			}).then(res => {
			}).catch(err => {
				this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_AUDIT_LIST_INIT');
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

