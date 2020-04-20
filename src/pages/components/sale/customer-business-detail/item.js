import { Tooltip } from 'iview';
import { Level } from 'chalk';
import { Tips } from '../_common/popup/tips';
import { getLevel } from '../_common/util';
import { SeeDetail } from './popup/see-detail.vue';
import { AddCustomer } from '../customer-business/popup/add-customer';
import { SeeCustomer } from '../customer-business/popup/see-customer';
import { MSeeCustomer } from '../customer-business/popup/m-add-customer';

export default {
	data() {
		return {
			columns1: [
				{
					title: '公司名称',
					key: 'company_name',
					minWidth: 170,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div class="g-flex g-operation" style={{ color: params.row.type == 4 ? '' : '#515a6e !important' }}
								onClick={() => { this.handleDetails(params.row); }}>
								{
									params.row.company_name.length > 10 ? <Tooltip
										transfer
										placement="bottom-start"
										style="display: block;maxWidth:200px"
									>
										<div>
											{ params.row.company_name.substr(0, 10) + '...' }
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{params.row.company_name}
											</p>

										</div>
									</Tooltip>
										: params.row.company_name
								}
							</div>
						);
					}

				},
				{
					title: '注册资金（万元）',
					key: 'capital',
					minWidth: 150,
				},
				{
					title: '所属行业',
					key: 'industry',
					minWidth: 150,
				},
				{
					title: '产品',
					key: 'product',
					minWidth: 150,
				},
				{
					title: '地区',
					key: 'region',
					minWidth: 150,
				},
				{
					title: '是否老板',
					key: 'is_boss',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>{row.is_boss == 0 ? '否' : '是'}</div>
						);
					}
				}
			],
			columns2: [
				{
					title: '公司名称',
					key: 'company_name',
					fixed: 'left',
					minWidth: 170,
					render: (h, params) => {
						return (
							<div class="g-flex g-operation" style={{ color: params.row.type == 4 ? '' : '#515a6e !important' }}
								onClick={() => { this.handleDetails(params.row); }}>
								{
									params.row.company_name.length > 10 ? <Tooltip
										transfer
										placement="bottom-start"
										style="display: block;maxWidth:200px"
									>
										<div>
											{ params.row.company_name.substr(0, 10) + '...' }
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{params.row.company_name}
											</p>

										</div>
									</Tooltip>
										: params.row.company_name
								}
							</div>
						);
					}
				},
				{
					title: '谈判时间',
					key: 'create_time',
					minWidth: 160,

				},
				{
					title: '谈判手',
					key: 'negotiator_arr',
					minWidth: 200,
					render: (h, { row }) => {
						return (
							<div>{
								row.negotiator_arr.length > 2

									? <Tooltip
										transfer
										placement="bottom-start"
										style="display: block;maxWidth:200px"
									>
										<div>
											<span>{row.negotiator_arr[0]} </span>
											<span>{row.negotiator_arr[1]} </span>...
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{row.negotiator_arr.map(ele => {
													return <span>{ele} </span>;
												})}
											</p>
										</div>
									</Tooltip> : (row.negotiator_arr.map(ele => {
										return <span>{ele}</span>;
									}))
							}
							</div>
						);
					}
				},
				{
					title: '客户名称',
					key: 'customer_name',
					minWidth: 150,
				},
				{
					title: '职务',
					key: 'position',
					minWidth: 150,
				},
				{
					title: '手机号码',
					key: 'customer_tel',
					minWidth: 150,
				},
				{
					title: '注册资金(万元)',
					key: 'capital',
					minWidth: 150,
				},
				{
					title: '所属行业',
					key: 'industry',
					minWidth: 150,
				},
				{
					title: '产品',
					key: 'product',
					minWidth: 150,
				},
				{
					title: '是否签单',
					key: 'is_deal',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>{row.is_deal == 0 ? '否' : '是'}</div>
						);
					}
				},
				{
					title: '签单金额',
					key: 'payment',
					minWidth: 150,
				},
				{
					title: '合作项目',
					key: 'cooperation_project',
					minWidth: 150,
				}
			],
			columns3: [ // 经理查看自己的数据
				{
					title: '公司名称',
					key: 'company_name',
					minWidth: 170,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div class="g-flex g-operation"
								style={{ color: params.row.type == 4 ? '' : '#515a6e !important' }}
								onClick={() => { this.handleDetails(params.row); }}>
								{
									params.row.company_name.length > 10 ? <Tooltip
										transfer
										placement="bottom-start"
										style="display: block;maxWidth:200px"
									>
										<div>
											{ params.row.company_name.substr(0, 10) + '...' }
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{params.row.company_name}
											</p>

										</div>
									</Tooltip>
										: params.row.company_name
								}
							</div>
						);
					}
				},
				{
					title: '客户名称',
					key: 'customer_name',
					minWidth: 150,
				},
				{
					title: '邀约人',
					key: 'invite_staff_name',
					minWidth: 150,
				},
				{
					title: '主跟人',
					key: 'follow_up_person',
					minWidth: 150,
				},
				{
					title: '客户类型',
					key: 'customer_type',
					minWidth: 150,
				},
				{
					title: '所属行业',
					key: 'industry',
					minWidth: 150,
				},
				{
					title: '产品',
					key: 'product',
					minWidth: 150,
				},
				{
					title: '地区',
					key: 'region',
					minWidth: 150,
				}
			],
			columns4: [ // 经理查看自己的数据-成交客户
				{
					title: '公司名称',
					key: 'contract_company_name',
					minWidth: 170,
					fixed: 'left',
					render: (h, params) => {
						return (
							<div class="g-flex g-operation"
								style={{ color: params.row.type == 4 ? '' : '#515a6e !important' }}
								onClick={() => { this.handleDetails(params.row); }}>
								{
									params.row.contract_company_name.length > 10 ? <Tooltip
										transfer
										placement="bottom-start"
										style="display: block;maxWidth:200px"
									>
										<div>
											{ params.row.contract_company_name.substr(0, 10) + '...' }
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{params.row.contract_company_name}
											</p>

										</div>
									</Tooltip>
										: params.row.contract_company_name
								}
							</div>
						);
					}
				},
				{
					title: '客户名称',
					key: 'customer_name',
					minWidth: 150,
				},
				{
					title: '邀约人',
					key: 'staff_name',
					minWidth: 150,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150,
				},
				{
					title: '下单产品',
					key: 'product_num',
					minWidth: 150,
				},
				{
					title: '实付金额',
					key: 'payment',
					minWidth: 150,
				},
				{
					title: '付款时间',
					key: 'first_deal_time',
					minWidth: 160,
				}
			],
		};
	},
	computed: {
		columns() {
			let columns = [];
			if (this.$route.query.staff_identity == 1 || this.level == 4) {
				// 与经理查看员工数据一致
				columns = this.type == 4 ? this.columns2 : this.columns1;
			} else {
				columns = this.type == 10 ? this.columns4 : this.columns3;
			}
			columns = [...columns];
			if (this.can_edit == 1) {
				columns.push({
					title: '操作',
					key: 'link',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div class=" g-operation">
								{
									params.row.can_edit
										? <div class="g-flex">
											<span onClick={() => { this.handleEdit(params.row); }} class="g-m-r-5"> 编辑</span>
													 <span class="margin:0 5px">|</span>
											<span onClick={() => { this.handleDel(params.row); }} class="g-m-l-5">删除</span>
										</div>
										: ('')
								}
							</div>
						);
					}
				});
			}
		 return	 columns;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_DETAIL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_CUSTOMER_BUSINESS_DETAIL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		loadDetails(row) {

		},
		handleEdit(row) {
			const { query } = this.$route;
			const title = {
				'1': '加微信客户',
				'2': '维护客户',
				'3': '维护出来客户',
				'4': '约见客户',
				'5': '绕前台',
				'6': '过客户',
				'7': '过出来客户数',
				'8': '谈判客户',
				'9': '跟进客户',
			};
			this.$request({
				url: '_SALE_CUSTOMER_BUSINESS_DETAIL_INFO_GET',
				type: "post",
				loading: false,
				param: {
					type: row.type,
					data_id: row.data_id,
					staff_id: query.staff_id
				}
			}).then((res) => {
				if (res.data.can_edit == 0) {
					this.$Message.error("客户暂不能编辑");
					return;
				}
				if (query.staff_identity == 1) {
					row.type == 4 ? SeeCustomer.popup({
						data: {
							type: row.type,
							title: title[row.type],
							inform: res.data
						}
					}).then(() => {
						this.handleResetCur();
					}) : AddCustomer.popup({
						data: {
							type: row.type,
							title: title[row.type],
							inform: res.data
						}
					}).then(() => {
						this.handleResetCur();
					});
				} else {
					MSeeCustomer.popup({ data: {
						type: row.type,
						title: title[row.type],
						inform: res.data
					}
					}).then(() => {
						this.handleResetCur();
					});
				}
			}).catch(error => {
				console.error(error, "error");
			});

		},
		handleDetails(row) {
			if (row.type != 4) return;
			SeeDetail.popup({
				data: {
					type: '4',
					data_id: row.data_id,
					staff_id: this.$route.query.staff_id
				}
			});
		},
		handleDel(row) {
			Tips.popup({
				data: {
					msg: '是否确认删除此条数据，删除后，数据将不会显示在列表中',
				}
			}).then(() => {
				this.$request({
					url: '_SALE_CUSTOMER_BUSINESS_DETAIL_DEL_POST',
					type: "post",
					loading: false,
					param: {
						staff_id: this.$route.query.staff_id,
						data_id: row.data_id
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
				}).catch(error => {
					console.error(error, "error");
				});
			});
		}
	}
};

