import { ImgsPreview } from 'wya-vc';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Tooltip } from 'iview';
import { AuditModal } from '../academy-train-arrangement-audit/popup/audit-modal';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50,
				},
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 100,
				},
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 170,
					render: (h, params) => {
						let course_name = params.row.course_name;
	
						return (
							<AutoToolTip 
								content={course_name}
								width="150px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 150,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 100,
				},
				// {
				// 	title: '凭证',
				// 	key: 'voucher',
				// 	minWidth: 120,
				// 	render: (h, params) => {
				// 		const dataSource = params.row.voucher;
				// 		return dataSource.length ? h('span', {
				// 			style: {
				// 				marginRight: '5px',
				// 				color: '#2e9dfa',
				// 				cursor: 'pointer'
				// 			},
				// 			on: {
				// 				click: (e) => {
				// 					e.stopPropagation();
				// 					this.$auth[973] && ImgsPreview.popup({
				// 						visible: true,
				// 						dataSource
				// 					});
				// 				}
				// 			}
				// 		}, '查看凭证') : h('span', '未上传凭证');
				// 	}
				// },
				{
					title: '提交时间',
					key: 'create_time',
					minWidth: 170,
				},
				{
					title: '审核人',
					key: 'audit_staff_name',
					minWidth: 100,
				},
				{
					title: '审核时间',
					key: 'audit_time',
					minWidth: 170,
				},
				{
					title: '证明人',
					key: 'witness_name',
					minWidth: 120,
					render: (h, params) => {
						let witness_name = params.row.witness_name;
	
						return (
							<AutoToolTip 
								content={witness_name}
								width="100px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '操作',
					minWidth: 80,
					fixed: 'right',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div
								class="g-c-blue-mid g-pointer g-absulute g-lh-40"
								onClick={ () => this.handleAudit(row.audit_id, row.status) }>{ row.status == '1' ? '审核' : '查看'}</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleAudit(id, status) {
			// 传入 auditId 为一个字符串（id）时代表单个审核或查看， 传入数组代表批量审核
			((status == '1' && this.$auth[974]) || (status != '1' && this.$auth[975])) && AuditModal.popup({
				id
			}).then(() => {
				this.handleResetFirst();
			}).catch((err) => {
				err && console.error(err);
			});
		}
	}
};

