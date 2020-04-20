<template>
	<div>
		<oa-title title="教育信息" class="v-hr-resume-title">
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
					:rules="rules.college"
					:content="old.college"
					label="毕业院校:"
					prop="college">
					<i-input v-model="formValidate.college" :maxlength="55" style="width:300px" placeholder="请输入毕业院校" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.education"
					:content="old.education_name"
					label="学历:"
					prop="education">
					<i-select v-model="formValidate.education" clearable style="width:300px" placeholder="请选择学历">
						<i-option v-for="(item, index) in education" :key="index" :value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.graduate_time"
					:content="old.graduate_time"
					format="YYYY-MM"
					label="毕业时间:"
					prop="graduate_time">
					<i-date-picker
						v-model="formValidate.graduate_time"
						style="width:300px"
						type="month"
						format="yyyy-MM"
						placeholder="请选择毕业时间"
						@on-change="formValidate.graduate_time=$event" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.profession"
					:content="old.profession"
					label="专业:"
					prop="profession">
					<i-input v-model="formValidate.profession" :maxlength="20" style="width:300px" placeholder="请输入专业" />
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
		services.education()
	],
	props: {
		formValidate: Object,
		rules: Object,
		old: Object
	},
	data() {
		return {
			edit: false
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
				type: 3,
				cb: () => {
					this.edit = false;
				}
			});
		}
	}
};
</script>

<style lang="scss">
</style>


