<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="680px" 
		class="v-sale-service-complain"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>服务提成申诉</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="审核阶段：">
				<span>{{ appeal_step }}</span>
			</i-form-item>
			<i-form-item label="服务提成：">
				<span>{{ service_amount }}元</span>
			</i-form-item>
			<i-form-item label="审核流程：">
				<oa-across-table 
					:data="audit_schedule"
					style="justify-content:flex-start;height:60px;margin-left:-45px;"
				/>
			</i-form-item>
			<i-form-item label="申请理由：" prop="reason">
				<oa-limit-words 
					v-model="formData.reason"
					:max="500"
					clearable
					placeholder="请输入申请理由"
					style="width: 80%"
				/>
			</i-form-item>
			<i-form-item label="上传凭证：" prop="image_url">
				<oa-upload
					v-model="formData.image_url"
					:max="6"
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import AcrossTable from '@components/_common/across-table/across-table';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-service-complain",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		"oa-upload": Upload,
		'oa-across-table': AcrossTable
	},
	mixins: [orderModal],
	props: {
		reason: String,
		appealStep: String,
		applyId: [String, Number],
		serviceId: [String, Number],
		serviceAmount: [String, Number],
		contractCompanyId: [String, Number],
		auditSchedule: {
			type: Array,
			default() {
				return [];
			}
		},
		fileImage: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			audit_schedule: this.auditSchedule || [], // 审核角色列表
			appeal_step: this.appealStep || '', // 阶段
			service_amount: this.serviceAmount || '', // 金额
			formData: {// 表单
				reason: this.reason || '',
				image_url: this.fileImage || []
			},
			rules: {// 表单验证
				reason: [
					{ required: true, message: "申请理由不能为空", trigger: "blur" }
				],
				image_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				]
			},
		};
	},
	mounted() {
		this.visible = true;
		if (!this.applyId) {
			this.loadData();
		}
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_SERVICE_APPEAL_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					service_id: this.serviceId
				},
				autoTip: false
			}).then(res => {
				this.appeal_step = res.data.appeal_step;
				this.service_amount = res.data.service_amount;
				if (Array.isArray(res.data.audit_schedule)) {
					this.audit_schedule = res.data.audit_schedule;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let param = {
						contract_company_id: this.contractCompanyId,
						service_id: this.serviceId,
						...this.formData,
						image_url: this.formData.image_url.map(it => it.url)
					};
					if (this.applyId) {
						param = {
							...param,
							apply_id: this.applyId
						};
					}

					this.$request({
						url: '_SALE_SERVICE_AMOUNT_APPEAL_POST',
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceComplain = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-service-complain {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.c-across-table {
		margin-top: 0;
		margin-bottom: 20px;
	}
	.c-across-table ._item {
		height: 60px;
	}
}
</style>

