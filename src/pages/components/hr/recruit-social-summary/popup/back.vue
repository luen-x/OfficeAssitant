<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-pass-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				背景调查
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem
					prop="is_background"
					label="是否背景调查:"
				>
					<i-radio-group
						v-model="formValidate.is_background"
						style="width: 220px"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-formitem>
				<i-formitem
					v-if="formValidate.is_background"
					prop="background_url"
					label="凭证:"
				>
					<vc-imgspicker
						v-model="formValidate.background_url" 
						:max="3"
						@error="handleError"
					/>
				</i-formitem>
				<i-formitem
					label="备注:"
				>
					<oa-limit-words
						v-model="formValidate.background_remarks"
						:max="200"
						style="width: 220px"
						placeholder="请输入备注"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, RadioGroup, Radio } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-position-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'oa-limit-words': LimitWords,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'vc-imgspicker': ImgsPicker
	},
	props: {
		applicantId: String | Number,
	},
	data() {
		return {
			visible: false,		
			formValidate: {
			},
			ruleValidate: {
				is_background: [
					{ required: true, type: 'number', message: '请选择是否背景调查', trigger: 'change' }
				],
				background_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				],
			},
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
		this.loadInfo();
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		loadInfo() {
			this.$request({
				url: "_HR_RECRUIT_SOCIAL_SUMMARY_BACKGROUND_GET", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_id: this.applicantId,
				}
			}).then((res) => {
				this.formValidate = res.data;
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		handleSave() {
			this.$request({
				url: "HR_RECRUIT_SOCIAL_SUMMARY_SURVEY_BACKGROUND_POST", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_id: this.applicantId,
					...this.formValidate,
				}
			}).then((res) => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const BackModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-pass-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 0 20px !important;
	}
	.ivu-modal-footer {
		padding: 0 20px 20px 20px !important;
	}
}
</style>
