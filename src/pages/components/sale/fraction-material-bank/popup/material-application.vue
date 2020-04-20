<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true"
		:mask-closable="false" 
		width="680px" 
		class="v-sale-material-application"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="申请素材：">
				<span>{{ fileName }}</span>
			</i-form-item>
			<i-form-item 
				v-if="audit_schedule.length" 
				label="审核流程："
			>
				<oa-across-table 
					:data="audit_schedule"
					style="justify-content:flex-start;height:60px;margin-left:-45px;"
				/>
			</i-form-item>
			<i-form-item 
				v-if="refuse_reason.length" 
				label="驳回理由：" 
				style="width: 98%;word-break: break-all;"
			>
				<span>{{ refuse_reason[0] }}</span>
			</i-form-item>
			<i-form-item label="申请理由：" prop="apply_reason">
				<oa-limit-words 
					v-model="formData.apply_reason"
					placeholder="请输入申请理由"
					clearable
					style="width: 80%"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from "iview";
import { CreatePortal } from "wya-vc";
import orderModal from '@extends/mixins/orderModal';
import AcrossTable from '@components/_common/across-table/across-table';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-material-application",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem,
		'oa-across-table': AcrossTable,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		title: String,
		fileName: String,
		applyId: [String, Number],
		materialId: [String, Number]
	},
	data() {
		return {
			visible: false,
			refuse_reason: [], // 驳回理由
			audit_schedule: [], // 审核角色列表
			formData: {// 表单
				apply_reason: ""
			},
			rules: {// 表单验证
				apply_reason: [
					{ required: true, message: "申请理由不能为空", trigger: "blur" }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		if (this.applyId) {
			this.loadData();
		}
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_LIBRARY_APPLY_AUDIT_DETAIL_GET',
				type: "GET",
				loading: false,
				param: {
					apply_id: this.applyId
				},
				autoTip: false
			}).then(res => {
				this.audit_schedule = res.data.audit_info.map(it => ({ title: it.step_name, step: it.step, status: it.status }));
				this.refuse_reason = res.data.refuse_reason;
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
						material_id: this.materialId,
						apply_reason: this.formData.apply_reason
					};

					if (this.applyId) {
						param = {
							...param,
							apply_id: this.applyId
						};
					}

					this.$request({
						url: '_SALE_LIBRARY_APPLY_CREATE_POST',
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
		}
	}
};

export const FractionMaterialApplication = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sale-material-application {
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
	}
	.c-across-table ._item {
		height: 60px;
	}
}
</style>

