<template>
	<div class="v-sale-cus-form">
		<slot :data="priceCost" />
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="formRule" 
			:label-width="144" 
			inline
		>
			<div :class="configs.mode==='small'?'_block-small':'_block'">
				<!-- 优先单独显示规格 -->
				<template v-if="specs">
					<i-form-item 
						v-for="(item) in specs" 
						:label="item.label +'：'" 
						:key="item.field" 
						:prop="item.field">
						<i-select 
							v-model="formData[item.field]" 
							:placeholder="'请选择'+item.label" 
							:transfer="true"
							:clearable="true"
							@on-change="handleSpecChange(item.field,$event)"
						>
							<i-option 
								v-for="option in item.values" 
								:key="option.specs_value" 
								:value="option.specs_value"
								:disabled="option.disabled"
							>
								{{ option.specs_name }}
							</i-option>
						</i-select>
					</i-form-item>
				</template>
				<!-- 成本分期时，优先单独显示实扣成本 -->
				<i-form-item 
					v-if="isCostInstalment"
					key="cost_amount"
					label="实扣成本：" 
					prop="cost_amount"
				>
					<span class="_number-append">元</span>
					<i-input-number
						v-model="formData.cost_amount"
						:min="0"
						:max="999999999" 
						placeholder="请输入实扣成本"
					/>
				</i-form-item>

				<oa-form-item
					v-for="(item,index) in configs.list"
					:key="index"
					:config="item"
					:form-data="formData"
					@change="handleChange"
				/>
			</div>
		</i-form>
		<slot name="footer"/>
	</div>
</template>

<script >
import { Form, FormItem, InputNumber, RadioGroup, Radio, Select, Option } from 'iview';
import { dataValidity } from "@utils/utils";
import moment from 'moment';
import CusFormItem from './cus-form-item';

const ruleConfig = {
	email: [{ type: 'validEmail', message: '邮箱格式不正确', validator: dataValidity, trigger: 'blur' }],
	customer_mailbox: [{ type: 'validEmail', message: '邮箱格式不正确', validator: dataValidity, trigger: 'blur' }],
	boss_tel: [{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: 'blur' }],
	contact_tel: [{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: 'blur' }],
	mp_administrator_phone: [{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: 'blur' }],
	// mp_account: [{ type: 'validWeChat', validator: dataValidity, message: '请输入正确的微信号', trigger: "blur" }],
};
const arrayType = ['checkbox-group', 'checkbox-group-input', 'img-picker', 'region'];
export const getItemType = (component_type, check_type, has_other) => {
	component_type = +component_type;
	check_type = +check_type;
	has_other = +has_other;
	switch (component_type) { 
		case 1: return 'select';
		case 2: return 'input';
		case 3: return 'limit-words';
		case 4: return 'date-picker';
		case 5: return 'date-time-picker';
		case 6: return 'img-picker';
		case 7: if (check_type == 1) {
			if (has_other) {
				return 'radio-group-input';
			} else {
				return 'radio-group';
			}
		} else if (has_other) {
			return 'checkbox-group-input';
		} else {
			return 'checkbox-group';
		}
		case 8: return "region";
		case 9: {
			if (check_type == 1) {
				return "remote-select-single";
			} else {
				return "remote-select-muti";
			}
		}
		default:
			console.error('unknow component_type', component_type);
			return 0;
	}
};
export const getRuleType = (componentType, checkType) => {
	componentType = +componentType;
	checkType = +checkType;
	switch (componentType) {
		case 1: return 'string';
		case 2:
			return 'string';
		case 3:
			return 'string';
		case 4: return 'date';
		case 5: return 'date';
		case 6: return 'array';
		case 7: if (checkType == 1) {
			return 'string';
		} else return 'array';
		case 8: return "array";
		case 9: if (checkType == 1) {
			return 'string';
		} else return 'array';
		default: console.error('unkonw componentType', componentType);
	}

};
export const getRules = (item) => {
	let trigger = (item.component_type == 2 || item.component_type == 3) ? 'blur' : "change";
	let rules = [];
	
	if (item.required == '1') {
		let pre = '';
		if (item.component_type == 6) {
			pre = "请上传";
		} else if (trigger === 'change') {
			pre = '请选择';
		} else {
			pre = '请输入';
		}
		if (item.component_type == 7) {
			const rule = { 
				required: true, 
				message: pre + item.component_label, 
				trigger,
				transform(val) {
					if (val === undefined) return undefined;
					return val + '';
				}
			};
			rules.push(rule);
		} else {
			rules.push({ 
				required: true, 
				type: getRuleType(item.component_type, item.check_type), 
				message: pre + item.component_label, 
				trigger,
			});
		}

	}
	if (trigger === 'change') return rules;
	if (ruleConfig[item.component_field]) {
		rules = [...rules, ...ruleConfig[item.component_field]];
		return rules;
	}
	const data = JSON.parse(item.data || '[]');
	if (data.length >= 4) {
		return rules;
	}
	if (data.length === 0) return rules;
	const arr = [
		{ label: "[\u4e00-\u9fa5]", value: '中文' },
		{ label: "[a-zA-Z]", value: '英文' },
		{ label: "[0-9.]", value: '数字' },
		{ label: "[·`~!_@#$%^&*()=|+-{}'\":;',\\[\\].<>/?~！@#￥……&*（《》）——|{}【】‘；：”“'。，、？\\s\\r\\n\\t]", value: '特殊字符' }
	];
	let message = '请输入' + data.map(it => {
		return arr[parseInt(it.value, 10)].value;
	}).join('或');
	let regexs = data.map(it => {
		return arr[parseInt(it.value, 10)].label;
	});
	const reg = new RegExp("^(" + regexs.join('|') + ')+$');
	rules.push(
		{ 
			message,
			pattern: reg,
			trigger, 
		}
	);

	return rules;
};
export const getFormatValue = (item) => {
	let targetValue = item.component_value;
	if (item.component_type == 7) {
		if (item.check_type == 1) { // 单选
			if (targetValue !== undefined) {
				targetValue += '';
				if (targetValue.includes('other_')) {
					targetValue = targetValue.replace('other_', '');
				} else {
					targetValue = ("value_" + targetValue);
				}
			}
		} else if (item.check_type == 2) { // 多选
			if (Array.isArray(targetValue)) {
				for (let i = 0; i < targetValue.length; i++) {
					targetValue[i] += '';
					if (targetValue[i].includes('other_')) {
						targetValue[i] = targetValue[i].replace('other_', '');
					} else {
						targetValue[i] = "value_" + targetValue[i];
					}
				}
			} else {
				// console.error("checkboxGroup'value should be an array, but got " + temp.value, item);
				targetValue = [];
			}
		}
	} else if (item.component_type == 8) {
		targetValue = (targetValue || []).filter(i => i !== null && i !== undefined).map(val => +val);
	} else if (item.component_type == 6) {
		targetValue = (targetValue || []).filter(i => i !== null && i !== undefined);
	} else if (item.component_type == 9) {
		if (item.check_type == 1 && targetValue) {
			targetValue += '';
		} else if (item.check_type == 2) {
			targetValue = (targetValue || []).filter(i => i !== null && i !== undefined).map(i => i + '');
		}
	}
	return targetValue || '';

};
/**
 * 处理后端返回的数据返回组件想要的config
 */
