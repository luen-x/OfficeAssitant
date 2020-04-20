import { Poptip } from 'iview';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import Explain from '@components/_common/explain/explain';
import { AuditModal } from "./tabs/position-analyze/popup/add";


export default {
	data() {
		return {
			columns: []
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SOCIAL_TRANSFORM_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SOCIAL_TRANSFORM_LIST_RESET', { type: this.type });
		},
		handleLinkTo(applicant_id) {
			let baseUrl = `/hr/recruit/social/statistics/${applicant_id}`;
			return getHashUrl(baseUrl, {
				...this.$route.query,
				list_type: 'social-follow'
			});
		},
		handleTip(operate_id) {
			this.$router.push(getHashUrl(
				'/hr/recruit/social/social-transform-details', {
					...this.$route.query,
					type: 1,
					operate_id
				}
			));
		},
		handleEdit(info) {
			const { is_edit } = info;
			if (is_edit == 0) return false;
			AuditModal.popup({ title: "需求修改", info }).then(res => {
				this.$store.commit("HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_INIT");
			}).catch(err => err && console.error(err.msg));
		},
		handleJump(info) {
			const { is_edit, position_id } = info;
			// if (is_edit == 0) return false;
			this.$router.push(getHashUrl(
				'/hr/recruit/social/statistics/position/details', {
					...this.$route.query,
					type: '1',
					position_id,
				}
			));
		},
		getColumns(type) {
			let column1 = [
				{
					title: '招聘成员',
					key: 'staff_name',
					fixed: "left",
					minWidth: 170
				},
				{
					title: '录入简历',
					key: 'entering_counts',
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								录入简历
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="录入简历人数，按录入时间筛选，录入一个人员记录一个人"
								/>
							</div>
						);
					},
				},
				{
					title: '实际面试',
					key: 'actual_interview_counts',
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								实际面试
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="实际面试人数，按照第一次实际面试时间筛选，有一个第一次实际面试时间算一个人"
								/>
							</div>
						);
					},
				},
				{
					title: '面试通过',
					key: 'pass_interview_counts',
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								面试通过
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="面试通过人数，按照第一次实际面试时间筛选，变更到实际面试之后状态的人员就算一个面试通过人数"
								/>
							</div>
						);
					},
				},
				{
					title: '试岗人数',
					key: 'try_counts',
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								试岗人数
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="试岗人数，按照第一天试岗时间筛选，有一个试岗时间算一个人"
								/>
							</div>
						);
					},
				},
				{
					title: '入职人数',
					key: 'entry_counts',
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								入职人数
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="入职人数，按照入职时间筛选（以人事办理入职时的入职为准），有一个入职时间算一个人"
								/>
							</div>
						);
					},
				},
				{
					title: '转介绍',
					key: 'ex_introduce_counts',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								转介绍
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="转介绍人数，按照录入时间筛选，招聘渠道选择转介绍的人员，有一个人员算一个人员"
								/>
							</div>
						);
					},
				},
				{
					title: '面试淘汰',
					key: 'pass_by_interview_counts',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								面试淘汰
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="面试淘汰人数，按照第一次实际面试时间筛选，有一个在面试淘汰的人就算一个人"
								/>
							</div>
						);
					},
				},
				{
					title: '试岗后淘汰',
					key: 'try_end_pass_counts',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								试岗后淘汰
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="试岗完成淘汰人事，按照第一天试岗时间筛选，有一个在试岗完成淘汰的人就算一个人"
								/>
							</div>
						);
					},
				},
				{
					title: '淘汰总数',
					key: 'disuse_counts',
					minWidth: 150,
				},
				{
					title: '15天内离职',
					key: 'leave_counts',
					minWidth: 150,
				},
				{
					title: '面试率',
					key: 'interview_percent',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								面试率
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="面试率，等于实际面试人数/录入简历人数"
								/>
							</div>
						);
					},
				},
				{
					title: '发offer率',
					key: 'offer_percent',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								发offer率
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="发offer率，等于面试通过人数/实际面试人数"
								/>
							</div>
						);
					},
				},
				{
					title: '试岗率',
					key: 'try_percent',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								试岗率
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="试岗率，等于试岗人数/面试通过人数"
								/>
							</div>
						);
					},
				},
				{
					title: '入职率',
					key: 'entry_percent',
					minWidth: 150,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }} >
								入职率
								<Explain
									style={{ marginLeft: '2px' }}
									width={40}
									trigger="hover"
									content="入职率，等于入职人数/试岗人数"
								/>
							</div>
						);
					},
				},
				{
					title: '操作',
					minWidth: 160,
					fixed: 'right',
					render: (h, params) => {
						const { operate_id } = params.row;
						return (
							<div>
								{
									this.$auth[1521] ? <span 
										class="g-operation" 
										onClick={() => this.handleTip(operate_id)}
									>查看</span> : ''
								}
							</div>	
						);
					}
				}
			];
			let column2 = [
				{
					title: '月份',
					key: 'month',
					minWidth: 120
				},
				{
					title: '录入简历人数',
					key: 'entering_counts',
					minWidth: 120
				},
				{
					title: '实际面试人数',
					key: 'actual_interview_counts',
					minWidth: 120
				},
				{
					title: '面试通过人数',
					key: 'pass_interview_counts',
					minWidth: 120
				},
				{
					title: '试岗人数',
					key: 'try_counts',
					minWidth: 120
				},
				{
					title: '入职人数',
					key: 'entry_counts',
					minWidth: 120
				},
				{
					title: '试岗完成淘汰人数',
					key: 'try_end_pass_counts',
					minWidth: 160
				}
			];
			let column3 = [
				{
					title: '姓名',
					key: 'applicant_name',
					minWidth: 190,
					fixed: 'left',
					render: (h, params) => {
						const { applicant_name, applicant_id, content } = params.row;
						return (
							<div class="g-operation g-flex-ac">
								{content && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<span class="g-remark g-m-r-5">注</span>
									<div slot="content" style="max-width: 300px; white-space: normal">
										{ content }
									</div>
								</Poptip>}
								{<router-link
									style={{ display: 'block', width: '100%' }}
									to={this.handleLinkTo(applicant_id)}
								>
									{applicant_name}
								</router-link>}
							</div>

						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					width: 120,
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
					minWidth: 170
				},
				{
					title: '现居住地',
					key: 'now_address',
					minWidth: 310,
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
					title: '工作年限',
					key: 'work_time_name',
					minWidth: 100,
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
					minWidth: 150,
				},
				{
					title: '面试时间',
					key: 'interview_time',
					minWidth: 200,
				},
				{
					title: '面试官',
					key: 'interviewer_name',
					minWidth: 120
				},
				{
					title: '是否通过',
					key: 'hr_pass_result_name',
					minWidth: 100
				},
				{
					title: '所在试岗部门',
					key: 'try_depart_name',
					minWidth: 150
				},
				{
					title: '试岗时间',
					key: 'try_time',
					minWidth: 200,
				},
				{
					title: '入职时间',
					key: 'entry_time',
					minWidth: 150,
				},
				{
					title: '离职时间',
					key: 'leave_time',
					minWidth: 150,
				},
				{
					title: '招聘状态',
					key: 'status_name',
					minWidth: 100,
				},
				{
					title: '淘汰状态',
					key: 'pass_type_name',
					minWidth: 150,
				},
				{
					title: '录入时间',
					key: 'create_time',
					minWidth: 150,
				}
			];
			let column4 = [
				{
					title: '面试官',
					key: 'staff_name',
					fixed: "left",
					minWidth: 170
				},
				{
					title: '实际面试人数',
					key: 'actual_interview_counts',
					minWidth: 120
				},
				{
					title: '面试通过人数',
					key: 'pass_interview_counts',
					minWidth: 120
				},
				{
					title: '试岗人数',
					key: 'try_counts',
					minWidth: 120
				},
				{
					title: '入职人数',
					key: 'entry_counts',
					minWidth: 120
				},
				{
					title: '面试淘汰人数',
					key: 'pass_by_interview_counts',
					minWidth: 120
				},
				{
					title: '发offer率',
					key: 'offer_percent',
					minWidth: 120
				},
				{
					title: '试岗率',
					key: 'try_percent',
					minWidth: 100
				},
				{
					title: '入职率',
					key: 'entry_percent',
					minWidth: 100
				}
			];
			let column5 = [];
			let column6 = [
				{
					title: '招聘职位',
					key: 'position_name',
					fixed: "left",
					minWidth: 170,
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth[1525] ? <span 
										class="g-operation"
										onClick={() => this.handleJump(params.row)}
									>{ params.row.position_name }</span> : <span>{ params.row.position_name }</span>
								}
							</div>	
							
						);
					}
				},
				{
					title: '所属部门',
					key: 'depart_name',
					minWidth: 120
				},
				{
					title: '需求人数',
					key: 'need_number',
					minWidth: 120
				},
				{
					title: '录入简历',
					key: 'entering_count',
					minWidth: 120
				},
				{
					title: '实际面试',
					key: 'actual_interview_count',
					minWidth: 120
				},
				{
					title: '面试通过',
					key: 'pass_interview_count',
					minWidth: 120
				},
				{
					title: '试岗人数',
					key: 'try_count',
					minWidth: 120
				},
				{
					title: '面试淘汰',
					key: 'pass_by_interview_count',
					minWidth: 100
				},
				{
					title: '试岗后淘汰',
					key: 'try_end_pass_count',
					minWidth: 100
				},
				{
					title: '淘汰人数',
					key: 'disuse_count',
					minWidth: 100
				},
				{
					title: '入职人数',
					key: 'entry_count',
					minWidth: 100
				},
				{
					title: '剩余任务',
					key: 'residue_count',
					minWidth: 100
				},
				{
					title: '招聘要求',
					key: 'staff_standard',
					minWidth: 220,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.staff_standard}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '操作',
					minWidth: 160,
					fixed: 'right',
					render: (h, params) => {
						return (
							<div>
								{
									this.$auth[1526] ? <span 
										class={params.row.is_edit == 0 ? '' : 'g-operation'}
										onClick={() => this.handleEdit(params.row)}
									>修改</span> : ''
								}
							</div>	
							
						);
					}
				}
			];
			switch (type) {
				case 'social-transform':
					return column1;
				case 'entry-trend':
					return column2;
				case 'social-follow':
					return column3;
				case 'interviewer-statistics':
					return column4;
				case 'interview-record':
					return column5;
				case 'position-analyze':
					return column6;
				default:
					break;
			}
		}
	}
};

