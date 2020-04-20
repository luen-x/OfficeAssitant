<template>
	<div>
		<oa-title title="其他信息" class="v-hr-resume-title">
			<div class="g-m-l-20">
				<template v-if="edit">
					<span class="g-operation" @click="handleCancel">取消</span>
					<span class="g-operation g-m-l-10" @click="handleSave">保存</span>
				</template>
				<span v-else class="g-operation" @click="handleEdit">编辑</span>
			</div>
		</oa-title>
		<i-row>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.important_name"
					:rules="rules.important_name"
					label="紧急联系人:"
					prop="important_name">
					<i-input v-model="formValidate.important_name" :maxlength="10" style="width:300px" placeholder="请输入紧急联系人" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.important_phone"
					:rules="rules.important_phone"
					label="紧急联系人电话:"
					prop="important_phone">
					<i-input v-model="formValidate.important_phone" :maxlength="11" style="width:300px" placeholder="请输入紧急联系人电话" />
				</oa-form-item>
			</i-col>
			<!-- <i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.hobby"
					:rules="rules.hobby"
					label="个人特长:"
					prop="hobby">
					<i-input v-model="formValidate.hobby" :maxlength="20" style="width:300px" placeholder="请输入个人特长" />
				</oa-form-item>
			</i-col> -->
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.english_skills_name"
					:rules="rules.english_skills"
					label="外语能力:"
					prop="english_skills">
					<i-select v-model="formValidate.english_skills" clearable style="width:300px" placeholder="请选择外语能力">
						<i-option v-for="(item, index) in skillLevel" :key="index" :value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.computer_skills_name"
					:rules="rules.computer_skills"
					label="计算机能力:"
					prop="computer_skills">
					<i-select v-model="formValidate.computer_skills" clearable style="width:300px" placeholder="请选择计算机能力">
						<i-option v-for="(item, index) in skillLevel" :key="index" :value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.front_impression_name"
					:rules="rules.front_impression"
					label="对前台印象:"
					prop="front_impression">
					<i-select v-model="formValidate.front_impression" clearable style="width:300px" placeholder="请选择对前台印象">
						<i-option v-for="(item, index) in impression" :key="index" :value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.last_social_company"
					:rules="rules.last_social_company"
					label="上家社保单位:"
					prop="last_social_company">
					<i-input v-model="formValidate.last_social_company" :maxlength="50" style="width:300px" placeholder="请输入上家社保单位" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.social_suspension_date"
					:rules="rules.social_suspension_date"
					label="社保停缴月:"
					style="width:50%"
					prop="social_suspension_date">
					<i-date-picker
						v-model="formValidate.social_suspension_date"
						style="width:300px"
						type="month"
						format="yyyy-MM"
						placeholder="请选择社保停缴月"
						@on-change="handleChange"/>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:content="old.ali_sesame_credit"
					:rules="rules.ali_sesame_credit"
					label="芝麻信用分:"
					prop="ali_sesame_credit">
					<i-input-number v-model="formValidate.ali_sesame_credit" :max="9999" style="width:300px" placeholder="请输入数字" />
				</oa-form-item>
			</i-col>
		</i-row>
	</div>
</template>

<script>
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Cascader,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio,
	Button
} from 'iview';
import { services } from "@stores/services/hr";
import Title from "../_common/title";
import Item from './item';

export default {
	name: 'hr-recruit-social-resume',
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-cascader": Cascader,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-button": Button,
		"oa-title": Title,
		"oa-form-item": Item
	},
	mixins: [
		services.skillLevel(),
		services.impression()
	],
	props: {
		formValidate: Object,
		rules: Object | Array,
		old: Object
	},
	data() {
		return {
			edit: false,
		};
	},
	methods: {
		handleEdit() {
			this.edit = true;
			this.$emit('edit');
		},
		handleCancel() {
			this.edit = false;
			this.$emit('cancel');
		},
		handleSave() {
			this.$emit('save', {
				type: 4,
				cb: () => {
					this.edit = false;
				}
			});
		},
		handleChange(data) {
			this.formValidate.social_suspension_date = data;
		},
	}
};
</script>

<style lang="scss">
</style>


