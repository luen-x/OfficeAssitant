<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看详情"
		footer-hide
		width="680"
	>
		<div class="g-m-b-40">
			<div style="margin-left: 23px;">
				{{ data.contract_company_name }}
			</div>
			<oa-block v-if="refund_info.refund_type" title="退款信息" class="">
				<oa-block-item :bule="true" :content="refund_info.real_refund_amount" labels="退款金额">
					<oa-money-tooltip :total="refund_info.real_refund_amount" :data="refund_info.real_refund_amount_detail"/>
				</oa-block-item>
				<template v-if="data.refund_type!=3">
					<oa-block-item
						:content="refund_info.refund_project.map(ele=>ele.product_name).join('/')"
						:labels="data.refund_type==2?'被换产品':'退款产品'"/>
					<oa-block-item labels="退还成本">
						<oa-money-tooltip :total="refund_info.return_cost_amount" :data="refund_info.return_cost_amount_detail"/>
					</oa-block-item>
					<oa-block-item
						v-if="data.refund_type==2"
						:content="refund_info.after_product.map(ele=>ele.product_name).join('/')"
						labels="换后产品"/>
				</template>
				<oa-block-item v-if="data.refund_type==3" :content="refund_info.refund_mode_name" labels="退款种类"/>
				<oa-block-item :content="refund_info.remark" labels="退款理由">
					<span v-if="refund_info.remark.length<10">{{ refund_info.remark }}</span>
					<i-poptip v-else transfer trigger="hover">
						<span class="g-poninter">{{ refund_info.remark.substring(0,10)+'...' }}</span>
						<div slot="content" style="max-width: 500px;white-space: normal;">
							{{ refund_info.remark }}
						</div>
					</i-poptip>
				</oa-block-item>
			</oa-block>
			<oa-block v-if="refund_info.deduction_commission!='0.00'" title="提成情况" class="" >
				<oa-block-item
					:bule="refund_info.refund_type!=3"
					:content="refund_info.deduction_commission"
					labels="应扣回提成"
					style="margin-left: 14px;">
					<oa-money-tooltip
						v-if="refund_info.refund_type!=3"
						:total="refund_info.deduction_commission"
						:data="refund_info.deduction_commission_detail"
					/>
				</oa-block-item>
			</oa-block>
			<template v-if="data.refund_type!=3">
				<oa-block title="产品信息" class="">
					<template v-for="(item,index) in refund_info.refund_project">
						<div :key="index+'l'" style="width:100%;margin-left:25px" class="g-m-t-20 g-c-black1 g-fs-14">
							{{ item.product_name }}
						</div>
						<oa-block-item :key="index+'n'" :bule="true" labels="退还成本">
							<oa-money-tooltip :total="item.return_cost_amount" :data="item.detail"/>
						</oa-block-item>
					</template>
				</oa-block>
				<div class="g-flex g-jc-sb">
					<oa-block-item labels="返还服务提成">
						<oa-money-tooltip :total="refund_info.return_service_commission" :data="refund_info.return_service_commission_detail"/>
					</oa-block-item>
					<oa-block-item labels="应扣回提成">
						<oa-money-tooltip :total="refund_info.deduction_commission" :data="refund_info.deduction_commission_detail"/>
					</oa-block-item>
				</div>
			</template>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import BlockItem from './block-item';
import Block from './block';

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
			refund_info: {
				refund_project: [],
				after_product: [],
			},
			rules: {
				prop: []
			}
		};
	},
	created() {
		const { query } = this.$route;
		this.$request({
			url: '_SALE_REFUND_INFO_GET',
			type: "get",
			param: {
				// ...this.data
				refund_id: this.data.refund_id,
				staff_id: query.staff_id || this.$global.staff.staff_id
			},
			loading: false
		}).then(res => {
			this.refund_info = res.data.refund_info;
			// if (data.refund_type == 3) {
			// 	this.refund_info.real_refund_amount_detail = [res.data.real_refund_amount_detail];
			// }
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
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const productRefund = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>