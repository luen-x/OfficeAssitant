import { Dropdown, DropdownMenu, DropdownItem, Tag, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { ConfirmWithRemark } from "@components/sale/_common/customer/confirm-remark";
import { AuditProductRefund } from './popup/audit-product-refund';
import { AuditLeftRefund } from './popup/audit-left-refund';
import { auditReject, auditPass } from './popup/audit';
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
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_REFUND_LIST_INIT');
		},
		handlePass(row) {
			// <!--  1 产品退款 ， 2 换产品退款 ， 3 余额退款 -->
			const { refund_type: refundType, refund_id: refundId, contract_id: contractId } = row;
			auditPass({ refundType, refundId, contractId }).then(this.handleResetFirst).catch(err => err && console.error(err));
		},
		handleReject(row) {
			auditReject(row.refund_id)
				.then(this.handleResetFirst)
				.catch(err => err && console.error(err));
		},
		handleOpenDrawer(row) {
			const { 
				contract_company_name,
				contract_num, 
				refund_id, 
				contract_id, 
				refund_type,
				contract_company_id,
				refund_amount
			} = row;
			FinanceDetail.popup({
				type: this.type,
				name: 'refund',
				refund_id,
				contract_id,
				refund_type,
				contract_company_name,
				contract_company_id,
				contract_num,
				detail_info: {
					refund_amount: Number(refund_amount)
				}
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
						const { contract_company_name } = params.row;
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
					minWidth: 120,
					key: 'customer_name',
				},
				{
					title: '客户手机号',
					minWidth: 120,
					key: 'phone',
				},
				{
					title: '退款金额',
					minWidth: 120,
					key: 'refund_amount',
				},
				{
					title: '退款类型',
					minWidth: 120,
					key: 'refund_type_name',
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
				},
				{
					title: '申请人',
					minWidth: 120,
					key: 'staff_name',
				},
				{
					title: '申请时间',
					minWidth: 200,
					key: 'create_time',
				}
			];

			type === '1' ? columns.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				minWidth: 100,
				align: 'center',
				render: (h, { row }) => {
					const { refund_id, refund_type, refund_amount } = row;
					return (this.$auth[101] || this.$auth[102]) && ( 
						<Dropdown 
							style="width: 100%; text-align: center" 
							transfer
							placement="left-start" 
							onOn-click={(name) => this[name](row)} 
							 >
							<i 
								class="iconfont icon-point g-pointer" 
								style="font-size: 20px; display: block" 
								onClick={event => event.stopPropagation()}
							/>
							<DropdownMenu slot="list">
								{this.$auth[101] && <DropdownItem name="handlePass">通过申请</DropdownItem>}
								{this.$auth[102] && <DropdownItem name="handleReject">驳回申请</DropdownItem>}
							</DropdownMenu>
						</Dropdown>
					);
				}
			}) : columns.push({
				title: '审核人',
				minWidth: 120,
				key: 'audit_staff_name',
			}, {
				title: '审核时间',
				minWidth: 120,
				key: 'audit_time',
			});
			return columns;
		}
	}
};