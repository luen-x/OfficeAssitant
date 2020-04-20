import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		const colums = [
			{
				title: '排名',
				key: 'rank',
				minWidth: 60,
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
		const columns1 = [...colums];
		columns1.splice(
			1, 
			0,
			{
				title: '战区',
				key: 'depart_name',
				minWidth: 100,
				render: (h, { row }) => {
					return <span class="g-operation" onClick={() => this.handleClickZone(row)}>{row.depart_name}</span>;
				}
			},
			{
				title: '总监',
				key: 'depart_manage_staff_name',
				minWidth: 100,
			},
		);
		const columns2 = [...colums];
		columns2.splice(
			1, 
			0,
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 100,
				render: (h, { row }) => {
					return <span class="g-operation" onClick={() => this.handleClickDepart(row)}>{row.depart_name}</span>;
				}
			},
			{
				title: '经理',
				key: 'depart_manage_staff_name',
				minWidth: 100,
			},
		);
		const columns3 = [...colums];
		columns3.splice(
			1, 
			0,
			{
				title: '员工姓名',
				key: 'staff_name',
				minWidth: 160,
				render: (h, { row }) => {
					return <span class="g-operation" onClick={() => this.handleClickStaff(row)}>{row.staff_name}（{row.depart_name}）</span>;
				}
			},
			{
				title: '经理',
				key: 'manage_staff_name',
				minWidth: 100,
			},
		);
		return {
			columns: {
				1: columns1,
				2: columns2,
				3: columns3
			},
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_RESET', { type: this.type });
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
					year: this.$refs.filter3[0].query.year
				}
			});
		},
		handleClickDepart(row) {
			this.$router.push({
				path: '/statistic/business/customer/renew/depart',
				query: {
					depart_id: row.depart_id,
					depart_name: row.depart_name,
					year: this.$refs.filter2[0].query.year,
					type: 2
				}
			});

		},
		handleClickZone(row) {
			this.$router.push({
				path: '/statistic/business/customer/renew/depart',
				query: {
					depart_id: row.depart_id,
					depart_name: row.depart_name,
					year: this.$refs.filter1[0].query.year,
					type: 1
				}
			});

		}
	}
};

