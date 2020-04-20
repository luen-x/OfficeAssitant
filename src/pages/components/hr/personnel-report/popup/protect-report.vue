<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="发起辩护"
		width="400" 
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
		>
			<i-form-item label="辩护说明:" prop="defend_remark">
				<oa-limit-words
					v-model="formData.defend_remark"
					:max="200"
					placeholder="请填写辩护说明"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="辩护文件:" prop="images">
				<oa-upload
					v-model="formData.images"
					:max="10"
					:upload="{multiple: true, max: 10}"
					:show-title="false"
					style="width: 220px"
					placeholder="请上传通话证明或者工商信息等凭证"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Input, Form, FormItem, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import Upload from '@common/upload/upload';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'oa-upload': Upload
		
	},
	mixins: [orderModal],
	props: {
		reportId: Number,
		
	},
	data() {
		return {
			visible: false,
			formData: {
				defend_remark: '',
				images: []
			},
			rules: {
				defend_remark: [{ required: true, type: 'string', message: "请填写辩护说明", trigger: "blur" }],
				images: [{ required: true, type: 'array', message: "请上传凭证", trigger: "change" }]
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
						url: '_HR_PERSONAL_REPORT_DEFEND_POST',
						type: "POST",
						param: {
							...this.formData,
							images: this.formData.images.map(i => i.url),
							report_id: this.reportId
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$refs.modal.buttonLoading = false;
						console.error(res, 'post data:', {
							...this.formData,
							report_id: this.reportId
						});
						this.$Message.error(res.msg);
						
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const ProtectReport = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>