<template>
	<i-modal 
		ref="modal"
		:loading="true"
		v-model="visible" 
		:width="400"
		:mask-closable="false"
		class="c-modal-contain"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			添加跟进记录
		</div>

		<i-form 
			ref="form"
			:model="formData" 
			:rules="rule" 
			:label-width="110" 
			class="g-m-t-20"
		>
			<i-form-item label="跟进记录:" prop="content">
				<oa-limit-words
					v-model="formData.content"
					:max="200"
					placeholder="请填写跟进记录"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>

	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-add-follow-modal",

	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		make_id: String,
		record_id: String,
		component_info: String,
		flag: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				content: ""
			},
			rule: {
				content: [
					{
						required: true,
						message: "请填写跟进记录",
						trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		if (this.flag == 1) { 
			this.form.content = this.component_info; 
		}

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
			let API = this.flag == 1 ? "_SC_CUSTOMER_COOPERATE_EDIT_TRACK_RECORD_POST" : "_SC_CUSTOMER_COOPERATE_TRACK_RECORD_POST";

			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					record_id: this.flag == 1 ? this.record_id : "",
					make_id: this.flag != 1 ? this.make_id : "",
					content: this.formData.content
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure', true);
			}).catch(error => { 
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const AddFollowRecordModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>