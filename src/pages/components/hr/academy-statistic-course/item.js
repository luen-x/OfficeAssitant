import { Tooltip, Message } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { CourseDetail } from './popup/course-detail';

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': []
			}
		};
	},

	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},

	mounted() {
		this.$vc.on('hr-academy-statistic-course-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},

	beforeDestroy() {
		this.$vc.off('hr-academy-statistic-course-change');
	},

	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},

		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 250,
					fixed: 'left',
					render: (h, params) => {
						const { course_name } = params.row;
						return (
							<div class="g-flex-ac g-pointer" >
								<span>
									{ course_name.length <= 10
										? <span class="g-c-blue-light g-oneline">
											{course_name}
										</span>
										: <span class="g-c-blue-light">{course_name.slice(0, 10) + '...'}</span>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: "课程类型",
					key: "course_type_name",
					minWidth: 150,
				},
				{
					title: "项目类型",
					key: "type_name",
					minWidth: 150,
				},
				{
					title: "项目主题",
					key: "project_topic",
					minWidth: 120,
					render: (h, params) => {
						let project_topic = params.row.project_topic;
						return (
							<AutoToolTip 
								content={project_topic}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "授课地点",
					key: "position",
					minWidth: 120,
					render: (h, params) => {
						let position = params.row.position;
						return (
							<AutoToolTip 
								content={position}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "授课部门",
					key: "teach_depart_name",
					minWidth: 120,
					render: (h, params) => {
						let teach_depart_name = params.row.teach_depart_name;
						return (
							<AutoToolTip 
								content={teach_depart_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "授课时间",
					key: "start_time",
					minWidth: 160,
					render: (h, params) => {
						const { start_time, end_time } = params.row;
						let time = start_time + '-' + end_time;
						return (
							<div class="g-flex-ac">
								<span>
									{ time.length <= 16
										? <Tooltip class="g-pointer" transfer>
											{time}
											<div slot="content">
												{time}
											</div>
										</Tooltip>
										: <Tooltip class="g-pointer" transfer>
											{time.slice(0, 16) + '...'}
											<div slot="content">
												{time}
											</div>
										</Tooltip>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: "授课方式",
					key: "method_name",
					minWidth: 100,
				},
				{
					title: "授课讲师",
					key: "lecture",
					minWidth: 180,
					render: (h, params) => {
						const { lecture } = params.row;
						let lecture_name = lecture.map(v => v.staff_name).join(',');
						return (
							<div class="g-flex-ac">
								<span>
									{ lecture_name.length <= 15
										? <span class="g-pointer" transfer>
											{lecture_name}
										</span>
										: <Tooltip class="g-pointer" transfer max-width="250">
											{lecture_name.slice(0, 11) + '...'}
											<div slot="content">
												{lecture_name}
											</div>
										</Tooltip>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: "参与人员",
					key: "participator_all",
					minWidth: 150,
					render: (h, params) => {
						let participator_all = params.row.participator_all;
						return (
							<AutoToolTip 
								content={participator_all}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				
				{
					title: "参与人数",
					key: "participator_num",
					minWidth: 100,
					align: 'center',
					render: (h, params) => {
						const { participator_num } = params.row;
						return (
							<div>
								{
									type == 1 ? <span 
										class="g-operation g-inline-block"
										style="width: 100%;height: 100%;"
										onClick={(e) => {
											e.stopPropagation(); this.handleToClass(params.row.course_id, 
												params.row.project_id, params.row.exam_id); 
										}}
									>
										{participator_num}
									</span> : <span style="width: '100%'">{participator_num}</span>
								}
							</div>
						);
					}
				},
				{
					title: "通过人数",
					key: "pass_num",
					minWidth: 100,
					align: 'center',
					render: (h, params) => {
						return (
							<div>
								{
									type == 1 ? <span 
										class="g-operation g-inline-block"
										style="width: 100%;height: 100%;"
										onClick={(e) => { e.stopPropagation(); this.handleToResult(8, params.row, 2); }}
									>
										{params.row.pass_num}
									</span> : <span style="width: '100%'">{params.row.pass_num}</span>
								}
							</div>
						);
					}
				},
				{
					title: "未通过人数",
					key: "not_pass_num",
					minWidth: 100,
					align: 'center',
					render: (h, params) => {
						return (
							<div>
								{
									type == 1 ? <span 
										class="g-operation g-inline-block"
										style="width: 100%;height: 100%;"
										onClick={(e) => { e.stopPropagation(); this.handleToResult(9, params.row, 3); }}
									>
										{params.row.not_pass_num}
									</span> : <span style="width: '100%'">{params.row.not_pass_num}</span>
								}
							</div>
						);
					}
				},
				{
					title: "数据类型",
					key: "data_type_name",
					minWidth: 100,
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);
			type == 2 ? columnsShow.unshift({
				type: 'selection',
				fixed: 'left',
				width: 50,
			}) : '';

			return columnsShow;
		},

		handleOpenDrawer(row) {
			CourseDetail.popup({ courseId: row.course_id }).finally(re => {
				this.$refs.tableTarget[this.type].$refs.tableTarget.clearCurrentRow();
			});	
		},

		handleToResult(type, row, audit) {
			if (row.exam_id) {
				row.method == 2
					? this.$router.push(`/hr/academy/train/detail/paper/3/result?type=${type}&project_id=${row.project_id}&exam_id=${row.exam_id}`)
					: this.$router.push(`/hr/academy/train/detail/paper/0/audit?project_id=${row.project_id}&type=${audit}`);
			} else {
				this.$Message.warning('暂无人员数据');
			}
			
		},

		handleToClass(course, project, id) {
			this.$router.push(`/hr/academy/train/detail/participate/0/roster?course_id=${course}&project_id=${project}&exam_id=${id}`);
		},

		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

