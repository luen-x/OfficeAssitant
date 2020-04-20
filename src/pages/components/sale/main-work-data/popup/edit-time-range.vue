<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="设置接通时长指标"
		width="400" 
		class="v-main-work-data-popup-edit-time"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="90"
			class="g-pd-l-20"
			@submit.native.prevent
		>
			<i-form-item label="接通时长：" prop="call_time">
				<i-input-number 
					v-model="formData.call_time" 
					:max="999"
					:min="1"
					:precision="0" 
					placeholder="请输入接通时长" 
					style="width: 220px"
				/>
				<span class="g-m-l-5 g-absolute" style="left:190px">秒</span>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, InputNumber, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-form-item': FormItem,
		
	},
	props: {
		time: Number
	},
	data() {
		return {
			visible: false,
			formData: {
				call_time: this.time || null
			},
			rules: {
				call_time: [{ required: true, type: 'number', message: "请输入接通时长", trigger: "blur" }]
			},
			
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_SALE_MAIN_WORK_DATA_MORE_TIME_CONFIG_POST',
						type: "POST",
						param: {
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure', this.formData);
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const EditTimeRange = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-main-work-data-popup-edit-time {
	.ivu-input-number-handler-wrap {
		display: none
	}


}
</style>