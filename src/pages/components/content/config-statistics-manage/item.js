export default {
	data() {
		return {
			columns: [
				{
					title: '下载人',
					key: 'status',
					render: (h, { row }) => {
						return <div class="g-operation" onClick={() => { this.handleDetailTo(row); }}>
							{row.staff_name}
						</div>;
					}
				},
				{
					title: '手机号',
					key: 'mobile',
				},
				{
					title: '下载总次数',
					key: 'total_count',
					sortable: true
				},
				{
					title: '最高下载日',
					key: 'download_date',
				},
				{
					title: '最高下载月',
					key: 'download_month',
				},
				{
					title: '最近下载时间',
					key: 'create_time',
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_CONFIG_STATISTICS_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_CONFIG_STATISTICS_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleDetailTo(row) {
			this.$router.push({
				path: "/content/config/statistics/manage/detail",
				query: { staff_name: row.staff_name, type: this.type != 0 ? this.type : 1 }
			});
		},
	}
};

