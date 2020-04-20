import { PModalDelete } from "../main-pk-department/_common/popup/delete.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: '擂主',
					key: 'guard_staff_name',
					fixed: 'left',
					minWidth: 200,
				},
				{
					title: '擂主业绩',
					key: 'guard_performance',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '擂主手机号',
					key: 'guard_mobile',
					minWidth: 150
				},
				{
					title: '攻擂者',
					key: 'attack_staff_name',
					minWidth: 200,
				},
				{
					title: '攻擂者业绩',
					key: 'attack_performance',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '攻擂者手机号',
					key: 'attack_mobile',
					minWidth: 150
				},
				{
					title: 'PK类型',
					key: 'winMon',
					minWidth: 110,
					render(h, params) {
						return h('div', Number(params.row.type) ? '部门' : '员工');
					}
				},
				{
					title: 'PK金额',
					key: 'pk_amount',
					minWidth: 110
				},
				{
					title: '月份',
					key: 'month',
					minWidth: 100
				},
				{
					title: '结果',
					key: 'grade',
					minWidth: 80,
					render: (h, params) => {
						return h('div', this.handlePKResult(params.row.is_victory));
					}
				},
				{
					title: '操作',
					key: 'opt',
					minWidth: 110,
					fixed: 'right',
					render: (h, params) => {
						return h('div', {
							'class': ['g-c-blue-mid'],
							style: {
								marginRight: '5px',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									PModalDelete.popup({ data: params.row }).then(res => {
										this.handleResetCur();
									});
								}
							}
						}, '删除');
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_PK_STAFF_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_PK_STAFF_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handlePKResult(type) {
			const temp = Number(type);
			if (temp < 0) {
				return '擂主负';
			} else if (temp === 0) {
				return '平局';
			}
			return '擂主胜';
		}
	}
};

