import Explain from '@components/_common/explain/explain';
import { Tooltip } from "iview"; 
import {
	AchiAuditModal
} from './popup/audit.vue';

export default {
	data() {
		return {
			columns: [{
				title: '公司名称',
				width: 240,
				fixed: 'left',
				render: (h, params) => {
					const { contract_company_name } = params.row;
					return <div>
						{contract_company_name.length > 15
							? <Tooltip 
								transfer 
								placement="bottom-start"
								style="margin: 10px auto;display: block;maxWidth:200px"
							>
								<div>
									{contract_company_name.substr(0, 15) + '...'}
								</div>
								<div slot="content">
									<p style="whiteSpace: normal">
										{contract_company_name}
									</p>
								</div>
							</Tooltip>
							: contract_company_name}
					</div>;
				}
			},
			{
				title: '客户姓名',
				width: 150,
				key: 'customer_name'
			},
			{
				title: '客户手机号',
				width: 150,
				key: 'phone'
			},
			{
				title: '更改对象',
				width: 150,
				key: 'before_category_name',
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							更改对象
							<Explain 
								style={{ marginLeft: '2px' }}
								title="被更改的余额类型，更改后金额减少"
								content="举例：需要将软件产品的余额5万更改为培训产品的余额，则更改对象为软件产品余额"
							/>
						</div>
					);
				}
			},
			{
				title: '更改前余额',
				width: 150,
				key: 'before_category_before_amount',
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							更改前余额
							<Explain 
								style={{ marginLeft: '2px' }}
								content="更改对象在更改之前的余额"
							/>
						</div>
					);
				}
			},
			{
				title: '更改后余额',
				width: 150,
				key: "before_category_after_amount",
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							更改后余额
							<Explain 
								style={{ marginLeft: '2px' }}
								content="更改对象在更改之后的余额"
							/>
						</div>
					);
				}
			},
			{
				title: '转移金额',
				width: 150,
				key: 'transfer_amount',
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							转移金额
							<Explain 
								style={{ marginLeft: '2px' }}
								title="本次更改的余额金额，从更改对象中获取，转移到改后对象的余额中"
								content="举例：需要将软件产品的余额5万更改为培训产品的余额，则转移金额为5万"
							/>
						</div>
					);
				}
			},
			{
				title: '改后对象',
				width: 150,
				key: 'after_category_name',
				renderHeader: (h, params) => {
					return (
						<div class="g-c-black2" style={{ fontWeight: 400 }}>
							改后对象
							<Explain 
								style={{ marginLeft: '2px' }}
								title="将更改金额转移到该余额类型中，更改后金额增加"
								content="举例：需要将软件产品的余额5万更改为培训产品的余额，则改后对象为培训产品余额"
							/>
						</div>
					);
				}
			},
			{
				title: '申请人',
				width: 200,
				render: (h, params) => {
					const { staff_name } = params.row;
					return <div>
						{staff_name.length > 15
							? <Tooltip 
								transfer 
								placement="bottom-start"
								style="margin: 10px auto;display: block;maxWidth:200px"
							>
								<div>
									{ staff_name.substr(0, 15) + '...' }
								</div>
								<div slot="content">
									<p style="whiteSpace: normal">
										{staff_name}
									</p>
								</div>
							</Tooltip>
							: staff_name}
					</div>;
				}
			},
			{
				title: '申请时间',
				width: 200,
				key: 'create_time'
			},
			{
				title: '邀约人',
				width: 200,
				key: 'invite_staff_name'
			},
			{
				title: '部门',
				width: 150,
				key: 'invite_depart_name'
			},
			{
				title: '审核人',
				width: 200,
				render: (h, params) => {
					const { audit_staff_name } = params.row;
					return <div>
						{audit_staff_name.length > 15
							? <Tooltip 
								transfer 
								placement="bottom-start"
								style="margin: 10px auto;display: block;maxWidth:200px"
							>
								<div>
									{ audit_staff_name.substr(0, 15) + '...' }
									
								</div>
								<div slot="content">
									<p style="whiteSpace: normal">
										{audit_staff_name}
									</p>
								</div>
							</Tooltip>
							: audit_staff_name}
					</div>;
				}
			},
			{
				title: '操作',
				width: 100,
				key: 'opt',
				align: "center",
				fixed: 'right',
				render: (h, params) => {
					return h('div', {
						class: 'g-operation',
						style: 'width:100%;height:100%',
						on: {
							click: () => {
								this.handleBtn(params);
							}
						}
					}, '查看详情');
				}
			}

			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_REMAIN_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_CUSTOMER_REMAIN_LIST_RESET', {
				type: this.type
			});
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleBtn(params) {
			const {
				query = {}
			} = this.$route;
			const {
				transfer_id
			} = params.row;
			AchiAuditModal.popup({
				queryType: query.type,
				transfer_id
			}).then(res => {
				this.$store.commit('FINANCE_CUSTOMER_REMAIN_LIST_RESET', {
					type: this.type
				});
			});
		}
	}
};
