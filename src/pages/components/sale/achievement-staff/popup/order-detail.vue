<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class-name="sale-achievement-staff-order-detail"
		title="查看详情"
		footer-hide
		width="680"
	>
		<div v-if="contract_info.contract_amount" class="g-m-b-40">
			<div style="margin-left: 30px;">
				{{ data.contract_company_name }}
			</div>
			<oa-block>
				<oa-block-item :content="contract_info.contract_amount" labels="合同金额"/>
				<oa-block-item :content="contract_info.need_amount" labels="应付金额"/>
				<oa-block-item :bule="true" :content="contract_info.order_payment_amount" labels="实付金额">
					<oa-money-tooltip
						:total="contract_info.order_payment_amount"
						:data="contract_info.payment_amount_detail.filter(ele=>{
						return ele.supply_id===0})" />
				</oa-block-item>
				<oa-block-item :content="contract_info.last_amount" labels="剩余尾款"/>
				<oa-block-item :content="contract_info.total_need_cost_amount" labels="产品成本"/>
				<oa-block-item :content="contract_info.order_cost_amount" labels="实扣成本">
					<oa-money-tooltip
						:total="contract_info.order_cost_amount"
						:data="contract_info.total_cost_amount_detail.filter(ele=>{
						return ele.supply_id===0})" />
				</oa-block-item>
				<oa-block-item v-if="contract_info.order_commission_performance" :bule="true" labels="提成业绩">
					<oa-money-tooltip
						:total="contract_info.order_commission_performance"
						:data="contract_info.commission_performance_detail.filter(ele=>{
						return ele.supply_id===0})" />
				</oa-block-item>
				<oa-block-item v-if="contract_info.order_service_amount" labels="服务提成">
					<oa-money-tooltip
						:total="contract_info.order_service_amount"
						:data="contract_info.service_amount_detail.filter(ele=>{
						return ele.supply_id===0})" />
				</oa-block-item>
			</oa-block>
			<oa-expand-panel v-for="(pro,index) in project" :key="index" :border="false" style="margin-top:10px;">
				<div slot="header" class="g-m-lr-5 g-flex g-jc-sb">
					<span class="g-m-r-20">{{ pro.product_name }}</span>
					<span class="g-m-r-20">标准价：{{ pro.need_amount }}</span>
					<span>成本价：{{ pro.need_cost_amount }}</span>
				</div>
				<div class="g-flex g-fw-w g-relative g-pd-l-10 g-pd-b-20">
					<oa-info-item
						v-for="(sku,index) in pro.sku"
						:key="index+'sku'"
						:content="sku.specs_name"
						:label="sku.specs_label"
					/>
					<oa-info-item
						:content="pro.need_cost_amount"
						label="产品成本"
					/>
					<oa-info-item label="实扣成本">
						<oa-money-tooltip
							:total="pro.cost_amount"
							:data="pro.cost_amount_detail.filter(ele=>{
							return ele.supply_id===0})"
							type="cost"
							init-type="3" />
					</oa-info-item>
					<oa-info-item
						v-for="(item,index) in pro.project_request"
						:key="index"
						:label="item.component_label"
						:content="item.component_value"
						:type="item.component_type"
					>
						<i-poptip
							v-if="item.component_value&&item.component_value.length>10"
							transfer
							trigger="hover">
							<span class="g-poninter">{{ item.component_value.substring(0,10)+'...' }}</span>
							<div slot="content" style="max-width: 500px;white-space: normal;">
								{{ item.component_value }}
							</div>
						</i-poptip>
					</oa-info-item>
				</div>
			</oa-expand-panel>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import ExpandPanel from '@components/_common/expand-panel/expand-panel';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import ProductLabel from '@common/product-label/product-label';
import InfoBlock from '@components/sale/_common/info-block';
import InfoItem from '@components/sale/_common/info-item';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import BlockItem from './block-item';
import Block from './block';
import commissionDetailed from '../_common/achievement/commission-detailed';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-block-item': BlockItem,
		'oa-block': Block,
		'oa-expand-panel': ExpandPanel,
		'oa-commission-detailed': commissionDetailed,
		'oa-product-label': ProductLabel,
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'oa-money-tooltip': MoneyTooltip

	},
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			formData: {
				prop: ''
			},
			contract_info: {},
			project: [], // 项目信息
			rules: {
				prop: []
			}
		};
	},
	created() {
		this.$request({
			url: '_SALE_CONTRACT_PERFORMANCE_PROJECT_GET',
			type: "GET",
			param: {
				contract_id: this.data.contract_id
			},
			loading: false
		}).then(res => {
			this.records = res.data;
			this.contract_info = res.data.contract_info;
			this.project = res.data.project;
		}).catch((res) => {

		});
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
	}
};
export const orderDetail = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
	.sale-achievement-staff-order-detail{
		._product-label {
				position: absolute;
				right: 0;
				margin-right: 20px;
				margin-top: 20px;
		}
		.v-sale-customer-info-item{
			width: auto !important;
			flex: 0.5 !important;
			margin-right: 20px !important;
			._label{
				min-width: 100px !important;
			}
		}
		.v-sale-customer-info-item:nth-child(even){
			margin-right: 0 !important;
		}
	}
</style>