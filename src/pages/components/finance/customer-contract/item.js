import { Dropdown, DropdownMenu, DropdownItem, Tag, Tooltip, Poptip } from 'iview';
import API_ROOT from '@stores/apis/root';
import Explain from '@components/_common/explain/explain';
import { ContractAuditModal } from '../customer-supplement/popup/audit';
import { ChangeModal } from './popup/change';
import { FinanceDetail } from '../_common';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4'),
			},
		};
	},
	methods: {
		handleContractRequest(res) {
			const url = res.data.type === '3' 
				? '_FINANCE_CUSTOMER_CONTRACT_EDIT_COST_POST' 
				: '_FINANCE_CUSTOMER_CONTRACT_AUDIT_POST';
			this.$request({
				url: API_ROOT[url],
				type: 'POST',
				param: res.data
			}).then(suc => {
				this.$store.commit('FINANCE_CUSTOMER_CONTRACT_LIST_INIT');
				this.$Message.success(suc.msg);
				res.cb();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenDrawer(row) {
			const { contract_company_name, contract_num, 
				contract_company_id,
				need_amount, is_supply,
				contract_type, contract_id, project } = row;		
			FinanceDetail.popup({
				type: this.type,
				name: 'contract',
				contract_type,
				contract_id,
				contract_company_name,
				contract_company_id,
				contract_num,
				is_supply,
				need_amount,
				project
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		getColumns(type) {
			const columns = [
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
					title: '合同编号',
					minWidth: 150,
					key: 'contract_num',
				},
				{
					title: '下单产品',
					width: 220,
					render: (h, params) => {
						const { project = [] } = params.row;
						let product = "";
						project.forEach((item, index) => {
							product += item.product_name;
							if (index !== project.length - 1) {
								product += '+';
							}
						});
						return (
							<div>
								{
									product.length > 14 ? <Tooltip 
										transfer
										max-width={200}
										content={product}>
										{ product.substr(0, 13) }
									</Tooltip> : <div>{product}</div>
								}
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
					minWidth: 150,
					key: 'phone',
				},
				{
					title: '应付金额',
					minWidth: 150,
					key: 'need_amount',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								应付金额
								<Explain 
									style={{ marginLeft: '2px' }}
									content="客户应该付款的金额，如：微商系统合同的标准金额是13.98万，销售给客户优惠后的价格是10万，优惠后的金额即应付金额，即应付金额是10万"
								/>
							</div>
						);
					}
				},
				{
					title: '实付金额',
					minWidth: 150,
					key: 'payment_amount',
				},
				{
					title: '剩余尾款',
					minWidth: 150,
					key: 'last_amount',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								剩余尾款
								<Explain 
									style={{ marginLeft: '2px' }}
									content="客户合作后还未付清的费用，假如产品A需要10万，客户下单支付8万，则剩余尾款为2万"
								/>
							</div>
						);
					}
				},
				{
					title: '实扣成本',
					minWidth: 150,
					key: 'total_cost_amount',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实扣成本
								<Explain 
									style={{ marginLeft: '2px' }}
									content="扣除的产品成本，如微商系统是10万，成本为10%，则扣除成本是1万"
								/>
							</div>
						);
					}
				},
				{
					title: '提成业绩',
					minWidth: 150,
					key: 'commission_performance',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								提成业绩
								<Explain 
									style={{ marginLeft: '2px' }}
									content="当月可以算提成的业绩，如：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万"
								/>
							</div>
						);
					}
				},
				{
					title: '服务提成',
					minWidth: 150,
					key: 'service_amount',
				},
				{
					title: '合同类型',
					minWidth: 150,
					key: 'contract_type_name',
				},
				{
					title: '邀约人',
					minWidth: 150,
					key: 'invite_staff_name',
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'invite_depart_name',
				},
				{
					title: '下单人',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '下单时间',
					minWidth: 200,
					key: 'create_time',
				},
				{
					title: '审核人',
					minWidth: 150,
					key: 'audit_staff_name',
				}
			];
			type === '1' && columns.pop();
			type === '1' && columns.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				minWidth: 100,
				align: 'center',
				render: (h, params) => {
					const { contract_id, project, contract_company_id } = params.row;
					const { is_charge } = this.$global.staff;
					return (
						h(Dropdown, {
							style: 'width: 100%; text-align: center',
							props: {
								transfer: true,
								placement: 'left-start'
							},
							on: {
								'on-click': (name) => {
									(name === '3' ? ChangeModal : ContractAuditModal)
										.popup({ 
											name, 
											project, 
											contract_id,
											contract_company_id,
											show: true,
											requestFn: (res) => this.handleContractRequest({
												...res,
												data: {
													...res.data,
													contract_id,
													type: name
												}
											})
										}).then(res => { 
											
										});
								}
							}
						}, [
							h('i', {
								class: 'iconfont icon-point g-pointer',
								style: "font-size: 20px; display: block",
								on: {
									'click': (e) => { e.stopPropagation(); },
								}
							}),
							h(DropdownMenu, {
								slot: 'list'
							}, [
								this.$auth['96'] && h(DropdownItem, {
									props: {
										name: '1'
									}
								}, '通过申请'),
								this.$auth['97'] && h(DropdownItem, {
									props: {
										name: '2'
									}
								}, '驳回申请'),
								this.$auth['98'] && h(DropdownItem, {
									props: {
										name: '3'
									}
								}, '修改成本')
							])
						])
					);
				}
			});
			type !== '1' && columns.push({
				title: '审核时间',
				key: 'audit_time',
				minWidth: 200
			});
			['2', '4'].includes(type) && columns.splice(10, 0, {
				title: '提成归属',
				minWidth: 150,
				key: 'actual_month',
				render: (h, { row }) => {
					return (
						<div>
							{
								row.actual_month.map((item, index) => {
									return <span>
										{ index > 0 && <span>,</span> }
										{ item }
									</span>;
								})
							}
						</div>
					);
				}
			});
			return columns;
		}
	}
};

