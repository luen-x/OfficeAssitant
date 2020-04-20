<template>
	<div class="v-content-product-new-double-specs">

		<div v-for="(item,index) in sku" :key="item.front_key" class="_table-content g-m-t-20 " >
			<div v-if="specs.length" class="g-fr g-operation" @click="handleDelStuff(index,item)">
				删除
			</div>
			<div class="g-flex g-m-b-20 g-fs-14">
				<div v-for="(spe,index) in specs" :key="index" class="g-col">
					{{ spe.component_label }}:
					<span v-if="item.specs.length" class="g-m-l-10 g-c-black2">
						{{ item.specs[index].specs_name }}
					</span>
				</div>
			</div>
			<div class="g-flex _title g-b-black1 g-bold" style="font-weight: bold;">
				<div class="g-pd-l-10" style="width:190px;border: 1px solid #D4D7DB;border-bottom:none">标准价格</div>
				<div class=" g-col g-pd-l-10" style="border-top: 1px solid #D4D7DB">成本设置</div>
				<div class="g-col g-pd-l-10" style="border: 1px solid #D4D7DB;border-bottom:none">续费功能
				</div>
			</div>
			<oa-specs-form
				v-if="!loading"
				ref="form"
				:sku="sku"
				:data="item"
				:mask="index"
				:front-key="item.front_key?item.front_key:''"
				:unit="item.specs.length>0"
				style="border: 1px solid #D4D7DB;border-bottom:none" />
		</div>
		<vc-debounce-click
			class="_add g-m-t-20 g-m-b-30"
			@click="handleAddStuff"
		><i class="iconfont icon-add2"/> 添加产品规格</vc-debounce-click>
	</div>
</template>
<script>
import { Form, FormItem, Input, InputNumber, Select, Option, RadioGroup, Radio } from 'iview';
import API from "@stores/apis/root";
import { setTimeout } from 'timers';
import { Confirm } from "@components/_common/confirm/confirm";
import { AddStuffs } from './add-stuffs';
import { selectStuffs } from './select-stuffs';
import specsForm from './specs-form';

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
		'oa-specs-form': specsForm

	},
	props: {
		price_unit_all: Array,
		pro_sku: Array,
		all_specs: Array,
	},
	data() {
		return {
			visible: false,
			loading: false,
			tableField: String,
			tableLabel: "请选择产品规格",
			components: Object,
			sku: [],
			specs: [],
			selectList: [],
			selectCom: [],
			hideList: [],
		};
	},
	computed: {

	},
	watch: {
	},
	mounted() {
		// this.handleSku();
		this.handleSpecs();
		if (this.$route.query.product_id) {
			this.loading = true;
			this.$nextTick(() => {
				this.specs = this.all_specs;
				this.sku = this.pro_sku;
				this.handleSku();
			});
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		}

	},
	methods: {
		handleSku() {
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
							specs_name: this.specs[0].component_label,
							specs_value: element.label,
						});
						specs1.push({
							specs_field: this.specs[1].component_field,
							specs_name: this.specs[1].component_label,
							specs_value: item.label
						});
						sku.push({
							specs: specs1,
							front_key: this.specs[0].component_field + "+" + element.value + "+" + this.specs[1].component_field + "+" + item.value,
							front: element.label + '-' + item.label,
						});
					});
				});
			} else if (this.specs.length > 0) {
				this.specs[0].values.forEach(element => {
					let specs1 = [];
					specs1.push({
						specs_field: this.specs[0].component_field,
						specs_name: this.specs[0].component_label,
						specs_value: element.label,
					});
					sku.push({
						specs: specs1,
						front_key: this.specs[0].component_field + "+" + element.label,
						front: element.label
					});
				});
			} else {
				let specs1 = [];
				sku.push({
					specs: [],
				});
			}
			sku.forEach(ele => {
				const v = this.pro_sku.find(it => {
					return it.front_key == ele.front_key;
				});
				if (!v) {
					this.hideList.push(ele);
				} else { this.selectList.push(ele); }
			});
		},
		handleAddStuff() {
			AddStuffs.popup({
				data: {
					specs: this.specs
				}
			}).then((res => {
				this.specs = res;
				if (this.specs.length) { this.handleSelectStuff(); } else {
					this.sku = [];
					this.sku.push({ specs: [], front_key: '' });
				}
			})).catch(err => {
				console.error(err);
			});
		},
		handleSelectStuff() {
			selectStuffs.popup({
				data: {
					specs: this.specs,
					sku: this.selectList,
					hide: this.hideList,
				}
			}).then((res => {
				this.selectList = res.sku;
				this.hideList = res.hide;
				this.handleSpecs();
			})).catch(err => {
				this.handleAddStuff();
			});
		},
		handleSubmit() {
			let sku = [];
			this.$refs.form.map(ele => {
				ele.$refs.formData.validate((valid) => {
					if (valid) {
						sku.push(ele.data);
					} else {
						return false;
					}
				});
				return sku;
			});
		},
		handleSpecs() {
			let	com = {
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
			let skuList = [...this.sku];
			this.sku = [];
			this.selectList.forEach(ele => {
				const q = this.hideList.find(it => {
					return it.front_key == ele.front_key;
				});
				if (q) { return; }
				const v = skuList.find(it => {
					return it.front_key == ele.front_key;
				});
				if (v) {
					this.sku.push(v);
				} else {
					this.sku.push({
						...ele,
					});
				}
			});





			if (this.selectList.length == 0) {
				this.sku.push({
					 ...com,
					 specs: []
				 });
			}
		},
		handleDelStuff(i, v) {
			Confirm.popup({
				title: '确认删除？',
				msg: '请问确定要删除吗？'
			 }).then(data => {
				 this.hideList.push(v);
				 this.sku.splice(i, 1);
				 if (!this.sku.length) {
					 this.specs = [];
					 this.sku = [];
					 this.sku.push({ specs: [], front_key: '' });
				 }
			}).catch(data => { });
		}
	}
};
</script>
<style lang="scss">
    .v-content-product-new-double-specs {
        min-width: 890px;
        ._add {
			cursor: pointer;
            display: inline-block;
            line-height: 40px;
            text-align: center;
			width:100%;
			height:40px;
			background:rgba(255,255,255,1);
			border:1px dashed #D4D7DB;
			border-radius:4px;
			color: #2397F9;
        }
        ._title {
            color: #333;
            height: 40px;
            line-height: 40px;
            background: #f0f4fc;
        }
        ._requrie::before {
            content: " *";
            display: inline-block;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
        }
		._table-content{
			border-bottom:1px solid #dcdee2;
		}
    }
</style>
