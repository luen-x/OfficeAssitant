import { Dropdown, DropdownMenu, DropdownItem, Tag, Tooltip, Poptip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AchiAuditModal } from '../customer-achi/popup/audit';
import { FinanceDetail } from '../_common';

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'status',
					fixed: 'left',
					minWidth: 270,
					render: (h, params) => {
						const { contract_company_name, contract_num, contract_type, contract_id, project, tagList } = params.row;
						return (
							<div>
								<span class="g-operation g-dp-ib" style="width:191px">
									{
										contract_company_name.length > 15 ? <Tooltip
											content={contract_company_name}
											max-width={240}
											transfer={true}
										>
											{ contract_company_name.substr(0, 15) + '...' }
										</Tooltip> 
											: <span>{ contract_company_name }</span>
									}
								</span>
								
								{ tagList && tagList.length > 0
								&& <Poptip
									word-wrap
									transfer
									placement="right-start"
									trigger="hover"
								>
									<i class="iconfont icon-tag g-c-red-dark g-m-l-10 g-pointer" />
									<div slot="content">
										{tagList.map((item) => {
											return (
												<div key={item.key} class=" g-tc" style={{
													display: "inline-block",
													padding: '3px 8px',
													color: '#fff',
													borderRadius: '3px',
													background: '#d9444f',
													marginRight: '10px'
												}}>
													{item.label}
												</div>
											);
										})}
									</div>
								</Poptip>}
							</div>
						);
					}
				},
				{
					title: '客户姓名',
					minWidth: 150,
					key: 'customer_name',
				},
				{
					title: '客户手机号',
					minWidth: 120,
					key: 'phone',
				},
				{
					title: '成交时间',
					minWidth: 150,
					key: 'first_deal_time',
				},
				{
					title: '最近成交时间',
					minWidth: 150,
					key: 'last_deal_time',
				},
				{
					title: '总实付金额',
					minWidth: 120,
					key: 'total_payment_amount',
				},
				{
					title: '总到账金额',
					minWidth: 120,
					key: 'total_received_amount',
				},
				{
					title: '下单金额',
					minWidth: 120,
					key: 'contract_payment_amount',
				},
				{
					title: '可用余额',
					minWidth: 120,
					key: 'total_balance_amount',
				},
				{
					title: '续费金额',
					minWidth: 120,
					key: 'renew_amount',
				},
				{
					title: '复购金额',
					minWidth: 120,
					key: 'repeat_amount',
				},
				{
					title: '剩余尾款',
					minWidth: 120,
					key: 'contract_last_amount',
				},

				{
					title: '已开票金额',
					minWidth: 120,
					key: 'invoice_amount',
				},
				{
					title: '未开票金额',
					minWidth: 120,
					key: 'last_invoice_amount',
				},
				{
					title: '交接完成项目数',
					minWidth: 150,
					key: 'has_deliver',
				},
				{
					title: '未交接完成项目数',
					minWidth: 150,
					key: 'wait_deliver',
				},
				{
					title: '邀约人',
					minWidth: 120,
					key: 'invite_staff_name',
				},
				{
					title: '部门',
					minWidth: 120,
					key: 'invite_depart_name',
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			const { contract_company_name, contract_company_id, label = [] } = row;			
			this.$auth['104'] && this.$router.push(getHashUrl('/finance/customer/nego/detail', {
				contract_company_id
			}));
		}
	}
};

