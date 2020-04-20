import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		const columns = [
			{
				title: '排名',
				key: 'rank',
				minWidth: 60,
			},
			{
				title: '员工姓名',
				key: 'staff_name',
				minWidth: 160,
				render: (h, { row }) => {
					return <span 
						class={this.$auth[1791] && "g-operation"} 
						onClick={() => this.$auth[1791] && this.handleClickStaff(row)}
					>
						{row.staff_name}（{row.depart_name}）
					</span>;
				}
			},
			{
				title: '经理',
				key: 'manage_staff_name',
				minWidth: 100,
			},
			{
				title: '续费客户数量',
				key: 'customer_renew_num',
				minWidth: 130,
				sortable: 'custom'

			},		
			{
				title: '客户续费率',
				key: 'renew_rate',
				minWidth: 140,
				render: (h, { row }) => {
					const str = (row.renew_rate || []).map(it => `${it.percent}（${it.year}）`).join('/') || '-';
					return <AutoTooltip content={str} theme="dark" placement="bottom" labelClass=" " />;
				}
			},
			{
				title: '个人客户数量',
				key: 'personal',
				minWidth: 110,
			},
			{
				title: '公司客户数量',
				key: 'company',
				minWidth: 120,
			},
			{
				title: '续费金额',
				key: 'renew_amount_total',
				minWidth: 100,
				sortable: 'custom'

			}
		];
		this.setColumnSortType(columns);
		return {
			columns
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleClickStaff(row) {
			this.$router.push({
				path: '/statistic/business/customer/renew/staff',
				query: {
					staff_id: row.order_staff_id,
					staff_name: row.staff_name,
					year: this.$route.query.year || '',
					depart_id: this.$route.query.depart_id,
					depart_name: this.$route.query.depart_name,
				}
			});
		},
	}
};

