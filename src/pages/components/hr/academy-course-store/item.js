import { Tooltip } from 'iview';
import { oneLinePipe, getParseUrl } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { CourseDetail } from '../_common/academy-course/drawers/course-detail';

export default {
	data() {
		const columns = [
			{
				type: "selection",
				width: 60,
				fixed: "left",
				className: "g-pd-l-10"
			},
			{
				title: "课程名称",
				key: "course_name",
				fixed: 'left',
				className: 'g-operation',
				width: 250,
				render: (h, { row }) => <AutoTooltip content={row.course_name} theme="dark" placement="bottom"/>
			},
			{
				title: "授课讲师",
				key: "lecture",
				minWidth: 130,
				render: (h, { row }) => <AutoTooltip content={row.lecture} theme="dark" placement="bottom" labelClass=""/>
			},
			{
				title: "课程类型",
				key: "course_type_name",
				minWidth: 100,

			},
			{
				title: "课程编码",
				key: "course_code",
				minWidth: 120,
				render: (h, { row }) => <AutoTooltip content={row.course_code} theme="dark" placement="bottom" labelClass=""/>
			},
			{
				title: "人才梯队",
				key: "echelon",
				minWidth: 180,
				render: (h, params) => {
					let echelon = params.row.echelon.map(v => v.echelon_name + '-' + v.stage_name).join(',');
					return (
						<div class="g-flex-ac g-pointer" >
							<span>
								{ echelon.length <= 11
									? <span class="g-pointer" transfer>
										{echelon}
									</span>
									: <Tooltip class="g-pointer" transfer max-width="250">
										{echelon.slice(0, 11) + '...'}
										<div slot="content">
											{echelon}
										</div>
									</Tooltip>
								}
							</span>
						</div>
					);
				}
			},
			{
				title: "创建人",
				key: "staff_name",
				minWidth: 100,
				ellipsis: true
			},
			{
				title: "创建时间",
				key: "create_time",
				minWidth: 200,
			},
			{
				title: "更新人",
				key: "update_staff_name",
				minWidth: 100,
				ellipsis: true
			},
			{
				title: "更新时间",
				key: "update_time",
				minWidth: 200,
			}, 
			{
				title: "操作",
				key: "-",
				fixed: 'right',
				width: 80,
				render: (h, { row }) => {
					return (
						<div class="g-operation" onClick={() => this.handleEdit(row)}>
							编辑
						</div>
					);
				}
			}
		];
		return {
			columns,
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_COURSE_STORE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_STORE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEdit(row) {
			window.event.stopPropagation();
			this.$router.push({ path: '/hr/academy/course/store/add', query: { action: 'update', course_id: row.course_id } });


		},
		handleOpenDrawer(row) {
			if (!this.$auth[1038]) return;
			CourseDetail.popup({ courseId: row.course_id }).catch(() => {}).finally(re => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			});	
		}
	}
};