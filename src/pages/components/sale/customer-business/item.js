import { Tooltip } from 'iview';
import { getLevel } from '../_common/util';

export default {
	data() {
		return {
			columns3: [ // 员工看自己数据
				{
					title: '月份',
					key: 'months',
					minWidth: 150
				},
				{
					title: '加微信客户',
					key: 'wechat',
					minWidth: 150
				},
				{
					title: '维护客户',
					key: 'maintenance',
					minWidth: 150
				},
				{
					title: '维护出来客户',
					key: 'maintenanced',
					minWidth: 150
				},
				{
					title: '约见客户',
					key: 'appoint',
					minWidth: 150
				},
				{
					title: '绕前台',
					key: 'proscenium',
					minWidth: 150
				},
				// 		{
				// 			refund_info": [    // 退款信息
				//             {
				// 				"refund_id": 1248,
				// 				"refund_amount": 2000000,    // 退款金额
				// 				"product_name": "纯微商全套"    // 对应的产品名
				// 			},
				//             {
				// 			"refund_id": 1249,
				// 			"refund_amount": 3000000,
				// 			"product_name": "微商全套"
				// 		},
				// 		{
				// 			"refund_id": 1250,
				// 			"refund_amount": 5000000,
				// 			"product_name": "代理内训（成交型内训）"
				// 		}
				// 	],
				// },
				{
					title: '业绩金额数据（元）',
					key: 'achievement',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div class="g-operation _name" >
								{params.row.refund_info.length ? <Tooltip transfer maxWidth={250}>
									{params.row.achievement}
									<div slot="content">
										{params.row.refund_info.map(ele => {
											return <div>{ele.product_name}：{ele.refund_amount}</div>;
										})}
									</div>
								</Tooltip> : <div>{params.row.achievement}</div>	}
							</div>
						);
					}
				},
				{
					title: '操作',
					key: 'link',
					width: 150
				}
			],
			columns2: [ // 经理看员工数据
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div >{params.row.staff_name}</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150
				},
				{
					title: '入职时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '月份',
					key: 'months',
					minWidth: 150
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 150
				},
				{
					title: '加微信客户',
					key: 'wechat',
					minWidth: 150
				},
				{
					title: '维护客户',
					key: 'maintenance',
					minWidth: 150
				},
				{
					title: '维护出来客户',
					key: 'maintenanced',
					minWidth: 150
				},
				{
					title: '约见客户',
					key: 'appoint',
					minWidth: 150
				},
				{
					title: '绕前台',
					key: 'proscenium',
					minWidth: 150
				},
				{
					title: '业绩金额数据（元）',
					key: 'achievement',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div class="g-operation">
								{params.row.refund_info.length ? <Tooltip transfer maxWidth={250}>
									{params.row.achievement}
									<div slot="content">
										{params.row.refund_info.map(ele => {
											return <div>{ele.product_name}：{ele.refund_amount}</div>;
										})}
									</div>
								</Tooltip> : <div>{params.row.achievement}</div>	}
							</div>
						);
					}
				}
			],
			columns1: [ // 经理看自己数据
				{
					title: '月份',
					key: 'months',
					minWidth: 150
				},
				{
					title: '过客户',
					key: 'adoptive',
					minWidth: 150
				},
				{
					title: '过出来客户',
					key: 'adoptived',
					minWidth: 150
				},
				{
					title: '谈判客户',
					key: 'negotiation',
					minWidth: 150
				},
				{
					title: '成交客户',
					key: 'deal',
					minWidth: 150

				},
				{
					title: '跟进客户',
					key: 'follow_up',
					minWidth: 150
				},
				{
					title: '操作',
					key: 'link',
					minWidth: 150
				}
			],
			columns4: [ // 总监看经理数据
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 150,
					render: (h, params) => {
						return (
							<div >{params.row.staff_name}</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150
				},
				{
					title: '入职时间',
					key: 'create_time',
					minWidth: 150
				},
				{
					title: '月份',
					key: 'months',
					minWidth: 150
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 150
				},
				{
					title: '过客户',
					key: 'adoptive',
					minWidth: 150
				},
				{
					title: '过出来客户',
					key: 'adoptived',
					minWidth: 150,
				},
				{
					title: '谈判客户',
					key: 'negotiation',
					minWidth: 150,
				},

				{
					title: '跟进客户',
					key: 'follow_up',
					minWidth: 150,
				},
				{
					title: '成交客户',
					key: 'deal',
					minWidth: 150,
				}
			],
		};
	},
	computed: {
		columns() {
			if (getLevel() == 4) {
				return this.columns3;
			} else if (getLevel() == 3) {
				return	this.type == 1 ? this.columns1 : this.columns2;
			} else {
				return	this.type == 1 ? this.columns4 : this.columns2;
			}
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_LIST_RESET', { type: this.type });
		},
		handleCheck({ row }) {
			this.$router.push({ path: '/sale/customer/business/check',
				query: {
					month: row.months,
					staff_id: row.staff_id,
					staff_identity: row.staff_identity ? row.staff_identity : getLevel() == 4 ? '1' : '2' } });
		}
	}
};

