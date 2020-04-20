import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import Explain from '@components/_common/explain/explain';
import { AchiAuditModal } from './popup/audit.vue';
// import { DetailDrawer } from './popup/detail.vue';
import { FinanceDetail } from '../_common';

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
	computed: {
		
	},
	methods: {
		handleAuditRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_AUDIT_POST,
				type: 'POST',
				param: res.data,
			}).then(suc => {
				setTimeout(() => {
					// 后端审核推队列慢
					this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_RESET', { type: this.type });
					this.$Message.success(suc.msg);
					res.cb();
					this.$emit('destory');
				}, 1000);

			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenDrawer(row) {
			const { payment_id, contract_company_name, contract_company_id, customer_id } = row;
			this.$auth['95'] && FinanceDetail.popup({
				type: this.type,
				name: 'payment',
				...row
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		getColumns(type) {
			const column = [
				{
					title: '公司名称',
					key: 'status',
					fixed: 'left',
					minWidth: 270,
					render: (h, params) => {
						const { payment_id, contract_company_name } = params.row;
						return (
							<div class="g-operation">
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
					title: '实付金额',
					minWidth: 120,
					key: 'payment_amount',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实付金额
								<Explain 
									style={{ marginLeft: '2px' }}
									title="客户实际支付的金额"
									content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
								/>
							</div>
						);
					}
				},
				{
					title: '分单后业绩',
					minWidth: 120,
					key: 'after_share_performance',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								分单后业绩
								<Explain 
									style={{ marginLeft: '2px' }}
									content="销售分单之后的业绩，如：我是销售A，业绩是1万，分了10%给了销售B，即分了1000给了B，则我的分单业绩是9000"
								/>
							</div>
						);
					}
				},
				{
					title: '到账金额',
					minWidth: 120,
					key: 'received_amount',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								到账金额
								<Explain 
									style={{ marginLeft: '2px' }}
									content="扣除手续费后实际到账的金额，用以计算业绩提成"
								/>
							</div>
						);
					}
				},
				{
					title: '手续费',
					minWidth: 120,
					key: 'poundage',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								手续费
								<Explain 
									style={{ marginLeft: '2px' }}
									content="客户付款过程中因缴款方式不同被第三方扣除的费用，如：购买微商系统通过刷卡付款，产生的被银行扣除的100元，则手续费是100元"
								/>
							</div>
						);
					}
				},
				{
					title: '成交月份',
					minWidth: 200,
					key: 'deal_month',
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								成交月份
								<Explain 
									style={{ marginLeft: '2px' }}
									content="选择财务收到客户打款的时间（打款凭证上面的时间）或者是签订合同的时间"
								/>
							</div>
						);
					}
				},
				{
					title: '款项标签',
					minWidth: 120,
					key: 'payment_label',
					render: (h, { row }) => {
						return <span>
							{ row.payment_label.map((item, index) => {
								return <span>
									{ !!index && <span>/</span> }
									{ item.label_name }
								</span>;
							})}
						</span>;
					}
				},
				{
					title: '邀约人',
					minWidth: 160,
					key: 'invite_staff_name',
				},
				{
					title: '部门',
					minWidth: 120,
					key: 'invite_depart_name',
				},
				{
					title: '录入人',
					minWidth: 160,
					key: 'staff_name',
				},
				{
					title: '录入时间',
					minWidth: 200,
					key: 'create_time',
				},
				{
					title: '审核人',
					minWidth: 150,
					key: 'audit_staff_name',
				},
				{
					title: '操作',
					key: 'opt',
					fixed: 'right',
					minWidth: 100,
					align: 'center',
					render: (h, params) => {
						const { payment_id } = params.row;
						// const _self = this;
						return (
							this.type === '1' ? h(Dropdown, {
								style: 'width: 100%; text-align: center',
								props: {
									transfer: true,
									placement: 'left-start'
								},
								on: {
									'on-click': (name) => {
										AchiAuditModal.popup({ 
											name, 
											...params.row,
											requestFn: (res) => this.handleAuditRequest({
												...res,
												data: {
													...res.data,
													type: name,
													payment_id
												}
											}) 
										});
										
										// .then(res => {
										// 	this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
										// });
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
									this.$auth['93'] && h(DropdownItem, {
										props: {
											name: '1'
										}
									}, '通过申请'),
									this.$auth['94'] && h(DropdownItem, {
										props: {
											name: '2'
										}
									}, '驳回申请')
								])
							]) : null
						);
					}
				}
			];
			type !== '1' && column.pop();
			type !== '1' && column.push({
				title: '审核时间',
				key: 'audit_time',
				minWidth: 200
			});
			type === '1' && column.splice(13, 1);
			type === '2' && column.splice(8, 0, {
				title: '业绩归属',
				minWidth: 120,
				key: 'actual_month',
			});
			type === '2' && column.splice(10, 0, {
				title: '到账状态',
				minWidth: 120,
				key: 'use_status_name',
			});
			return column;
		}
	}
};

