import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';

export default {
	data() {
		return {
			columns: [
				{
					title: '　　组织名称',
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
							class: children && "g-pointer"
						}, [
							h('i', {
								class: `iconfont g-c-black2 g-fs-12 g-m-r-10 ${children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''}`,  // eslint-disable-line
								on: {
									click: () => { handleClick(); }
								}
							}),
							h('span', {
								class: `${__level__ >= 3 ? 'g-c-blue-mid g-pointer' : ''}`,
								on: {
									click: () => { this.handleLinkTo(params); }
								}
							}, depart_name)
						]);
					}
				},
				{
					title: '已分配人数',
					key: 'assign_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.assign_count + '人');
					}
				},
				{
					title: '分配未来人数',
					key: 'weed_out_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.weed_out_count + '人');
					}
				},
				{
					title: '离开人数',
					key: 'departure_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.departure_count + '人');
					}
				},
				{
					title: '离职人数',
					key: 'leave_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.leave_count + '人');
					}
				},
				{
					title: '入职人数',
					key: 'entry_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.entry_count + '人');
					}
				},
				{
					title: '未分配部门人数',
					key: 'un_assign_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.un_assign_count + '人');
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_RESET', { type: this.type });
		},
		handleLinkTo(params) {
			if (params.row.level >= 2) {
				this.$router.push(getHashUrl(
					`/hr/recruit/school/${params.row.level === 2 ? 'war' : 'depart'}`,
					{ depart_id: params.row.depart_id }
				));
			}
		},
	}
};

