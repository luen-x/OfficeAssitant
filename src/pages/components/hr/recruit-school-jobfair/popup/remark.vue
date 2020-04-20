<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="备注"
			class="v-hr-remark-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form 
				ref="formdata" 
				:model="formdata" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20">
				<i-form-item label="备注:">
					<oa-limit-words
						v-model="formdata.remarks"
						:max="500"
						width="220px"
						placeholder="请输入文字"
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
		name: Number,
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			formdata: {
				remarks: ''
			},
			formdataRule: {
				remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.formdata.remarks = this.datas.remarks;
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.handleSave();
		},
		handleSave() {
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_ADD_REMARKS_POST'], // eslint-disable-line
				type: "POST",
				param: {
					meeting_id: this.datas.meeting_id,
					remarks: this.formdata.remarks
				}
			}).then((res) => {
				Message.success('填写备注成功');
				this.visible = false;
				app.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT', {});
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const RemarkModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


