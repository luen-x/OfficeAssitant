import { Progress } from 'iview';
import API_ROOT from "@stores/apis/root";
import { getHashUrl, getItem } from '@utils/utils';

export default {
	data() {
		return {
			columns: [
				{
					title: '状态',
					key: 'status',
					minWidth: 120,
					render: (h, params) => {
						const { status } = params.row;
						return <span>{status === 0 ? '进行中' : '已结束'}</span>;
					}
				},
				{
					title: '导出结果',
					key: 'status_str',
					minWidth: 120,
					render: (h, params) => {
						const { status } = params.row;
						return <span>{status === 0 ? '正在导出' : (status === 1 ? '成功' : '失败')}</span>;
					}
				},
				{
					title: '进度',
					key: 'status',
					minWidth: 240,
					render: (h, params) => {
						const { status } = params.row;
						// const status = 2;
						return (<div>
							{ status === 0 && <div>
								<Progress style="width: 150px" percent={0} hide-info></Progress>
								<span class="g-m-l-5">正在导出</span>
							</div> }
							{ status === 1 && <Progress style="width: 205px" percent={100} status="success">100%</Progress> }
							{ status === 2 && <div>
								<i class="iconfont icon-warning f-fs-12 g-m-r-5" style="color: red;"/>
								<span>导出失败，请重新尝试导出</span>
							</div>}
						</div>);
					}
				},
				{
					title: '创建时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '完成时间',
					key: 'finish_time',
					minWidth: 160
				},
				{
					title: '文件大小',
					key: 'file_size',
					minWidth: 120
				},
				{
					title: '导出人',
					key: 'staff_name',
					minWidth: 120
				},
				{
					title: '操作',
					key: 'action',
					minWidth: 110,
					render: (h, params) => {
						return (
							params.row.status === 0 ? <span>--</span>
								: <span
									class="g-pointer g-c-blue-mid"
									onClick={() => this.handleDownload(params.row)}>
								下载</span>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_OUTPUT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_OUTPUT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleDownload(info) {
			const url = getHashUrl(info.file_url, {
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};

