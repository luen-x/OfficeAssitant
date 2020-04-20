import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from "iview";
import { Confirm } from '@common/confirm/confirm';
import { SupplyDetail } from "../_common/customer/popup";
import { PayLeft } from '../_common/customer/pay-left';
import { getAuth } from '../_common/util';

const columnStore = {};
export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 250,
					fixed: 'left',
					render: (h, params) => {
						const name = params.row.contract_company_name;
						const maxLength = 15;
						return (
							<div
								class="g-dp-ib g-operation"
								style="width:100%;"
							>
								{name.length <= maxLength && name}
								{name.length > maxLength && (
									<Tooltip 
										transfer
										maxWidth={220}
										content={name}
									>
										{name.substr(0, maxLength) + '...'}
									</Tooltip>
								)}	
							</div>
						);
					}
				},
				{
					title: "合同编号",
					key: "contract_num",
					minWidth: 150,
					ellipsis: true
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 130,
					ellipsis: true
				},
				{
					title: "补款金额",
					key: "payment_amount",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "剩余尾款",
					key: "last_amount",
					minWidth: 100
				},
				{
					title: "补交成本",
					key: "total_cost_amount",
					minWidth: 100
				},
				{
					title: "剩余成本",
					key: "last_cost_amount",
					minWidth: 100
				},
				{
					title: "提成业绩",
					key: "commission_performance",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "服务提成",
					key: "service_amount",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "补款人",
					key: "staff_name",
					minWidth: 100,
					ellipsis: true
				},
				{
					title: "补款时间",
					key: "create_time",
					minWidth: 130,
				}
			],
			extraColumns: {
				'1': {
					title: "操作",
					key: "link",
					width: 160,
					align: 'center',
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(row.is_own == 1, 805, 810) && (
									<span 
										class={row.show_option ? "g-operation " : 'g-operation-disable'} 
										onClick={() => {
											if (!row.show_option) return;
											this.handleEdit(row);
										}}
									>
									重新编辑
									</span>
								)}
								{getAuth(row.is_own == 1, 805, 810) && getAuth(row.is_own == 1, 806, 811) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(row.is_own == 1, 806, 811) && (
									<span 
										class={row.show_option ? "g-operation " : 'g-operation-disable'} 
										onClick={() => this.handleDrawBack(row)}
									>
									撤回补款
									</span>
								)}

							</div>
						);
					}

				},
				'3': {
					title: "操作",
					key: "link",
					width: 130,
					align: 'center',
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(row.is_own == 1, 822, 823) && (
									<span 
										class={row.show_option && !row.is_again ? 'g-operation' : 'g-operation-disable'}
										onClick={() => {
											
											this.handleReSupply(row);
										}}
									>
									重新申请
									</span>
								)}
								{getAuth(row.is_own == 1, 822, 823) && getAuth(row.is_own == 1, 807, 812) && (
									<span class={"g-m-lr-5 " + (row.show_option ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(row.is_own == 1, 807, 812) && (
									<span 
										class={row.show_option ? "g-operation " : 'g-operation-disable'} 
										onClick={() => this.handleDelete(row)}
									>
									删除
									</span>
								)}

							</div>
						);

					}

				},
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_CUSTOMER_DEAL_SUPPLY_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_SUPPLY_LIST_RESET", {
				type: this.type
			});
		},
		getColumns(type) {
			if (!columnStore[type]) {
				const columnsCopy = [...this.columns];
				if ((type == '1') && (this.$auth[805] || this.$auth[806] || this.$auth[810] || this.$auth[811])) {
					columnsCopy.push(this.extraColumns[type]);
				} else if (type == '3' && (this.$auth[807] || this.$auth[812] || this.$auth[822] || this.$auth[823])) {
					columnsCopy.push(this.extraColumns[type]);
				}
				columnStore[type] = columnsCopy;
			}
			return columnStore[type];
		},
		handleOpenDrawer(row) {
			if (!getAuth(row.is_own == 1, 804, 809)) return;
			SupplyDetail.popup({
				data: {
					...row,
					type: this.$route.query.type || '1',
					is_own: row.is_own == 1,
					show_footer: row.show_option
				},
				router: this.$router
			}).then(err => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			}).catch(err => {
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			});
		},
		async handleEdit(row) {
			if (!row.show_option) return {};
			const ok = await this.$request({
				url: "_SALE_SUPPLEMENT_HAS_AUDIT_GET",
				type: "GET",
				param: {
					supply_id: row.supply_id
				},
				loading: false,
			}).then(res => {
				return true;
				
			}).catch((res) => {
				this.$Message.error(res.msg);
				this.handleResetCur();
				return false;
			});
			if (!ok) return { has_audit: true };
			return PayLeft.popup({
				data: {
					contract_company_id: row.contract_company_id,
					contract_id: row.contract_id,
					action: 'update',
					supply_id: row.supply_id
				}
			}).then(() => {
				this.handleResetCur();
				return { has_update: true };
			}).catch((err) => {
				err && console.error(err);
				return {};

			});

		},
		handleReSupply(row) {
			if (!row.show_option || row.is_again) return;
			return PayLeft.popup({
				data: {
					contract_company_id: row.contract_company_id,
					contract_id: row.contract_id,
					action: 'readd',
					supply_id: row.supply_id
				}
			}).then(() => {
				this.handleResetCur();
				return 1;
			}).catch((err) => {
				err && console.error(err);
				return 0;
			});

		},
		handleDelete(row) {
			if (!row.show_option) return;
			return new Promise((resolve) => {
				Confirm.popup({ msg: "确认删除该条记录吗？", title: "删除提示" }).then(() => {
					this.$request({
						url: "_SALE_CUSTOMER_DEAL_SUPPLY_DELETE_POST",
						type: "POST",
						param: {
							supply_id: row.supply_id,
							type: 1
						},
						loading: false,
					}).then(res => {
						this.handleResetCur();
						resolve(1);
						this.$Message.success(res.msg);
					}).catch((res) => {
						resolve(0);
						this.$Message.error(res.msg);
					});
				}).catch(() => {
					resolve(0);
				});

			});

		},
		handleDrawBack(row) {
			if (!row.show_option) return Promise.resolve(0);
			return new Promise((resolve, reject) => {
				Confirm.popup({ msg: "确认撤回补款吗？", title: "撤回提示" }).then(() => {
					this.$request({
						url: "_SALE_CUSTOMER_DEAL_SUPPLY_DELETE_POST",
						type: "POST",
						param: {
							supply_id: row.supply_id,
							type: 2
						},
						loading: false,
					}).then(res => {

						this.handleResetCur();
						resolve(1);
						this.$Message.success(res.msg);
						
					}).catch((res) => {
						resolve(0);
						this.$Message.error(res.msg);
					});
				}).catch(() => {
					resolve(0);
				});
			});
	
		},
	}
};


