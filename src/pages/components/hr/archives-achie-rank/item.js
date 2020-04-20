import {
	Tooltip 
} from "iview";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
			}
		};
	},

	methods: {
		getColumns(type) {
			let columns = [];
			const {
				query = {}
			} = this.$route;
			switch (type) {
				case '1':
					columns.push(
						{
							title: '姓名',
							key: 'staff_name',
							minWidth: 120,
						},
						{
							title: '工号',
							key: 'staff_number',
							minWidth: 120,
						},
						{
							title: '部门',
							key: 'depart_name',
							minWidth: 120,
						},
						{
							title: '职位',
							key: 'position_name',
							minWidth: 120,
						},
						{
							title: '入职时间',
							key: 'entry_time',
							minWidth: 120,
						},
						{
							title: '工龄',
							key: 'work_day',
							minWidth: 120,
						},
						{
							title: '月度PK业绩',
							key: 'pk_performance',
							minWidth: 200,
						},
						{
							title: '月度实际业绩',
							key: 'real_performance',
							minWidth: 200,
						},
						{
							title: '战区排名',
							key: 'section_rank',
							minWidth: 120,
							sortable: 'custom',
						},
						{
							title: '公司排名',
							key: 'company_rank',
							minWidth: 120,
							sortable: 'custom',
						}
					);
					this.listInfo && this.listInfo[type] && (query.data_type === '2' || query.data_type === '3') && columns.splice(6, 4);
					this.listInfo && this.listInfo[type] && query.data_type === '2' && columns.push(
						{
							title: '上半年度PK业绩',
							key: 'first_pk_performance',
							minWidth: 200,
						},
						{
							title: '上半年度实际业绩',
							key: 'first_real_performance',
							minWidth: 200,
						},
						{
							title: '上半年度战区排名',
							key: 'first_section',
							minWidth: 200,
							sortable: 'custom',
						}, 
						{
							title: '上半年度公司排名',
							key: 'first_company',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '下半年度PK业绩',
							key: 'second_pk_performance',
							minWidth: 200,
						},
						{
							title: '下半年度实际业绩',
							key: 'second_real_performance',
							minWidth: 200,
						},
						{
							title: '下半年度战区排名',
							key: 'second_section',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '下半年度公司排名',
							key: 'second_company',
							minWidth: 200,
							sortable: 'custom',
						},
					);
					this.listInfo && this.listInfo[type] && query.data_type === '3' && columns.push(
						{
							title: '年度PK业绩',
							key: 'full_pk_performance',
							minWidth: 200,
						},
						{
							title: '年度实际业绩',
							key: 'full_real_performance',
							minWidth: 200,
						},
						{
							title: '年度公司排名',
							key: 'full_company',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '年度平均业绩',
							key: 'average_performance',
							minWidth: 200,
						},
						{
							title: '年度平均业绩排名',
							key: 'average_company',
							minWidth: 200,
							sortable: 'custom',
						},
						
					);
					
					return columns;
				case '2':
					columns.push(
						{
							title: '部门',
							key: 'depart_name',
							minWidth: 120,
						},
						{
							title: '经理姓名',
							key: 'leader_name',
							minWidth: 120,
						},
						{
							title: '部门人数',
							key: 'depart_num',
							minWidth: 120,
						},
						{
							title: '入职时间',
							key: 'entry_time',
							minWidth: 120,
						},
						{
							title: '带部门时间',
							key: 'leader_depart_time',
							minWidth: 120,
						},
						{
							title: '带部门年限',
							key: 'leader_depart_year',
							minWidth: 120,
						},
						{
							title: '月度PK业绩',
							key: 'pk_performance',
							minWidth: 120,
						},
						{
							title: '月度实际业绩',
							key: 'real_performance',
							minWidth: 120,
						},
						{
							title: '公司排名',
							key: 'rank',
							minWidth: 120,
							sortable: 'custom',
						},
						{
							title: '人均业绩',
							key: 'average_performance',
							minWidth: 120,
						}
					);
					this.listInfo && this.listInfo[type] && (query.data_type === '2' || query.data_type === '3') && columns.splice(6, 4);
					this.listInfo && this.listInfo[type] && query.data_type === '2' && columns.push(
						{
							title: '上半年度PK业绩',
							key: 'first_pk_performance',
							minWidth: 200,
						},
						{
							title: '上半年度实际业绩',
							key: 'first_real_performance',
							minWidth: 200,
						},
						{
							title: '上半年度公司排名',
							key: 'first_rank',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '下半年度PK业绩',
							key: 'second_pk_performance',
							minWidth: 200,
						},
						{
							title: '下半年度实际业绩',
							key: 'second_real_performance',
							minWidth: 200,
						},
						{
							title: '下半年度公司排名',
							key: 'second_rank',
							minWidth: 200,
							sortable: 'custom',
						},
					);
					this.listInfo && this.listInfo[type] && query.data_type === '3' && columns.push(
						{
							title: '年度PK业绩',
							key: 'full_pk_performance',
							minWidth: 200,
						},
						{
							title: '年度实际业绩',
							key: 'full_real_performance',
							minWidth: 200,
						},
						{
							title: '年度公司排名',
							key: 'full_rank',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '年度平均业绩',
							key: 'average_performance',
							minWidth: 200,
						},
						{
							title: '年度平均业绩排名',
							key: 'average_rank',
							minWidth: 200,
							sortable: 'custom',
						},
					);
					return columns;
				case '3':
					columns.push(
						{
							title: '战区',
							key: 'depart_name',
							minWidth: 120,
						},
						{
							title: '总监姓名',
							key: 'leader_name',
							minWidth: 120,
						},
						{
							title: '战区人数',
							key: 'depart_num',
							minWidth: 120,
						},
						{
							title: '入职时间',
							key: 'entry_time',
							minWidth: 120,
						},
						{
							title: '带战区时间',
							key: 'leader_depart_time',
							minWidth: 120,
						},
						{
							title: '带战区年限',
							key: 'leader_depart_year',
							minWidth: 120,
						},
						{
							title: '月度PK业绩',
							key: 'pk_performance',
							minWidth: 120,
						},
						{
							title: '月度实际业绩',
							key: 'real_performance',
							minWidth: 120,
						},
						{
							title: '公司排名',
							key: 'rank',
							minWidth: 120,
							sortable: 'custom',
						},
						{
							title: '人均业绩',
							key: 'average_performance',
							minWidth: 120,
						}
					);
					this.listInfo && this.listInfo[type] && (query.data_type === '2' || query.data_type === '3') && columns.splice(6, 4);
					this.listInfo && this.listInfo[type] && query.data_type === '2' && columns.push(
						{
							title: '上半年度PK业绩',
							key: 'first_pk_performance',
							minWidth: 200,
						},
						{
							title: '上半年度实际业绩',
							key: 'first_real_performance',
							minWidth: 200,
						},
						{
							title: '上半年度公司排名',
							key: 'first_rank',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '下半年度PK业绩',
							key: 'second_pk_performance',
							minWidth: 200,
						},
						{
							title: '下半年度实际业绩',
							key: 'second_real_performance',
							minWidth: 200,
						},
						{
							title: '下半年度公司排名',
							key: 'second_rank',
							minWidth: 200,
							sortable: 'custom',
						},
					);
					this.listInfo && this.listInfo[type] && query.data_type === '3' && columns.push(
						{
							title: '年度PK业绩',
							key: 'full_pk_performance',
							minWidth: 200,
						},
						{
							title: '年度实际业绩',
							key: 'full_real_performance',
							minWidth: 200,
						},
						{
							title: '年度公司排名',
							key: 'full_rank',
							minWidth: 200,
							sortable: 'custom',
						},
						{
							title: '年度平均业绩',
							key: 'average_performance',
							minWidth: 200,
						},
						{
							title: '年度平均业绩排名',
							key: 'average_rank',
							minWidth: 200,
							sortable: 'custom',
						},
					);
					return columns;
				default:
					return columns;
			}
		},
	},
};
