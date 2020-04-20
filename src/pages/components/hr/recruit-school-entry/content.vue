<template>
	<i-form 
		ref="form" 
		:model="formValidate" 
		:rules="ruleValidate" 
		:label-width="120"
		class="v-tpl-form"
		style="width: 500px" 
		position="left"
	>
		<i-form-item label="客户公司名称:" prop="name">
			<i-input v-model="formValidate.name" disabled placeholder="请输入客户公司名称" />
		</i-form-item>
		<i-form-item label="客户姓名:" prop="customer_name">
			<i-input v-model="formValidate.customer_name" placeholder="请输入客户姓名" />
		</i-form-item>
		<i-form-item label="客户合同公司:" prop="contact">
			<i-input v-model="formValidate.contact" placeholder="请填写合同签订公司" />
		</i-form-item>
		<i-form-item label="我方合同公司:" prop="my_company">
			<i-select 
				v-model="formValidate.my_company"
				clearable 
				placeholder="请选择我方合同公司"
			>
				<i-option 
					v-for="(item, index) in company" 
					:key="index" 
					value="item"
				>
					{{ item }}
				</i-option>
			</i-select>
			<span class="_right">添加</span>
		</i-form-item>
		<i-form-item label="成交时间" prop="deal_time">
			<i-date-picker 
				v-model="formValidate.deal_time" 
				style="width: 100%"
				type="datetime" 
				placeholder="请选择成交时间"
			/>
		</i-form-item>
		<i-form-item label="客户手机号" prop="mobile">
			<i-input 
				v-model="formValidate.mobile" 
				:maxlength="11"
				placeholder="请输入客户手机号"
			/>
		</i-form-item>
		<i-form-item label="不分单认证" prop="permit">
			<i-input 
				v-model="formValidate.permit" 
				placeholder="请输入认证验证码"
			/>
		</i-form-item>
		<i-form-item label="合同金额" prop="amount">
			<i-input-number
				v-model="formValidate.amount" 
				:min="0"
				:precision="2"
				style="width: 100%"
				placeholder="请输入合同金额"
			/>
		</i-form-item>
		<i-form-item 
			v-for="(item, index) in formValidate.items"
			:key="item.index"
			
			:label="index === 0 ? '缴款方式' : ''"
		>
			<i-form-item
				:prop="'items.' + index + '.date'" 
				:rules="{required: true, message: '请选择成交时间'}"
			>
				<i-date-picker 
					v-model="item.date" 
					style="width: 100%" 
					type="datetime"
					placeholder="请选择成交时间" 
				/>
			</i-form-item>
			<i-form-item 
				:prop="'items.' + index + '.pay_type'" 
				:rules="{required: true, message: '选择付款方式'}"
			>
				<i-cascader 
					:data="payType" 
					v-model="item.pay_type" 
					class="g-m-t-24"
					placeholder="选择付款方式"
				/>
			</i-form-item>
			<i-form-item 
				:prop="'items.' + index + '.amount'" 
				:rules="{required: true, message: '请输入付款金额'}"
			>
				<i-input-number
					v-model="item.amount" 
					:min="0"
					:precision="2"
					style="width: 100%; margin-top: 20px"
					placeholder="请输入付款金额"
				/>
			</i-form-item>
			<i-form-item
				:prop="'items.' + index + '.imgs'" 
				:rules="{required: true, message: '请选择图片'}"
			>
				<vc-imgs-picker v-model="item.imgs" class="g-m-t-24" />
			</i-form-item>
			
			<span
				class="_del" 
				@click="handleDel(item.index)"
			>
				删除
			</span>
		</i-form-item>
		<div class="g-flex-ac">
			<div style="width: 120px"/>
			<div class="btn" @click="handleAdd">Add Item</div>
		</div>
		<div class="g-flex-ac">
			<div style="width: 120px"/>
			<div class="btn g-m-t-20" @click="handleSubmit">提交</div>
		</div>
	</i-form>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message
} from 'iview';
// utils
import { dataValidity } from '@utils/utils';
import { ImgsPicker } from 'wya-vc';

const data = [
	{
		value: 'beijing',
		label: '北京',
		children: [
			{
				value: 'gugong',
				label: '故宫'
			},
			{
				value: 'tiantan',
				label: '天坛'
			},
			{
				value: 'wangfujing',
				label: '王府井'
			}
		]
	}, 
	{
		value: 'jiangsu',
		label: '江苏',
		children: [
			{
				value: 'nanjing',
				label: '南京',
				children: [
					{
						value: 'fuzimiao',
						label: '夫子庙',
					}
				]
			},
			{
				value: 'suzhou',
				label: '苏州',
				children: [
					{
						value: 'zhuozhengyuan',
						label: '拙政园',
					},
					{
						value: 'shizilin',
						label: '狮子林',
					}
				]
			}
		],
	}];

export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'vc-imgs-picker': ImgsPicker
	},
	data() {
		return {
			company: ['阿里', '有赞', '网易', '滴滴'],
			payType: data,
			index: 1,
			formValidate: {
				name: 'xxxxx',
				customer_name: '',
				contact: '',
				my_company: '',
				deal_time: '',
				mobile: '',
				permit: '',
				amount: null,
				items: [
					{
						index: 1,
						date: '',
						pay_type: [],
						amount: null,
						imgs: []
					}
				]
			},
			ruleValidate: {
				name: [
					{ required: true, message: '请输入客户公司名称' }
				],
				customer_name: [
					{ required: true, message: '请输入客户姓名' }
				],
				contact: [
					{ required: true, message: '请填写合同签订公司' }
				],
				my_company: [
					{ required: true, message: '请选择我方合同公司', trigger: 'change' }
				],
				deal_time: [
					{ required: true, type: "date", message: '请选择成交时间', trigger: 'change' }
				],
				mobile: [
					{ required: true, message: '请输入客户手机号', trigger: 'blur' }, 
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity }
				],
				permit: [
					{ required: true, message: '请输入认证验证码' }
				],
				amount: [
					{ required: true, type: 'number', message: '请输入合同金额' }
				]
			}
		};
	},
	mounted() {
	},
	methods: {
		handleAdd() {
			this.index++;
			this.formValidate.items.push({
				index: this.index,
				date: '',
				pay_type: [],
				amount: null
			});
		},
		handleDel(index) {
			this.formValidate.items = this.formValidate.items.filter((item) => {
				return item.index !== index;
			});
		},
		handleSubmit(name) {
			this.$refs.form.validate((isValid) => {
				if (isValid) {
					Message.success('Success!');
				} else {
					Message.error('Fail!');
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-tpl-form {
	.btn {
		color: #0085ff;
		cursor: pointer;
	}
	._right {
		@extend .btn;
		position: absolute; 
		right: -30px; 
		top: 0;
	}
	._del {
		@extend .btn;
		display: block;
		margin-top: 24px;
	}
}
</style>
