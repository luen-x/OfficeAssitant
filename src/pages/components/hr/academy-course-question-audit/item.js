import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { QuestionAudit } from '../_common/academy-course/modals/audit-question';
import { QuestionDetail } from '../_common/academy-course/drawers/question-detail';

const columnsChache = {

};
export default {
	data() {
		return {
			columns: [
				{
					type: "selection",
					width: 60,
					fixed: "left",
					className: "g-pd-l-10"
				},
				{
					title: '提交人',
					key: 'staff_name',
					fixed: 'left',
					minWidth: 100,
					ellipsis: true
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 120,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100,
					ellipsis: true
				},
				{
					title: '题目',
					key: 'title',
					width: 250,
					render: (h, { row }) => <AutoTooltip content={row.title} theme="dark" placement="bottom"/>
				},
				{
					title: '题型',
					key: 'type_name',
					minWidth: 100,
				},
				{
					title: '分值',
					key: 'score',
					minWidth: 100,
				},
				{
					title: '发起时间',
					key: 'create_time',
					minWidth: 140,
				},
				{
					title: '审核人',
					key: 'audit_staff_name',
					minWidth: 100,
				},
				{
					title: '审核时间',
					key: 'audit_time',
					minWidth: 140,
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleAudit(row) {
			window.event.stopPropagation();
			if (Array.isArray(row) && row.length == 0) {
				this.$Message.error('请先选择题目');
				return;
			}
			let questionId = Array.isArray(row) ? row.map(r => r.question_id) : row.question_id;
			QuestionAudit.popup({ 
				questionId,
				action: 'add',
				type: this.type 
			}).then(() => {
				this.handleResetCur();
			}).catch((res) => res && console.error(res));
		},
		handleView(row) {
			window.event.stopPropagation();
			QuestionAudit.popup({ 
				questionId: row.question_id,
				action: 'view',
				type: this.type 
			}).then(() => {
			}).catch((res) => res && console.error(res));

		},
		handleOpenDrawer(row) {
			if (!this.$auth[1054]) return;
			QuestionDetail.popup({ 
				questionId: row.question_id, 
				showFooter: true, 
				questionAudit: true,
				updateTable: () => this.handleResetCur(),
				auditStatus: this.type
			 }).then(() => {
				this.handleResetCur();
			}).catch(() => {}).finally(() => {
				this.$refs.tableTarget[+this.type - 1].$refs.tableTarget.clearCurrentRow();

			});
		},
		getColumns(type) {
			if (columnsChache[type]) {
				return columnsChache[type];
			}
			if (type == 1) {
				if (this.$auth[1055]) {
					columnsChache[1] = [...this.columns, { 
						title: '操作',
						key: '-',
						width: 100,
						fixed: 'right',
						render: (h, { row }) => {
							return (
								<div class="g-operation" onClick={() => this.handleAudit(row)}>
								审核
								</div>
							);
						}
					}];
				} else {
					columnsChache[1] = this.columns;
				}
			} else if (type == 2 || type == 4) {
				if (this.$auth[1056]) {
					columnsChache[2] = [...this.columns, {
						title: '操作',
						key: '-',
						width: 100,
						fixed: 'right',
						render: (h, { row }) => {
							return (
								<div class="g-operation" onClick={() => this.handleView(row)}>
								查看审核
								</div>
							);
						}
					}];
				} else {
					columnsChache[2] = this.columns;
				}
				columnsChache[4] = columnsChache[2]; 

			} else if (type == 3) {
				let arr;
				if (this.$auth[1056]) {
					arr = [...this.columns, {
						title: '操作',
						key: '-',
						width: 100,
						fixed: 'right',
						render: (h, { row }) => {
							return (
								<div class="g-operation" onClick={() => this.handleView(row)}>
								查看审核
								</div>
							);
						}
					}];
				} else {
					arr = this.columns;
				}
				arr.splice(0, 1);
				columnsChache[3] = arr;
			}
			return columnsChache[type];
		}
	}
};

