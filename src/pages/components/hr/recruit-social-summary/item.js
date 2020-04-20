import { Poptip, Dropdown, DropdownItem, DropdownMenu } from 'iview';
import { Copy } from 'wya-vc';
import { getParseUrl, getHashUrl, oneLinePipe } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PassModal } from './popup/pass';
import { ChangeModal } from './popup/change';
import { InterviewModal } from './popup/interview';
import { DesignateModal } from './popup/designate';
import { LinkModal } from './popup/link';
import { OfferModal } from './popup/offer';
import { remarksPModal } from './popup/remarksModal.vue';
import { TrainModal } from './popup/train';
import { BackModal } from './popup/back';
import { BackLookModal } from './popup/back-look';

export default {
	data() {
		return {
			columns: {
				'0': [],
				'1': [],
				'8': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': [],
				'7': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-recruit-soical-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-recruit-soical-title-change');
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
					title: '姓名',
					key: 'applicant_name',
					minWidth: 170,
					fixed: 'left',
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { applicant_name, applicant_id, content } = params.row;

						return (
							<div class="g-flex-ac">
								{ content && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<span class="g-remark g-m-r-5">注</span>
									<div slot="content" style="max-width: 300px; white-space: normal;word-break: break-all">
										{ content }
									</div>
								</Poptip>}
								{ !content && <span class="g-remark g-m-r-5" style="opacity: 0">注</span>}
								{ this.$auth[189]
									? <router-link
										class="g-c-blue-mid g-pointer"
										style={{ display: 'block', width: '100%' }}
										to={this.handleLinkTo(applicant_id)}
									>
										<span>
											{ applicant_name.length <= 7 ? applicant_name
												: <AutoToolTip
													content={applicant_name}
													labelClass=""
													width="105px"
													theme="dark"
												>
													{applicant_name}
												</AutoToolTip>
											}
										</span>
									</router-link>
									: <span>
										{ applicant_name.length <= 7 ? applicant_name
											: <AutoToolTip
												content={applicant_name}
												labelClass=""
												width="105px"
												theme="dark"
											>
												{applicant_name}
											</AutoToolTip>
										}
									</span>
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
					minWidth: 150
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 100,
				},
				{
					title: '籍贯',
					key: 'native',
					minWidth: 150
				},
				{
					title: '年龄',
					key: 'age',
					minWidth: 100,
				},
				{
					title: '期望薪资',
					key: 'salary',
					minWidth: 150
				},
				{
					title: '现居住地',
					key: 'now_address',
					minWidth: 250,
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
					minWidth: 150
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
					title: '是否背景调查',
					key: 'is_background_name',
					minWidth: 120,
					render: (h, { row }) => {
						return <span
							class="g-operation"
							onClick={() => this.handleBackLook(row)}>{row.is_background_name}</span>;
					}
				},
				{
					title: '预计面试时间',
					key: 'predict_interview_time',
					minWidth: 150,
				},
				{
					title: '实际面试时间',
					key: 'interview_time',
					minWidth: 150,
				},
				{
					title: '面试官',
					key: 'interviewer_name',
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.interviewer_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '面试轮数',
					key: 'step',
					minWidth: 120,
					filters: [
						{
							label: '一轮面试',
							value: "1"
						},
						{
							label: '二轮面试',
							value: "2"
						},
						{
							label: '三轮面试',
							value: "3"
						},
						{
							label: '四轮面试',
							value: "4"
						}
					],
					filterMultiple: false,
					filteredValue: this.$route.query.step || 0,
					filterRemote: (value, row) => {
						let params = { ...this.$route.query };
						delete params.step;
						if (value != 0) {
							params.step = value;
						}
						this.$router.replace(getHashUrl(
							'/hr/recruit/social/summary',
							params
						));
						this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
					}
				},
				{
					title: '面试结果',
					key: 'interview_result_name',
					minWidth: 120
				},
				{
					title: '试岗时间',
					key: 'try_time',
					minWidth: 200,
					render: (h, params) => {
						return <span>{params.row.try_time}</span>;
					}
				},
				{
					title: '试岗部门',
					key: 'try_depart_name',
					minWidth: 150
				},
				{
					title: '是否参加培训',
					key: 'is_join_train_name',
					minWidth: 150
				},
				{
					title: '试岗培训时间',
					key: 'try_train_start_time',
					minWidth: 150,
				},
				{
					title: '通知培训进度',
					key: 'inform_train_progress',
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.inform_train_progress}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '试岗培训跟踪',
					key: 'try_train_tracking',
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.try_train_tracking}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '预计入职时间',
					key: 'predict_entry_time',
					minWidth: 150
				},
				{
					title: '发offer时间',
					key: 'send_offer_time',
					minWidth: 160
				},
				{
					title: '入职时间',
					key: 'entry_time',
					minWidth: 150
				},
				{
					title: '离职时间',
					key: 'leave_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '状态',
					key: 'status_name',
					minWidth: 150,
				}
			];
			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);
			if (type !== '2') {
				columnsShow.forEach(v => {
					if (v.key == 'step') {
						delete v.filters;
					}
				});
			}
			if (type != 0 && type != 7) {
				columnsShow.splice(0, 0, {
					type: 'selection',
					width: 60,
					fixed: "left",
				});
			}
			if (type != 6 && type != 7) {
				columnsShow.splice(columnsShow.length, 0,
					{
						title: '操作',
						key: 'options',
						minWidth: 100,
						align: 'center',
						fixed: 'right',
						render: (h, params) => {
							const { status, step, is_join, is_back, applicant_name,
								position_name, interview_urls = [], url, is_write_entry } = params.row;
							// 获取记录单单据url
							const urls = [];
							interview_urls.length ? interview_urls.forEach((i, index) => {
								urls[index] = {};
								urls[index].mobileUrl = i.split(' ')[0].split('手机端：')[1];
								urls[index].pcUrl = i.split(' ')[1].split('pc端：')[1];
							}) : '';

							if (status == 5 || status == 7) return null;
							return (
								<Dropdown transfer placement="left-start" onOn-click={(name) => {
									this.handleClickItem(name, params.row);
								}}>
									<i class="iconfont icon-point g-fs-20 g-pointer" />
									<DropdownMenu slot="list">
										{this.getOpts(status, { step, is_join, is_back, is_write_entry }).map((opt) => {
											if (typeof opt.auth === 'number' && !this.$auth[opt.auth]) return null;
											if (typeof opt.auth === 'boolean' && !opt.auth) return null;

											if (opt.key === 'checkTryDepart') {
												return (
													<DropdownItem name={opt.key}>
														<Copy
														value={`您好，${position_name}${applicant_name}等待您的入职面谈，点击下方链接进行面谈单填写。 ${url.mobile?'手机端链接：'+url.mobile+';':""}${url.pc ? '电脑端链接：'+url.pc+';' : ''}`} // eslint-disable-line
															tag="span"
															onAfter={() => {
																this.$Message.success('入职面谈链接已复制');
															}}
														>
														入职面谈链接
														</Copy>
													</DropdownItem>
												);
											}

											if (opt.key === 'resultLink') {
												return (
													<Dropdown transfer placement="right-start">
														<DropdownItem>
															{opt.label}
															<i class="iconfont icon-right g-fs-12 g-c-black4 g-m-l-20" />
														</DropdownItem>
														<DropdownMenu slot="list">
														{Array.from({ length: step }).map((subItem, index) => { // eslint-disable-line
																return (
																	<DropdownItem name={index}>
																		<Copy
																		value={`您好，有一位应聘者正在等待面试，应聘者${applicant_name}，应聘岗位${position_name}，点击下方链接进行记录单填写。手机端链接：${urls[index].mobileUrl} 电脑端链接：${urls[index].pcUrl}`} // eslint-disable-line
																			tag="span"
																			onAfter={() => {
																				this.$Message.success(`第${index + 1}轮的面试链接已复制`);
																			}}
																		>
																			{`第${index + 1}轮面试链接`}
																		</Copy>
																	</DropdownItem>
																);
															})}
														</DropdownMenu>
													</Dropdown>
												);
											}
											return <DropdownItem name={opt.key}>{opt.label}</DropdownItem>;
										})}
									</DropdownMenu>
								</Dropdown>
							);
						}
					});
			}

			return columnsShow;
		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_RESET', { type: this.type });
		},
		handleLinkTo(applicant_id) {
			let baseUrl = `/hr/recruit/social/summary/${applicant_id}`;
			return getHashUrl(baseUrl, {
				...this.$route.query,
				type: this.type,
				list_type: 'social-index'
			});
		},
		handleBackLook(item) {
			BackLookModal.popup({
				applicantId: item.applicant_id,
			}).then(res => {

			}).catch(err => {

			});
		},
		handleClickItem(name, item) {
			const { query = {} } = this.$route;
			let url = '';
			switch (name) {
				case 'pass':
					PassModal.popup({
						info: item
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'change':
					ChangeModal.popup({
						applicantId: item.applicant_id,
						status: item.status,
						query
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'check':
					this.$router.push(`/hr/recruit/social/resume?applicant_id=${item.applicant_id}&print=1`);
					break;
				case 'resultLink':
					if (item.step == 0) {
						this.$router.push(`/hr/form/interview?applicant_id=${item.applicant_id}`);
					}
					break;
				case 'editDesignate':
					InterviewModal.popup({
						type: 'edit',
						applicantId: item.applicant_id,
						info: {
							interviewer_ids: item.interviewer_name ? item.interviewer_ids : [],
							interviewer_name: item.interviewer_name,
							interview_time: new Date(item.interview_time)
						}
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'keepInterview':
					InterviewModal.popup({
						type: 'keep',
						applicantId: item.applicant_id,
						step: item.step,
						info: {
							interviewer_ids: [],
							interviewer_name: "",
							interview_time: "",
						}
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'expect':
					InterviewModal.popup({
						type: 'expect',
						applicantId: item.applicant_id,
						info: {
							interviewer_ids: item.interviewer_name ? item.interviewer_ids : [],
							interviewer_name: item.interviewer_name,
							predict_interview_time: new Date(item.predict_interview_time)
						}
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'lookTrain':
					TrainModal.popup({
						applicantId: item.applicant_id,
						info: item
					}).then((res) => {
						this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
					}).catch((err) => {

					});
					break;
				case 'background':
					BackModal.popup({
						applicantId: item.applicant_id,
					}).then((res) => {
						this.$store.commit('HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT');
					}).catch((err) => {

					});
					break;
				case 'offer':
					// 跳转到该应聘者的offer文档（模板空的内容自动填写）页面，招聘者可以发送邮箱
					OfferModal.popup({
						applicantId: item.applicant_id
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'designate':
					DesignateModal.popup({
						applicantId: item.applicant_id,
					}).then((res) => {

					}).catch((err) => {

					});
					break;
				case 'entryFaceInvoice':
					url = item.url ? item.url.pc.split('.com') : '';
					url ? this.$router.push(`${url[1]}`) : null;
					break;
				case 'remarks':	// 备注
					remarksPModal.popup({
						id: item.applicant_id
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;
				case 'checkTryDepart':
				default:
					break;
			}
		},
		getOpts(status, opts = {}) {
			const { step, is_join, is_back, is_write_entry } = opts;
			switch (Number(status)) {
				case 0:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 177 },
						{ key: 'pass', label: '淘汰', auth: 176 },
						{ key: 'check', label: '查看简历', auth: 178 }
					];
				case 13:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 177 },
						{ key: 'pass', label: '淘汰', auth: 176 },
						// { key: 'resultLink', label: '面试链接', auth: 179 },
						{ key: 'check', label: '查看简历', auth: 178 },
						{ key: 'editDesignate', label: '修改实际面试信息', auth: 1001 },
						{ key: 'keepInterview', label: '继续面试', auth: 181 }
					];
				case 14:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 177 },
						{ key: 'pass', label: '淘汰', auth: 176 },
						{ key: 'check', label: '查看简历', auth: 178 },
						{ key: 'expect', label: '修改预计面试信息', auth: 1000 }
					];
				case 2:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 177 },
						{ key: 'pass', label: '淘汰', auth: 176 },
						{ key: 'offer', label: '发offer', auth: 183 }
					];
				case 3:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 177 },
						{ key: 'pass', label: '淘汰', auth: 176 },
						{ key: 'lookTrain', label: '填写培训信息', auth: 1002 }
					];
				case 4:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 177 },
						{ key: 'pass', label: '淘汰', auth: 176 },
						{ key: 'background', label: '背景调查', auth: 1003 },
						{ key: 'checkTryDepart', label: '入职面谈链接', auth: 185 },
						{ key: 'entryFaceInvoice', label: '查看入职面谈', auth: !!is_write_entry }
					];
				default:
					return [];
			}
		},
	}
};
