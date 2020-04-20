<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="电话沟通进度"
			class="v-hr-tel-progress-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form 
				ref="form" 
				:model="formdata" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20">
				<i-form-item label="电话沟通进度:" prop="communication_progress">
					<oa-limit-words
						v-model="formdata.communication_progress"
						:max="500"
						width="220px"
						placeholder="请输入电话沟通进度"
					/>
					<!-- type="daterange" -->
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: 'hr-recruit-remark-modal',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		meeting_id: {
			type: Number | String,
			required: true
		},
		communication_progress: {
			type: String | Number,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			formdata: {
				communication_progress: this.communication_progress
			},
			formdataRule: {
				communication_progress: [{ required: true, message: '请输入电话沟通进度', trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.handleSave();
		},
		handleSave() {
            
			this.$refs.modal.buttonLoading = false;
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
                        url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_TEL_PROGRESS_POST'], // eslint-disable-line
						type: "POST",
						param: {
							meeting_id: this.meeting_id,
							communication_progress: this.formdata.communication_progress
						}
					}).then((res) => {
						this.$Message.success(res.msg);
						this.visible = false;
						app.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT', {});
						this.$emit('sure');
					}).catch((error) => {
						Message.error(error.msg);
						this.$refs.modal.buttonLoading = false;
					});
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const ProgresskModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


