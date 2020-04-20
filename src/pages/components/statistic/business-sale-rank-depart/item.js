export default {
	data() {
		return {
			columns: [
				{
					title: '员工姓名',
					key: 'staff_name',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={() => {
								this.$router.push({
									path: '/statistic/business/sale/rank/staff',
									query: {
										staff_name: row.staff_name,
										staff_id: row.staff_id,
										depart_name: this.$route.query.depart_name,
										...this.$parent.$children[1].time,
										season: this.$parent.$children[1].time.season.join(','),
										time_type: this.$parent.$children[1].search.time_type,
										amount_type: this.$parent.$children[1].amountType,
										whose: 4,
										type: this.$route.query.type,
										is_staff: !!this.$route.query.staff_id // 是否是通过筛选staff_id
									}
								});
							}}>
								{ row.staff_name }
							</div>
						);
					}
				},
				{
					title: '成交金额',
					key: "pay_performance",
					minWidth: 150,
					sortable: "custom"
				},
				{
					title: "实际业绩",
					key: "real_performance",
					minWidth: 150,
					sortable: "custom"
				},
				{
					title: "月平均实际业绩",
					key: "average_performance",
					minWidth: 150
				},
				{
					title: "保底目标",
					key: "min_target",
					minWidth: 120
				},
				{
					title: "平衡目标",
					key: "target",
					minWidth: 120
				},
				{
					title: "冲刺目标",
					key: "max_target",
					minWidth: 120
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};