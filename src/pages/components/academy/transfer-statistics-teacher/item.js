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
						const { applicant_name, status } = params.row;

						return (
							<div class="g-flex">
								{ (status === 6 || status === 11) && <div class="g-m-r-5 g-remark">淘</div>}
								{ status === 7 && <div class="g-m-r-5 g-remark">离</div>}
								{ (status !== 6 && status !== 11 && status !== 7) && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								 <AutoToolTip
									content={applicant_name}
									labelClass=" "
									width="105px"
									theme="dark"
								/>
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