export const formatProductDetail = (productComponent, productId, parentProductId, option = {}) => {
	const configs = {
		product_id: productId,
		payment_amount: option.payment_amount,
		cost_amount: option.cost_amount,
		need_amount: option.need_amount,
		is_cost_instalment: option.is_cost_instalment,
		price_unit_name: option.price_unit_name || '',
		project_id: option.project_id || 0,
		parent_product_id: parentProductId || 0,
		has_sku: option.has_sku,
		sku: option.sku || [],
		selected_sku: option.selected_sku,
		is_gift: option.is_gift || false,
		can_gift: option.can_gift,
		list: productComponent.map(item => {
			const temp = {
				itemType: 'input',
				label: "label",
				placeholder: '请输入',
				disabled: false,
				prop: 'input',
				rule: [],
				max: 12,
			};
			temp.itemType = getItemType(item.component_type, item.check_type, item.has_other);
			temp.label = item.component_label;
			temp.disabled = !!item.disabled;
			temp.placeholder = item.placeholder;
			temp.prop = item.component_field;
			temp.value = item.component_value;
			temp.upload_example = item.upload_example;
			// 格式化value
			temp.value = getFormatValue(item);
			temp.rule = getRules(item);
			temp.options = JSON.parse(item.data || '[]').filter(Boolean);
			// 格式化option，value全部转为字符串，当component_type == 7,把不是other_开头的数据添加value_前缀
			
			temp.options.forEach(op => {
				op.value += '';
				if (item.component_type == 7) {
					
					op.value = 'value_' + op.value;
					
					
				}
			});
			temp.max = item.input_limit;
			if (item.component_type == 6) {
				temp.max = item.upload_limit;
			} else {
				temp.max = item.input_limit;
			}
			return temp;
		})
	};
	return configs;
};

