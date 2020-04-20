export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 220,
					fixed: 'left'
				},
				{
					title: '身份证号',
					key: 'id_card',
					minWidth: 180,
					fixed: 'left'
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 220,
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 220,
				},
				{
					title: '社保方案',
					key: 'social_security_type',
					minWidth: 160,
				},
				{
					title: '开始月份',
					key: 'start_month',
					minWidth: 160,
				},
				{
					title: '结束月份',
					key: 'end_month',
					minWidth: 160,
				},
				{
					title: '缴纳公司',
					key: 'security_company_name',
					minWidth: 250,
				},
				{
					title: '月收入',
					key: 'salary',
					minWidth: 160,
				},
				{
					title: '补贴金额',
					key: 'subsidy_money',
					minWidth: 160,
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_SALARY_SOCIAL_HISTORY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_SALARY_SOCIAL_HISTORY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

