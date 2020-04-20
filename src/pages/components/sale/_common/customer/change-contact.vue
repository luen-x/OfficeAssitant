<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="更改对接信息"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-flex g-jc-c g-m-t-20">
			<i-form ref="form" :model="formData" :rules="rule" :label-width="100">
				<i-form-item label="对接人姓名" prop="contact_name">
					<i-input
						v-model="formData.contact_name"
						clearable
						placeholder="请输入对接人姓名"
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item label="对接人电话" prop="contact_tel">
					<i-input
						v-model="formData.contact_tel"
						clearable
						placeholder="请输入对接人电话"
						style="width: 220px"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button, Form, FormItem, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from "@common/limit-words/limit-words";
import { dataValidity } from '@utils/utils';
import orderModal from '@extends/mixins/orderModal';
import { debounce } from 'lodash';

export default {
	name: "oa-confirm-remark",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		'i-input': Input
	},
	mixins: [orderModal],
	props: {
		data: Object // {contract_id}
	},
	data() {
		return {
			visible: false,
			formData: {
				contract_id: this.data.contract_id,
				contact_name: this.data.contact_name,
				contact_tel: this.data.contact_tel
			},
			rule: {
				contact_name: [{ required: true, message: "请输入对接人姓名", trigger: "blur" }],
				contact_tel: [
					{ required: true, message: "请输入对接人电话", trigger: "blur" },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: 'blur' }
				],
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
					this.$request({
						url: "_SALE_CONTRACT_MODIFY_CONTRACT_POST",
						type: "POST",
						param: {
							contract_id: this.formData.contract_id,
							customer_info: [
								 {
									component_value: this.formData.contact_name,
									component_field: "contact_name",
								},
								{
									component_value: this.formData.contact_tel,
									component_field: "contact_tel",
								}
							]
						},
						loading: false,
					}).then(res => {
						this.visible = false;
						this.$Message.success(res.msg);
						this.$emit('sure', 1);
					}).catch((res) => {
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(res.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});

		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		},
	}
};

export const ChangeContact = CreatePortal({}, module.exports.default);
</script>
