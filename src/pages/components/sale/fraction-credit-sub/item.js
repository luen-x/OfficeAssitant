export default {
	data() {
		const baseColumns = [
			{
				title: '姓名',
				key: 'staff_name',
				fixed: 'left',
				width: 120
			},
			{
				title: '手机号码',
				key: 'mobile',
				fixed: 'left',
				width: 120
			},
			{
				title: '工号',
				key: 'staff_number',
				minWidth: 120
			},
			{
				title: '部门',
				key: 'departs',
				minWidth: 160
			},
			{
				title: '职位',
				key: 'position_name',
				minWidth: 120
			},
			{
				title: '工龄',
				key: 'standing',
				minWidth: 120
			},
			{
				title: '历史总分',
				key: 'history',
				minWidth: 90
			},
			{
				title: '今年总分',
				key: 'this_year',
				minWidth: 90
			},
			{
				title: '目前总分',
				key: 'all',
				minWidth: 90
			},
			{
				title: '可用晋升学分',
				key: 'usable',
				sortable: true,
				minWidth: 130
			},
			{
				title: '操作',
				key: 'opt',
				fixed: 'right',
				width: 100,
				render: (h, { row }) => {
					return (
						<div class="g-operation">
							{
								this.$auth[519] ? <span 
									onClick={() => {
										this.$router.push({
											name: 'sale-fraction-credit-detail',
											query: {
												staff_id: row.staff_id
											}
										});
									}}
								>
							详情
								</span> : null
							}
						</div>
					);
				}
			}
		];
		return {
			baseColumns,
			showColumns: [...baseColumns]
		};
	}
};

