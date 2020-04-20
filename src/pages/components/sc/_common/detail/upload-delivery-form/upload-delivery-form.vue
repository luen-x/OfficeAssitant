<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		width="400px"
		@on-ok="handleSubmit('form')"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ name == 1 ? "上传交接表" : "上传项目完成表" }}
		</div>

		<i-form
			ref="form" 
			:model="formData" 
			:rules="ruleData"
			:label-width="100"
			class="g-m-t-20"
		>
			<i-form-item
				:label="flag ? '更改交接表' : name == 1 ? '交接表:' : '项目完成表'"
				prop="image"
			>
				<vc-imgs-picker
					v-model="formData.image"
					:max="6"
					:upload="{multiple: true, max: 6}"
					@error="handleError"
				/>
			</i-form-item>
	
			<i-form-item 
				:label="name==1 ? '交接完成时间:' : '完成时间：'" 
				prop="complete_time"
			>
				<i-datepicker 
					v-model="formData.complete_time"
					type="datetime"
					transfer
					placeholder="请选择交接完成时间" 
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, DatePicker } from "iview";
import { CreatePortal, ImgsPicker } from 'wya-vc';
import moment from "moment";

export default {
	name: "sc-customer-upload-delivery-form-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-datepicker": DatePicker,
		"vc-imgs-picker": ImgsPicker
	},

	props: {
		name: Number,
		project_id: Number,
		contract_id: Number,
		delivery_data: Object,
		flag: Number
	},

	data() {
		return {
			visible: false,
			formData: {
				image: [],
				complete_time: ""
			},
			ruleData: {
				image: [
					{ 
						required: true, 
						type: 'array', 
						message: '请选择图片', 
						trigger: 'change' 
					}
				],
				complete_time: [
					{ 
						required: true,
						type: 'date',
						message: '请选择完成时间', 
						trigger: 'change' 
					}
				]
			}
		};
	},

	mounted() {
		if (this.flag) {
			this.formData.image = this.delivery_data.images;
			this.formData.complete_time = this.delivery_data.complete_time 
			&& moment(this.delivery_data.complete_time).format("YYYY-MM-DD HH:mm:ss") + "";
		}
		
		this.visible = true;
	},

	methods: {
		handleSubmit(name) {
			this.$refs[name].validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},

		handleSave() {
			let complete_time = this.formData.complete_time
				&& moment(this.formData.complete_time).format("YYYY-MM-DD HH:mm:ss");
			
			let API = this.name == 1 ? "_SC_CUSTOMER_HANDOVER_DELIVERY_ADD_POST" : "_SC_CUSTOMER_COOPERATE_PROJECT_COMPLETE_ADD_GET";
				
			this.$request({
				url: API,
				type: "POST",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id,
					images: this.formData.image,
					complete_time,
					type: this.flag ? 1 : null
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
			this.visible = false;
			this.$emit("close");
		},
		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};
export const UploadDeliveryFormModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>