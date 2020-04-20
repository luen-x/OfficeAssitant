import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { AuditModal } from './popup/audit-modal';
import { DetailDrawer } from './popup/detail';

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					minWidth: 200,
					fixed: 'left',
					key: 'company_name',
					render: (h, params) => {
						return (
							<div>
								{
									<AutoTooltip content={params.row.company_name} theme="dark" placement="bottom" />
								}
							</div>
						);
					}
				},
				{
					title: '审核类型',
					minWidth: 140,
					key: 'type_name',
				}, 
				{
					title: '举报原因',
					minWidth: 140,
					key: 'reason',
					render: (h, params) => {
						return (
							<div>
								{
									<AutoTooltip content={params.row.reason} theme="dark" placement="bottom" labelClass=" " />
								}
							</div>
						);
					}
				},
				{
					title: '备注信息',
					minWidth: 200,
					key: 'record_remark',
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip content={params.row.record_remark} theme="dark" placement="bottom" labelClass=" " />
							</div>
						);
					}
				}, 
				{
					title: '举报说明',
					minWidth: 140,
					key: 'remark',
					render: (h, params) => {
						return (
							<div>
								{
									<AutoTooltip content={params.row.remark} theme="dark" placement="bottom" labelClass=" " />
								}
							</div>
						);
					}
				},
				{
					title: '举报人',
					minWidth: 120,
					key: 'staff_name',
				},
				{
					title: '举报时间',
					minWidth: 170,
					key: 'create_time',
				}
			],
		};
	},
	computed: {
		getColumns() {

			let columns = this.type == '2' ? [{
				type: "selection",
				fixed: "left",
				minWidth: 50
			}, {
				title: '操作',
				minWidth: 200,
				key: 'options',
				align: 'center',
				render: (h, { row }) => {
					return (
						<div class="g-operation" onClick={(e) => { e.stopPropagation(); }}>
							{
								this.$auth[1672]
									&& <span 
										onClick={() => { this.handleOption([row.report_id], 1, row.record_type, row.record_remark); }}>
											举报通过
									</span>
							}
							{
								this.$auth[1672] 
									&& this.$auth[1673] && <span class="g-pd-lr-10">|</span>
							}
							{
								this.$auth[1673]
									&& <span 
										onClick={() => { this.handleOption([row.report_id], 0, row.record_type, row.record_remark); }}>
											举报驳回
									</span>
							}
						</div>
					);
				}
			}] : [{
				title: '审核人',
				minWidth: 160,
				key: 'audit_staff_name',
			},
			{
				title: '审核时间',
				minWidth: 160,
				key: 'audit_time',
			}];
			this.type == 2 ? columns.splice(1, 0, ...this.columns) : columns.unshift(...this.columns);
			return columns;
		},
	},
	methods: {
		handleOption(report, name, type, remark, link_number) {
			AuditModal.popup({
				report_ids: report,
				status: name,
				record_type: type,
				remark,
				link_number
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_AUDIT_LIST_INIT');
			}).catch(err => err && console.error(err));
		},
		handleOpenDrawer(row) {
			DetailDrawer.popup({
				company_name: row.company_name,
				reportId: row.report_id,
				type: +this.type
			}).then(res => {
				this.$store.commit('HR_ARCHIVES_AUDIT_LIST_INIT');
			}).catch(err => {
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_ARCHIVES_AUDIT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ARCHIVES_AUDIT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

