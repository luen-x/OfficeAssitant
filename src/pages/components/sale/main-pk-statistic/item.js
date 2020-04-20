import { PModalDelete } from "../main-pk-department/_common/popup/delete";

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					minWidth: 200,
				},
				{
					title: '本月业绩',
					key: 'performance',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '本月PK数',
					key: 'pk_times',
					minWidth: 100
				},
				{
					title: '本月PK胜',
					key: 'pk_victory',
					minWidth: 100
				},
				{
					title: '本月PK负',
					key: 'pk_defeat',
					minWidth: 100
				},
				{
					title: '本月PK平',
					key: 'pk_draw',
					minWidth: 100
				},
				{
					title: 'PK类型',
					key: 'type',
					minWidth: 100,
					render(h, params) {
						return h('div', `${Number(params.row.type) ? '部门' : '员工'}PK`);
					}
				},
				{
					title: '赢（元）',
					key: 'victory_amount',
					minWidth: 100
				},
				{
					title: '输（元）',
					key: 'defeat_amount',
					minWidth: 100
				},
				{
					title: '净赚（元）',
					key: 'profit_amount',
					minWidth: 100
				},
				{
					title: '月份',
					key: 'month',
					minWidth: 100
				}
				// {
				// 	title: '操作',
				// 	key: 'opt',
				// 	minWidth: 110,
				// 	fixed: 'right',
				// 	render: (h, params) => {
				// 		return h('div', {
				// 			'class': ['g-c-blue-mid'],
				// 			style: {
				// 				marginRight: '5px',
				// 				cursor: 'pointer'
				// 			},
				// 			on: {
				// 				click() {
				// 					PModalDelete.popup({ data: params.row });
				// 				}
				// 			}
				// 		}, '删除');
				// 	}
				// }
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_PK_STATISTIC_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_PK_STATISTIC_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

