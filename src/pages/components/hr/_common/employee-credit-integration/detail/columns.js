export default {
	data() {
		const { query = {} } = this.$route;
		const name = query.cate === '1' ? '积分' : '学分';
		return {
			columns: [
				{
					title: `${name}类型`,
					key: 'type_name',
					width: 180
				},
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
			]
		};
	}
};