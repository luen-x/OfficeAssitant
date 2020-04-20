import { getParseUrl, getHashUrl } from '@utils/utils';
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
				list_type: 'try-data-detail-index',
				tabType: this.type,
				try_month: this.$route.query.try_month,
				index: 'try'
			}) : getHashUrl(baseUrl, {
				list_type: 'try-data-detail-index',
				type: this.type,
				try_month: this.$route.query.try_month,
				index: 'try'
			});
		},
		getColumns(type) {
			let columns = [
				{
					title: "姓名",
					key: "applicant_name",
					fixed: "left",
					minWidth: 130,
					render: (h, params) => {
						const { applicant_name, add_type } = params.row;
						return (
							<div class="g-flex-ac">
								{ ((add_type === 2 || add_type === 3) && this.$auth[942])
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
					title: "试岗部门",
					key: "try_depart_name",
					minWidth: 150
				},
				{
					title: "应聘职位",
					key: "position_name",
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
					minWidth: 180
				}
			];

			switch (type) {
				case '1':
					return columns;
				case '2':
					columns.splice(columns.length, 0,
						{
							title: "试岗离开时间",
							key: "pass_time",
							minWidth: 160
						},
						{
							title: "淘汰原因",
							key: "pass_remarks_type_name",
							minWidth: 120,
							render: (h, params) => {
								return (
									<AutoToolTip
										content={params.row.pass_remarks_type_name}
										labelClass=""
										theme="dark"
									/>
								);
							}
						},
						{
							title: "备注",
							key: "pass_remarks",
							minWidth: 150,
							render: (h, params) => {
								return (
									<AutoToolTip
										content={params.row.pass_remarks}
										labelClass=""
										theme="dark"
									/>
								);
							}
						});
					return columns;
				case '3':
				case '4':
					columns.splice(columns.length, 0,
						{
							title: "入职时间",
							key: "entry_time",
							minWidth: 160
						});
					return columns;
				case '5':
					columns.splice(columns.length, 0,
						{
							title: "入职时间",
							key: "entry_time",
							minWidth: 160
						},
						{
							title: "离职时间",
							key: "leave_time",
							minWidth: 160
						},
						{
							title: "离职原因",
							key: "reason_name",
							minWidth: 120,
							render: (h, params) => {
								return (
									<AutoToolTip
										content={params.row.reason_name}
										labelClass=""
										theme="dark"
									/>
								);
							}
						});
					return columns;
				default:
					break;
			}
		}
	}
};

