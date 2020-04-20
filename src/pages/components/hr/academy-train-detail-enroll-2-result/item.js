import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { AuditModal } from './popup/audit-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					width: 100,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.staff_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 120,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.depart_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 150
				},
				{
					title: '提交时间',
					key: 'create_time',
					minWidth: 150
				},
				{
					title: '审核人',
					key: 'audit_staff_name',
					minWidth: 100,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.audit_staff_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '审核时间',
					key: 'audit_time',
					minWidth: 150
				},
				{
					title: '推荐人',
					key: 'referee_name',
					minWidth: 80,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.referee_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '操作',
					width: 80,
					fixed: 'right',
					align: 'center',
					tooltip: true,
					render: (h, { row }) => {
						return (
							<div 
								class="g-c-blue-mid g-pointer g-absulute g-lh-40"
								on-click={ () => this.handleAudit(row.record_id) }>{ row.status == '1' ? '审核' : '查看'}</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_LIST_RESET', { type: this.type });
		},
		handleAudit(recordId) { 
			// 传入 auditId 为一个字符串（id）时代表单个审核或查看， 传入数组代表批量审核
			AuditModal.popup({
				recordId
			}).then(() => {
				this.handleResetFirst();
			}).catch(() => {
			});
		}
	}
};

