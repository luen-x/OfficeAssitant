import { Tooltip } from "iview";
import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from './popup/detail';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					width: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<div>
								<span class={this.$auth[1646] ? "g-operation" : ''}>
									{params.row.staff_name}
								</span>
								{
									params.row.is_quit
										? <span
											class="g-inline-block g-tc g-c-white g-m-l-10"
											style="width: 40px;height: 24px; line-height: 24px; background: #E84C57;border-radius: 4px;"
										>
											离职
										</span>
										: null
								}
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100
				},
				{
					title: '手机号',
					key: 'mobile',
					minWidth: 120
				},
				{
					title: '课程通关数',
					key: 'pass_count',
					minWidth: 120
				},
				{
					title: '参与课程',
					key: 'course_name',
					minWidth: 160,
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.course_participator.join("、")} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '通关课程',
					key: 'pass_count',
					minWidth: 160,
					render: (h, { row }) => {
						let show = row.pass_course_participator.join("").length < 20;
						if (show) {
							return (
								<div>{row.pass_course_participator.join(",")}</div>
							);
						} else {
							return (
								<Tooltip
									content={row.pass_course_participator.join(",")}
									placement="bottom"
									max-width="250"
								>
									<div>
										{row.pass_course_participator.join(",").slice(0, 20)}...
									</div>
								</Tooltip>
							);
						}
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_STATISTICS_STUDENT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_STATISTICS_STUDENT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			if (!this.$auth[1646]) {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				return;
			}

			DetailDrawer.popup({
				staffId: Number(row.staff_id),
				applicantId: Number(row.applicant_id)
			}).then(res => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},
	}
};