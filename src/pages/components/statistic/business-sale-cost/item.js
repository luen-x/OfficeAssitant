import { Cost } from './modal/cost';

export default {
	data() {
		return {
			columns: [
				{
					title: '产品名称',
					key: 'product_alias',
					minWidth: 150
				},
				{
					title: '类型',
					key: 'category_alias',
					minWidth: 120
				},
				{
					title: '成本归属部门',
					key: 'cost_depart_name',
					minWidth: 160
				},
				{
					title: '关联产品',
					key: 'product_count',
					minWidth: 120,
					render: (h, { row }) => {
						const { query } = this.$route;
						
						if (row.product_count > 0) {
							return (
								<div 
									class="g-operation"
									onClick={() => {
										Cost.popup({
											params: query,
											productAlias: row.product_alias,
											mainProductId: row.main_product_id,
											categoryId: row.category_id,
											costDepartId: row.cost_depart_id
										}).then(res => {});
									}}
								>
									{row.product_count}
								</div>
							);
						} else {
							return (
								<div>{row.product_count}</div>
							);
						}
					}
				},
				{
					title: '客户数量',
					key: 'customer_count',
					minWidth: 120,
					sortable: "custom"
				},
				{
					title: '成本总额',
					key: 'total_amount',
					minWidth: 160,
					sortable: "custom"
				},
				{
					title: '成本占比',
					key: 'cost_amount_ratio',
					minWidth: 120
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_COST_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_COST_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};