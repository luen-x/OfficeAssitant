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
				minWidth: 120,
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
		
		return {
			columns,
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_ADD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_ADD_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			QuestionDetail.popup({ questionId: row.question_id, showFooter: false }).then(() => {}).catch(() => {});
		},
		handleEdit(row) {
			window.event.stopPropagation();
			QuestionDetail.popup({ questionId: row.question_id, inEdit: true, canDelete: false }).then(() => {}).catch(() => {});
		}

	}
};

