export default {
	data() {
		return {
			columns: [
				{
					title: "任务类型",
					key: "",
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>导出</div>
						);
					}
				},
				{
					title: "状态",
					key: "status",
					minWidth: 100,
					render: (h, params) => {
						let arr = ['导出中', '完成', '失败'];

						return (
							<div>{ arr[params.row.status] }</div>
						);
					}
				},
				{
					title: "创建时间",
					key: "create_time",
					minWidth: 160
				},
				{
					title: "完成时间",
					key: "update_time",
					minWidth: 160
				},
				{
					title: "文件大小",
					key: "size",
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{ params.row.size + 'KB' }</div>
						);
					}
				},
				{
					title: "操作",
					key: "",
					minWidth: 100,
					render: (h, params) => {
						if (+params.row.status === 1) {
							return (
								<div 
									class="g-pointer" 
									style="color: #2397f9;padding: 2px 8px;padding-left: 0px"
									onClick={() => {
										this.handleDownload(params.row);
									}}
								>
									下载
								</div>
							);
						} else {
							return <div>--</div>;
						}
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_EXPORT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_EXPORT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleDownload(row) {
			window.open(row.down_url, '_blank');
		}
	}
};

