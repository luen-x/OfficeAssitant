import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		return {
			columns: [
				{
					title: '排名',
					key: 'rank',
					minWidth: 60,
					
				},
				{
					title: '战区名称',
					key: 'depart_name',
					minWidth: 100,
					render: (h, { row }) => {
						return <span class={this.$auth[1799] && "g-operation"} onClick={() => this.$auth[1799] && this.handleToZone(row)} >
							{row.depart_name}
						</span>;
					}
				
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
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_LIST_RESET', { type: this.type });
		},
		handleToZone(row) {
			this.$router.push({
				path: '/statistic/business/customer/reproduct/zone',
				query: {
					year: this.$route.query.year,
					zone_name: row.depart_name,
					zone_depart_id: row.zone_depart_id,
				}
			});

		}
	}
};