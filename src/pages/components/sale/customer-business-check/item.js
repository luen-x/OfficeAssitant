

export default {
	data() {
		return {
			columns1: [ // 经理
				{
					title: '日期',
					key: 'which_day',
					minWidth: 160,
					fixed: 'left'
				},
				{
					title: '周期',
					key: 'which_week',
					minWidth: 150
				},
				{
					title: '星期',
					key: 'week_day',
					minWidth: 150
				},
				{
					title: '过客户',
					key: 'adoptive',
					minWidth: 100
				},
				{
					title: '过出来客户',
					key: 'adoptived',
					minWidth: 100
				},
				{
					title: '谈判客户',
					key: 'negotiation',
					minWidth: 100
				},
				{
					title: '跟进客户',
					key: 'follow_up',
					minWidth: 100
				},

				{
					title: '成交客户',
					key: 'deal',
					minWidth: 100
				},
				{
					title: '操作',
					key: 'link',
					minWidth: 150,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth[969]
										? <div onClick={() => { this.handleCheck(params.row.which_day); }} class="g-operation">查看</div>
										: ""
								}
							</div>
						);
					}
				}
			],
			columns2: [ // 员工
				{
					title: '日期',
					key: 'which_day',
					minWidth: 160,
					fixed: "left"
				},
				{
					title: '周期',
					key: 'which_week',
					minWidth: 150
				},
				{
					title: '星期',
					key: 'week_day',
					minWidth: 150
				},
				{
					title: '加微信客户',
					key: 'wechat',
					minWidth: 100
				},
				{
					title: '维护客户',
					key: 'maintenance',
					minWidth: 120
				},
				{
					title: '维护出来客户',
					key: 'maintenanced',
					minWidth: 120
				},
				{
					title: '约见客户',
					key: 'appoint',
					minWidth: 100
				},
				{
					title: '绕前台',
					key: 'proscenium',
					minWidth: 100
				},
				{
					title: '操作',
					key: 'link',
					minWidth: 150,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth[969]
										? <div onClick={() => { this.handleCheck(params.row.which_day); }} class="g-operation">查看</div>
										: ""
								}
							</div>
						);
					}
				}
			],
		};
	},
	computed: {
		columns() {
			if (this.$route.query.staff_identity == 2) {
				return this.columns1; // 超管
			} else {
				return this.columns2; // 员工
			}
		},
		staffIdentity() {
			return this.$refs.tableTarget.$attrs.staffIdentity;
		}

	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_CHECK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_CHECK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleCheck(v) {
			this.$router.push({ name: 'sale-customer-business-detail',
				query: { choose_day: v, staff_id: this.$route.query.staff_id, staff_identity: this.$refs.tableTarget.$attrs.staff } });
		}
	}
};

