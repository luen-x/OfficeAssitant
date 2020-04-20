import AutoToolTip from '@common/auto-tooltip/auto-tooltip';
import Upload from '@common/upload/upload';
import { DelayDetail } from '../_common/customer/popup/index';
import { AuditDelay } from '../_common/customer/popup/delay-detail/audit';

export default {
	data() {
		const columns = [
			{
				title: '公司名称',
				key: 'company_name',
				fixed: 'left',
				width: 200,
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.company_name}
						theme="dark"
						placement="bottom"
					/>;
				}
			},
			{
				title: '申请原因',
				key: 'prolong_reason',
				minWidth: 150,
				render: (h, { row }) => {
					return <AutoToolTip
						content={row.prolong_reason}
						theme="dark"
						placement="bottom"
						labelClass=" "
					/>;

				}
			},
			{
				title: '凭证',
				key: 'images',
				minWidth: 280,
				render: (h, { row }) => {
					return <div class="g-m-t-10 g-blue-scroll" style="width:240px;overflow-x:auto" onClick={e => e.stopPropagation()}>
						<Upload disabled wrap={false} showTitle={false} dataSource={row.image_url.map(i => ({ url: i }))}/>
					</div>;
				} 
			},
			{
				title: '申请人',
				key: 'applicant',
				minWidth: 150,
			},
			{
				title: '申请时间',
				key: 'create_time',
				minWidth: 180,
			},
			{
				title: '保护截止时间',
				key: 'expiration_time',
				minWidth: 180,
			},
			{
				title: '申请延长至',
				key: 'prolong_to_time',
				minWidth: 180,
			}
		];
		const columns1 = [
			...columns,
			{
				title: '操作',
				key: '-',
				width: 100,
				fixed: 'right',
				render: (h, { row }) => {
					return <div class="g-operation">
						{
							this.$auth[1722]
									&& <span onClick={(e) => { e.stopPropagation(); this.handleOption(row, 'pass'); }} >通过</span>
						}
						{
							this.$auth[1722] 
									&& this.$auth[1723] && <span class="g-m-lr-5" >|</span>
						}
						{
							this.$auth[1723]
									&& <span onClick={(e) => { e.stopPropagation(); this.handleOption(row, 'reject'); }}>驳回</span>
						}
					</div>;
				}
			}

		];
		const columns2 = [
			...columns,
			{
				title: '保护期已延长至',
				key: 'audit_prolong_time',
				minWidth: 180,
			},
			{
				title: '审核时间',
				key: 'audit_time',
				minWidth: 180,
			}

		];
		const columns3 = [
			...columns,
			{
				title: '审核时间',
				key: 'audit_time',
				minWidth: 180,
			}
		];
		return {
			columns: {
				1: columns1,
				2: columns2,
				3: columns3
			},
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_AUDIT_DELAY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_AUDIT_DELAY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			DelayDetail.popup({
				protectId: row.protect_id,
				companyName: row.company_name,
				tabType: this.type,
				updateList: () => this.handleResetCur()
			}).catch(e => e && console.error(e)).finally(() => this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow()));
		},
		handleOption(row, option) {
			AuditDelay.popup({
				protectId: row.protect_id,
				action: option, //  pass / reject,
				applyTime: row.prolong_to_time, // '2019-10-10 10:10:10',
				originTime: row.expiration_time, // '019-11-10 10:10:10'
			}).then(() => {
				this.handleResetCur();
			}).catch(e => e && console.error(e));
		}

	}
};

