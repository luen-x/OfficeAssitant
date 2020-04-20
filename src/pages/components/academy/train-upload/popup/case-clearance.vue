<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="案例通关"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div class="g-tc" style="color: #E74854;">
				已选中{{ staffId ? 1 : staffIds.length }}人
			</div>

			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20"
			>
				<i-form-item label="分数：" prop="score">
					<i-input-number
						v-model="formData.score" 
						:min="1"
						:max="99"
						:precision="0"
						placeholder="请输入分数（正整数）"
						clearable
						style="width: 220px;"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'v-academy-train-upload-case-clearance-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		"i-input-number": InputNumber
	},
	props: {
		staffId: Number,
		staffIds: Array
	},
	data() {
		return {
			formData: {
				score: null
			},
			formDataRule: {
				score: [
					{
						required: true,
						message: "请输入分数（正整数）！",
						trigger: "blur",
						type: "number"
					}
				]
			},
			visible: false
		};
	},
	mounted() {
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
			this.$request({
				url: "_ACADEMY_TRAIN_UPLOAD_RECORD_POST",
				type: "POST",
				param: {
					staff_id: this.staffId || this.staffIds,
					...this.formData
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const CaseClearance = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>