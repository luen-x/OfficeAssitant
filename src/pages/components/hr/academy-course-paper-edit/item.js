import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { QuestionDetail } from '../_common/academy-course/drawers/question-detail';

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
				title: '题型',
				key: 'type_name',
				fixed: 'left',
				width: 100,
			},
			{
				title: '题目',
				key: 'title',
				minWidth: 250,
				render: (h, { row }) => <AutoTooltip content={row.title} theme="dark" placement="bottom"/>

			},
			{
				title: '分值',
				key: 'score',
				minWidth: 60,
			},
			{
				title: '关联课题',
				key: 'subject_name',
				minWidth: 100,
				render: (h, { row }) => <AutoTooltip content={row.subject_name} theme="dark" placement="bottom" labelClass=""/>

			},
			{
				title: '创建人',
				key: 'staff_name',
				minWidth: 100,
				ellipsis: true
			},
			{
				title: '更新时间',
				key: 'update_time',
				minWidth: 150,
			}
		];
		if (this.$auth[1071]) {
			columns.push({
				title: '操作',
				key: '-',
				width: 150,
				render: (h, { row }) => {
					return (
						<div onClick={() => this.handleOpenDrawer(row)} class="g-operation">
							编辑
						</div>
					);
				}
			});
		}
		return {
			columns,
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_EDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_EDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			window.event.stopPropagation();
			if (!this.$auth[1070]) return;
			QuestionDetail.popup({ 
				questionId: row.question_id, 
				deleteQuestion: (id) => this.handleDelete(1, id),
				updateTable: () => {
					this.handleResetCur();
					this.$emit('change');
				},
				paperId: +this.$route.query.paper_id
			}).then(() => {}).catch(() => {}).finally(() => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},
		handleEdit(row) {
			QuestionDetail.popup({ 
				questionId: row.question_id, 
				inEdit: true, 
				deleteQuestion: (id) => this.handleDelete(1, id),
				updateTable: () => {
					this.handleResetCur();
					this.$emit('change');
				}
			}).then(() => {}).catch(() => {}).finally(() => {
				
			});


		}
	}
};

