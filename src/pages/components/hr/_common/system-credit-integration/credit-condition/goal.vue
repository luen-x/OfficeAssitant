<template>
	<div class="v-integration-condition-goal">
		<template v-if="['1', '2', '3', '4', '5', '6'].some(item => item === id)">
			<span v-if="['1', '2', '5'].some(item => item === id)">本人</span>
			<i-formitem 
				v-else
				:rules="validator.object" 
				:prop="prop + '.object'">
				<i-select
					v-model="rules.object"
					:disabled="disabled"
					placeholder="选择对象"
					transfer
					style="width: 220px;"
				>
					<i-option
						v-for="item of arrHandle"
						:key="item.value"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</i-formitem>
			<span v-if="id === '1'">每次完成必修课学习所获得学分为</span>
			<span v-if="id === '2'">每次必修课首次考试通关时，所获得学分为</span>
			<span v-if="id === '3'">必修课开课后超过一个月,</span>
			<span v-if="id === '3'">每有一人有未通关必修课即获得</span>
			<span v-if="id === '4'">本月必修课通关时比例</span>
			<i-formitem 
				v-if="id === '4'"
				:rules="validator.percent_type" 
				:prop="prop + '.percent_type'">
				<i-select 
					v-model="rules.percent_type" 
					:disabled="disabled"
					style="width: 220px" 
					clearable 
					transfer
					placeholder="请选择"
				>
					<i-option :value="1">大于等于</i-option>
					<i-option :value="2">小于</i-option>
				</i-select>
			</i-formitem>
			<i-formitem 
				v-if="id === '4'" 
				:rules="validator.pass_percent"
				:prop="prop + '.pass_percent'">
				<i-input-number
					v-model="rules.pass_percent"
					:disabled="disabled"
					:max="100"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			<span v-if="id === '4'">%时，所获得学分为</span>
			<span v-if="id === '5'">本人每次选修课凭证审核通过或者选修课通关后，所获得的学分为</span>
			<span v-if="id === '6'">未获得任何选修课学分，所获得的学分为</span>
			<i-formitem 
				:rules="validator.point"
				:prop="prop + '.point'"
			>	
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					:placeholder="['1', '2', '4', '5'].some(item => item === id) ? '输入数字' : '输入负数'"
					style="width: 100px;"
				/>
				分
				<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
			</i-formitem>
		</template>
		<template v-if="id === '7'">
			上传了
			<i-formitem :rules="validator.material_use" :prop="prop + '.material_use'">
				<i-select 
					v-model="rules.material_use" 
					:disabled="disabled"
					style="width: 220px" 
					clearable 
					transfer
					placeholder="请选择素材用途"
				>
					<i-option 
						v-for="(item, index) in type"
						:key="index"
						:value="item.value"
					>
						{{ item.name }}
					</i-option>
				</i-select>
			</i-formitem>
			素材，并经过人事审核后
			<i-formitem :rules="validator.material_person_type" :prop="prop + '.material_person_type'">
				<i-select 
					v-model="rules.material_person_type" 
					:disabled="disabled"
					style="width: 220px" 
					clearable 
					transfer
					placeholder="请选择"
				>
					<i-option :value="1">提供者</i-option>
					<i-option :value="2">分享者</i-option>
				</i-select>
			</i-formitem>
			所获得学分为
			<i-formitem :rules="validator.point" :prop="prop + '.point'">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-if="id === '9'">
			学分排名在
			<i-formitem :rules="validator.credit_rank_from" :prop="prop + '.credit_rank_from'">
				<i-input-number
					v-model="rules.credit_rank_from"
					:disabled="disabled"
					:max="999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			名到
			<i-formitem :rules="validator.credit_rank_to" :prop="prop + '.credit_rank_to'">
				<i-input-number
					v-model="rules.credit_rank_to"
					:disabled="disabled"
					:max="999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			名时，所获得学分为
			<i-formitem :rules="validator.point" :prop="prop + '.point'">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-if="id === '10'">
			<i-formitem :rules="validator.audit_type" :prop="prop + '.audit_type'">
				<i-input
					v-model="rules.audit_type"
					:disabled="disabled"
					:maxlength="8"
					style="width: 220px;"
					placeholder="请输入审核类型"
				/>
			</i-formitem>
			通过后，获取学分
			<i-formitem :rules="validator.point" :prop="prop + '.point'">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-if="id === '8'">
			培训开课条件项，通过手动评分进行评定
		</template>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, InputNumber } from 'iview';
import Rules from './rules';

export default {
	name: 'hr-integration-condition-goal',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber
	},
	mixins: [Rules],
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		},
		prop: String,
		disabled: Boolean
	},
	data() {
		return {
			rules: this.formdata,
			// arr: [
			// 	{
			// 		label: '本人',
			// 		value: 1
			// 	},
			// 	{
			// 		label: '徒弟',
			// 		value: 2
			// 	},
			// 	{
			// 		label: '下属员工',
			// 		value: 3
			// 	},
			// 	{
			// 		label: '下属管理',
			// 		value: 4
			// 	}
			// ],
			arrOther: [
				{
					label: '徒弟',
					value: 2
				},
				{
					label: '下属员工',
					value: 3
				},
				{
					label: '下属管理',
					value: 4
				}
			],
			arrThree: [
				{
					label: '本人',
					value: 1
				},
				{
					label: '徒弟',
					value: 2
				},
				{
					label: '下属员工',
					value: 3
				}
			],
			type: [],
			objectArr: []
		};
	},
	computed: {
		arrHandle() {
			const obj = {
				3: this.arrThree,
				4: this.arrOther,
				6: this.arrThree
			};
			return obj[this.id] || this.arr;
		}
	},
	watch: {
		formdata(val) {
			if (this.disabled) {
				this.rules = val;
			}
		}
	},
	mounted() {
		this.id === '7' && this.loadType();
	},
	methods: {
		loadType() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_SYSTEM_RANK_MARIERIAL_TYPE_GET',
				type: 'GET',
			}).then(res => {
				this.type = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadObject() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_SYSTEM_RANK_MARIERIAL_TYPE_GET',
				type: 'GET',
			}).then(res => {
				this.objectArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-integration-condition-goal{
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
	}
}
</style>


