import { Progress } from "iview";
import { getParseUrl, getHashUrl } from "@utils/utils";
import API_ROOT from "@stores/apis/root";

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
					key: "status"
				},
				{
					title: "导出结果",
					key: "result"
				},
				{
					title: "进度",
					key: "progress_rate",
					minWidth: 80,
					render: (h, params) => {
						if (params.row.result != "失败") {
							return (
								<Progress percent={Number(params.row.progress_rate.split("%")[0])} status="active">
									{params.row.progress_rate}
								</Progress>
							);
						} else {
							return (
								<div>
									<i class="iconfont icon-warning f-fs-12" style="color: red;"/>
									<span>导出失败，请重新尝试导出</span>
								</div>
							);
						}
					}
				},
				{
					title: "创建时间",
					key: "create_time"
				},
				{
					title: "完成时间",
					key: "finish_time"
				},
				{
					title: "文件大小",
					key: "size"
				},
				{
					title: "导出人",
					key: "staff_name"
				},
				{
					title: "操作",
					key: "",
					render: (h, params) => {
						if (params.row.status == "已结束") {
							return (
								<div 
									class="g-pointer" 
									style="color: #2397f9;padding: 2px 8px;padding-left: 0px"
									onClick={() => {
										const url = getHashUrl(API_ROOT['_SC_CUSTOMER_COOPERATE_EXPORTTASK_DOWN'], {
											customer_excel_id: params.row.customer_excel_id,
											is_export: 1,
											'-token': this.$global.token
										});

										window.open(url);
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
			this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};