import { Copy, Upload } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip } from 'iview';
import Explain from '@components/_common/explain/explain';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { passPModal } from './popup/pass.vue';
import { offerPModal } from './popup/offer.vue';
import { assignPModal } from './popup/assign.vue';
import { changePModal } from './popup/change.vue';
import { recoverPModal } from './popup/recover.vue';
import { delPModal } from './popup/delete.vue';
import { remarksPModal } from './popup/remarks.vue';

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
				'7': [],
				'8': [],
				'9': [],
				'10': [],
				'11': [],
				'12': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-recruit-school-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-recruit-school-title-change');
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
					title: "姓名",
					key: "applicant_name",
					fixed: "left",
					minWidth: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { applicant_name, content } = params.row;
						
						return (
							<div class="g-flex-ac">
								{ content && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<div class="g-m-r-5 g-remark">注</div>
									<div slot="content" style="max-width: 300px; white-space: normal;word-break: break-all">
										{ content }
									</div>
								</Poptip>}
								{ !content && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								{ this.$auth[152]
									? <router-link
										class="g-c-blue-mid g-pointer"
										style={{ display: 'block', width: '100%' }}
										to={this.handleLinkTo(params)}
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
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					minWidth: 120
				},
				{
					title: "性别",
					key: "sex_name",
					minWidth: 80,
					render: (h, params) => {
						return h('span', {}, params.row.sex === 0 ? '男' : '女');
					}
				},
				{
					title: "应聘职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "备选职位",
					key: "alternative_position_name",
					minWidth: 150
				},
				{
					title: "毕业学校",
					key: "college",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.college}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "专业",
					key: "profession",
					minWidth: 150
				},
				{
					title: "学历",
					key: "education_name",
					minWidth: 100
				},
				{
					title: "邮箱",
					key: "email",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.email}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "微信号",
					key: "wechat",
					minWidth: 150
				},
				{
					title: '笔试匹配度',
					key: 'match_progress',
					minWidth: 120,
					sortable: 'custom'

				},
				// {
				// 	title: '面试结果',
				// 	key: 'interview_result_name',
				// 	minWidth: 120,
				// 	sortable: 'custom'
				// },
				{
					title: '面试结果',
					key: 'interview_result_name',
					minWidth: 120,
					sortable: 'custom'
				},
				{
					title: '发Offer时间',
					key: 'send_offer_time',
					minWidth: 160,
					sortable: 'custom',
				},
				{
					title: '回复报到时间',
					key: 'reply_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '车票信息',
					key: 'ticket_info_all',
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.ticket_info_all}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '试岗时间',
					key: 'try_time',
					minWidth: 200,
					sortable: 'custom',
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
					title: '实际报到时间',
					key: 'register_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '预计入职时间',
					key: 'predict_entry_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '入职时间',
					key: 'entry_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '淘汰时间',
					key: 'pass_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '离开时间',
					key: 'departure_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '上班天数',
					key: 'work_day',
					minWidth: 100,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								上班天数
								<Explain
									style={{ marginLeft: '2px' }}
									title="上班天数从实际报到的时间开始算累计"
									content="例如，职员A在11月1号报到，在11月5号主动离开，那么上班天数就是4天。（如果遇到休息日或者节假日都直接累计，不扣除）"
								/>
							</div>
						);
					}
				},
				{
					title: '上班周期',
					key: 'work_period',
					minWidth: 100,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								上班周期
								<Explain
									style={{ marginLeft: '2px' }}
									title="上班天数/30即为上班周期，且保留两位小数"
									content="例如，职员A上了2天班之后离开，那么他的上班周期就是2/30，保留两位小数就是0.07"
								/>
							</div>
						);
					}
				},
				{
					title: '离职时间',
					key: 'leave_time',
					minWidth: 160,
					sortable: 'custom'
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150
				},
				{
					title: '状态',
					key: 'status_name',
					minWidth: 100
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				// if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			// if (type == 5 || type == 10 || type == 11) {
			if (['1', '2', '5', '10', '11'].includes(type)) {
				columnsShow.splice(0, 0, {
					type: 'selection',
					width: 60,
					fixed: "left",
				});
			}
			if (type != 9 && type != 12) {
				columnsShow.splice(columnsShow.length, 0, {
					title: "操作",
					key: 'action',
					minWidth: 100,
					align: 'center',
					fixed: "right",
					render: (h, params) => {
						const { status, url, position_name, applicant_name, is_write_entry } = params.row;
						if (status === 5 || status === 7) return null;

						return (
							<Dropdown transfer placement="left-start" onOn-click={(name) => {
								this.handleAction(name, params);
							}}>
								<i class="iconfont icon-point g-fs-20 g-pointer" />
								<DropdownMenu slot="list">
									{ this.getOpts(status, { is_write_entry }).map(opt => {
										// 判断是否有权限
										if (typeof opt.auth === 'number' && !this.$auth[opt.auth]) return null;
										if (typeof opt.auth === 'boolean' && !opt.auth) return null;

										if (opt.key === 'upload') {
											return (
												<DropdownItem name={opt.key}>
													<Upload
														multiple
														max={10}
														accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .png, .jpg, .jpeg, .gif, .zip, .rar, .avi, .mp3, .mp4, .mpeg, .rmvb, text/plain" // eslint-disable-line
														onComplete={(res, file) => {
															this.uploadFile(res, params);
														}}
														onError={(error) => {
															this.$Message.warning(error.msg);
														}}
													>上传附件</Upload>
												</DropdownItem>
											);
										}

										if (opt.key === 'entryFaceInvoiceUrl' && url) {
											return (
												<DropdownItem name={opt.key}>
													<Copy
														value={`您好，${position_name}${applicant_name}等待您的入职面谈，点击下方链接进行面谈单填写。 ${url.mobile?'手机端链接：'+url.mobile+';':""}${url.pc ? '电脑端链接：'+url.pc+';' : ''}`} // eslint-disable-line
														// value={`您好，${position_name}${applicant_name}等待您的入职面谈，点击下方链接进行面谈单填写。手机端链接：${url.mobile ? url.mobile : ''}电脑端链接：${url.pc ? url.pc : ''}`} // eslint-disable-line
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
		// 跳转到详情页
		handleLinkTo(params) {
			let baseUrl = `/hr/recruit/school/summary/${params.row.applicant_id}`;
			return getHashUrl(baseUrl, { tabType: this.type, list_type: 'school-index' });
		},
		// 弹框
		handleAction(name, params) {
			let url = '';
			switch (name) {
				case 'delete':	// 删除
					delPModal.popup({
						data: {
							selected: params.row,	// 选中元素
						}
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;
				case 'remarks':	// 备注
					remarksPModal.popup({
						id: params.row.applicant_id
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;
				case 'change':
				case 'leave':	// 变更、离开
					changePModal.popup({
						data: {
							action: name,
							info: params.row,
						}
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;

				case 'fail':	// 淘汰
					passPModal.popup({
						data: {
							info: params.row,
						}
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;

				case 'offer':	// 待发offer
					offerPModal.popup({
						data: params.row
					}).then(res => {
						// 跳转待发offer模板页
						this.$router.push(
							getHashUrl('/hr/recruit/school/summary/email',
								{
									...res,
									send_offer_time: formatMoment(res.letter_time),
									offer_valid_time: formatMoment(res.valid_date),
									try_out_date: res.try_time,
									applicant_id: params.row.applicant_id,
									position_id: res.position_id,
									recruitType: 'school'
								})
						);
						// this.$router.push({
						// 	path: '/hr/recruit/school/summary/offer',
						// 	query: {
						// 		...res,
						// 		send_offer_time: formatMoment(res.letter_time),
						// 		offer_valid_time: formatMoment(res.valid_date),
						// 		try_out_date: res.try_time,
						// 		applicant_id: params.row.applicant_id,
						// 		recruitType: 'school'
						// 	}
						// });
					}).catch(() => {});
					break;

				case 'assign':	// 指派
					assignPModal.popup({
						data: {
							info: params.row,
						}
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;

				case 'recover':	// 恢复
					recoverPModal.popup({
						data: {
							type: this.type,
							info: params.row,
						}
					}).then(res => {
						this.$Message.success('操作成功');
					}).catch(() => {});
					break;

				case 'entryFaceInvoice':
					url = params.row.url.pc.split('.com');
					this.$router.push(`${url[1]}`);
					break;

				default:
					break;
			}
		},
		// 上传附件
		uploadFile(res, params) {
			let resume = [];
			if (res.imgs.length) {
				res.imgs.forEach(item => {
					let obj = { ...item.data };
					resume.push(obj);
				});
			}

			// 上传附件
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_UPLOAD_POST'],
				type: 'POST',
				param: {
					applicant_id: params.row.applicant_id,
					resume
				},
				loading: false
			}).then(res1 => {
				this.$Message.success('附件上传成功，请在详情中查看!');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		getOpts(status, opts = {}) {
			const { is_write_entry } = opts;
			switch (Number(status)) {
				case 1:
				case 8:
				case 12:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 142 },
						{ key: 'fail', label: '淘汰', auth: 143 },
						{ key: 'delete', label: '删除' },
						{ key: 'upload', label: '上传附件', auth: 144 }
					];
				case 2:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 142 },
						{ key: 'fail', label: '淘汰', auth: 143 },
						{ key: 'offer', label: '发offer', auth: 146 }
					];
				case 9:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 142 },
						{ key: 'fail', label: '淘汰', auth: 143 },
						{ key: 'assign', label: '指派', auth: 147 }
					];
				case 3:
				case 10:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 142 },
						{ key: 'leave', label: '离开', auth: 149 },
						{ key: 'assign', label: '指派', auth: 147 }
					];
				case 4:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'change', label: '变更', auth: 142 },
						{ key: 'leave', label: '离开', auth: 149 },
						{ key: 'entryFaceInvoiceUrl', label: '入职面谈链接' },
						{ key: 'entryFaceInvoice', label: '查看入职面谈', auth: !!is_write_entry }
					];
				case 6:
				case 11:
					return [
						{ key: 'remarks', label: '备注' },
						{ key: 'recover', label: '恢复', auth: 150 }
					];
				default:
					return [];
			}
		}
	}
};
