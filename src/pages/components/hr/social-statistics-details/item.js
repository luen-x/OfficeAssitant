import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import { Poptip, Tooltip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	data() {
		return {
			getColumns(type) {
				let baseColumn = [
					{
						title: '姓名',
						key: 'applicant_name',
						minWidth: 190,
						fixed: 'left',
						render: (h, params) => {
							const { applicant_name, applicant_id, content } = params.row;
							let leftStytle = content ? '' : '32px';
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
										style={{ display: 'block', width: '100%', marginLeft: leftStytle }}
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
						minWidth: 150,
						
					},
					{
						title: '学历',
						key: 'education_name',
						minWidth: 100,
					},
					{
						title: '籍贯',
						key: 'native',
						minWidth: 150,
						
					},
					{
						title: '现居住地',
						key: 'now_address',
						minWidth: 310,
						
					},
					{
						title: '工作年限',
						key: 'work_time_name',
						minWidth: 100,
					},
					{
						title: '招聘渠道',
						key: 'ditch_name',
						minWidth: 150,
						
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
						minWidth: 100,
						
					}
				];
				switch (type) {
					case '0':
						return baseColumn.concat(
							[
								{
									title: '状态',
									key: 'status_name',
									minWidth: 100,
									
								},
								{
									title: '淘汰状态',
									key: 'pass_type_name',
									minWidth: 100,
									
								}
							]
						);
					case '1':
						return baseColumn.concat(
							[
								{
									title: '状态',
									key: 'status_name',
									minWidth: 100,
									
								}
							]
						);
					case '2':
						return baseColumn;
					case '3':
						return baseColumn.concat(
							[
								{
									title: '试岗时间',
									minWidth: 104,
									render: (h, params) => {
										return (
											 h('div', { style: 'width:100%;height:100%' }, params.row.try_start_time
											 + params.row.try_end_time)
										);
									}
								}
							]
						);
					case '4':
						return baseColumn.concat(
							[
								{
									title: '入职时间',
									key: 'entry_time',
									minWidth: 120,
									
								}
							]
						);
					default:
						return baseColumn;
				}
			}
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
			let baseUrl = `/hr/recruit/social/summary/${applicant_id}`;
			return getHashUrl(baseUrl, {
				...this.$route.query
			});
		},
	}
};

