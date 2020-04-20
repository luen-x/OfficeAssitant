import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		return {
			columns: [
				
				{
					title: '产品名称',
					key: 'product_name',
					minWidth: 100,
				
				},
				{
					title: '产品类型',
					key: 'category_name',
					minWidth: 120,
					
				},
				{
					title: '续费客户数量',
					key: 'customer_renew_num',
					minWidth: 120,
					sortable: "custom",
					
				},
				{
					title: '续费次数',
					key: 'renew_num',
					minWidth: 120,
					
				}, 
				{
					title: '产品续费率',
					key: 'renew_rate_str',
					minWidth: 120,
					render: (h, { row }) => {
						return <AutoTooltip content={row.renew_rate_str} theme="dark" placement="bottom" labelClass=" " />;
					}
					
				}, 
				{
					title: '续费总额',
					key: 'renew_amount_total',
					minWidth: 120,
					sortable: "custom",
					
				}
				
				
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_RESET', { type: this.type });
		}
	}
};

