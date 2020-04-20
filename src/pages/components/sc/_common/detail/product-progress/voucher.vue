<template>
	<i-modal 
		ref="modal"
		:loading="true"
		v-model="visible" 
		:width="400"
		:mask-closable="false"
		class="v-sc-customer-vouvher"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			特殊情况提交
		</div>

		<i-form 
			ref="form"
			:model="formData" 
			:rules="rule" 
			:label-width="110" 
			class="g-m-t-20"
		>
			<i-form-item label="情况说明：" prop="content">
				<oa-limit-words
					v-model="formData.content"
					:max="500"
					placeholder="请输入特殊情况，特殊情况会同步至跟进记录"
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item label="凭证上传：">
				<vc-imgs-picker
					v-model="formData.images"
					:max="6"
					:upload="{multiple: true, max: 6}"
					@error="handleError"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from "iview";
import { CreatePortal, ImgsPicker } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-add-follow-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-imgs-picker": ImgsPicker
	},

	props: {
		step_id: Number,
		record_id: Number,
		component_info: Object,
		flag: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				content: "",
				images: []
			},
			rule: {
				content: [
					{
						required: true,
						message: "请填写特殊情况",
						trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		if (this.flag == 1) {
			this.formData.content = this.component_info.content;
			this.formData.images = this.component_info.images;
		} else if (this.record_id) {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_EDIT_GET,
				type: "GET",
				param: {
					record_id: this.record_id
				}
			}).then(res => {
				this.formData.content = res.data.component_info.content;
				this.formData.images = res.data.component_info.images;
			}).catch(error => {});
		}

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		// _SC_CUSTOMER_COOPERATE_CHANGE_RECORD_POST
		handleSave() {
			let API = "";

			if (this.flag == 1) {
				API = "_SC_CUSTOMER_COOPERATE_EDIT_TRACK_RECORD_POST";
			} else if (this.record_id) {
				API = "_SC_CUSTOMER_COOPERATE_CHANGE_RECORD_POST";
			} else {
				API = "_SC_CUSTOMER_COOPERATE_ADD_EXCEPTION_RECORD_POST";
			}

			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					record_id: this.record_id,
					step_id: this.step_id,
					content: this.formData.content,
					images: this.formData.images
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure', true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
		},
        
		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};
export const VoucherModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-vouvher{
	textarea.ivu-input {
		resize: none;
		width:220px;
		height: 100px;
	}
}
</style>