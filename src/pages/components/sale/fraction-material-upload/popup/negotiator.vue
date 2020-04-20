<template>
	<div class="v-sale-material-upload-negotiator">
		<i-form-item label="素材名称：" prop="tape_material_name">
			<i-input 
				v-model="formData.tape_material_name" 
				:maxlength="50"
				clearable
				placeholder="请输入录音时间+主述人+客户公司/品名"
				style="width: 300px"
			/>
		</i-form-item>
		<i-form-item label="录音日期：" prop="tape_date">
			<i-date-picker
				v-model="formData.tape_date"
				format="yyyy-MM-dd"
				type="date"
				clearable
				placeholder="请选择时间"
				style="width: 300px"
			/>
		</i-form-item>
		<i-form-item label="录音者：" prop="tape_person_id">
			<i-select
				v-model="formData.tape_person_id"
				:remote-method="(search)=>loadStaffList(search,'tape_person_list')"
				:loading="tape_person_list_loading"
				filterable
				remote
				transfer
				placeholder="请输入关键字搜索"
			>
				<i-option
					v-for="(item,index) in tape_person_list"
					:key="index"
					:value="item.staff_id"
				>{{ item.staff_name }}</i-option>
			</i-select>
		</i-form-item>
		<i-form-item label="客户信息：" prop="customer_info">
			<oa-limit-words 
				v-model="formData.customer_info"
				:max="200"
				clearable
				placeholder="公司、对方的姓名和职位"
				style="width: 300px;margin-bottom: 10px;"
			/>
		</i-form-item>
		<i-form-item label="客户基本情况：" prop="base_situation">
			<i-checkbox-group 
				v-model="formData.base_situation" 
				style="width: 300px;"
			>
				<i-checkbox 
					v-for="(item, index) in base_situations" 
					:key="index" 
					:label="item.value"
				>
					{{ item.name }}
				</i-checkbox>
			</i-checkbox-group>
		</i-form-item>
		<i-form-item label="客户产品：" prop="customer_product">
			<i-input 
				v-model="formData.customer_product" 
				:maxlength="50"
				clearable
				placeholder="请填写客户产品"
				style="width: 300px"
			/>
		</i-form-item>
		<i-form-item label="谈判手：" prop="negotiator_id">
			<i-select
				v-model="formData.negotiator_id"
				:remote-method="(search)=>loadStaffList(search,'negotiator_list')"
				:loading="negotiator_list_loading"
				filterable
				remote
				transfer
				placeholder="请输入关键字查询对应谈判手"
			>
				<i-option
					v-for="(item,index) in negotiator_list"
					:key="index"
					:value="item.staff_id"
				>{{ item.staff_name }}</i-option>
			</i-select>
		</i-form-item>
		<i-form-item label="沟通地点：" prop="communicate_place">
			<i-input 
				v-model="formData.communicate_place" 
				:maxlength="20"
				clearable
				placeholder="请填写沟通地点"
				style="width: 300px"
			/>
		</i-form-item>
		<i-form-item label="沟通结果：" prop="communicate_result">
			<oa-limit-words 
				v-model="formData.communicate_result"
				:max="200"
				clearable
				placeholder="请说明客户现场是否有签合同/打款合作、客户的认可情况、客户是否为决策人、是否需要回去告知等"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="业务流程：" prop="operation_flow">
			<oa-limit-words 
				v-model="formData.operation_flow"
				:max="200"
				clearable
				placeholder="请说明这个客户是第几次约见/沟通（如不是首次，请简述之前的沟通基本情况）、客户是否是参加了半天总裁策略班后的约见（或预约后的沟通等）"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="沟通前客户存在问题：" prop="customer_problem">
			<oa-limit-words 
				v-model="formData.customer_problem"
				:max="200"
				clearable
				placeholder="请说明客户面谈或者电话沟通前主要存在的问题是什么、此次沟通客户的意图是什么"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="面谈前同事做了什么：" prop="colleague_do">
			<oa-limit-words 
				v-model="formData.colleague_do"
				:max="200"
				clearable
				placeholder="请说明客户面谈前同事的价值传递做到什么程度"
				style="width: 300px"
			/>
		</i-form-item>
	</div>
</template>

<script>
import { Button, Input, FormItem, DatePicker, CheckboxGroup, Checkbox, Select, Option } from "iview";
import LimitWords from '@components/_common/limit-words/limit-words';
import * as Tools from "../tools";

export default {
	name: "oa-material-upload-negotiator",
	components: {
		"i-button": Button,
		"i-input": Input,
		"i-form-item": FormItem,
		'i-date-picker': DatePicker,
		"i-checkbox-group": CheckboxGroup,
		"i-checkbox": Checkbox,
		'oa-limit-words': LimitWords,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		formData: Object,
		tapeData: Object
	},
	data() {
		return {
			tape_person_list_loading: false,
			negotiator_list_loading: false,
			loadStaffList: Tools.loadStaffList,
			loadTapeData: Tools.loadTapeData,
			tape_person_list: [], // 录音者列表
			negotiator_list: [], // 谈判手列表
			base_situations: [], // 客户基本信息
		};
	},
	mounted() {
		this.loadTapeData('base_situation');
		if (this.tapeData) {
			for (let key in this.tapeData) {
				if (key in this.formData) {
					if (['tape_person_id', 'negotiator_id'].includes(key)) {
						this.formData[key] = +this.tapeData[key];
					} else {
						this.formData[key] = this.tapeData[key];
					}
				} else if (['tape_person', 'negotiator'].includes(key)) {
					this.loadStaffList(this.tapeData[key], `${key}_list`);
				}
			}
		}
	}
};

export const FractionMaterialUploadNegotiator = module.exports.default;

</script>

<style lang="scss">
.v-sale-material-upload-negotiator {
	.ivu-checkbox-wrapper {
		width: 75px;
		margin-right: 0;
	}
}
</style>

