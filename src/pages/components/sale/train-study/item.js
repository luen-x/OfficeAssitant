
import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { CourseDetail } from '@components/hr/_common/academy-course/drawers/course-detail';
import API from "@stores/apis/root";
import { Confirm } from '@components/_common/confirm/confirm';
import { UploadProof } from './popup/upload-proof.vue';
import { AuditModal } from '../train-study-examine/popup/audit-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: '课程名称',
					key: 'course_name',
					width: 250,
					render: (h, { row }) => {
						return <div >{
							row.course_name.length > 20
								? <Tooltip
									transfer
									placement="bottom"
								>
									<span>{row.course_name.substring(0, 16) + '...'}</span>
									<div style="white-space: normal;" slot="content">
										<span class="_inline-block">{row.course_name}</span>
									</div>
								</Tooltip>
								: <span>{row.course_name}</span>
						}
						</div>;
					}
				},
				{
					title: '授课讲师',
					key: 'lecture',
					width: 130,
					render: (h, { row }) => {
						return <div >{
							row.lecture_staff.length > 8
								? <Tooltip
									transfer
									placement="bottom"
								>
									<span>{row.lecture_staff.substring(0, 7) + '...'}</span>
									<div style="white-space: normal;" slot="content">
										<span class="_inline-block">{row.lecture_staff}</span>
									</div>
								</Tooltip>
								: <span>{row.lecture_staff}</span>
						}
						</div>;
					}
				},
				{
					title: '授课地点',
					key: 'address',
					minWidth: 100,
					tooltip: true,
				},
				{
					title: '授课时间',
					key: 'start_time',
					minWidth: 180,
					render: (h, { row }) => {
						return (
							<AutoTooltip content={`${row.start_time}至${row.end_time}`} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},

				{
					title: '参与状态',
					key: 'is_sign_name',
					minWidth: 100,
				},
				{
					title: '作业截止时间',
					key: 'start_time',
					minWidth: 180,
					render: (h, { row }) => {
						return (
							<AutoTooltip content={row.upload_end_time} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '作业情况',
					key: 'is_arrange_name',
					minWidth: 100,
				},
				{
					title: '通关情况',
					key: 'is_pass_name',
					minWidth: 100,
				},
				{
					title: '上传时间',
					key: 'start_time',
					minWidth: 180,
					render: (h, { row }) => {
						return (
							<AutoTooltip content={row.upload_time} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '课程来源',
					key: 'user_source_name',
					minWidth: 100,
				}, {

					title: '操作',
					width: 150,
					fixed: 'right',
					render: (h, { row }) => {
						return <div class="g-operation">
							{row.has_attachment ? <span onClick={(e) => { e.stopPropagation; this.handleGoStudy(row); }}>
								线上学习
							</span> : <span style={{ color: '#ACA899' }}>
								线上学习
							</span>}
							<span class=" g-m-lr-5">|</span>
							{ row.enable_upload ? <span onClick={() => { this.handleUploadProof(row); }}>
								{row.is_upload ? '重新上传' : '上传作业'}
							</span> : <span style={{ color: '#ACA899' }}>
								{row.is_upload ? '重新上传' : '上传作业'}
							</span>}
						</div>;
					}
				}
			],
		};
	},
	computed: {

	},
	mounted() {
		const { query } = this.$route;
		if (query.course_id) {
			this.handleCourseDetail(query);
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_TRAIN_STUDY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_TRAIN_STUDY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleGoStudy(row) {
			this.$router.push({ path: '/sale/study/video', query: { course_id: row.course_id, course_name: row.course_name, type: this.type } });
		},
		handleGoExam(exam_id, row) {
			if (row.result_id) {
				this.$router.push({
					path: '/hr/academy/course/exam/view',
					query: {
						result_id: row.result_id
					}
				});
			} else {
				this.$router.push({
					path: '/hr/academy/course/exam',
					query: {
						exam_id,
						paper_id: row.relation_paper_id ? row.relation_paper_id : row.paper_id
					}
				});
			}
		},
		handleDel(course_id) {
			Confirm.popup({
				title: '删除',
				msg: '是否删除该素材库课程'
			}).then(data => {
				this.$request({
					url: '_SALE_TRAIN_STUDY_LIST_DELETE_GET',
					type: 'GET',
					param: {
						course_id
					},
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleCourseDetail(row) {
			if (this.$auth[504]) {
				CourseDetail.popup({
					courseId: row.course_id,
					author: 'sale'
				});
			}
		},
		 handleUploadProof(row) {
			UploadProof.popup({
				data: {
					...row
				},
				title: row.is_upload ? '重新上传' : '上传作业',
				is_upload: row.is_upload,
				course: row.course_name,
				course_id: row.course_id,
			}).then(res => {
				this.handleResetCur();
			});
		},

	}
};

