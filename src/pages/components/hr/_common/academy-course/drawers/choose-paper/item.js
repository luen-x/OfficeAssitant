import { Radio } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PaperDetail } from '../paper-detail';

export default {
	data() {
		const columns = [
			{
				title: ' ',
				width: 60,
				fixed: "left",
				className: "g-pd-l-10",
				render: (h, { row }) => {
					return (
						<span onClick={() => window.event.stopPropagation()}><Radio label={row.paper_id} /></span>
					);

				}
			},
			{
				title: '试卷名称',
				key: 'paper_name',
				fixed: 'left',
				className: "g-operation",
				width: 250,
				render: (h, params) => {
					let paper_name = params.row.paper_name;

					return (
						<AutoToolTip 
							content={paper_name}
							width="130px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: '试卷类型',
				key: 'paper_type_name',
				minWidth: 100
			},
			{
				title: '关联课题',
				key: 'subject_name',
				minWidth: 100,
				render: (h, params) => {
					let subject_name = params.row.subject_name;

					return (
						<AutoToolTip 
							content={subject_name}
							width="130px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: '试卷满分',
				key: 'full_score',
				minWidth: 100
			},
			{
				title: '及格分数',
				key: 'pass_score',
				minWidth: 100
			},
			{
				title: '使用次数',
				key: 'use_count',
				minWidth: 100
			},
			{
				title: '创建人',
				key: 'staff_name',
				minWidth: 80
			},
			{
				title: '创建时间',
				key: 'create_time',
				minWidth: 140,
				render: (h, params) => {
					let create_time = params.row.create_time;

					return (
						<AutoToolTip 
							content={create_time}
							width="130px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: '更新人',
				key: 'update_staff_name',
				minWidth: 80
			},
			{
				title: '更新时间',
				key: 'update_time',
				minWidth: 140,
				render: (h, params) => {
					let update_time = params.row.update_time;

					return (
						<AutoToolTip 
							content={update_time}
							width="130px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
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
			window.event.stopPropagation();
			PaperDetail.popup({ 
				paperId: row.paper_id,
				paper_type: row.paper_type,
				secondDrawer: true,
				showFooter: false
			}).then(() => {}).catch((err) => {
				console.error(err);
			}).finally(() => {
				this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};

