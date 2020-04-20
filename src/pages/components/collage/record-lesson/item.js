import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { Confirm } from "@components/_common/confirm/confirm";
import API_ROOT from '@stores/apis/root';
import { EditAndAddLesson } from './popup/edit-and-add-lesson.vue';
import { LessonDetail } from './popup/lesson-detail.vue';
import { AuditLesson } from './popup/audit-lesson.vue';

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': []
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('collage-record-lesson-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('collage-record-lesson-title-change');
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
					title: "课程名称",
					key: "lesson_name",
					minWidth: 220,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div class="g-flex-ac">
								<AutoToolTip 
									content={ row.lesson_name }
									width="160px"
									theme="dark"
									placement="bottom" 
									labelClass=" "
								/>
							</div>
						);
					}
				},
				{
					title: "开课日期",
					key: "activity_start_time",
					minWidth: 120
				},
				{
					title: "课程类型",
					key: "activity_category_name",
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<AutoToolTip 
								content={ row.activity_category_name }
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "课程主题",
					key: "lesson_subject",
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<AutoToolTip 
								content={ row.lesson_subject || '--' }
								width="150px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "担任角色",
					key: "role_type_name",
					minWidth: 160
				},
				{
					title: "录单人",
					key: "staff_name",
					minWidth: 160,
				},
				{
					title: '录单人部门',
					key: 'depart_name',
					minWidth: 110
				},
				{
					title: "参与日期",
					key: "join_time",
					minWidth: 200
				},
				{
					title: "参与天数",
					key: "join_day",
					minWidth: 100,
					render(h, { row }) {
						return (
							<div>{ row.join_day }天</div>
						);
					}
				},
				{
					title: '讲课时长',
					key: 'lecturer_hour',
					minWidth: 120,
				},
				{
					title: '录单时间',
					key: 'create_time',
					minWidth: 130,
				},
				{
					title: '上传人',
					key: 'upload_staff_name',
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
			if (!this.$auth[1408]) {
				columnsShow.push(
					{
						title: '操作',
						key: 'operate',
						width: 150,
						align: 'center',
						fixed: 'right',
						render: (h, { row }) => {
							return (
								<div class="g-c-blue-mid g-pd-t-5">
									{
										this.type == 1 
											? <span>
												<span class="g-pointer" onClick={ () => this.handleCancelApply(row) }>撤销申请</span>
												<i 
													class="icon iconfont icon-vertical-line g-c-blue-mid g-pd-t-5"
													style="margin: 0 5px; vertical-align: middle"/>
												<span class="g-pointer" onClick={ () => this.handleEditApply(row) }>编辑</span>
											</span>
											: <div class="g-pointer g-c-blue-mid">
												{
													this.type == 2 
														? <div onClick={ () => this.handleSeeDetail(row) }>查看</div>
														: <div 
															class={ row.status === 4 ? 'g-c-black5' : '' }
															onClick={ () => this.handleReSubmit(row) }>
																重新提交
														</div>
												}
											</div>
									}
								</div>
							);
						}
					}
				);
			} else {
				columnsShow.push(
					{
						title: '操作',
						key: 'operate',
						width: 120,
						align: 'center',
						fixed: 'right',
						render: (h, { row }) => {
							return (
								<div class="g-c-blue-mid g-pd-t-5">
									{
										this.type == 1 
											? <div 
												class="g-pointer g-c-blue-mid"
												onClick={ () => this.handleAuditDetail(row) }>
												审核
											</div>
											: <div 
												class="g-pointer g-c-blue-mid"
												onClick={ () => this.handleSeeAuditDetail(row) }>
												查看
											</div>
									}
								</div>
							);
						}
					}
				);
			}

			return columnsShow;
		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_RECORD_LESSON_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_RECORD_LESSON_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleCancelApply(row) {
			Confirm.popup({
				title: "撤销申请",
				msg: "确定要撤销申请？"
			}).then(() => {
				this.$request({
					url: API_ROOT._COLLEAGE_RECORD_LESSON_CANCEL_POST,
					param: {
						open_lesson_id: row.open_lesson_id
					},
					type: "POST",
					loading: false
				}).then((res) => {
					this.$Message.success('撤销成功');
					this.handleResetCur();
				}).catch(err => this.$Message.error(err.msg));
			}).catch(() => {});
		},
		handleEditApply(row) {
			EditAndAddLesson.popup({
				open_lesson_id: row.open_lesson_id,
				lecture_set_id: row.lecture_set_id,
				title: '编辑信息'
			}).then(() => {
				this.handleResetCur();
			}).catch((err) => {});
		},
		handleSeeDetail(row) {
			LessonDetail.popup({
				rowData: row
			}).then(() => {}).catch(() => {});
		},
		handleReSubmit(row) {
			if (row.status === 4) {
				this.$Message.warning('已经重新提交， 请勿重新操作！');
				return;
			}
			EditAndAddLesson.popup({
				open_lesson_id: row.open_lesson_id,
				lecture_set_id: row.lecture_set_id,
				title: '重新提交'
			}).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		},
		handleSeeAuditDetail(row) {
			LessonDetail.popup({
				rowData: row
			}).then(() => {}).catch(() => {});
		},
		handleAuditDetail(row) {
			AuditLesson.popup({
				rowData: row
			}).then(() => {
				this.handleResetCur();
			}).catch(() => {});
		}
	}
};