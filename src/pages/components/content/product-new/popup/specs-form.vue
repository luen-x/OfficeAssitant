<template>
	<div class="v-content-single-specs-form">
		<i-form
			ref="formData"
			:model="formData"
			:rules="ruleValidate"
			:label-width="0"
			label-position="right"
			inline>
			<div class="g-flex _table">
				<div class="g-flex" style="width:189px;padding-top:30px;padding-left:5px;border-right:1px solid #D4D7DB">
					<i-form-item
						prop="price"
						class="g-col"
						style="min-width:80px;margin-right:5px"
					>
						<span v-if="unit" class="_number-append">元</span>
						<i-input-number
							v-model="formData.price"
							:max=" 99999999 "
							:min="0"
							:precision="2"
							:active-change="false"
							placeholder="请输入标准价格"
						/>
					</i-form-item>
					<i-form-item
						v-if="!unit&&price_unit_all.length"
						:rules="ruleValidate.price_unit"
						prop="price_unit"
						style="display: inline-block; margin-bottom: 0 !important"
					>
						<i-select
							v-model="formData.price_unit"
							clearable
							placeholder="请选择"
						>
							<i-option
								v-for="(item) in price_unit_all"
								:key="item.price_unit"
								:value="item.price_unit"
							>{{ item.price_unit_name }}</i-option>
						</i-select>
					</i-form-item>
				</div>
				<div class="g-col" style="padding-top: 10px;border-right:1px solid #D4D7DB">
					<i-form-item
						:label-width="75"
						:rules="ruleValidate.cost_type"
						label="首次购买:"
						style="width:195px;margin-right:5px"
						prop="first_purchase.cost_type"
					>
						<i-select
							v-model="formData.first_purchase.cost_type"
							clearable
							placeholder="请选择成本类型"
						>
							<i-option
								v-for="(item) in group_cost"
								:key="item.value"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item
						:rules="ruleValidate.cost"
						prop="first_purchase.cost"
						style="width:115px"
					>
						<span
							v-if="formData.first_purchase.cost_type == 3"
							class="_number-append"
						>{{ unit_name }}</span>
						<span v-else class="_number-append">%</span>
						<i-input-number
							v-model="formData.first_purchase.cost"
							:max="formData.first_purchase.cost_type==3 ? 99999999 : 100"
							:min="0"
							:precision="2"
							:active-change="false"
							class="g-m-r-10"
							placeholder="请输入成本"
						/>
					</i-form-item>
					<div>
						<i-form-item
							:rules="ruleValidate.cost_type"
							:label-width="75"
							label="再次购买:"
							style="width:195px;margin-right:5px"
							prop="again_purchase.cost_type"
						>
							<i-select
								v-model="formData.again_purchase.cost_type"
								clearable
								placeholder="请选择成本类型"
								@on-change="()=>{loading?loading:formData.again_purchase.cost=null}"
							>
								<i-option
									v-for="(item) in group_cost"
									:key="item.value"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
						<i-form-item
							:rules="ruleValidate.cost"
							prop="again_purchase.cost"
							style="width:115px"
						>
							<span
								v-if="formData.again_purchase.cost_type == 3"
								class="_number-append">
								{{ unit_name }}
							</span>
							<span v-else class="_number-append">%</span>
							<i-input-number
								v-model="formData.again_purchase.cost"
								:max="formData.again_purchase.cost_type==3 ? 99999999 : 100"
								:min="0"
								:precision="2"
								:active-change="false"
								placeholder="请输入成本"
							/>
						</i-form-item>
					</div>
				</div>
				<div class="g-col" style="padding-top: 10px">
					<div>
						<i-form-item
							:label-width="75"
							label="续费功能:"
							style="width:195px;margin-right:5px"
						>
							<i-radio-group v-model="formData.is_renew" @on-change="handleRenew">
								<i-radio :label="1" class="_radio">开</i-radio>
								<i-radio :label="0" class="_radio">关</i-radio>
							</i-radio-group>
						</i-form-item>
						<i-form-item
							v-if="formData.is_renew"
							:rules="ruleValidate.price"
							prop="renew_price"
							style="width:130px"
						>
							<span class="_number-append">{{ unit_name }}</span>
							<i-input-number
								v-model="formData.renew_price"
								:max="99999999"
								:min="0"
								:precision="2"
								:active-change="false"
								style="width:115px"
								placeholder="请输入续费价格"
							/>
						</i-form-item>
					</div>
					<div v-if="formData.is_renew">
						<i-form-item
							:label-width="75"
							:rules="ruleValidate.cost_type"
							prop="renew_purchase.cost_type"
							label="续费成本:"
							style="width:195px;margin-right:5px"
						>
							<i-select
								v-model="formData.renew_purchase.cost_type"
								clearable
								placeholder="请选择成本类型"
								@on-change="()=>{loading?loading:formData.renew_purchase.cost=null}"
							>
								<i-option
									v-for="(item) in group_cost"
									:key="item.value"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
						<i-form-item
							:rules="ruleValidate.price"
							prop="renew_purchase.cost"
							style="width:130px"
						>
							<span
								v-if="formData.renew_purchase.cost_type==3"
								class="_number-append"
							>{{ unit_name }}</span>
							<span v-else class="_number-append">%</span>
							<i-input-number
								v-model="formData.renew_purchase.cost"
								:max="formData.renew_purchase.cost_type==3 ? 99999999 : 100"
								:min="0"
								:precision="2"
								:active-change="false"
								style="width:115px"
								placeholder="请输入成本"
							/>
						</i-form-item>
					</div>
				</div>
			</div>
		</i-form>
	</div>
