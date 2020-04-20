import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: '服务客户总数',
					key: 'total',
					minWidth: 120
				},
				{
					title: '总质检数',
					key: 'has_quality_num',
					minWidth: 100
				},
				{
					title: '未质检数',
					key: 'no_quality_num',
					minWidth: 100
				},
				{
					title: '非雷/未评',
					key: 'no_thunder_and_comment',
					minWidth: 100
				},
				{
					title: '雷区',
					key: 'mine_field',
					minWidth: 100
				},
				{
					title: '<6',
					key: 'score_step_one',
					minWidth: 100
				},
				{
					title: '6≤X<8',
					key: 'score_step_two',
					minWidth: 100
				},
				{
					title: '8≤X≤10',
					key: 'score_step_three',
					minWidth: 100
				},
				{
					title: '9≤X≤10',
					key: 'score_step_four',
					minWidth: 100
				},
				{
					title: '10分数',
					key: 'score_step_five',
					minWidth: 100
				},
				{
					title: '<6分率',
					key: 'score_step_one_rate',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{params.row.score_step_one_rate}%</div>
						);
					}
				},
				{
					title: '≥8分率',
					key: 'score_step_two_rate',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{params.row.score_step_two_rate}%</div>
						);
					}
				},
				{
					title: '≥9分率',
					key: 'score_step_three_rate',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{params.row.score_step_three_rate}%</div>
						);
					}
				},
				{
					title: '10分率',
					key: 'score_step_four_rate',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{params.row.score_step_four_rate}%</div>
						);
					}
				}
			],
			keyMap: {
				1: {
					labelKey: 'service_depart_id',
					valueKey: 'zone_depart_id'
				},
				2: {
					labelKey: 'service_depart_id',
					valueKey: 'service_person_depart_id'
				},
				3: {
					labelKey: 'service_staff_id',
					valueKey: 'service_person_id'
				},
			}
		};
	},
	computed: {
		getColumns({ type } = data) {
			let columns = [];

			switch (type) {
				case "1":
					columns = [
						{
							title: '战区',
							key: 'depart_name',
							minWidth: 220,
							fixed: "left",
							render: (h, params) => {
								return (
									<span>
										{
											this.$auth[1666] ? <div onClick={() => { this.handleToDetail(1, params.row); }}>
												<AutoToolTip 
													content={params.row.depart_name}
													width="120px"
													theme="dark"
													placement="bottom"
												/>
											</div> : <div>
												<AutoToolTip 
													content={params.row.depart_name}
													width="120px"
													theme="dark"
													placement="bottom"
													labelClass=" "
												/>
											</div>
										}
									</span>
								);
							}
						},
						{
							title: '部门简称',
							key: 'depart_abbreviation',
							minWidth: 100
						},
						{
							title: '管理人',
							key: 'manage_items',
							minWidth: 150,
							render: (h, params) => {
								if (params.row.manage_items && params.row.manage_items.length > 0) {
									return (
										<AutoToolTip 
											content={params.row.manage_items.join("、")}
											width="120px"
											theme="dark"
											placement="bottom" 
											labelClass=" "
										/>
									);
								} else {
									return (<div>--</div>);
								}
							}
						},
						...this.columns
					];
					break;
				
				case "2":
					columns = [
						{
							title: '部门',
							key: 'depart_name',
							minWidth: 220,
							fixed: "left",
							render: (h, params) => {
								return (
									<span>
										{
											this.$auth[1666] ? <div onClick={() => { this.handleToDetail(2, params.row); }}>
												<AutoToolTip 
													content={params.row.depart_name}
													width="120px"
													theme="dark"
													placement="bottom"
												/>
											</div> : <div>
												<AutoToolTip 
													content={params.row.depart_name}
													width="120px"
													theme="dark"
													placement="bottom"
												/>
											</div>
										}
									</span>
								);
							}
						},
						{
							title: '部门简称',
							key: 'depart_abbreviation',
							minWidth: 100
						},
						{
							title: '管理人',
							key: 'manage_items',
							minWidth: 150,
							render: (h, params) => {
								if (params.row.manage_items && params.row.manage_items.length > 0) {
									return (
										<AutoToolTip 
											content={params.row.manage_items.join("、")}
											width="120px"
											theme="dark"
											placement="bottom" 
											labelClass=" "
										/>
									);
								} else {
									return (<div>--</div>);
								}
							}
						},
						...this.columns
					];
					break;

				case "3":
					columns = [
						{
							title: '服务人',
							key: 'service_person_name',
							minWidth: 220,
							fixed: "left",
							render: (h, params) => {
								return (
									<span>
										{
											this.$auth[1666] ? <div onClick={() => { this.handleToDetail(3, params.row); }}>
												<AutoToolTip 
													content={params.row.service_person_name}
													width="120px"
													theme="dark"
													placement="bottom"
												/>
											</div> : <div>
												<AutoToolTip 
													content={params.row.service_person_name}
													width="120px"
													theme="dark"
													placement="bottom"
												/>
											</div>
										}
									</span>
								);
							}
						},
						{
							title: '部门',
							key: 'depart_name',
							minWidth: 220
						},
						{
							title: '部门简称',
							key: 'depart_abbreviation',
							minWidth: 100
						},
						...this.columns
					];
					break;
			
				default:
					break;
			}

			return columns;
		}
	},
	methods: {
		handleToDetail(type, row) {
			const map = this.keyMap[type];
			const query = this.$route.query;
			let param = {
				place_order_start_time: query.place_order_start_time,
				place_order_end_time: query.place_order_end_time,
				customer_type: query.customer_type || '3',
				depart_type: type,
				name: type == 3 ? row.service_person_name
					: row.depart_name,
				[map.labelKey]: row[map.valueKey]
			};
			this.$router.push({
				path: '/sc/manage/statistics/market/detail',
				query: param
			});
		},
		handleResetFirst() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		},
	}
};