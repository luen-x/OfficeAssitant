import { Tooltip } from 'iview';
import { oneLinePipe, getParseUrl } from '@utils/utils';
import { SeaCompanyDetail } from '../sea-archive/popup/company-detail';


export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'company_name',
					width: 220,
					render: (h, { row }) => {
						const name = row.company_name;
						return <div class={row.status == 1 ? "g-operation" : ''}>
							{name.length <= 15 && name}
							{name.length > 15 && (
								<Tooltip 
									transfer
									content={name}
									maxWidth={180}
								>
									{oneLinePipe(name, 15)}
								</Tooltip>
							)
							} 
						</div>;

					}
				},
				{
					title: '客户电话',
					key: 'tel',
					minWidth: 120,
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100,
				},
				{
					title: '公司状态',
					key: 'status_str',
					minWidth: 140,
					render: (h, { row }) => {
						return (
							<span>
								{row.status_str} 
								{!!row.staff_name && row.status != 1 && `(${row.staff_name})`}
							</span>
						);
					}
				},
				{
					title: '导入时间',
					key: 'import_time',
					minWidth: 150,
				},
				{
					title: '操作',
					key: '-',
					width: 100,
					render: (h, { row }) => {
						if (row.status === 1) {
							return (
								<div
									class="g-operation"
									onClick={() => this.handleSignCustomer(row)}
								>
								领取
								</div>
							);
						} else if (row.status === 0) {
							return (
								<div
									class="g-operation"
									onClick={() => this.handleAddCustomer(row)}
								>
								录入
								</div>
							);
						} else {
							return (
								<span>-</span>
							);
						}
					}
				}
				
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			if (this.$auth[476] && row.status == 1) {
				this.$request({
					url: "_SALE_INTENTION_PRIVATE_CHECK_GET_INFO",
					type: "GET",
					param: {
						filter_id: row.filter_id
					},
					loading: false,
				}).then(res => {
					SeaCompanyDetail.popup({
						customerId: row.relation_id,
						isPrivate: true
					}).then(() => {
						this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
					}).catch(error => {
						this.$refs.tableTarget.$refs.tableTarget.clearCurrentRow();
					});
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}
		},
		handleAddCustomer({ customer_name, company_name, tel }) {
			window.event.stopPropagation();
			this.$router.push({
				path: '/sale/customer/intention/detail',
				query: {
					customer_name,
					company_name,
					tel
				}
			});
		},
		handleSignCustomer(row) {
			window.event.stopPropagation();
			this.$request({
				url: '_SALE_CUSTOMER_INTENTION_PRIVATE_SIGN',
				type: 'POST',
				loading: false,
				param: {
					filter_id: row.filter_id
				},
				autoTip: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleResetCur();					
				
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
	}
};