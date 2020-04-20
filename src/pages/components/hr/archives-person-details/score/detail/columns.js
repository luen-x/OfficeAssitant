export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
			}
		};
	},

	methods: {
		getColumns(type) {
			let columns = [
				{
					title: '1月',
					key: 'jan'
				},
				{
					title: '2月',
					key: 'feb'
				},
				{
					title: '3月',
					key: 'mar'
				},
				{
					title: '4月',
					key: 'apr'
				},
				{
					title: '5月',
					key: 'may'
				},
				{
					title: '6月',
					key: 'jun'
				},
				{
					title: '7月',
					key: 'jul'
				},
				{
					title: '8月',
					key: 'aug'
				},
				{
					title: '9月',
					key: 'sep'
				},
				{
					title: '10月',
					key: 'oct'
				},
				{
					title: '11月',
					key: 'nov'
				},
				{
					title: '12月',
					key: 'dec'
				}
			];
			switch (type) {
				case "1":
					columns.unshift(
						{
							title: '积分类型',
							key: 'type_name',
							minWidth: 120,
							align: 'left'
						},
					);
					return columns;
				case '2':
					columns.unshift(
						{
							title: '学分类型',
							key: 'type_name',
							minWidth: 120
						},
					);
					return columns;
				default:
					return columns;
			}
		},
	},
};
