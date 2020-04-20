import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { PaperDetail } from '../_common/academy-course/drawers/paper-detail';

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
				title: '试卷名称',
				key: 'paper_name',
				fixed: 'left',
				className: "g-operation",
				width: 250,
				render: (h, { row }) => <AutoTooltip content={row.paper_name} theme="dark" placement="bottom"/>
			},
			{
				title: '试卷类型',
				key: 'paper_type_name',
				minWidth: 100,
			},
			{
				title: '关联课题',
				key: 'subject_name',
				minWidth: 120,
				render: (h, { row }) => <AutoTooltip content={row.subject_name} theme="dark" placement="bottom" labelClass=""/>
			},
			{
				title: '试卷满分',
				key: 'full_score',
				minWidth: 100,
			},
			{
				title: '及格分数',
				key: 'pass_score',
				minWidth: 100,
			},
			{
				title: '使用次数',
				key: 'use_count',
				minWidth: 100,
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
				minWidth: 150,
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
				minWidth: 150, 
			},
			{
				title: '操作',
				key: '-',
				fixed: 'right',
				width: 100,
				render: (h, { row }) => {
					return (
						<div class="g-operation" onClick={() => this.handleEdit(row)} >编辑试卷</div>
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
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_PAPER_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			if (!this.$auth[1063]) return; 
			PaperDetail.popup({ paperId: row.paper_id, paper_type: row.paper_type }).then(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		},
		handleEdit(row) {
			if (!this.$auth[1068]) return; 
			window.event.stopPropagation();
			this.$router.push({
				path: '/hr/academy/course/paper/edit',
				query: {
					paper_id: row.paper_id,
					paper_type: row.paper_type
				}
			});
		}
	}
};

