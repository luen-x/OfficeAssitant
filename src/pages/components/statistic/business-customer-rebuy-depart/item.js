export default {
	data() {
		const columns = [
			{
				title: '排名',
				key: 'rank',
				minWidth: 60,
			},
			{
				title: '员工姓名',
				key: 'staff_name',
				minWidth: 160,
				render: (h, { row }) => {
					return <span 
						class={this.$auth[1795] && "g-operation"} 
						onClick={() => this.$auth[1795] && this.handleClickStaff(row)}
					>
						{row.staff_name}（{row.depart_name}）
					</span>;
				}
			},
			{
				title: '经理',
				key: 'manage_staff_name',
				minWidth: 100,
			},
			{
				title: '复购客户数量',
				key: 'customer_repeat_num',
				minWidth: 110,
				sortable: 'custom'
			},		
			{
				title: '个人客户数量',
				key: 'personal',
				minWidth: 110,
			},
			{
				title: '公司客户数量',
				key: 'company',
				minWidth: 120,
			},
			{
				title: '复购金额',
				key: 'repeat_amount_total',
				minWidth: 100,
				sortable: 'custom'
			}
		];
		this.setColumnSortType(columns);
		return {
			columns
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_DEPART_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_DEPART_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleClickStaff(row) {
			this.$router.push({
				path: '/statistic/business/customer/rebuy/staff',
				query: {
					staff_id: row.invite_staff_id,
					staff_name: row.staff_name,
					year: this.$refs.filter3[0].query.year,
					depart_id: this.$route.query.depart_id,
					depart_name: this.$route.query.depart_name,
				}
			});
		}
	}
};

