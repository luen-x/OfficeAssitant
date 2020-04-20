<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-credit-application-edit"
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
			<i-form-item 
				label="学分类型：" 
				prop="type_id" 
			>
				<i-select
					v-model="formData.type_id"
					clearable
					transfer
					placeholder="请选择学分类型"
					@on-change="handleChange"
				>
					<i-option 
						v-for="(item, index) in type_list" 
						:key="index"
						:value="item.type_id"
					>
						{{ item.type_name }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				label="申请项目：" 
				prop="rule_info" 
			>
				<i-select
					v-model="formData.rule_info"
					clearable
					transfer
					placeholder="请选择申请项目"
				>
					<i-option 
						v-for="(_item, _index) in audit_types" 
						:key="_index"
						:value="_item.rule_id + '-' + _item.rule_info_id + '-' + _item.rule_type"
					>
						{{ _item.audit_type }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="备注说明：" prop="remarks">
				<oa-limit-words 
					v-model="formData.remarks"
					placeholder="请填写详细说明"
					clearable
					style="width: 80%"
				/>
			</i-form-item>
			<i-form-item label="图片上传：" prop="url">
				<vc-imgs-picker 
					v-model="formData.url" 
					:max="5"
					class="g-m-t-10"
					@error="handleError"
					@open="handleOpen"
					@close="handleClose"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option } from 'iview';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';
import { CreatePortal, ImgsPicker } from 'wya-vc';

export default {
	name: "oa-credit-application-edit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		"vc-imgs-picker": ImgsPicker,
		'oa-limit-words': LimitWords,
	},
	mixins: [orderModal],
	props: {
		title: String,
		applyId: [String, Number],
		typeId: [String, Number],
		ruleId: [String, Number],
		ruleInfoId: [String, Number],
		remarks: String,
		url: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			type_list: [],
			audit_types: [],
			rule_type: '',
			formData: {// 表单
				type_id: this.typeId || '',
				rule_info: '',
				remarks: this.remarks || '',
				url: this.url || []
			},
			rules: {// 表单验证
				type_id: [
					{ required: true, type: 'number', message: '请选择学分类型', trigger: 'change' }
				],
				rule_info: [
					{ required: true, message: '请选择申请项目', trigger: 'change' }
				],
				remarks: [
					{ required: true, message: '请填写详细说明', trigger: 'blur' }
				],
				url: [
					{ required: true, type: 'array', message: '请上传附件', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_TRAIN_CREDIT_APPLY_TYPES_GET',
				type: 'GET',
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				this.type_list = res.data;
				if (this.typeId) {
					this.audit_types = res.data.filter(it => it.type_id == this.typeId)[0].audit_types;
					this.rule_type = this.audit_types.filter(it => it.rule_id == this.ruleId)[0].rule_type;
					this.formData.rule_info = this.ruleId + '-' + this.ruleInfoId + '-' + this.rule_type;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 监听学分类型change事件
		 */
		handleChange(v) {
			let audit_type = this.type_list.find(it => it.type_id == v);
			if (audit_type) {
				this.audit_types = audit_type.audit_types;
			} else {
				return;
			}
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					const arr = this.formData.rule_info.split('-');
					const param = { apply_id: this.applyId } || {};

					this.$request({
						url: '_SALE_TRAIN_CREDIT_SAVE_APPLY_POST',
						type: "POST",
						loading: false,
						param: {
							...param,
							type_id: this.formData.type_id,
							rule_id: arr[0],
							rule_info_id: arr[1],
							rule_type: arr[2],
							remarks: this.formData.remarks,
							url: this.formData.url
						},
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
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleOpen() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handleClose() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const FractionCreditApplicationEdit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-credit-application-edit {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-select {
		width: 80%;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.vcp-imgs-picker .__normal {
		width: 60px;
		height: 60px;
		cursor: pointer;
	}
	.vcp-imgs-picker .__normal .__img {
		width: 60px;
		height: 60px;
	}
	.vcp-imgs-picker .__item {
		padding: 0;
	}
}
</style>

