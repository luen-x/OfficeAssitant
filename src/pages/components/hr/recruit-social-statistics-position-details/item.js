import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'applicant_name',
					fixed: "left",
					minWidth: 120
				},
				{
					title: '手机号码',
					key: 'mobile',
					fixed: "left",
					minWidth: 120
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 220
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 120
				},
				{
					title: '籍贯',
					key: 'native',
					minWidth: 120
				},
				{
					title: '邀约人',
					key: 'invite_name',
					minWidth: 120
				},
				{
					title: '现居住地',
					key: 'now_address',
					minWidth: 220,
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
					minWidth: 180
				},
				{
					title: '转介绍人',
					key: 'introducer_name',
					minWidth: 180
				},
				{
					title: '试岗时间',
					key: 'try_time',
					minWidth: 180
				},
				{
					title: '试岗部门',
					key: 'try_depart_name',
					minWidth: 180
				},
				{
					title: '录入时间',
					key: 'create_time',
					minWidth: 180
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

