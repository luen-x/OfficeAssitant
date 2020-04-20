import Explain from '@components/_common/explain/explain';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 150
				},
				{
					title: '手机号',
					key: 'mobile',
					width: 150
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 120
				},
				{
					title: '薪资总额',
					key: 'gross_salary',
					minWidth: 120
				},
				{
					title: '促单业绩',
					key: 'minus_performance',
					minWidth: 120,
				},
				{
					title: '促单提成',
					key: 'total_commission',
					minWidth: 120,
				},
				{
					title: '团队业绩',
					key: 'team_performance',
					minWidth: 120,
				},
				{
					title: '团队提成',
					key: 'team_commission',
					minWidth: 120
				},
				{
					title: '课时费',
					key: 'lecture_fee',
					minWidth: 120
				},
				{
					title: '流程对接费',
					key: 'process_allowance',
					minWidth: 120
				},
				{
					title: '主持人补贴',
					key: 'presenter_allowance',
					minWidth: 120,
				},
				{
					title: '唱单补贴',
					key: 'sign_allowance',
					minWidth: 120,
				},
				{
					title: '会议总统筹补贴',
					key: 'meet_plan_allowance',
					minWidth: 120,
				},
				{
					title: '外出补贴',
					key: 'out_allowance',
					minWidth: 120,
				},
				{
					title: '操作',
					key: 'title',
					minWidth: 100,
					render: (h, params) => {
						return this.$auth['1460'] ? h('div', {
							class: "g-operation",
							style: {
								marginRight: '5px',
							},
							on: {
								click: () => {
									const { query = {} } = this.$route;
									this.handleLinkTo(
										params.row.staff_id, 
										query.month == undefined ? '' : query.month, 
										params.row.staff_name, params.row.is_charge
									);
								}
							}
						}, '查看详情') : '';
					}
				}


			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_COUNT_STAFF_COLLAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_COUNT_STAFF_COLLAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo(staff_id, month, staff_name, is_charge) {
			this.$router.push(`/finance/count/staff/collage/detail?staff_id=${staff_id}
			&month=${month}
			&staff_name=${staff_name}
			&is_charge=${is_charge}`);
		},
	}
};

