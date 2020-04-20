export default {
	data() {
		return {
			columns: [
				{
					title: '晋级级称',
					minWidth: 150,
					render: (h, params) => {
						return h('div', {}, params.row.rank_name);
					}
				},
				{
					title: '晋级条件',
					minWidth: 120,
					render: (h, params) => {
						return h('div', {
							class: "g-m-tb-10"
						},
						[
							(params.row.rule.titles.map(
								(item, index) => {
									return h('div', {
										props: {
											key: index + 'titles'
										},
										domProps: {
											innerHTML: item !== '' ? `条件(${index + 1})：${item}` : '暂无数据'
										},
									});
								}
							))
						]);
					}
				},
				{
					title: '我的数据',
					minWidth: 100,
					render: (h, params) => {
						return h('div', {
							class: "g-m-tb-10"
						},
						[
							(params.row.rule.contents.map(
								(item, index) => {
									return h('div', {
										props: {
											key: index + 'contents'
										},
										domProps: {
											innerHTML: `条件(${index + 1})：${item}`
										},
									});
								}
							))
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_RESET', {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};
