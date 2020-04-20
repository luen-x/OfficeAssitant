import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";

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
			let columns = [
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150,
				},
				{
					title: '部门简称',
					key: 'abbreviation',
					minWidth: 150,
				},
				{
					title: '管理人',
					key: 'manager_name',
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.manager_name} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '月份',
					key: 'month',
					minWidth: 150,
				},
				{
					title: '录账业绩',
					key: 'pay_amount',
					minWidth: 150,
				},
				{
					title: '已退金额',
					key: 'refund_amount',
					minWidth: 150,
				},
				{
					title: '下单金额',
					key: 'consume_amount',
					minWidth: 150,
				},
				{
					title: '未下单金额',
					key: 'rest_amount',
					minWidth: 150,
				}
			];
			switch (type) {
				case '3':
					columns.unshift({
						title: '员工姓名',
						key: 'staff_name',
						minWidth: 150,
					});
					columns.splice(3, 1);
					return columns;
				default:
					return columns;
			}
		},
		handleResetFirst() {
			this.$store.commit('FINANCE_MAIN_PLAYMENT_MORE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_MAIN_PLAYMENT_MORE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