// 给后端数据时如果has_other,添加other_
export const formatCheckValue = (item) => {
	if (item.component_type == 7) {
		if (item.check_type == 1) {
			if (item.component_value.startsWith('value_')) {
				item.component_value = item.component_value.replace('value_', '');
			} else {
				item.component_value = 'other_' + item.component_value;
			}
			
		} else if (item.check_type == 2) {
			for (let i = 0; i < item.component_value.length; i++) {
				if (item.component_value[i].startsWith('value_')) {
					item.component_value[i] = item.component_value[i].replace('value_', '');
				} else { 
					item.component_value[i] = 'other_' + item.component_value[i];
				}
				
			}
		}
	}
	return item.component_value;
};
export const getOutputValue = ({ component_type, check_type, component_value }) => {
	if (!component_value) {
		if (component_type == 6 || (component_type == 7 && check_type == 2) || component_type == 8 || (component_type == 9 && check_type == 2)) {
			component_value = [];
		} else {
			component_value = '';
		}
	}
	if (component_type == 7) {
		if (check_type == 1) {
			if (component_value.startsWith('value_')) {
				component_value = component_value.replace('value_', '');
			} else {
				component_value = 'other_' + component_value;
			}
			
		} else if (check_type == 2) {
			for (let i = 0; i < component_value.length; i++) {
				if (component_value[i].startsWith('value_')) {
					component_value[i] = component_value[i].replace('value_', '');
				} else { 
					component_value[i] = 'other_' + component_value[i];
				}
				
			}
		}
	} else if (component_type == 4) {
		component_value && (component_value = moment(component_value).format("YYYY-MM-DD"));
	} else if (component_type == 5) {
		component_value && (component_value = moment(component_value).format("YYYY-MM-DD HH:mm:ss"));
	}
	return component_value;
};
export const getOutputOption = (component, configs) => {
	const item = { ...component };
	item.data = item.data || '[]';
	if (item.component_type == 9) {
		const curField = configs.list.find(field => {
			return field.prop == item.component_field;
		});
		item.data = JSON.stringify(curField.options);

	} else if (item.component_type == 8) { // app端需要data中有地址信息
		const curField = configs.list.find(field => {
			return field.prop == item.component_field;
		});
		curField && (item.data = JSON.stringify(curField.options));
	} else if (item.component_type == 7) {
		// 这里本来就是后端给的json字符串，不用改，不会把other_的数据存到data里

	}
	return item.data;

};

// 给后端数据时，如果时远程搜索的组件，要在data里添加选中的options
export const formatOptions = (item, configs) => {
	item.data = item.data || '[]';
	if (item.component_type == 9) {
		const curField = configs.list.find(field => {
			return field.prop == item.component_field;
		});

		if (item.check_type == 2) { // 多选
			item.data = item.component_value.map(val => {
				
				const selectOption = curField.options.filter(i => i).find(op => op.value == val);
				return selectOption;

			});
			item.data = JSON.stringify(item.data);
		} else if (item.check_type == 1) { // 单选
			const _option = curField.options.filter(i => i).find(op => op.value == item.component_value);
			
			item.data = _option ? [_option] : [];
			item.data = JSON.stringify(item.data);
		}

	} else if (item.component_type == 8) { // app端需要data中有地址信息
		const curField = configs.list.find(field => {
			return field.prop == item.component_field;
		});
		curField && (item.data = JSON.stringify(curField.options));
	} else if (item.component_type == 7) {
		// 这里本来就是后端给的json字符串，不用改，不会把other_的数据存到data里

	}
};


