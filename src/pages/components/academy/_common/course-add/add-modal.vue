<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="新建课程"
			class="v-academy-support-course-add-modal"
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
				<i-form-item label="课程大类:" prop="course_train">
					<i-radio-group v-model="formData.course_train" :style="{ width: '80%' }">
						<i-radio :label="1">岗前培训</i-radio>
						<i-radio :label="2">三立培训</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, Radio, RadioGroup } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';
import { PreModal } from '../../support-course/popup/pre-modal';

export default {
	name: 'v-academy-support-course-pre-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	props: {
		datas: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			visible: false,
			formData: {
				course_train: null,
			},
			formDataRule: {
				course_train: [{ type: 'number', required: true, message: '请选择课程大类', trigger: 'change' }]
			},
		};
	},
	watch: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {

		// 线下课程详情
		loadInfo() {

		},

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
			if (this.formData.course_train == 1) {
				PreModal.popup({
				}).then(res => {
				});
			} else {
				this.$router.push('/academy/support/course/add');
			}
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>