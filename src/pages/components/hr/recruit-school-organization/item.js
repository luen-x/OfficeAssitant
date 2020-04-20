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
					title: '在职人数',
					key: 'depart_num',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.depart_num + '人');
					}
				},
				{
					title: '男生',
					key: 'man_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.man_count + '人');
					}
				},
				{
					title: '女生',
					key: 'woman_count',
					minWidth: 150,
					render: (h, params) => {
						return h('span', {}, params.row.woman_count + '人');
					}
				}
				// {
				// 	title: '实时人数',
				// 	key: 'real_count',
				// 	minWidth: 150,
				// 	render: (h, params) => {
				// 		return h('span', {}, params.row.real_time_count + '人');
				// 	}
				// }
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SCHOOL_ORGANIZATION_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SCHOOL_ORGANIZATION_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

