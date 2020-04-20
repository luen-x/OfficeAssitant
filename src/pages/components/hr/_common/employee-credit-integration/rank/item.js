export default {
	data() {
		return {
			columns: [
				{
					title: '排名',
					key: 'rank'
				},
				{
					title: '姓名',
					key: 'staff_name'
				},
				{
					title: '部门',
					key: 'depart_name'
				},
				{
					title: '职位',
					key: 'position_name'
				},
				{
					title: this.cate === '2' ? '新增学分' : '新增积分',
					key: 'point'
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_RANK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_RANK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

