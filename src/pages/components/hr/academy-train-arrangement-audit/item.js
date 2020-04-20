import { ImgsPreview } from 'wya-vc';
import { Tooltip } from 'iview';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { AuditModal } from './popup/audit-modal';

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': []
			}
		};
	},

	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},

	mounted() {
		this.$vc.on('hr-academy-course-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},

	beforeDestroy() {
		this.$vc.off('hr-academy-course-title-change');
	},

	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},

		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					type: 'selection',
					width: 50,
				},
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 120
				},
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 200,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.course_name }
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
					title: '部门',
					key: 'depart_name',
					minWidth: 100,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.depart_name }
								labelClass=" "
							/>
						);
					}
				},
				// {
				// 	title: '凭证',
				// 	key: 'voucher',
				// 	minWidth: 120,
				// 	render: (h, params) => {
				// 		const dataSource = params.row.voucher;
				// 		return dataSource ? h('span', {
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
					width: 170
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
					minWidth: 160
				},
				// {
				// 	title: '课程类型',
				// 	key: 'course_type',
				// 	minWidth: 150,
				// },
				// {
				// 	title: '课程来源',
				// 	key: 'course_type',
				// 	minWidth: 150,
				// },
				{
					title: '证明人',
					key: 'witness_name',
					minWidth: 100,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.witness_name }
								labelClass=" "
							/>
						);
					}
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			if (type < 2) {
				columnsShow.unshift({
					type: 'selection',
					width: 50
				});
			}
			columnsShow.push({
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
			});
			return columnsShow;
		},

		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_RESET', { type: this.type });
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
				console.error(err);
			});
		}
	}
};

