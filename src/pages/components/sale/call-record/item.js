import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { downloadFile } from '@utils/download';
import API_ROOT from "@stores/apis/root";
import Explain from '@components/_common/explain/explain';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import CusAudio from '../_common/audio/audio';

export default {
	data() {
		const baseColumns = [
			{
				type: "selection",
				width: 60,
				align: "center",
				fixed: 'left'
			},
			{
				title: "录音",
				key: "tape_link",
				width: 350,
				fixed: 'left',
				render: (h, params) => {
					return (
						<CusAudio 
							src={params.row.tape_link} 
							mode="mid" 
							disabled={!params.row.agent_duration_num} 
							show-tip="never"
						/>
					);
				}
			},
			{
				title: "公司名称",
				key: "company_name",
				minWidth: 200,
				render: (h, params) => {
					return (
						<div>
							<AutoTooltip 
								content={params.row.company_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: "客户",
				key: "customer_name",
				minWidth: 200,
				render: (h, params) => {
					return (
						<div>
							<AutoTooltip 
								content={params.row.customer_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: "员工",
				key: "staff_name",
				minWidth: 200,
				render: (h, params) => {
					return (
						<div>
							<AutoTooltip 
								content={params.row.staff_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: "呼叫类型",
				key: "type_str",
				minWidth: 100,
			},
			{
				title: "开始时间",
				key: "start_time",
				minWidth: 200,
			},
			{
				title: "通话状态",
				key: "status_str",
				minWidth: 100,
			},
			{
				title: "坐席接听时长",
				key: "agent_duration",
				minWidth: 150,
				renderHeader: (h, params) => {
					return (
						<span>
							坐席接听时长
							<Explain 
								placement="bottom-start" 
								content="电话拨出后到结束的通话时间，包括等待客户接听的时间"
							/>
						</span>
					);
				}
			},
			{
				title: "通话时长",
				key: "call_time",
				minWidth: 150,
				renderHeader: (h, params) => {
					return (
						<span>
							通话时长
							<Explain 
								placement="bottom-start" 
								content="电话拨出后从接通开始的通话时间，即客户接通后才进行计算"
							/>
						</span>
					);
				}
			},
			{
				title: "操作",
				key: "-",
				width: 100,
				fixed: 'right',
				render: (h, params) => {
					return (
						<div
							class={params.row.agent_duration == "00:00:00" ? 'g-operation-disable' : 'g-operation'}
							onClick={() => {
								if (params.row.agent_duration == "00:00:00") return;
								this.handleDownload([params.row.download]);
							}}
						>
							下载
						</div>
					);
				}
			}
		];
		const showColumns = [...baseColumns];
		showColumns.splice(10, 0, {
			title: "质检板块",
			key: "list_type",
			minWidth: 150,
			renderHeader: (h, params) => {
				return (
					<span>
							质检板块
						<Explain 
							placement="bottom-start" 
							content="立客户板块生成的录音，质检板块为立客户。商学院板块生成的录音，质检板块为商学院；"
						/>
					</span>
				);
			}
		});
		return {
			baseColumns,
			showColumns
		};
	},
	methods: {
		getColumns(tab_type) {
			if (tab_type == '1') {
				return this.baseColumns;
			} else {
				return this.showColumns;
			}
		},
		handleResetFirst() {
			this.$store.commit("SALE_CALL_RECORD_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CALL_RECORD_LIST_RESET", {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleDownload(attachment_urls) {
			if (attachment_urls.length == 0) {
				this.$Message.warning("请选择要下载的文件");
				return;
			}
			attachment_urls.forEach((url) => {
				this.downloadFile(url);
			});
		},
		downloadFile(url) {
			let iframe = document.createElement('iframe');
			iframe.id = (new Date()).getTime();
			iframe.addEventListener('load', function () {
				document.body.removeChild(iframe);
			}); 
			// hack 因为预览类型的文件，onload不会执行，所以在iframe内在创建一个下载的iframe
			iframe.srcdoc = `<iframe src='${url}'></iframe>`;
			document.body.appendChild(iframe);
		}
	}
};
