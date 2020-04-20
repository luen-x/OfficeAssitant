<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:closable="false"
		title="添加产品规格"
		class-name="v-content-product-new-select-stuffs"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30 g-flex g-fd-c">
			<div class="g-flex  g-fw-w " style="min-height:100px;border-bottom: 1px solid #e8eaec;padding-bottom:10px">
				<div style="width:100%">
					已添加
				</div>
				<div v-for="(item,index) in sku" :key="index" class="_show-title g-m-r-10">
					<span class="__left">{{ item.front }}</span>
					<i class="__right iconfont icon-close" @click="handleClose(index)" />
				</div>
			</div>
			<div class="g-flex g-fw-w g-m-t-10" style="min-height:100px">
				<div style="width:100%">
					未添加
				</div>
				<div v-for="(item,index) in hide" :key="index" class="_hide-title g-m-r-10">
					<span class="__left" >{{ item.front }}</span>
					<div class="__mask" @click="handleAdd(index)">添加</div>
				</div>
			</div>
		</div>
		<div slot="footer">
			<i-button style="font-size:14px !important;" class="g-m-r-10 " type="text" @click="handleCancel()">上一步</i-button>
			<i-button style="font-size:14px !important;" type="primary" @click="handleOk()">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from "@stores/apis/root";

export default {
	name: "v-add-stuff",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-checkbox-group": CheckboxGroup,
		"i-checkbox": Checkbox,
		"i-button": Button
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			specs: [],
			sku: [],
			hide: [],
			allSkuList: [],
		};
	},
	computed: {
	},
	created() {
		this.specs = this.data.specs;
		this.handleSku();
		if (!this.sku.length) {
			this.sku = this.hide;
			this.hide = [];
		}

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData(api) {
			this.$request({
				url: API.CONTENT_PRODUCT_SKU_COMPONENT_TYPE_GET,
				type: "get",
			}).then(res => {
				this.stuffList = res.data;
				res.data.map(ele => {
					this.$set(this.stuffs, ele.component_field, []);
					this.$set(this.component, ele.component_field, false);
					return;
				});
				if (this.data.specs.length) {
					this.data.specs.map(element => {
						const v = this.stuffList.find(ele => {
							return ele.component_field == element.component_field;
						});
						this.specs.push(v);
						this.component[element.component_field] = true;
						element.values.forEach(it => {
							this.stuffs[element.component_field].push(it.value);
						});
						return;
					});

				}
			});
		},
		handleSku() {
			let com = {
				"sku_id": "",
				"product_id": "",
				"specs_ids": "",
				"price": null,
				"price_unit": "1",
				"is_renew": 1,
				renew_price: null,
				"first_purchase": {
					"price_type": 1,
					"cost_type": 1,
					"cost": null
				},
				"again_purchase": {
					"price_type": 2,
					"cost_type": 1,
					"cost": null
				},
				"renew_purchase": {
					"price_type": 3,
					"cost_type": 1,
					"cost": null
				}
			};
			let specs = {
				"specs_field": "bill_year",
				"specs_name": "提单两年",
				"specs_value": 2
			};
			let sku = [];
			if (this.specs.length > 1) {
				this.specs[0].values.forEach(element => {
					this.specs[1].values.forEach(item => {
						let com1 = {};
						let specs1 = [];
						specs1.push({
							specs_field: this.specs[0].component_field,
							specs_name: element.label,
							specs_value: element.value,
						});
						specs1.push({
							specs_field: this.specs[1].component_field,
							specs_name: item.label,
							specs_value: item.value
						});

						const n = this.sku.find((ele) => {
							return ele.front_key == com1.front_key;
						});
						if (n) { sku.push(n); } else {
							sku.push({
								specs: specs1,
								front_key: this.specs[0].component_field + "+" + element.value + "+"
								+ this.specs[1].component_field + "+" + item.value,
								front: element.label + '-' + item.label,
							});
						}
					});
				});
			} else if (this.specs.length > 0) {
				this.specs[0].values.forEach(element => {
					let specs1 = [];
					specs1.push({
						specs_field: this.specs[0].component_field,
						specs_name: element.label,
						specs_value: element.value,
					});

					const n = this.sku.find((ele) => {
						return ele.front_key == com1.front_key;
					});
					if (n) { sku.push(n); } else {
						sku.push({
							specs: specs1,
							front_key: this.specs[0].component_field + "+" + element.value,
							front: element.label
						});
					}
				});
			} else {
				let specs1 = [];
				sku.push({
					specs: [],
				});
			}
			this.sku = sku;
			this.allSkuList = sku;
			if (this.data.sku && this.data.sku.length) {
				let s = [];
				this.sku.forEach(ele => {
					const v = this.data.hide.find(it => {
						return it.front_key == ele.front_key;
					});
					v ? this.hide.push(ele) : s.push(ele);
				});
				this.sku = s;
				return;
			}
		},
		handleClose(i) {
			const v = this.sku.splice(i, 1);
			this.hide.push(...v);
		},
		handleAdd(i) {
			const v = this.hide.splice(i, 1);
			this.sku.push(...v);
			//
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			if (this.sku.length < 1) { this.$Message.error('请至少添加一种规格'); return; }
			this.visible = false;
			this.allSkuList.filter((v) => {
				return this.sku.find(ele => {
					return v.front_key == ele.front_key;
				 });
			});
			this.$emit('sure', { sku: this.allSkuList, hide: this.hide });

		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const selectStuffs = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
    .v-content-product-new-select-stuffs {
        ._show-title,
        ._hide-title {
            position: relative;
            height: 32px;
            background: #e84c57;
            border-radius: 4px;
            color: #fff;
            line-height: 20px;
            padding: 3px 5px;
			margin-top: 10px;
            .__left {
                display: inline-block;
                padding: 3px 5px;
                margin-right: 2px;
                text-align: center;
            }
            .__right {
                display: inline-block;
                padding: 3px 5px;
                margin-right: 2px;
                text-align: center;
                cursor: pointer;
            }
        }
        ._hide-title {
            background: #f0f4fc;
			color: rgb(75, 79, 87);
        }
        .__mask{
			border-radius: 4px;
            opacity: 0;
            position: absolute;
            color: #fff;
            left: 0;
            top: 0;
            width: 100%;
			text-align: center;
            height: 32px;
            line-height: 32px;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.6);
        }
		.__mask:hover{
			opacity:1;
		}
    }
</style>

