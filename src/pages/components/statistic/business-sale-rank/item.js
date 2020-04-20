export default {
	data() {
		return {
			columns: {},
			common: [
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
	created() {
		this.columns = {
			'1': this.getColumns('1'),
			'2': this.getColumns('2'),
			'3': this.getColumns('3')
		};
	},
	methods: {
		getColumns(type) {
			let columns = [];

			switch (type) {
				case '1':
					columns = [
						{
							title: "排名",
							key: "sort",
							minWidth: 100
						},
						{
							title: "战区",
							key: "depart_name",
							minWidth: 120,
							render: (h, { row }) => {
								return (
									<div class={this.$auth[1781] && "g-operation"} onClick={() => {
										this.$auth[1781] && this.$router.push({
											path: '/statistic/business/sale/rank/depart',
											query: {
												depart_id: row.depart_id,
												depart_name: row.depart_name,
												...this.time,
												season: this.time.season.join(','),
												time_type: this.search.time_type,
												amount_type: this.amountType,
												whose: 2,
												type: this.type
											}
										});
									}}>
										{ row.depart_name }
									</div>
								);
							}
						},
						{
							title: "总监",
							key: "manage_name",
							minWidth: 120
						},
						{
							title: "成交金额",
							key: "pay_performance",
							minWidth: 150,
							sortable: "custom"
						},
						{
							title: "成交金额占比",
							key: "pay_rate",
							minWidth: 120
						},
						{
							title: "实际业绩",
							key: "real_performance",
							minWidth: 150,
							sortable: "custom"
						},
						{
							title: "业绩占比",
							key: "real_rate",
							minWidth: 100
						}
					];

					break;

				case '2':
					columns = [
						{
							title: "排名",
							key: "sort",
							minWidth: 100
						},
						{
							title: "部门",
							key: "depart_name",
							minWidth: 120,
							render: (h, { row }) => {
								return (
									<div class={this.$auth[1781] && "g-operation"} onClick={() => {
										this.$auth[1781] && this.$router.push({
											path: '/statistic/business/sale/rank/depart',
											query: {
												depart_id: row.depart_id,
												depart_name: row.depart_name,
												...this.time,
												season: this.time.season.join(','),
												time_type: this.search.time_type,
												amount_type: this.amountType,
												whose: 3,
												type: this.type
											}
										});
									}}>
										{ row.depart_name }
									</div>
								);
							}
						},
						{
							title: "经理",
							key: "manage_name",
							minWidth: 120
						},
						{
							title: "成交金额",
							key: "pay_performance",
							minWidth: 150,
							sortable: "custom"
						},
						{
							title: "实际业绩",
							key: "real_performance",
							minWidth: 150,
							sortable: "custom"
						}
					];

					break;
				
				case '3':
					columns = [
						{
							title: "排名",
							key: "sort",
							minWidth: 100
						},
						{
							title: "员工",
							key: "staff_name",
							minWidth: 120,
							render: (h, { row }) => {
								return (
									<div class={this.$auth[1782] && "g-operation"} onClick={() => {
										this.$auth[1782] && this.$router.push({
											path: '/statistic/business/sale/rank/staff',
											query: {
												staff_name: row.staff_name,
												staff_id: row.staff_id,
												...this.time,
												season: this.time.season.join(','),
												time_type: this.search.time_type,
												amount_type: this.amountType,
												whose: 4,
												type: this.type,
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
							title: "经理",
							key: "manage_name",
							minWidth: 120
						},
						{
							title: "成交金额",
							key: "pay_performance",
							minWidth: 150,
							sortable: "custom"
						},
						{
							title: "实际业绩",
							key: "real_performance",
							minWidth: 150,
							sortable: "custom"
						}
					];

					break;
			
				default:
					break;
			}

			columns = [...columns, ...this.common];

			return columns;
		},
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};