<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			上传交付表
		</div>
		<i-form
			ref="form"
			:model="formData"
			:label-width="100"
			:rules="rules"
			class="g-m-t-20"
		>
			<i-form-item
				:rules="required ? { required: false } : rules.images" 
				label="交付表上传:"
				prop="images"
			>
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
import { Modal, Form, FormItem } from "iview";
import { CreatePortal, ImgsPicker } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "collage-service-upload-delivery-form-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-imgs-picker": ImgsPicker
	},

	props: {
		project_id: Number,
		record_id: Number,
		lesson_type: Number,
		lesson_status: Number,
		image: Array
	},

	data() {
		return {
			visible: false,
			formData: {
				images: []
			},
			rules: {
				images: [{ required: true, type: 'array', message: '请选择图片', trigger: 'change' }]
			}
		};
	},

	computed: {
		required() {
			return this.lesson_type === 1 || (this.lesson_type === 2 && this.lesson_status === 0);
		}
	},

	mounted() {
		this.image.length > 0 && this.image.forEach(item => {
			this.formData.images.push(item.url);
		});

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.required ? this.handleSave()
				: this.$refs.form.validate(valid => {
					if (valid) {
						this.handleSave();
					} else {
						this.$refs.modal.buttonLoading = false;
					}
				});
		},

		handleSave() {
			this.$request({
				url: API_ROOT._COLLAGE_CUSTOMER_COOPERATE_DELIVERY_UPLOAD_POST,
				type: "POST",
				param: {
					lesson_type: this.lesson_type,
					project_id: this.project_id,
					record_id: this.record_id,
					images: this.formData.images
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleError(err) {
			this.$Message.warning(err.msg);
		}
	}
};
export const UploadDeliveryFormModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>