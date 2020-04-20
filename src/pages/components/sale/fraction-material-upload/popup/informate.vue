<template>
	<div class="v-sale-material-upload-informate">
		<i-form-item label="素材名称：" prop="tape_material_name">
			<i-input 
				v-model="formData.tape_material_name" 
				:maxlength="50"
				clearable
				placeholder="输入录制的时间+主述人+客户公司/品名"
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
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="主述人：" prop="chief_prosecutor_id">
			<i-select
				v-model="formData.chief_prosecutor_id"
				:remote-method="(search)=>loadStaffList(search,'chief_prosecutor_list')"
				:loading="chief_prosecutor_list_loading"
				filterable
				remote
				transfer
				placeholder="请填写主述人"
			>
				<i-option
					v-for="(item,index) in chief_prosecutor_list"
					:key="index"
					:value="item.staff_id"
				>{{ item.staff_name }}</i-option>
			</i-select>
		</i-form-item>
		<i-form-item label="客户公司类型：" prop="company_type">
			<i-select 
				v-model="formData.company_type"
				placeholder="请选择"
				clearable
				transfer
				style="width: 300px"
			>
				<i-option 
					v-for="(item, index) in company_types" 
					:key="index" 
					:value="item.value"
				>
					{{ item.name }}
				</i-option>
			</i-select>
		</i-form-item>
		<i-form-item label="咨询信息：" prop="advisory_information">
			<oa-limit-words 
				v-model="formData.advisory_information"
				:max="200"
				clearable
				placeholder="请说明这是第几次预约咨询。如果不是第一次，请简述前几次预约咨询沟通的问题"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="预约目的：" prop="reservation_purpose">
			<oa-limit-words 
				v-model="formData.reservation_purpose"
				:max="200"
				clearable
				placeholder="请说明客户本次预约的主要目的的是什么、本次咨询主要帮客户解决了什么问题"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="客户所处阶段：" prop="customer_stage">
			<oa-limit-words 
				v-model="formData.customer_stage"
				:max="200"
				clearable
				placeholder="请说明目前客户做微商是处于哪个阶段"
				style="width: 300px"
			/>
		</i-form-item>
	</div>
</template>

<script>
import { Button, Input, FormItem, DatePicker, Select, Option } from "iview";
import LimitWords from '@components/_common/limit-words/limit-words';
import * as Tools from "../tools";

export default {
	name: "oa-material-upload-informate",
	components: {
		"i-button": Button,
		"i-input": Input,
		"i-form-item": FormItem,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords
	},
	props: {
		formData: Object,
		tapeData: Object
	},
	data() {
		return {
			tape_person_list_loading: false,
			chief_prosecutor_list_loading: false,
			loadStaffList: Tools.loadStaffList,
			loadTapeData: Tools.loadTapeData,
			tape_person_list: [], // 录音者列表
			chief_prosecutor_list: [], // 主述人列表
			company_types: [], // 公司类型
		};
	},
	mounted() {
		this.loadTapeData('company_type');
		if (this.tapeData) {
			for (let key in this.tapeData) {
				if (key in this.formData) {
					if (['tape_person_id', 'chief_prosecutor_id'].includes(key)) {
						this.formData[key] = +this.tapeData[key];
					} else {
						this.formData[key] = this.tapeData[key];
					}
				} else if (['tape_person', 'chief_prosecutor'].includes(key)) {
					this.loadStaffList(this.tapeData[key], `${key}_list`);
				}
			}
		}
	}
};

export const FractionMaterialUploadInformate = module.exports.default;

</script>

<style lang="scss">

</style>

