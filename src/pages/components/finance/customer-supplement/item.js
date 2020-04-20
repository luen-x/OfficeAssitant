import { Dropdown, DropdownMenu, DropdownItem, Tag, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import Explain from '@components/_common/explain/explain';
import { FinanceDetail } from '../_common';
import { ContractAuditModal } from './popup/audit';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
			},
		};
	},
	methods: {
		handleContractRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_AUDIT_POST,
				type: 'POST',
				param: res.data
			}).then(suc => {
				this.$store.commit('FINANCE_CUSTOMER_SUPPLEMENT_LIST_INIT');
				this.$Message.success(suc.msg);
				res.cb();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenDrawer(row) {
			if (!this.$auth[816]) {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
				return;
			}
			const { contract_company_name, contract_num,
				contract_company_id,
				contract_type, contract_id, project, supply_id } = row;	
			FinanceDetail.popup({
				type: this.type,
				name: 'supplement',
				contract_id,
				supply_id,
				contract_company_name,
				contract_company_id,
				contract_num,
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
						const { contract_company_name, contract_num, contract_type, contract_id, project } = params.row;
						return (
							<div>
								<span class="g-operation">
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
					title: '客户姓名',
					minWidth: 150,
					key: 'customer_name',
				},
				{
					title: '客户手机号',
					minWidth: 150,
					key: 'phone',
				},
				// {
				// 	title: '应付金额',
				// 	minWidth: 150,
				// 	key: 'need_amount',
				// 	renderHeader: (h, params) => {
				// 		return (
				// 			<div class="g-c-black2" style={{ fontWeight: 400 }}>
				// 				应付金额
				// 				<Explain 
				// 					style={{ marginLeft: '2px' }}
				// 					content="客户应该付款的金额，如：微商系统合同的标准金额是13.98万，销售给客户优惠后的价格是10万，优惠后的金额即应付金额，即应付金额是10万"
				// 				/>
				// 			</div>
				// 		);
				// 	}
				// },
				{
					title: '补款金额',
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
					title: '补交成本',
					minWidth: 150,
					key: 'total_cost_amount',
				},
				{
					title: '剩余成本',
					minWidth: 150,
					key: 'last_cost_amount',
				},
				// {
				// 	title: '实扣成本',
				// 	minWidth: 150,
				// 	key: 'total_cost_amount',
				// 	renderHeader: (h, params) => {
				// 		return (
				// 			<div class="g-c-black2" style={{ fontWeight: 400 }}>
				// 				扣除成本
				// 				<Explain 
				// 					style={{ marginLeft: '2px' }}
				// 					content="扣除的产品成本，如微商系统是10万，成本为10%，则扣除成本是1万"
				// 				/>
				// 			</div>
				// 		);
				// 	}
				// },
				{
					title: '提成业绩',
					minWidth: 150,
					key: 'commission_performance',
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
					title: '补款人',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '补款时间',
					minWidth: 200,
					key: 'create_time',
				}
			];
			type === '1' && columns.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				minWidth: 100,
				align: 'center',
				render: (h, params) => {
					const { contract_id, contract_company_id, supply_id } = params.row;
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
									ContractAuditModal.popup({ 
										name, 
										contract_company_id,
										supply_id,
										contract_id,
										show: true,
										label: '提成业绩归属',
										requestFn: (res) => this.handleContractRequest({
											...res,
											data: {
												...res.data,
												contract_id,
												supply_id,
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
								this.$auth[814] && h(DropdownItem, {
									props: {
										name: '1'
									}
								}, '通过申请'),
								this.$auth[815] && h(DropdownItem, {
									props: {
										name: '2'
									}
								}, '驳回申请')
							])
						])
					);
				}
			});
			type === '2' && columns.splice(9, 0, {
				title: '提成归属',
				minWidth: 150,
				key: 'status',
				render: (h, { row }) => {
					return (
						<span>{ row.actual_month.join('/') }</span>
					);
				}
			});
			return columns;
		}
	}
};

