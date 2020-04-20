import { QuestionDetail } from '../question-detail';

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
				title: '题目',
				key: 'title',
				fixed: 'left',
				width: 250,
				className: 'g-operation',
				tooltip: true
			},
			{
				title: '题型',
				key: 'type_name',
				minWidth: 80,
				tooltip: true
			},
			{
				title: '分值',
				key: 'score',
				minWidth: 80,
				tooltip: true
			},
			{
				title: '关联课题',
				key: 'subject_name',
				minWidth: 100,
				tooltip: true
			},
			{
				title: '创建人',
				key: 'staff_name',
				minWidth: 80,
				tooltip: true
			},
			{
				title: '更新时间',
				key: 'update_time',
				minWidth: 140,
				tooltip: true
			}
			

		];
		return {
			columns,
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_SELECT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_SELECT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			window.event.stopPropagation();
			QuestionDetail.popup({ 
				questionId: row.question_id,
				secondDrawer: true,
				updateTable: () => this.handleResetCur(),
				deleteQuestion: (id) => this.handleDelete(0, id),
				showFooter: false
			}).then(() => {}).catch((err) => { }).finally(() => {

				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},
		handleEdit(row) {
			window.event.stopPropagation();
			QuestionDetail.popup({ 
				questionId: row.question_id, 
				inEdit: true,
				updateTable: () => this.handleResetCur(),
				deleteQuestion: (id) => this.handleDelete(0, id)
			}).then(() => {}).catch(() => {});
		}
	}
};