</template>
<script>
import { Form, FormItem, Input, InputNumber, Select, Option, RadioGroup, Radio } from 'iview';
import { setTimeout } from 'timers';
import { AddStuffs } from './add-stuffs';
import { SaveConfirm } from './save-confirm';

export default {
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	props: {
		sku: {
			type: Array,
			default() {
				return [];
			},
		},
		unit: {
			type: Boolean,
			default() {
				return true;
			}
		},
		mask: {
			type: Number,
			default() {
				return true;
			}
		},
		data: {
			type: Object,
			default() {
				return {};
			}
		},
		frontKey: {
			type: String,
			default() {
				return {};
			}
		},
		data_sku: Array,
	},
	data() {
		return {
			price_unit_all: [],
			loading: false,
			group_cost: [
				{ label: "标准价成本", value: 1 },
				// { label: "成交金额成本", value: 2 },
				{ label: "固定成本", value: 3 }
			],
			formData: {
				sku_id: this.data.sku_id || "", // 规格ID
				price: this.data.price === undefined ? null : this.data.price, // 标准价格
				price_unit: this.data.price_unit || "", // 价格单位
				is_renew: this.data.is_renew === 0 ? 0 : 1, // 是否续费：0-否，1-是
				renew_price: this.data.renew_price === undefined ? null : this.data.renew_price,
				front_key: this.data.front_key || "",
				first_purchase: this.data.first_purchase || {
					price_type: 1,
					cost_type: 1,
					cost: null,
				},
				again_purchase: this.data.again_purchase || {
					price_type: 2,
					cost_type: 1,
					cost: null,
				},
				renew_purchase: this.data.is_renew ? this.data.renew_purchase : {
					price_type: 3,
					cost_type: 1,
					cost: null,
				},
				specs: this.data.specs || []
			},
			ruleValidate: {
				price: [
					{ required: true, type: 'number', message: '请输入价格', trigger: 'blur' }
				],
				price_unit: [
					{ required: true, type: 'number', message: '请选择单位', trigger: 'change' }
				],
				cost_type: [
					{ required: true, type: 'number', message: '请选择成本类型', trigger: 'change' }
				],
				cost: [
					{ required: true, type: 'number', message: '请输入成本', trigger: 'blur' }
				],
			},
		};
	},
	computed: {
		unit_name() {
			if (this.unit) {
				return '元';
			}
			return this.formData.price_unit && this.price_unit_all.length ? this.price_unit_all[this.formData.price_unit - 1].price_unit_name : '元';
		}
	},
	created() {
		this.formData.first_purchase.cost = this.formData.first_purchase.cost == null ? null : Number(this.formData.first_purchase.cost);
		this.formData.again_purchase.cost = this.formData.again_purchase.cost == null ? null : Number(this.formData.again_purchase.cost);
		this.formData.renew_purchase.cost = this.formData.renew_purchase.cost == null ? null : Number(this.formData.renew_purchase.cost);
	},
	mounted() {
		this.loadData();
		this.loadPriceUnit();
	},
	methods: {
		loadData() {
			this.loading = true;
			return;
		},
		loadPriceUnit() {
			this.$request({
				url: '_CONTENT_PRODUCT_PRICE_UNIT_GET',
				type: "GET",
			}).then(res => {
				this.price_unit_all = res.data;
			});
		},
		handleRenew(i) {
			this.formData.renew_purchase.price_type = 3;
			this.formData.renew_purchase.cost_type = 3;
			this.formData.renew_purchase.cost = i ? null : "";
		}
	}
};
</script>
<style lang="scss">
    .v-content-single-specs-form {
		._number-append {
            display: inline-block;
            position: absolute;
            right: 7px;
            vertical-align: bottom;
            z-index: 1;
			bottom: 0;
            color: gray;
        }
        ._radio {
            margin-right: 16px;
        }
		._cost-type::before {
            content: "*";
            display: inline-block;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
			padding-right: 2px;
        }
        ._table {
            /* margin-top: 10px; */
            height: 110px;
        }
        ._requrie::before {
            content: " *";
            display: inline-block;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
        }
    }
</style>
