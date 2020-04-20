import { Progress } from "iview";
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { downloadFile } from '@utils/download';

export default {
	data() {
		return {
			columns: [
				{
					title: "任务类型",
					key: "",
					render: (h, params) => {
						return (
							<div>导出</div>
						);
					}
				},
				{
					title: "状态",
					key: "status",
					render: (h, params) => {
						let arr = ['导出中', '完成', '失败'];
						return (
							<div>{ arr[params.row.status] }</div>
						);
					}
				},
				// {
				// 	title: "进度",
				// 	key: "progress_rate",
				// 	minWidth: 120,
				// 	render: (h, params) => {
				// 		if (params.row.status != 2) {
				// 			return (
				// 				<Progress percent={Number(params.row.progress_rate)} status="active">
				// 					{params.row.progress_rate + '%'}
				// 				</Progress>
				// 			);
				// 		} else {
				// 			return (
				// 				<div>
				// 					<i class="iconfont icon-warning f-fs-12" style="color: red;"/>
				// 					<span>导出失败，请重新尝试导出</span>
				// 				</div>
				// 			);
				// 		}
				// 	}
				// },
				{
					title: "创建时间",
					key: "create_time",
					minWidth: 120,
				},
				{
					title: "完成时间",
					key: "update_time",
					minWidth: 120,
				},
				{
					title: "文件大小",
					key: "size",
					render: (h, params) => {
						return (
							<div>{ params.row.size + 'KB' }</div>
						);
					}
				},
				{
					title: "操作",
					key: "",
					render: (h, params) => {
						if (params.row.status == 1) {
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
				
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('COLLAGE_CHECK_SERVICE_EXPORT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_CHECK_SERVICE_EXPORT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleDownload(row) {
			window.open(row.down_url, '_blank');
		}
	}
};

