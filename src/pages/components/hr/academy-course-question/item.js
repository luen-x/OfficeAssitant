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
				title: '题目',
				key: 'title',
				fixed: 'left',
				width: 250,
				render: (h, { row }) => <AutoTooltip content={row.title} theme="dark" placement="bottom"/>
			},
			{
				title: '题型',
				key: 'type_name',
				minWidth: 80,
			},
			{
				title: '出题人',
				key: 'maker_staff_name',
				minWidth: 100,
				ellipsis: true
			},
			{
				title: '分值',
				key: 'score',
				minWidth: 80,
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
				title: '创建时间',
				key: 'create_time',
				minWidth: 140,
			},
			{
				title: '更新人',
				key: 'update_staff_name',
				minWidth: 100,
				ellipsis: true
			},
			{
				title: '更新时间',
				key: 'update_time',
				minWidth: 140,
			},
			{
				title: '操作',
				key: '-',
				fixed: 'right',
				width: 100,
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
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			if (!this.$auth[1049]) return;
			QuestionDetail.popup({ 
				questionId: row.question_id,
				updateTable: () => this.handleResetCur(),
				deleteQuestion: (id) => this.handleDelete(0, id)
			}).catch(() => {}).finally(re => {
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

