export default {
	data() {
		return {
			show: true,
			page: {
				'size': 'small'
			},
			table: {

			},
			staffColumns: [
				{
					title: '排名',
					minWidth: 65,
					key: 'data_sort',
				}, 
				{
					title: '姓名',
					minWidth: 95,
					key: 'staff_name',
				},
				{
					title: '部门',
					minWidth: 95,
					key: 'depart_name',
				},
				{
					title: '新增客户数',
					minWidth: 100,
					key: 'num',
				}
			],
			departmentColumns: [
				{
					title: '排名',
					minWidth: 70,
					key: 'data_sort',
				}, 
				{
					title: '部门',
					minWidth: 110,
					key: 'depart_name',
				},
				{
					title: '新增客户数',
					minWidth: 100,
					key: 'num',
				}
			],
			areasColumns: [
				{
					title: '排名',
					minWidth: 70,
					key: 'data_sort',
				}, 
				{
					title: '战区',
					minWidth: 110,
					key: 'depart_name',
				},
				{
					title: '新增客户数',
					minWidth: 100,
					key: 'num',
					
				}
			],
		};
	},
	methods: {
	}
};

