export default {
	data() {
		return {
			columns: []
		};
	},
	created() {
		this.loadTitleArray();
	},
	mounted() {
		this.$vc.on('hr-archives-employee-detail-title-change', (res) => {
			this.loadTitleArray();
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-archives-employee-detail-title-change');
	},
	methods: {
		loadTitleArray() {
			this.loadTableTitle().then((res) => {
				this.columns = this.getColumns(res.data);
			});
		},
		handleLinkTo(info) {
			const { query } = this.$route;
			this.$router.push({
				path: '/hr/archives/employee/business/watch',
				query: {
					staff_id: query.staff_id,
					choose_day: info.which_day,
					prevType: this.$route.query.type
				}
			});
		},
		getColumns(data = { title_show: [], title_hide: [] }) {
			let columns1 = [
				{
					title: "日期",
					key: "which_day",
					minWidth: 110
				},
				{
					title: "周期",
					key: "which_week",
					minWidth: 100
				},
				{
					title: "星期",
					key: "week_day",
					minWidth: 100
				},
				{
					title: "过客户",
					key: "adoptive",
					minWidth: 100
				},
				{
					title: "过出来客户",
					key: "adoptived",
					minWidth: 100
				},
				{
					title: "谈判客户",
					key: "negotiation",
					minWidth: 100
				},
				{
					title: "跟进客户",
					key: "follow_up",
					minWidth: 100
				},
				{
					title: "成交客户",
					key: "deal",
					minWidth: 100
				}
			];

			let columns2 = [
				{
					title: "日期",
					key: "which_day",
					minWidth: 110
				},
				{
					title: "周期",
					key: "which_week",
					minWidth: 100
				},
				{
					title: "星期",
					key: "week_day",
					minWidth: 100
				},
				{
					title: "加微信客户",
					key: "wechat",
					minWidth: 100
				},
				{
					title: "维护客户",
					key: "maintenance",
					minWidth: 100
				},
				{
					title: "维护出来客户",
					key: "maintenanced",
					minWidth: 110
				},
				{
					title: "约见客户",
					key: "appoint",
					minWidth: 100
				},
				{
					title: "绕前台",
					key: "proscenium",
					minWidth: 100
				}
			];

			const columnsShow1 = data.title_show.map(cloShow => {
				const result = columns1.find(col => {
					return cloShow.key == col.key;
				});
				return result;
			}).filter(Boolean);

			columnsShow1.splice(columns1.length, 0, {
				title: "操作",
				key: 'action',
				minWidth: 100,
				align: 'center',
				fixed: "right",
				render: (h, params) => {
					return (
						<span>{ this.$auth[1105]
							? <span class="g-c-blue-mid g-pointer" onClick={() => this.handleLinkTo(params.row)}>查看</span>
							: null }</span>
					);
				}
			});

			const columnsShow2 = data.title_show.map(cloShow => {
				const result = columns2.find(col => {
					return cloShow.key == col.key;
				});
				return result;
			}).filter(Boolean);

			columnsShow2.splice(columns2.length, 0, {
				title: "操作",
				key: 'action',
				minWidth: 100,
				align: 'center',
				fixed: "right",
				render: (h, params) => {
					return (
						<span class="g-c-blue-mid g-pointer" onClick={() => this.handleLinkTo(params.row)}>查看</span>
					);
				}
			});

			return this.$route.query.type === '1' ? columnsShow1 : columnsShow2;
		}
	}
};

