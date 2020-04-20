export const STAFF_OR_DEPART_COLUMN = [
	{
		title: '擂主',
		key: 'guard_staff_name',
		fixed: 'left',
		minWidth: 150,
		render(h, params) {
			return h('div', `${params.row.guard_staff_name}（${params.row.guard_depart_name}）`);
		}
	},
	{
		title: '擂主业绩',
		key: 'guard_performance',
		minWidth: 110
	},
	{
		title: '擂主手机号',
		key: 'guard_mobile',
		minWidth: 150
	},
	{
		title: '攻擂者',
		key: 'win',
		minWidth: 150,
		render(h, params) {
			return h('div', `${params.row.attack_staff_name}（${params.row.attack_depart_name}）`);
		}
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
					click() {
						PModalDelete.popup({ data: params.row }).then(res => {
							res && this.handleResetCur();
						});
					}
				}
			}, '删除');
		}
	}
];

export const STATISTIC_COLUMN = [
	{
		title: '姓名',
		key: 'staff_name',
		fixed: 'left',
		minWidth: 110,
	},
	{
		title: '本月业绩',
		key: 'performance',
		minWidth: 100
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
			return h('div', `${params.row.type ? '部门' : '员工'}PK`);
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
		title: '净赚',
		key: 'profit_amount',
		minWidth: 100
	},
	{
		title: '月份',
		key: 'month',
		minWidth: 100
	}
];