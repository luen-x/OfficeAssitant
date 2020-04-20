<template>
	<div>
		<oa-title title="个人资料" class="v-hr-resume-title">
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
					:rules="rules.applicant_name"
					:content="old.applicant_name"
					label="姓名:"
					prop="applicant_name">
					<i-input v-model="formValidate.applicant_name" :maxlength="10" style="width:300px" placeholder="请输入姓名" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.sex"
					:content="old.sex == 0 ? '男' : '女'"
					label="性别:"
					prop="sex">
					<i-radio-group v-model="formValidate.sex">
						<i-radio label="0">男</i-radio>
						<i-radio label="1">女</i-radio>
					</i-radio-group>
				</oa-form-item>
			</i-col>
			<i-col span="12" class="__height">
				<oa-form-item
					:edit="edit"
					:rules="rules.height"
					:content="old.height"
					label="身高:"
					prop="height">
					<i-input v-model="formValidate.height" :maxlength="3" style="width:300px" placeholder="请输入身高" />
					<span class="__cm">cm</span>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.blood"
					:content="old.blood_name"
					label="血型:"
					prop="blood">
					<i-select v-model="formValidate.blood" clearable placeholder="请选择血型" style="width:300px">
						<i-option v-for="(item, index) in bloodArray" :key="index" :value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.hobby"
					:content="old.hobby"
					label="爱好/特长:"
					prop="hobby">
					<i-input v-model="formValidate.hobby" :maxlength="20" style="width:300px" placeholder="请输入爱好/特长" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.position_id"
					:content="old.position_name"
					label="应聘职位:"
					prop="position_id"
				>
					<i-cascader
						v-model="formValidate.position_id"
						:data="recruitDePosition"
						change-on-select
						style="width:300px; display: inline-block"
						clearable
						transfer
						filterable
						trigger="hover"
						placeholder="请选择应聘职位" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.salary"
					:content="old.salary"
					label="期望薪资:"
					prop="salary">
					<i-input v-model="formValidate.salary" :maxlength="20" style="width:300px" placeholder="请输入期望薪资元/月" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.mobile"
					:content="old.mobile"
					label="手机号码:"
					prop="mobile">
					<i-input v-model="formValidate.mobile" :maxlength="11" style="width:300px" placeholder="请输入手机号码" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.wechat"
					:content="old.wechat"
					label="微信号:"
					prop="wechat">
					<i-input v-model="formValidate.wechat" :maxlength="20" style="width:300px" placeholder="请输入微信号" />
				</oa-form-item>
			</i-col>
			<i-col span="12">
				<oa-form-item
					:edit="edit"
					:rules="rules.email"
					:content="old.email"
					label="邮箱:"
					prop="email">
					<i-input v-model="formValidate.email" :maxlength="50" style="width:300px" placeholder="请输入邮箱" />
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
		services.bloodArray(),
		services.recruitDePosition()
	],
	props: {
		formValidate: Object,
		rules: Object,
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
				type: 1,
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


