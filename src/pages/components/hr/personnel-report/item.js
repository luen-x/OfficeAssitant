import { Confirm } from '@common/confirm/confirm';
import AutoToolTip from '@common/auto-tooltip/auto-tooltip';
import { ReportDetail } from './popup/report-detail';

export default {
	data() {
		// "report_id": 2,
		// "customer_id": 399701,
		// "company_name": "梦澜（苏州）进出口有限公司",//公司名称
		// "type": 1,
		// "status": 1,
		// "create_time": "2019-12-10 20:05:03",//举报/被举报时间
		// "audit_staff_id": 0,
		// "audit_time": "-",//审核时间
		// "is_defend": 0,
		// "is_delete": 0,
		// "type_name": "错误关联举报",//举报类型
		// "status_name": "待辩护",//举报状态
		// "audit_staff_name": "-",//审核人
		// "is_defend_name": "未辩护"//是否已辩护
		const columns1 = [
			{
				title: '公司名称',
				key: 'company_name',
				width: 200,
				fixed: 'left',
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.company_name}
						theme="dark"
						placement="bottom"
					/>;
				}
				
			},
			{
				title: '举报类型',
				key: 'type_name',
				width: 150,
			},
			{
				title: '举报时间',
				key: 'create_time',
				minWidth: 150,
			},
			{
				title: '举报状态',
				key: 'status_name',
				width: 150,
			},
			{
				title: '审核人',
				key: 'audit_staff_name',
				minWidth: 150,
			},
			{
				title: '审核时间',
				key: 'audit_time',
				width: 170,
			}
			
		];
		if (this.$auth[1706]) {
			columns1.push({
				title: '操作',
				key: '-',
				fixed: 'right',
				width: 80,
				render: (h, { row }) => {
					return (
						(row.status == 2 || row.status == 1) ? <span class="g-operation" onClick={() => this.handleBack(row)} >撤回</span>
							: <span class="g-operation-disable">撤回</span>
					);
				}
			});
		}
		const columns2 = [
			{
				title: '公司名称',
				key: 'company_name',
				width: 200,
				fixed: 'left',
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.company_name}
						theme="dark"
						placement="bottom"
					/>;
				}
				
			},
			{
				title: '举报类型',
				key: 'type_name',
				width: 150,
			},
			{
				title: '被举报时间',
				key: 'create_time',
				minWidth: 150,
			},
			{
				title: '举报状态',
				key: 'status_name',
				width: 150,
			},
			{
				title: '是否已辩护',
				key: 'is_defend_name',
				width: 150,
			},
			{
				title: '审核人',
				key: 'audit_staff_name',
				minWidth: 150,
			},
			{
				title: '审核时间',
				key: 'audit_time',
				width: 170,
			}
			// {
			// 	title: '操作',
			// 	key: '-',
			// 	fixed: 'right',
			// 	width: 100,
			// 	render: (h, { row }) => {
			// 		return <span class="g-operation" onClick={() => this.handleProtect(row)} >发起辩护</span>;
			// 	}
			// }
		];
		return {
			columns: {
				1: columns1,
				2: columns2
			},
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_PERSONNEL_REPORT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_PERSONNEL_REPORT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleBack(row) {
			window.event.stopPropagation();
			Confirm.popup({
				msg: '确定要撤回举报吗？'
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_REPORT_DELETE_POST",
					type: "POST",
					param: {
						report_id: row.report_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch((res) => {
					console.error(res, {
						report_id: row.report_id
					});
					this.$Message.error(res.msg);
				});
			});
		},
		handleOpenDrawer(row) {
			ReportDetail.popup({
				reportId: row.report_id,
				updateList: () => this.handleResetCur(),
				companyName: row.company_name,
				reportType: row.type,
				tabType: this.type,
				mode: 'hr'
			}).catch(e => e && console.error(e)).finally(() => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			});
		}
	}
};

