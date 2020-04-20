<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="680px" 
		class="v-sale-service-close"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			
			<span>提交关闭服务项申请</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="审核流程：">
				<oa-across-table 
					:data="audit_schedule"
					style="justify-content:flex-start;height:60px;margin-left:-45px;"
				>
					<div 
						slot-scope="item" 
						class="g-flex g-flex-cc g-fd-c"
					>
						<div>{{ item.item.title }}</div>
						<div style="margin-top: -10px;">{{ item.item.staff_name }}</div>
					</div>
				</oa-across-table>
			</i-form-item>
			<i-form-item label="申请理由：" prop="reason">
				<oa-limit-words 
					v-model="formData.reason"
					placeholder="请输入申请理由"
					clearable
					style="width: 80%"
				/>
			</i-form-item>
			<i-form-item label="上传凭证：" prop="voucher">
				<oa-upload
					v-model="formData.image_url"
					:max="6"
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</i-form-item>
			<i-form-item 
				label="关闭服务项：" 
				prop="set_ids" 
				style="margin-top: -25px;"
			>
				<i-checkbox-group 
					v-model="formData.set_ids" 
					@on-change="handleGroupChange"
				>
					<i-checkbox 
						v-for="(item, index) in set"
						:key="index"
						:label="item.set_id"
						class="g-pd-r-20"
					>
						{{ item.service_name }}
					</i-checkbox>
				</i-checkbox-group>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';
import AcrossTable from '@components/_common/across-table/across-table';

export default {
	name: "oa-service-close",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		"oa-upload": Upload,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'oa-limit-words': LimitWords,
		'oa-across-table': AcrossTable,
	},
	mixins: [orderModal],
	props: {
		reason: String,
		applyId: [String, Number],
		contractCompanyId: [String, Number],
		fileImage: {
			type: Array,
			default() {
				return [];
			}
		},
		auditSchedule: {
			type: Array,
			default() {
				return [];
			}
		},
		sets: {
			type: Array,
			default() {
				return [];
			}
		},
		setIds: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			audit_schedule: this.auditSchedule || [], // 审核角色
			set: this.sets || [], // 服务项列表
			formData: {// 表单
				reason: this.reason || '',
				image_url: this.fileImage || [],
				set_ids: this.setIds || []
			},
			rules: {// 表单验证
				reason: [
					{ required: true, message: "申请理由不能为空", trigger: "blur" }
				],
				image_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				],
				set_ids: [
					{ required: true, type: 'array', message: '请选择服务项', trigger: 'change' }
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
				url: '_SALE_SERVICE_ITEM_APPLY_GET',
				type: "GET",
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data.audit_schedule)) {
					this.audit_schedule = res.data.audit_schedule;
				}
				if (Array.isArray(res.data.set)) {
					this.set = res.data.set;
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
						url: '_SALE_SERVICE_CLOSE_SET_APPLY_POST',
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
		/**
		 * 监听CheckboxGroup的change事件
		 */
		handleGroupChange(data) {
			this.formData.set_ids = data;
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceClose = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sale-service-close {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.ivu-modal-footer {
		border: none;
	}
	.ivu-input {
		width: 100%;
	}
	.c-across-table {
		margin-top: 0;
		margin-bottom: 20px;
	}
	.c-across-table ._item {
		height: 60px;
	}
	.ivu-checkbox-wrapper {
		margin-right: 0;
	}
}
</style>

