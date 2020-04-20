import AutoToolTip from '@common/auto-tooltip/auto-tooltip';
import { Tooltip } from 'iview';
import { TrainTooltip } from './_common/train-tooltip';
import { DetailDrawer } from './popup/detail';

export default {
	data() {
		return {
			columns: this.getColumns()
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (this.$auth[511]) {
				DetailDrawer.popup({
					staffId: Number(row.staff_id)
				}).then(res => {
					this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				}).catch(err => {
					this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
				});
			}
		},
		getColumns() {
			return [
				{
					title: '姓名',
					key: 'staff_name',
					width: 250,
					align: 'center',
					tooltip: true,
					render: (h, { row }) => {
						return (
							<div class="g-operation">
								{
									row.staff_status === 4 && <span
										class="g-bg-red-mid g-m-r-5"
										style="border-radius: 2px;padding: 1px 5px;"
									>
								已离职
									</span>
								}
								<span class="g-c-blue-mid g-pointer">
									{row.staff_name}
								</span>
							</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 120
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 120
				},
				{
					title: '课程通关数',
					key: 'pass_count',
					minWidth: 120
				},
				{
					title: '参与课程',
					key: 'course',
					minWidth: 150,
					render: (h, { row }) => {
						const name = row.course_participator.join(',') || '-';
						return (
							<AutoToolTip
								content={name}
								theme="dark"
								placement="bottom"
								labelClass="g-pointer"
							/>							
						);
					}
				},
				{
					title: '通关课程',
					key: 'pass_count',
					minWidth: 160,
					render: (h, { row }) => {
						const name = row.pass_course_participator.join(',') || '-';
						return (
							<AutoToolTip
								content={name}
								theme="dark"
								placement="bottom"
								labelClass="g-pointer"
							/>							
						);
					}
				}
			];
		},
	}
};

