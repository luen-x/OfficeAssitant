import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': [],
				'7': [],
				'8': [],
			}

		};
	},
	methods: {
		getColumns(type) {
			let columns = [
				{
					title: '姓名',
					key: 'applicant_name',
					fixed: "left",
					minWidth: 180
				},
				{
					title: '手机号码',
					fixed: "left",
					key: 'mobile',
					minWidth: 180
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 180
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 180
				},
				{
					title: '籍贯',
					key: 'native',
					minWidth: 180
				},
				{
					title: '现居地址',
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
					title: '工作年限',
					key: 'work_time_name',
					minWidth: 180
				},
				{
					title: '招聘渠道',
					key: 'ditch_name',
					minWidth: 180
				},
				{
					title: '邀约人',
					key: 'invite_name',
					minWidth: 180
				},
				{
					title: '状态',
					key: 'status_name',
					minWidth: 180
				},
				{
					title: '淘汰状态',
					key: 'pass_type_name',
					minWidth: 180
				}
			];
			switch (type) {
				case '1':
					columns.splice(9, 0,
						{
							title: '录入时间',
							key: 'create_time',
							minWidth: 180
						});
					return columns;
				case '2':
				case '3':
				case '6':
					columns.splice(9, 0,
						{
							title: '实际面试时间',
							key: 'interview_time',
							minWidth: 180
						});
					return columns;
				case '4':
				case '7':
					columns.splice(9, 0,
						{
							title: '试岗时间',
							key: 'try_start_time',
							minWidth: 200,
							render: (h, params) => {
								const { try_start_time, try_end_time } = params.row;
								return (
									try_start_time
										? <div>
											{try_start_time}至{try_end_time}
										</div>
										: ''
								);
							}
						});
					return columns;
				case '5':
					columns.splice(9, 0,
						{
							title: '入职时间',
							key: 'entry_time',
							minWidth: 180
						});
					return columns;
				case '8':
					columns.splice(8, 1,
						{
							title: '转介绍人',
							key: 'introducer_name',
							minWidth: 180
						},
						{
							title: '邀约人',
							key: 'invite_name',
							minWidth: 180
						},
						{
							title: '预计面试时间',
							key: 'predict_interview_time',
							minWidth: 180
						},
						{
							title: '实际面试时间',
							key: 'interview_time',
							minWidth: 180
						},
						{
							title: '试岗时间',
							key: 'try_start_time',
							minWidth: 200,
							render: (h, params) => {
								const { try_start_time, try_end_time } = params.row;
								return (
									try_start_time
										? <div>
											{try_start_time}至{try_end_time}
										</div>
										: ''
								);
							}
						},
						{
							title: '入职时间',
							key: 'entry_time',
							minWidth: 180
						});
					return columns;
				default:
					return columns;
			}
		},
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

