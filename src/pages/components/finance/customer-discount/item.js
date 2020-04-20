import { Dropdown, DropdownMenu, DropdownItem, Tag, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { AchiAuditModal } from '../customer-achi/popup/audit';
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
		handleElecRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_DISCOUNT_AUDIT_POST,
				type: 'POST',
				param: {
					...res.data,
					audit_remark: res.data.remarks
				}
			}).then(suc => {
				this.$store.commit('FINANCE_CUSTOMER_DISCOUNT_LIST_INIT');
				this.$Message.success(suc.msg);
				res.cb();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenDrawer(row) {
			const { contract_company_name, contract_id, contract_num, discount_id, contract_type } = row;
			FinanceDetail.popup({
				type: this.type,
				name: 'discount',
				contract_company_name,
				contract_num,
				contract_type,
				contract_id,
				discount_id
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
					fixed: 'left',
					minWidth: 270,
					render: (h, params) => {
						const { contract_company_name, contract_id, contract_num, electronic_id } = params.row;
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
					title: '合同编号',
					minWidth: 150,
					key: 'contract_num',
				},
				{
					title: '下单产品',
					minWidth: 220,
					key: 'opt',
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
					title: '邀约人',
					minWidth: 200,
					key: 'invite_staff_name',
				},
				{
					title: '下单时间',
					minWidth: 200,
					key: 'create_time',
				},
				{
					title: '上传时间',
					minWidth: 200,
					key: 'upload_time',
				},
				{
					title: '审核人',
					minWidth: 150,
					key: 'audit_staff_name',
				}
			];
			type === '1' && columns.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				minWidth: 100,
				align: 'center',
				render: (h, params) => {
					const { contract_id, electronic_id } = params.row;
					return (
						(this.$auth['1488'] || this.$auth['1489']) && h(Dropdown, {
							style: 'width: 100%; text-align: center',
							props: {
								transfer: true,
								placement: 'left-start'
							},
							on: {
								'on-click': (name) => {
									AchiAuditModal.popup({ 
										name,
										show: false,
										requestFn: (res) => this.handleElecRequest({
											...res,
											data: {
												...res.data,
												contract_id,
												electronic_id,
												status: name
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
								this.$auth['1488'] && h(DropdownItem, {
									props: {
										name: '1'
									}
								}, '通过申请'),
								this.$auth['1489'] && h(DropdownItem, {
									props: {
										name: '2'
									}
								}, '驳回申请')
							])
						])
					);
				}
			});
			return columns;
		}
	}
};