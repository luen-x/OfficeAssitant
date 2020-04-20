import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4'),
				'5': this.getColumns('5')
			}
		};
	},
	methods: {
		handleLinkTo(params) {
			let baseUrl = params.row.add_type === 3
				? `/hr/academy/transfer/school/${params.row.applicant_id}`
				: `/hr/academy/transfer/social/${params.row.applicant_id}`;
			return params.row.add_type === 3 ? getHashUrl(baseUrl, {
				type: 'no-edit',
				list_type: 'lecture-course-detail-index',
				tabType: this.type,
				project_id: this.$route.query.project_id,
				index: 'teacher'
			}) : getHashUrl(baseUrl, {
				list_type: 'lecture-course-detail-index',
				type: this.type,
				project_id: this.$route.query.project_id,
				index: 'teacher'
			});
		},
		getColumns(type) {
			let columns = [
				{
					title: "姓名",
					key: "applicant_name",
					fixed: "left",
					minWidth: 160,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { applicant_name, add_type, status } = params.row;
						// let applicant_name = '姓名姓名姓名姓名姓名姓名姓名姓名姓名姓名姓名姓名';
						return (
							<div class="g-flex">
								{ (status === 6 || status === 11) && <div class="g-m-r-5 g-remark">淘</div>}
								{ status === 7 && <div class="g-m-r-5 g-remark">离</div>}
								{ (status !== 6 && status !== 11 && status !== 7) && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								{ ((add_type === 2 || add_type === 3) && this.$auth[948])
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
											>{applicant_name}</AutoToolTip>
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
					title: "应聘职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "试岗部门",
					key: "try_depart_name",
					minWidth: 150
				},
				{
					title: "人才来源",
					key: "talent_resource_name",
					minWidth: 150
				},
				{
					title: "转介绍人",
					key: "introducer_name",
					minWidth: 120
				},
				{
					title: "邀约人",
					key: "invite_name",
					minWidth: 120
				},
				{
					title: "试岗时间",
					key: "try_time",
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.try_time}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "课程名称",
					key: "course_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.course_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "授课讲师",
					key: "lecturer_name",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.lecturer_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				}
			];

			switch (type) {
				case '1':
				case '4':
					columns.splice(columns.length - 3, 0,
						{
							title: "入职时间",
							key: "entry_time",
							minWidth: 160
						});
					return columns;
				case '2':
				case '3':
					return columns;
				case '5':
					columns.splice(columns.length - 3, 0,
						{
							title: "入职时间",
							key: "entry_time",
							minWidth: 160
						},
						{
							title: "离职时间",
							key: "leave_time",
							minWidth: 160
						});
					return columns;
				default:
					break;
			}
		}
	}
};

