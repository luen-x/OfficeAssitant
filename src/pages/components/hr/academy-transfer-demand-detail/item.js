import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3')
			}
		};
	},
	methods: {
		getColumns(type) {
			let columns = [
				{
					title: "姓名",
					key: "applicant_name",
					minWidth: 130,
					render: (h, params) => {
						const { applicant_name } = params.row;
						// let applicant_name =  '哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
						return (
							<div>
								{ applicant_name.length <= 7 ? applicant_name
									: <AutoToolTip
										content={applicant_name}
										labelClass=""
										theme="dark"
									/>
								}
							</div>
						);
					}
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
					title: "入职时间",
					key: "entry_time",
					minWidth: 160
				},
				{
					title: "试岗离开时间",
					key: "pass_time",
					minWidth: 160
				},
				{
					title: "离职时间",
					key: "leave_time",
					minWidth: 160
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
					title: "师傅",
					key: "master_name",
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.master_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "分配时间",
					key: "assign_time",
					minWidth: 160
				}
			];

			switch (type) {
				case '1':
					return columns;
				case '2':
					columns.splice(columns.length - 5, 1);
					return columns;
				case '3':
					columns.splice(columns.length - 6, 1);
					return columns;
				default:
					break;
			}
		}
	}
};

