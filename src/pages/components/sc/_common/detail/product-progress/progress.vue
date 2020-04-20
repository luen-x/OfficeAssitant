<template>
	<i-modal 
		ref="modal"
		:loading="true"
		v-model="visible" 
		:width="400"
		:mask-closable="false"
		title="制作完成"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form 
			ref="form"
			:model="formData" 
			:rules="rule" 
			:label-width="110" 
			class="g-m-t-20"
		>
			<i-form-item label="完成时间：" prop="complete_time">
				<i-date-picker
					v-model="formData.complete_time"
					:options="options"
					transfer
					placeholder="请选择完成时间"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, DatePicker } from "iview";
import { CreatePortal, ImgsPicker } from "wya-vc";
import moment from "moment";

export default {
	name: "sc-add-follow-modal",

	components: {
		"i-modal": Modal,
		"i-date-picker": DatePicker,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		make_id: {
			required: true,
			type: Number
		},
		project_id: {
			required: true,
			type: Number
		},
		complete_time: {
			required: true,
			type: String
		}
	},

	data() {
		return {
			visible: false,
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now() - 86400000 + 24 * 60 * 60 * 1000;
				}
			},
			formData: {
				complete_time: ""
			},
			rule: {
				complete_time: [
					{
						required: true,
						message: "请选择完成时间",
						trigger: "change",
						type: "date"
					}
				]
			}
		};
	},

	mounted() {
		this.formData.complete_time = this.complete_time || moment().format("YYYY-MM-DD");
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
        
		handleSave() {
			let url = this.complete_time ? '_SC_CUSTOMER_COOPERATE_COMPLETE_TIME_EDIT_POST' : '_SC_CUSTOMER_COOPERATE_COMPLETE_PRODUCT_POST';
			
			this.$request({
				url,
				type: "POST",
				param: {
					make_id: this.make_id,
					project_id: this.project_id,
					complete_time: moment(this.formData.complete_time).format("YYYY-MM-DD")
				}
			}).then(res => {
				this.$Message.success(res.msg);
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
export const Progress = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>