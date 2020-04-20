import AutoToolTip from '@common/auto-tooltip/auto-tooltip';
import { ReportDetail } from '@components/hr/personnel-report/popup/report-detail';
import Upload from '@common/upload/upload';
import { ConfirmWithRemark } from "@components/sale/_common/customer/confirm-remark";

export default {
	data() {
		const columns = [
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
				title: '被举报联系电话',
				key: 'link_str',
				minWidth: 200,
				
			},			
			{
				title: '凭证',
				key: 'images',
				minWidth: 280,
				render: (h, { row }) => {
					return <div class="g-m-t-10 g-blue-scroll" style="width:240px;overflow-x:auto" onClick={e => e.stopPropagation()}>
						<Upload disabled wrap={false} showTitle={false} dataSource={row.images.map(i => ({ url: i }))}/>
					</div>;
				} 
			},			
			{
				title: '举报人',
				key: 'staff_name',
				minWidth: 150,
			},
			{
				title: '举报时间',
				key: 'create_time',
				minWidth: 170,
			},
			{
				title: '是否已辩护',
				key: 'is_defend_name',
				minWidth: 100,
			}
		];
		const columns1 = [
			...columns, 
			{
				title: '操作',
				key: '-',
				width: 150,
				fixed: 'right',
				render: (h, { row }) => {
					return (
						<div class="g-operation">
							{
								this.$auth[1719]
									&& <span onClick={(e) => { e.stopPropagation(); this.handleOption(row, 'pass'); }} >举报通过</span>
							}
							{
								this.$auth[1719] 
									&& this.$auth[1720] && <span class="g-m-lr-5">|</span>
							}
							{
								this.$auth[1720]
									&& <span onClick={(e) => { e.stopPropagation(); this.handleOption(row, 'reject'); }}>举报驳回</span>
							}
						</div>
					);

				}

			}];
		const columns2 = [
			...columns,
			{
				title: '审核人',
				key: 'audit_staff_name',
				minWidth: 150,
			},
			{
				title: '审核时间',
				key: 'audit_time',
				minWidth: 170,
			}
		];
		return {
			columns: {
				2: columns1,
				3: columns2,
				4: columns2,

			},
			visible: false,
			loading: false,
			auditCallback: (row, status) => (remark) => {
				const param = {
					report_ids: [row.report_id],
					status,
					audit_remark: remark,
				};

				return this.$request({
					url: "_HR_ARCHIVES_AUDIT_AUDIT_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					return res;
				}).catch((res) => {
					console.error(res, param);
					this.$Message.error(res.msg);
					return res;
				});
			},
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_AUDIT_MISTAKE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_AUDIT_MISTAKE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOption(row, option) {
			ConfirmWithRemark.popup({
				title: option == 'pass' ? "举报通过" : '举报驳回',
				label: option == 'pass' ? "通过说明：" : '驳回说明：',
				placeholder: option == 'pass' ? "请填写通过说明" : '请填写驳回说明',
				required: option == 'reject',
				okCallback: this.auditCallback(row, option == 'pass' ? 3 : 4)
			}).then(() => {
				this.$store.commit('SALE_CUSTOMER_AUDIT_MISTAKE_LIST_INIT');
			}).catch(e => e && console.error(e));
		},
		handleOpenDrawer(row) {
			ReportDetail.popup({
				reportId: row.report_id,
				updateList: () => this.handleResetCur(),
				companyName: row.company_name,
				reportType: row.type || 2,
				tabType: this.type,
				mode: 'sale'
			}).catch(e => e && console.error(e)).finally(() => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			});
		}
	}
};

