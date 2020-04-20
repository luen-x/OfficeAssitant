import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import Explain from '@components/_common/explain/explain';
import { DetailDrawer } from './popup/detail';
import { AuditModal } from './popup/audit';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4'),
				'5': this.getColumns('5'),
			},
		};
	},
	methods: {
		handleOpenDetailDrawer(invoice_id) {
			this.$auth['90'] && DetailDrawer.popup({
				type: this.type,
				invoice_id
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleBallotRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_BALLOT_AUDIT_POST,
				type: 'POST',
				param: res.data
			}).then(suc => {
				this.$store.commit('FINANCE_BALLOT_LIST_INIT');
				this.$Message.success(suc.msg);
				res.cb();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenDrawer(row) {
			const { invoice_title, invoice_id } = row;
			this.handleOpenDetailDrawer(invoice_id);
		},
		getColumns(type) {
			const columns = [
				{
					title: '发票抬头',
					key: 'status',
					fixed: 'left',
					minWidth: 240,
					render: (h, params) => {
						const { invoice_title, invoice_id } = params.row;
						return (
							<div 
								class="g-operation">
								{
									invoice_title.length > 15 ? <Tooltip
										content={invoice_title}
										max-width={240}
										transfer={true}
									>
										{ invoice_title.substr(0, 15) + '...' }
									</Tooltip> 
										: <span>{ invoice_title }</span>
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
					title: '客户电话',
					minWidth: 120,
					key: 'customer_phone',
				},
				{
					title: '发票类型',
					minWidth: 130,
					key: 'invoice_name',
				},
				{
					title: '部门',
					minWidth: 120,
					key: 'department',
				},
				{
					title: '申请人',
					minWidth: 120,
					key: 'staff_name',
				},
				{
					title: '申请时间',
					minWidth: 200,
					key: 'create_date',
				}
			];
			type === '1' && columns.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				minWidth: 100,
				align: 'center',
				render: (h, params) => {
					const { invoice_id } = params.row;
					return (
						h(Dropdown, {
							style: 'width: 100%; text-align: center',
							props: {
								transfer: true,
								placement: 'left-start'
							},
							on: {
								'on-click': (name) => {
									AuditModal.popup({
										name,
										requestFn: (res) => this.handleBallotRequest({
											...res,
											data: {
												...res.data,
												invoice_id,
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
								h(DropdownItem, {
									props: {
										name: '2'
									}
								}, '通过申请'),
								h(DropdownItem, {
									props: {
										name: '4'
									}
								}, '驳回申请')
							])
						])
					);
				}
			});
			(type === '3' || type === '5') && columns.splice(4, 0, {
				title: '发票代码',
				minWidth: 130,
				key: 'invoice_code',
			},
			{
				title: '发票号码',
				minWidth: 130,
				key: 'invoice_num',
			},
			{
				title: '金额',
				minWidth: 130,
				key: 'amount',
			},
			{
				title: '税额',
				minWidth: 130,
				key: 'tax_amount',
			},
			{
				title: '总金额',
				minWidth: 130,
				key: 'total_amount',
			});
			(type === '3' || type === '5') && columns.push({
				title: '是否领票',
				minWidth: 200,
				key: 'is_receive',
			});
			return columns;
		}
	}
};

