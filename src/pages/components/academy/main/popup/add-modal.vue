<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="edit ? '编辑课程' : '添加课程'"
			:width="400"
			:mask-closable="false"
			class="v-academy-train-schedule-add-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item key="course_type" label="课程大类:" prop="course_type">
					<i-select
						v-model="formData.course_type"
						:disabled="edit && formData.course_type !== 1"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择课程大类"
					>
						<i-option :value="1">培训课程</i-option>
						<i-option :value="3">公司大课</i-option>
						<i-option :value="4">其它</i-option>
					</i-select>
				</i-form-item>
				<!-- 大课培训 -->
				<i-form-item v-if="formData.course_type == 1" label="" prop="course_train">
					<i-radio-group v-model="formData.course_train" :style="{ width: '80%' }">
						<i-radio :label="1">三立培训</i-radio>
						<i-radio :label="2">三立训练</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item 
					v-if="formData.course_type !== 1"
					key="course_name"
					ref="course_name" 
					label="课程名称:"
					prop="course_name"
				>
					<i-input 
						v-model="formData.course_name"
						:maxlength="30"
						style="width:220px"
						placeholder="请输入课程名称"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, Select, Option, Radio, RadioGroup, InputNumber, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	mixins: [
		commonServices.region()
	],
	props: {
		data: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Boolean,
			default: false
		},
		date: String,
		course_type: Number,
		course_name: String
	},
	data() {
		return {
			visible: false,
			formData: {
				course_type: this.course_type || 1,
				course_name: this.course_name || '',
				course_train: null,
			},
			formDataRule: {
				course_type: [{ type: 'number', required: true, message: '请选择课程大类', trigger: 'change' }],
				course_name: [{ type: 'string', required: true, message: '请填写课程名称', trigger: 'blur' }],
				course_train: [{ type: 'number', required: true, message: '请选择培训或训练类型', trigger: 'change' }]
			},
		};
	},
	watch: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			if (this.formData.course_type == 1) {
				let router = this.formData.course_train == 1
					? '/academy/train/plan/train' : '/academy/train/plan/manage';
				this.$router.push({
					path: router,
					query: {
						date_time: this.date,
						type: this.$route.query.type,
						depart_id: this.$route.query.depart_id
					}
				});
			} else {
				let obj = {
					course_name: this.formData.course_name,
					course_type: this.formData.course_type,
					course_date: this.date,
					type: this.$route.query.type || 1
				};
				this.edit ? obj.course_schedule_id = this.data.course_schedule_id : '';
				this.$request({
					url: '_ACADEMY_MAIN_SCHEDULE_COURSE_ADD_POST',
					type: "POST",
					param: obj,
					loading: false
				}).then((res) => {
					let msg = this.edit ? '编辑成功' : '添加成功';
					this.$Message.success(msg);
					this.$emit('sure');
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-train-schedule-add-modal{
	.ivu-form-item{
		margin-bottom: 5px !important;
	}
}
</style>