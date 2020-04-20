<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:title="title"
		:mask-closable="false"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form ref="form" :model="formData" :rules="rule" :label-width="100">
			<i-form-item :label="label" prop="remark">
				<oa-limit-words
					v-model="formData.remark"
					:max="maxLength"
					:placeholder="placeholder"
					width="220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from "@common/limit-words/limit-words";
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-confirm-remark",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		title: {
			type: String,
			default: '审核'
		},
		label: {
			type: String,
			default: '备注'
		},
		placeholder: {
			type: String,
			default: "请填写备注"
		},
		required: {
			type: Boolean,
			default: true
		},
		okText: {
			type: String,
			default: '确定'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		okCallback: Function,
		cancelCallback: Function,
		maxLength: {
			type: Number,
			default: 500
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				remark: ''
			},
			rule: {
				remark: [{ required: this.required, message: this.placeholder, trigger: 'blur' }]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.okCallback) {
						this.okCallback(this.formData.remark).then(res => {
							if (res.status) {
								this.visible = false;
								this.$emit('sure', this.formData.remark);
							}
							this.$refs.modal.buttonLoading = false;
						}).catch(res => {
							this.$refs.modal.buttonLoading = false;
						});
					}
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};

export const ConfirmWithRemark = CreatePortal({}, module.exports.default);
</script>
