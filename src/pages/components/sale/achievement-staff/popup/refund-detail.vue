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
		<div v-if="supply_info.payment_amount" class="g-m-b-40">
			<div style="margin-left: 23px;">
				{{ data.contract_company_name }}
			</div>
			<oa-block title="款项信息" class="">
				<oa-block-item :bule="true" :content="supply_info.payment_amount" labels="补款金额">
					<oa-money-tooltip :total="supply_info.payment_amount" :data="supply_info.payment_amount_detail" />
				</oa-block-item>
				<oa-block-item :bule="true" :content="supply_info.total_cost_amount" labels="补交成本">
					<oa-money-tooltip :total="supply_info.total_cost_amount" :data="supply_info.total_cost_amount_detail" />
				</oa-block-item>
				<oa-block-item :bule="true" :content="supply_info.commission_performance" labels="提成业绩">
					<oa-money-tooltip :total="supply_info.commission_performance+''" :data="supply_info.commission_performance_detail" />
				</oa-block-item>
				<oa-block-item :bule="true" :content="supply_info.service_amount" labels="服务提成">
					<oa-money-tooltip :total="supply_info.service_amount" :data="supply_info.service_amount_detail" />
				</oa-block-item>

			</oa-block>
			<oa-block v-if="project_info.length" title="产品信息" class="">
				<template v-for="(item,index) in project_info">
					<div :key="index" class="g-flex g-fw-w" style="width:100%;">
						<div style="width:100%;margin-left:25px" class="g-m-t-20 g-c-black1 g-fs-14">
							{{ item.product_name }}
						</div>
						<oa-block-item :bule="true" :content="item.cost_amount" labels="补交成本">
							<oa-money-tooltip :total="item.cost_amount" :data="item.cost_amount_detail" type="cost" />
						</oa-block-item>
					</div>
				</template>
			</oa-block>
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
			supply_info: {},
			project_info: {},
			rules: {
				prop: []
			}
		};
	},
	created() {
		this.$request({
			url: '_SALE_SUPPLEMENT_INFO_GET',
			type: "get",
			param: {
				...this.data,

			},
			loading: false
		}).then(res => {
			this.supply_info = res.data.supply_info;
			this.project_info = res.data.project_info;
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
export const refundDetail = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>