export default {
	name: 'oa-form',
	components: {
		'i-form': Form,
		'oa-form-item': CusFormItem,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		configs: Object,
		collection: Array,
		sku: Array,
		specs: Array,
		isCostInstalment: [Boolean, Number]

	},
	data() {
		let formData = {};
		let formRule = {

		};
		if (this.specs && this.specs.length > 0) {
			this.specs.forEach(sp => {
				formData[sp.field] = '';
				formRule[sp.field] = [{ required: true, type: 'number', message: "请选择" + sp.label, trigger: 'change' }];
			});
			if (this.configs.selected_sku) {
				this.configs.selected_sku.forEach(sk => {
					formData[sk.specs_field] = sk.specs_value;
				});
			}
		}
		if (this.isCostInstalment) {
			formData.cost_amount = this.configs.cost_amount ? +this.configs.cost_amount : null;
			formRule.cost_amount = [{ required: true, type: 'number', message: "请输入实扣成本", trigger: 'blur' }];
		}
		
		this.configs.list.forEach((item) => {
			formRule[item.prop] = item.rule;
			if (item.value !== undefined) {
				formData[item.prop] = item.value; 
				if (typeof formData[item.prop] == 'number') {
					formData[item.prop] += '';
				}
			} else if (item.itemType === 'input-number') formData[item.prop] = undefined;
			else if (arrayType.includes(item.itemType)) {
				formData[item.prop] = [];
			} else {
				formData[item.prop] = undefined;
			}
		});
		if (formRule.promote_lecturer) {
			formRule.promote_lecturer.push({
				validator: (rule, value, callback) => {
					if (value && value.length > 4) {
						return callback('促单讲师不能超过4个');
					} else {
						callback();
					}
				}, 
				trigger: 'change'
			 });
		}
		return {
			formData,
			formRule
		};
	},
	computed: {
		selectedSku() {
			if (this.configs.sku.option) {
				return this.configs.sku.option.find(_option => {
					return 	_option.sku_value == this.formData[_option.sku_field];
				});
			} else {
				return undefined;
			}
			
		},
		priceCost() {
			if (this.configs.has_sku) {
				const selectedSku = this.sku.find(sk => {
					return !this.specs.find(sp => { // 如果找到了一个值不同的则表示不是该规格，如果所有值都相同则返回undefined，取反后为true
						return sk.specsObj[sp.field] !== this.formData[sp.field];
					});	
				});

				if (!selectedSku) {
					return { price: '', cost: '', sku_id: '' };
				} else {
					return {
						price: selectedSku.price + selectedSku.price_unit_name,
						cost: selectedSku.cost ? (selectedSku.cost + selectedSku.price_unit_name) : '',
						sku_id: selectedSku.sku_id,
						cost_type: selectedSku.cost_type,
						cost_tips: selectedSku.cost_tips
					};
				}
			} else {
				const sk = this.sku && this.sku.length > 0 && this.sku[0];
				if (!sk) {
				// 	console.error('产品信息缺少规格');
					return { price: '', cost: '' };
				} else {
					return {
						price: sk.price + sk.price_unit_name,
						cost: sk.cost ? (sk.cost + sk.price_unit_name) : '',
						sku_id: sk.sku_id,
						cost_type: sk.cost_type,
						cost_tips: sk.cost_tips
					};
				}
			}
		},
	},
	created() {
		this.collection && this.collection.push(this);
	},
	methods: {
		parseInt(num) {
			return parseInt(num, 10);
		},
		getForm() {
			return this.$refs.form;
		},
		getFormData() {
			return this.formData;
		},
		getConfigs() {
			return this.configs;
		},
		handleChange(val) {
			this.$emit("change", val);
		},
		validateImgs() {
			const coms = this.configs.list.filter(item => {
				return item.componentType == 6;
			});
			const com = coms.find(item => {
				return this.formData[item.prop].find(it => {
					return it.uid;
				});
			});
			return com;
		},
		handleSpecChange(field, value) {
			const otherFileds = this.specs.filter(sp => sp.field != field);
			otherFileds.forEach(sp => {
				sp.values.forEach(option => {
					if (!value) {
						option.disabled = false;
						return;
					}
					const exist = this.sku.find(sk => {
						return this.specs.find(sp_ => { // 存在值同的
							return sk.specsObj[sp_.field] == this.formData[sp_.field] && sk.specsObj[option.specs_field] == option.specs_value;
						});
					});
					option.disabled = !exist;

				});
			});
		}
	},
};
</script>

<style  lang="scss">
.v-sale-cus-form {
    ._block-small{
        .ivu-form-item {
            width: 285px;
            &:nth-of-type(2n-1) {
                margin-right: 55px;
            }
        }
    }
    ._block {
        .ivu-form-item {
            width: 444px;
            &:nth-of-type(2n-1) {
                margin-right: 25px;
            }
        }
    }
    .ivu-input-number {
        width: 100%;
        .ivu-input-number-handler-wrap {
            display: none;
        }
    }

    .ivu-radio-group {
        display: flex;
         justify-content: start;
        flex-wrap: wrap;
        .ivu-radio-group-item {
            margin-right: 26px;
            // margin-left: 10px;
        }
    }
    .ivu-date-picker{
        width: 100%;
    }
    .ivu-checkbox-group {
        display: flex;
        // justify-content: space-around;
        flex-wrap: wrap;
        .ivu-checkbox-group-item {
            margin-right: 26px;
            // margin-left: 18px;
        }
	}
	.ivu-cascader{
		width: 100%
	}
    ._number-append {
        display: inline-block;
        position: absolute;
        right: 7px;
        vertical-align: bottom;
        z-index: 1;
        color: gray;
	}
	._footer {
		width: calc(100% - 160px);
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		text-align: center;
		.ivu-btn{
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
