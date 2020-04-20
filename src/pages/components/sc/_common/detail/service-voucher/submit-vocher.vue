<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			title="提交服务凭证"
			class="v-sc-submit-voucher"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form"
				:model="formData"
				:rules="ruleData"
				:label-width="115"
				class="g-m-t-20"
			>
				<i-form-item
					label="服务凭证："
					prop="images"
				>
					<oa-upload
						v-model="formData.img"
						:max="10"
					/>
				</i-form-item>

				<i-form-item label="备注:">
					<oa-limit-words
						v-model="formData.remark"
						:max="200"
						placeholder="请输入备注信息"
						style="width: 220px;"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem } from "iview";
import { CreatePortal } from "wya-vc";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-submit-vocher-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"oa-upload": Upload
	},

	props: {
		project_id: {
			required: true,
			type: Number
		},
		obj: {
			required: true,
			type: Object
		}
	},

	data() {
		return {
			visible: false,
			formData: {
				img: [],
				remark: ""
			},
			ruleData: {
				img: [
					{
						required: true,
						message: "请上传服务凭证！",
						trigger: "change"
					}
				]
			}
		};
	},

	mounted() {
		if (this.obj) {
			this.obj.img && this.obj.img.length != 0 && this.obj.img.forEach(item => {
				this.formData.img.push({
					url: item,
					title: item.substring(item.lastIndexOf("/") + 1, item.length),
					type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
					uid: item,
					file_id: item
				});
			});

			this.formData.remark = this.obj.remark;
		}

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let img = [];

			this.formData.img.forEach(item => {
				img.push(item.url);
			});

			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_TICKET_ADD_POST",
				type: "POST",
				param: {
					project_id: this.project_id,
					...this.formData,
					img,
					service_ticket_id: this.obj ? this.obj.service_ticket_id : null
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const SubmitVocher = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-submit-voucher{
	._title {
		display: none;
	}
}
</style>