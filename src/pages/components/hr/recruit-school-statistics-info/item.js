import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'applicant_name',
					width: 150,
					fixed: 'left',
					render: (h, params) => {
						let baseUrl = `/hr/recruit/school/statistics/${params.row.applicant_id}`;
						let linkUrl = getHashUrl(baseUrl, { tabType: this.type, list_type: 'school-statistics-index' });

						return h('router-link', {
							props: {
								to: linkUrl
							},
							style: 'display: block; width: 100%',
							class: 'g-operation'
						}, params.row.applicant_name);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					width: 150,
					fixed: 'left'
				},
				{
					title: '性别',
					key: 'sex_name',
					minWidth: 100,
				},
				{
					title: '应聘职位',
					key: 'position_name',
					minWidth: 150
				},
				{
					title: '毕业院校',
					key: 'college',
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
					title: '专业',
					key: 'profession',
					minWidth: 150
				},
				{
					title: '学历',
					key: 'education_name',
					minWidth: 100
				},
				{
					title: '邮箱',
					key: 'email',
					minWidth: 180,
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
					title: '微信号',
					key: 'wechat',
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.wechat}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '招聘会时间',
					key: 'applicant_time',
					minWidth: 200
				}
			]
		};
	},
	computed: {
		getColumns() {
			let columns = [...this.columns];
			if (this.type == '1') {
				columns.splice(-1, 0,
					{
						title: '发offer时间',
						key: 'send_offer_time',
						minWidth: 170
					});
			} else if (this.type == '4') {
				columns.splice(-1, 0,
					{
						title: '试岗时间',
						key: 'try_time',
						minWidth: 170
					},
					{
						title: '试岗部门',
						key: 'try_depart_name',
						minWidth: 170
					});
			} else if (this.type == '6') {
				columns.splice(-1, 0,
					{
						title: '淘汰时间',
						key: 'pass_time',
						minWidth: 150
					});
			} else if (this.type == '7') {
				columns.splice(-1, 0,
					{
						title: '离开时间',
						key: 'departure_time',
						minWidth: 170
					});
			} else if (this.type == '8' || this.type == '9') {
				columns.splice(-1, 0,
					{
						title: '试岗部门',
						key: 'try_depart_name',
						minWidth: 170
					});
			} 
			return columns;
		}
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_RESET', { type: this.type });
		},
	}
};

