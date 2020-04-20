import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns1: [
				{
					title: '招聘会学校',
					key: 'college',
					width: 250,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div onClick={() => this.handleDetail(params.row)}>
								<AutoTooltip content={params.row.college}
									theme="dark"
									placement="bottom"
								/>
							</div>
						);
					}
					// render: (h, params) => {
					// 	return h('router-link', {
					// 		props: {
					// 			to: `/hr/recruit/school/statistics/info?meeting_id=${params.row.meeting_id}`
					// 		},
					// 		style: 'display: block; width: 100%',
					// 		class: 'g-operation'
					// 	}, [
					// 		params.row.college.length <= 15 ? h('span', {}, params.row.college)
					// 			: h(Tooltip, {
					// 				props: {
					// 					transfer: true,
					// 					maxWidth: '200'
					// 				}
					// 			}, [
					// 				h('span', {}, params.row.college.slice(0, 15) + '...'),
					// 				h('div', {
					// 					slot: "content"
					// 				}, params.row.college)
					// 			])
					// 	]);
					// }
				},
				{
					title: '招聘会场次',
					key: 'meeting_count',
					width: 200,
					render: (h, params) => {
						return h('router-link', {
							props: {
								to: `/hr/recruit/school/jobfair/info?id=${params.row.meeting_id}&no_edit=1`
							},
							style: 'display: block; width: 100%',
							class: 'g-operation'
						}, params.row.meeting_count);
					}
				},
				{
					title: '录入人数',
					key: 'entering_count',
					width: 160,
				},
				{
					title: '发offer人数',
					key: 'send_offer_count',
					width: 160,
				},
				{
					title: '已回复人数',
					key: 'reply_students_count',
					width: 160,
				},
				{
					title: '报到人数',
					key: 'register_students_count',
					width: 160,
				},
				{
					title: '试岗人数',
					key: 'try_post_count',
					width: 160,
				},
				{
					title: '入职人数',
					key: 'entry_students_count',
					width: 160,
				},
				{
					title: '淘汰人数',
					key: 'weed_out_count',
					width: 160,
				},
				{
					title: '离开人数',
					key: 'leave_count',
					width: 160,
				},
				{
					title: '1月内流失',
					key: 'lose_students_three_count',
					width: 160,
				},
				{
					title: '1-3月流失',
					key: 'lose_students_three_six_count',
					width: 160,
				},
				{
					title: '报到率',
					key: 'register_percent',
					width: 160,
				},
				{
					title: '留下率',
					key: 'at_percent',
					width: 150,
				}
			],
			columns2: [
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 200,
					render: (h, params) => {
						const { row: { __level__, __expand__, depart_name, children }, index } = params;

						// 点击展开事件
						const handleClick = (e) => {
							this.$refs.table.expand({ index });
						};

						return h('div', {
							style: {
								marginLeft: `${(__level__ - 1) * 20}px`,
								boxSizing: 'content-box'
							},
							class: children && "g-pointer",
							on: {
								click: handleClick
							}
						}, [
							h('i', {
								class: `iconfont g-c-black2 g-fs-12 g-m-r-10 ${children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''}`,  // eslint-disable-line
							}),
							h('span', {}, depart_name)
						]);
					}
				},
				{
					title: '部门管理者',
					key: 'manager',
					minWidth: 150,
					render: (h, params) => {
						return (
							<span>{ params.row.manager.join(',')}</span>
						);
					}
				},
				{
					title: '在职人数',
					key: 'at_count',
					minWidth: 150,
					render: (h, params) => {
						return (
							<span>{ params.row.at_count + '人'}</span>
						);
					}
				},
				{
					title: '试岗人数',
					key: 'try_post_count',
					minWidth: 150,
					render: (h, params) => {
						return (
							<span>{ params.row.try_post_count + '人'}</span>
						);
					}
				},
				{
					title: '入职人数',
					key: 'entry_count',
					minWidth: 150,
					render: (h, params) => {
						return (
							<span>{ params.row.entry_count + '人'}</span>
						);
					}
				},
				{
					title: '一月内流失',
					key: 'one_leave_count',
					minWidth: 150,
					render: (h, params) => {
						return (
							<span>{ params.row.one_leave_count + '人'}</span>
						);
					}
				},
				{
					title: '年度PK业绩合计',
					key: 'depart_pk_performance',
					minWidth: 150,
					render: (h, params) => {
						return (
							<span>{ params.row.depart_pk_performance + '元'}</span>
						);
					}
				}
			],
			columns3: [
				{
					title: '招聘职位',
					key: 'position_name',
					width: 200,
					fixed: 'left',
				},
				{
					title: '录入人数',
					key: 'enter_count',
					width: 200,
				},
				{
					title: '发Offer人数',
					key: 'send_offer_count',
					width: 200,
				},
				{
					title: '回复人数',
					key: 'reply_count',
					width: 200,
				},
				{
					title: '报到人数',
					key: 'register_count',
					width: 200,
				},
				{
					title: '试岗人数',
					key: 'try_post_count',
					width: 200,
				},
				{
					title: '入职人数',
					key: 'entry_count',
					width: 200,
				},
				{
					title: '淘汰人数',
					key: 'weed_out_count',
					width: 200,
				},
				{
					title: '离开人数',
					key: 'leave_count',
					width: 200,
				},
				{
					title: '1月内流失',
					key: 'one_leave_count',
					width: 200,
				},
				{
					title: '1-3月流失',
					key: 'three_leave_count',
					width: 200,
				},
				{
					title: '报到率',
					key: 'register_rate',
					width: 200,
				},
				{
					title: '留下率',
					key: 'stay_rate',
					width: 150,
				}
			]
		};
	},
	methods: {
		handleDetail(row) {
			this.$router.push({
				path: '/hr/recruit/school/statistics/info',
				query: {
					meeting_id: row.meeting_id.join(','),
					season: this.$route.query.season,
					year: this.$route.query.year
				}
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

