import { Radio } from 'iview';
import { DetailDrawer } from './popup/detail.vue';

export default {
	data() {
		
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
			}
		};
	},
	methods: {
		getColumns(type) {
			let columns = [
				{
					type: 'selection',
					width: 50,
					fixed: 'left'
				},
				{
					title: '姓名',
					minWidth: 160,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth['1134'] ? <div 
										class="g-operation" 
										onClick={() => this.handleDrawer(params)}
									>{params.row.staff_name}</div>
										: <div>{params.row.staff_name}</div>
								}
								
							</div>
					
						);
					}
				},
				{
					title: '身份证号',
					minWidth: 180,
					fixed: 'left',
					key: 'id_card'
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 200,
				},
				{
					title: '职位',
					minWidth: 200,
					key: 'position_name'
				},
				{
					title: '缴纳公司',
					minWidth: 250,
					key: 'security_company_name'
				},
				{
					title: '参加工作日期',
					minWidth: 120,
					key: 'work_start_time'
				},
				{
					title: '户籍性质',
					minWidth: 160,
					key: 'residence_type_name'
				},
				{
					title: '用工性质',
					minWidth: 140,
					key: 'employment_form_name'
				},
				{
					title: '月收入',
					minWidth: 100,
					key: 'salary'
				},
				{
					title: '是否特困',
					minWidth: 100,
					key: 'is_poor'
				},
				{
					title: '新增原因',
					minWidth: 100,
					key: 'social_security_reason_name'
				},
				{
					title: '用工形式',
					minWidth: 100,
					key: 'employment_foremployment_form_name'
				},
				{
					title: "操作",
					key: 'action',
					minWidth: 100,
					align: 'left',
					fixed: "right",
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth['1134'] ? <div 
										class="g-operation" 
										onClick={() => this.handleDrawer(params)}
									>调整</div>
										: ''
								}
							</div>
						
						);
					}
				}
			];

			switch (type) {
				case '1':
					columns.splice(13, 0);
					return columns;
				case '2':
					columns.splice(5, 8);
					columns.push(
						{
							title: '发放开始月份',
							minWidth: 120,
							key: 'subsidy_month'
						},
						{
							title: '月收入',
							minWidth: 100,
							key: 'salary'
						},
						{
							title: '补贴金额',
							minWidth: 100,
							key: 'subsidy_money'
						},
						{
							title: '入职日期',
							minWidth: 100,
							key: 'create_time'
						},
					);
					return columns;
				default:
					return columns;
			}
		},
		handleDrawer(params) {
			const { query } = this.$route;
			// let type = String(query.type || "1");
			DetailDrawer.popup({
				staffId: params.row.staff_id,
				type: String(query.type || "1")
			}).then(res => {
				this.$store.commit('HR_SALARY_SOCIAL_SUBSIDY_LIST_INIT');
			}).catch(err => {
			});
		}
	}
};

