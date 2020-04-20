<template>
	<div class="v-sale-material-upload-train">
		<i-form-item label="素材名称：" prop="tape_material_name">
			<i-input 
				v-model="formData.tape_material_name" 
				:maxlength="50"
				clearable
				placeholder="请输入录制的时间+主述人+本次培训主题"
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
		<i-form-item label="主述人：" prop="chief_prosecutor_id">
			<i-select
				v-model="formData.chief_prosecutor_id"
				:remote-method="(search)=>loadStaffList(search,'chief_prosecutor_list')"
				:loading="chief_prosecutor_list_loading"
				filterable
				remote
				transfer
				placeholder="请输入关键字搜索"
			>
				<i-option
					v-for="(item,index) in chief_prosecutor_list"
					:key="index"
					:value="item.staff_id"
				>{{ item.staff_name }}</i-option>
			</i-select>
		</i-form-item>
		<i-form-item label="培训主题：" prop="train_theme">
			<i-input 
				v-model="formData.train_theme" 
				:maxlength="50"
				clearable
				placeholder="请填写培训主题"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="培训大纲：" prop="train_program">
			<oa-limit-words 
				v-model="formData.train_program"
				:max="200"
				clearable
				placeholder="请填写本次培训的主要内容大纲"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="培训对象：" prop="train_object">
			<oa-limit-words 
				v-model="formData.train_object"
				:max="200"
				clearable
				placeholder="请填写本次培训的主要学习对象"
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
	name: "oa-material-upload-train",
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
			tape_person_list: [], // 录音者列表
			chief_prosecutor_list: [], // 主述人列表
		};
	},
	mounted() {
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

export const FractionMaterialUploadTrain = module.exports.default;

</script>

<style lang="scss">

</style>

