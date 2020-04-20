import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import service from '@utils/service';
import { Confirm } from "@common/confirm/confirm"; 
import { SeaCompanyDetail } from '../sea-archive/popup/company-detail';
import { PropertyCard } from '../_common/property/property-card';

export default {
	data() {
		return {
			// {
			//     "attention_id": 2,
			//     "customer_id": 400170,
			//     "status": 1,    // 0 关注 1 用券的
			//     "company_name": "SHGS有限责任公司",
			//     "customer_name": "小A",
			//     "industry_name": "大日化",
			//     "address_str": "天津市天津市县区宁河县",
			//     "customer_status": "已领取",
			//     "staff_name": "杨总监（杭九战区）",
			//     "expiration_time": "2019-12-24 16:09:05",
			//     "capital": "100.00万",
			//     "create_staff_name": "超管",
			//     "change_times": 6,
			//     "scale": "50-200人",
			//     "see_detail": 0    // 是否能看详情
			//     "can_get": 1    // 是否可领取
			// }
			columns: [
				// {
				// 	type: "selection",
				// 	width: 60,
				// 	fixed: "left",
				// 	className: "g-pd-l-10"
				// },
				{
					title: '公司名称',
					key: 'company_name',
					width: 200,
					fixed: 'left',
					render: (h, { row }) => {
						const name = row.customer_status_name;
						return (
							<div>
								<div class="g-dp-ib" style="width:140px">
									<AutoTooltip 
										content={row.company_name} 
										placement="bottom" 
										theme="dark"
										labelClass={(row.is_own == 1 && (name == '已领取' || name == '关联中' || name == '已关联' || name == "已成交")) 
											? 'g-operation' : " "}
									/>
								</div>
								{row.status == 1 && <span class="_tag">抢</span>}

							</div>
						);	
					}
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 100
				},
				{
					title: '行业',
					key: 'industry_name',
					minWidth: 100
				},
				{
					title: '地址',
					key: 'address_str',
					minWidth: 170,
					render: (h, { row }) => {
						return <AutoTooltip content={row.address_str} placement="bottom" theme="dark" labelClass=" "/>;
					}
				},
				{
					title: '客户状态',
					key: 'customer_status_name',
					minWidth: 140,
					render: (h, { row }) => {
						return <AutoTooltip content={row.customer_status_name} placement="bottom" theme="dark" labelClass=" "/>;
					}
				},
				{
					title: '负责人',
					key: 'staff_name',
					minWidth: 160,
					render: (h, { row }) => {
						return <AutoTooltip content={row.staff_name} placement="bottom" theme="dark" labelClass=" "/>;
					}
				},
				{
					title: '保护时间至',
					key: 'expiration_time',
					minWidth: 150
				},
				{
					title: '注册资金',
					key: 'capital',
					minWidth: 100
				},
				{
					title: '创建人',
					key: 'create_staff_name',
					minWidth: 100
				},
				{
					title: '转手次数',
					key: 'change_times',
					minWidth: 90
				},
				{
					title: '人员规模',
					key: 'scale',
					minWidth: 90
				},
				{
					title: '操作',
					key: 'industry',
					width: 130,
					fixed: 'right',
					render: (h, { row }) => {
						const btns = [];
						if (!row.is_own && !!row.can_get && this.$auth[1676]) {
							btns.push(<span onClick={() => this.handleGetCustomer(row)}>领取资料</span>);
						}
						{ /*  customer_status:是已成交，row.status：是否已使用令牌 */ }
						if (!row.is_own && row.customer_status == 1 && row.status == 0 && this.$auth[1677]) {
							btns.push(
								<span 
									class={this.myProp.remain_num !== 0 ? '' : 'g-operation-disable'} 
									onClick={() => this.handleUseProp(row)}
								>
									使用令牌
								</span>
							);
						}
						if (!row.is_own && row.customer_status == 1 && row.status == 1 && this.$auth[1710]) {
							btns.push(<span onClick={() => this.handleCancelProp(row)}>取消令牌</span>);
						}
						if (this.$auth[1675]) {
							btns.push(<span onClick={() => this.handleMoveOut(row)}>移出</span>);
						}
						
						return <div class="g-operation" onClick={this.stopPropagation}>
							{btns.map((btn, index) => {
								if (index == btns.length - 1) {
									return btn;
								} else {
									return <span>
										{btn}
										<span class="g-m-lr-5">|</span>
									</span>;
								}
							})}
						</div>;
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_CONCERN_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_CONCERN_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		stopPropagation() {
			window.event.stopPropagation();
		},
		handleRowClick(row) {
			// 	'已成交': '_blue',
			// '存在公海': '_orange',
			// '已关联': '_blue',
			// '黑名单（待确认）': '_grey',
			// '黑名单（已确认）': '_black',
			// '已领取': '_green',
			// '白名单': '_red'
			if (!row.is_own) return; 
			if (row.customer_status_name == '已领取' || row.customer_status_name == '关联中') {
				this.$router.push({
					path: '/sale/customer/intention',
					query: {
						keyword: row.tel
					}
				});

			} else if (row.customer_status_name == '已成交') {
				this.$router.push({
					path: '/sale/customer/deal/deal',
					query: {
						customer_search: row.tel
					}
				});
			} else if (row.customer_status_name == '已关联') {
				this.$router.push({
					path: '/sale/customer/deal/deal',
					query: {
						relation_customer_search: row.tel
					}
				});
			}

			// if (row.see_detail) {
			// 	SeaCompanyDetail.popup({
			// 		customerId: row.customer_id,
			// 		isAttention: true
			// 	});
			// }
		},
		handleGetCustomer(row) {
			service.getCustomer(row.customer_id).then(this.handleResetCur);
		},
		handleUseProp(row) {
			if (this.myProp.remain_num === 0) {
				this.$Message.error('请先前往道具中心购买抢资料令牌');
				return;
			}
			PropertyCard.popup({
				typeId: 7
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_ATTENTION_USE_PROP_POST",
					type: "POST",
					param: {
						attention_id: row.attention_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					this.loadProp();
						
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});


		},
		handleCancelProp(row) {
			Confirm.popup({
				msg: '确认对' + row.company_name + '取消使用抢资料令牌？',
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMET_ATTENTION_CANCEL_PROP_POST",
					type: "POST",
					param: {
						attention_id: row.attention_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					this.loadProp();
			
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(e => e && console.error(e));
		},
		handleMoveOut(row) {
			Confirm.popup({
				msg: '确定移出关注列表吗？',
				
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMET_ATTENTION_REMOVE_POST",
					type: "POST",
					param: {
						attention_id: row.attention_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					this.loadProp();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(e => e && console.error(e));
		}
	}
};

