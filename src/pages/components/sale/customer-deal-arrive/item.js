import { Tooltip } from 'iview';
import { getHashUrl, getParseUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import { AccountRecord } from "../_common/customer/popup/index";
import { ApplyLeftRefund } from '../_common/customer/apply-left-refund';
import { getAuth, saleDataStore } from '../_common/util';
import Explain from '../../_common/explain/explain';
// 到账使用状态 1未使用 2已下单 3 已退款 4下单/退款 5部分下单 6部分退款
const colomnStore = {};
export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					fixed: "left",
					width: 250,
					render: (h, params) => {
						const name = params.row.contract_company_name;
						return (
							<div
								class="g-dp-ib g-operation"
								style="width:100%;"
							>
								{name.length <= 15 && name}
								{name.length > 15 && (
									<Tooltip
										transfer
										content={name}
										maxWidth={250}
									>
										{name.substr(0, 15) + '...'}
									</Tooltip>
								)
								}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 120,
					ellipsis: true
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 130,
				},

				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 130,
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
					title: "分单后业绩",
					key: "after_share_performance",
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								分单后业绩
								<Explain
									style={{ marginLeft: '2px' }}
									title="销售分单之后的业绩"
									content="举例：我是销售A，业绩是1万，分了10%给了销售B，即分了1000给了B，则我的分单业绩是9000"
								/>
							</div>
						);
					}
				},

				{
					title: "到账金额",
					key: "received_amount",
					minWidth: 130,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								到账金额
								<Explain
									style={{ marginLeft: '2px' }}
									title=""
									content="扣除手续费后实际到账的金额，用以计算业绩提成"
								/>
							</div>
						);
					}
				},

				{
					title: "手续费",
					key: "poundage",
					minWidth: 100,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								手续费
								<Explain
									style={{ marginLeft: '2px' }}
									title="客户付款过程中因缴款方式不同被第三方扣除的费用"
									content="举例：购买微商系统通过刷卡付款，产生的被银行扣除的100元，则手续费是100元"
								/>
							</div>
						);
					}
				},
				{
					title: "成交月份",
					key: "deal_month",
					minWidth: 100,
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120,
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 120,
				},
				{
					title: "录入人",
					key: "staff_name",
					minWidth: 120,
				},
				{
					title: "录入时间",
					key: "create_time",
					minWidth: 200,
				}
			],
			extraColumns: {
				"1": {
					title: "操作",
					key: "-",
					width: 140,
					fixed: "right",
					render: (h, params) => {
						const isOwn = params.row.is_own == 1;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(isOwn, 415, 419) && (
									<span
										class="g-operation"
										onClick={() => this.handleEdit(params.row)}
									>
										重新编辑
									</span>
								)}
								{getAuth(isOwn, 415, 419) && getAuth(isOwn, 87, 107) && (
									<span class={"g-m-lr-5 " + (params.row.can_refund ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(isOwn, 87, 107) && (
									<span
										class={params.row.can_refund ? 'g-operation' : 'g-operation-disable'}
										onClick={() => this.handleRemind(params.row)}
									>
										催一下
									</span>
								)}
							</div>

						);
					}
				},
				"2": {
					title: "操作",
					key: "-",
					width: 130,
					fixed: "right",
					render: (h, params) => {
						const isOwn = params.row.is_own == 1;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(isOwn, 416, 420) && (
									<span
										class={(params.row.show_option && params.row.rest_amount !== '0.00') ? 'g-operation' : 'g-operation-disable'}
										onClick={() => (params.row.show_option && params.row.rest_amount !== '0.00') && this.handleOrder(params.row)}
									>
										下单
									</span>
								)}
								{getAuth(isOwn, 416, 420) && getAuth(isOwn, 106, 412) && (
									<span class={
										"g-m-lr-5 " + (params.row.rest_amount === '0.00' ? "g-operation-disable " : 'g-operation')
									} >|</span>
								)}
								{getAuth(isOwn, 106, 412) && (
									<span
										class={params.row.rest_amount === '0.00' ? 'g-operation-disable' : 'g-operation' }
										onClick={() => this.handleLeftRefund(params.row)}
									>
										余额退款
									</span>
								)}
							</div>
						);
					}
				},
				"3": {
					title: "操作",
					key: "-",
					width: 130,
					fixed: "right",
					render: (h, params) => {
						const isOwn = params.row.is_own == 1;
						return (
							<div onClick={() => window.event.stopPropagation()}>
								{getAuth(isOwn, 417, 421) && (
									<span
										class={params.row.show_option && !params.row.is_again ? 'g-operation' : 'g-operation-disable'}
										onClick={() => this.handleReadd(params.row)}
									>
								重新录入
									</span>
								)}
								{getAuth(isOwn, 417, 421) && getAuth(isOwn, 720, 721) && (
									<span class={"g-m-lr-5 " + (params.row.show_option ? "g-operation " : 'g-operation-disable') } >|</span>
								)}
								{getAuth(isOwn, 720, 721) && (
									<span
										class={params.row.show_option ? 'g-operation' : 'g-operation-disable'}
										onClick={() => this.handleDelete(params.row)}
									>
								删除
									</span>
								)}
							</div>
						);
					}
				}
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_CUSTOMER_DEAL_ARRIVE_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_ARRIVE_LIST_RESET", {
				type: this.type
			});
		},
		getColumns(type) {
			if (colomnStore[type]) {
				return colomnStore[type];
			} else {
				const columnsCopy = [...this.columns];
				if (type == '1' && (this.$auth[415] || this.$auth[419])) {
					columnsCopy.push(this.extraColumns[type]);
				} else if (type == '2' && (this.$auth[416] || this.$auth[420])) {
					columnsCopy.splice(8, 0, {
						title: "业绩归属",
						key: "actual_month",
						minWidth: 100,
					});
					columnsCopy.push(this.extraColumns[type]);
				} else if (type == '3' && (this.$auth[417] || this.$auth[421])) {
					columnsCopy.push(this.extraColumns[type]);
				}
				colomnStore[type] = columnsCopy;
				return columnsCopy;
			}
		},
		handleOpenDrawer(row) {
			if (!getAuth(row.is_own == 1, 418, 422)) return;
			const page = (getParseUrl().query || {}).page || 1;
			const infoArr = this.listInfo[this.type].data[page];
			if (infoArr) {
				this.openIndex = infoArr.findIndex(item => {
					return item.payment_id == row.payment_id;
				});
			}
			AccountRecord.popup({
				router: this.$router,
				data: {
					...row,
					type: this.$route.query.type || '1',
					is_own: row.is_own == '1',
					show_footer: row.show_option
				},
				showContacts: true,
				condition: 'payment'
			}).then(err => {
				this.openIndex = -1;
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			}).catch(err => {
				this.openIndex = -1;
				this.$refs.tableTarget.forEach(it => it.$refs.tableTarget.clearCurrentRow());
			});
		},
		handleDelete(row) {
			if (!row.show_option) return Promise.resolve(0);
			return Confirm.popup({ msg: "确认删除该条记录吗？", title: "删除提示" }).then(() => {
				return this.$request({
					url: "_SALE_PAYMENT_DELETE_POST",
					type: "POST",
					param: { payment_id: row.payment_id, type: 1 },
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					return 1;
				}).catch((res) => {
					this.$Message.error(res.msg);
					return 0;
				});
			}).catch();
		},
		handleEdit(row) {
			window.event && window.event.stopPropagation();
			if (!row.show_option) return;
			this.$request({
				url: "_SALE_PAYMENT_HAS_AUDIT_GET",
				type: "GET",
				param: {
					payment_id: row.payment_id
				},
				loading: false,
			}).then(res => {
				this.$router.push(
					getHashUrl('/sale/customer/deal/arrive/record', {
						payment_id: row.payment_id,
						staff_id: row.invite_staff_id,
						deal_status: row.deal_status,
						contract_company_id: row.contract_company_id,
						action: "update",
					})
				);
			}).catch((res) => {
				this.$Message.error(res.msg);
				this.handleResetCur();
			});

		},
		handleOrder(row) {
			window.event && window.event.stopPropagation();
			if (!row.show_option) return;
			this.$router.push(
				getHashUrl('/sale/customer/deal/contract/order', {
					customer_id: row.customer_id,
					contract_company_id: row.contract_company_id,
					action: 'add'
				})
			);
		},
		handleReadd(row) {
			if (!row.show_option || row.is_again) return;
			this.$router.push(
				getHashUrl('/sale/customer/deal/arrive/record', {
					payment_id: row.payment_id,
					staff_id: row.invite_staff_id,
					deal_status: row.deal_status,
					action: "readd",
				})
			);
		},
		handleLeftRefund(row) {
			if (row.rest_amount === '0.00') return;
			ApplyLeftRefund.popup({
				data: {
					payment_id: row.payment_id,
					title: '余额退款',
					contract_company_id: row.contract_company_id,
					rest_amount: row.rest_amount,
					action: 'add'
				}
			}).then((res) => {
				saleDataStore.refund_id = res.refund_id;
				this.$router.push({
					path: '/sale/customer/deal/refund',
				});
			});
		},
		handleRemind(row) {
			this.$request({
				url: "_SALE_URGE_PAYMENT_POST",
				type: "POST",
				param: {
					relation_id: row.payment_id
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		}
	}
};
