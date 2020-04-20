import { Poptip, Tooltip } from 'iview';
import { getHashUrl, oneLinePipe } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: {
				'0': [],
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-recruit-soical-talent-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-recruit-soical-talent-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					type: 'selection',
					width: 60,
					fixed: 'left',
				},
				{
					title: '姓名',
					key: 'applicant_name',
					minWidth: 190,
					fixed: 'left',
					render: (h, params) => {
						const { applicant_name, applicant_id, content } = params.row;
						const applicantName = (
							<span
								onClick={() => this.handleLinkTo(applicant_id)}
								style={{ display: 'block', width: '100%' }}
							>
								{oneLinePipe(applicant_name)}
							</span>
						);
						return (
							<div class={{ "g-operation": this.$auth[1535], "g-flex-ac": true }}>
								{/* {content && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<span class="g-remark g-m-r-5">注</span>
									<div slot="content" style="max-width: 300px; white-space: normal">
										{ content }
									</div>
								</Poptip>} */}

								{applicant_name.length > 10 
									? <Tooltip content={applicant_name}>
										{applicantName}
									</Tooltip>
									: applicantName
								}
							</div>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 120,
					fixed: 'left',
					render: (h, params) => {
						return h('span', params.row.mobile);
					}
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 170
				},
				{
					title: '预计面试时间',
					key: 'predict_interview_time',
					minWidth: 170,
				},
				{
					title: '实际面试时间',
					key: 'interview_time',
					minWidth: 170,
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 120
				},
				{
					title: '籍贯',
					key: 'native',
					minWidth: 170
				},
				{
					title: '年龄',
					key: 'age',
					minWidth: 100
				},
				{
					title: '期望薪资',
					key: 'salary',
					minWidth: 100
				},
				{
					title: '现居住地',
					key: 'now_address',
					minWidth: 290,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.now_address}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '招聘渠道',
					key: 'ditch_name',
					minWidth: 120
				},
				{
					title: '转介绍人',
					key: 'introducer_name',
					minWidth: 120
				},
				{
					title: '邀约人',
					key: 'invite_name',
					minWidth: 120
				},
				{
					title: '淘汰时间',
					key: 'pass_time',
					minWidth: 150,
				},
				{
					title: '淘汰类型',
					key: 'pass_type_name',
					minWidth: 150
				},
				{
					title: '面试时间',
					key: 'interview_time',
					minWidth: 150,
				},
				{
					title: '试岗时间',
					key: 'try_time',
					minWidth: 180
				},
				{
					title: '是否再跟踪',
					key: 'is_tracking_name',
					minWidth: 150
				},
				{
					title: '备注',
					minWidth: 240,
					key: 'content',
					render: (h, params) => {
						return (
							<div>
								{params.row.content.length > 15
									? <Tooltip 
										transfer 
										placement="bottom-start"
										style="display: block;maxWidth:200px"
									>
										<div>{params.row.content.substr(0, 15) + '...'}</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{params.row.content}
											</p>
										</div>
									</Tooltip>
									: params.row.content}
							</div>
						);
					}
				},
				{
					title: '操作',
					key: 'options',
					minWidth: 100,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						if (!this.$auth[187]) {
							return null;
						}
						return h('div', {
							class: 'g-operation',
							on: {
								click: () => {
									this.handleRecover([params.row.applicant_id]);
								}
							}
						}, '邀约');
					}
				}

			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);
			columnsShow.splice(0, 0, {
				type: 'selection',
				width: 60,
				fixed: 'left',
			});
			columnsShow.splice(columnsShow.length, 0, {
				title: '操作',
				key: 'options',
				minWidth: 100,
				align: 'center',
				fixed: 'right',
				render: (h, params) => {
					if (!this.$auth[1537]) {
						return null;
					}
					return h('div', {
						class: 'g-operation',
						on: {
							click: () => {
								this.handleRecover(params.row.applicant_id);
							}
						}
					}, '邀约');
				}
			});
			return columnsShow;

		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SOCIAL_TALENT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SOCIAL_TALENT_LIST_RESET', { type: this.type });
		},
		handleRecover(applicant_id) {
			this.$router.push(getHashUrl('/hr/recruit/talent/invite/obsolete', {
				applicant_id
			}));
		},
		handleLinkTo(applicant_id) {
			let baseUrl = `/hr/recruit/talent/detail/obsolete/${applicant_id}`;
			this.$auth[1535] && this.$router.push(getHashUrl(baseUrl, {
				...this.$route.query,
				type: this.type,
				list_type: 'talents-index'
			}));
		},
	}
};
