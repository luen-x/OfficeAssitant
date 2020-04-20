<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			修改评定结果
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem v-if="formdata.status == 2" label="驳回理由:">
				<div style="width: 220px;wordBreak: break-all; padding: 10px 0; lineHeight: 1">{{ formdata.audit_remarks }}</div>
			</i-formitem>
			<i-formitem label="评定结果:" prop="status">
				<i-select
					v-model="formdata.status"
					placeholder="请选择评定结果"
					style="width: 220px"
				>
					<i-option :value="1">通过</i-option>
					<!-- <i-option value="2">待定</i-option> -->
					<i-option :value="2">驳回</i-option>
				</i-select>
			</i-formitem>
			<i-formitem
				v-if="formdata.status === 1 && (formdata.rule_type === 7 || formdata.rule_type === 8)" 
				label="评定学分:"
				prop="point">
				<i-input-number
					v-model="formdata.point"
					:max="99"
					:min="-99"
					placeholder="请输入评定学分（可输入负数扣分）"
					style="width: 220px"
				/>
			</i-formitem>
			<!-- <i-formitem v-if="formdata.result === '1'" label="提供人学分">
				<i-input 
					v-model="formdata.a"
					placeholder="请输入评定学分（可输入负数扣分）"
					style="width: 220px"
				/>
			</i-formitem>
			<i-formitem v-if="formdata.result === '1'" label="主要分享者学分">
				<i-input 
					v-model="formdata.a"
					placeholder="请输入评定学分（可输入负数扣分）"
					style="width: 220px"
				/>
			</i-formitem> -->
			<i-formitem v-if="formdata.status === 2" label="驳回原因:" prop="audit_remarks">
				<oa-textarea 
					v-model="formdata.audit_remarks"
					placeholder="请填写驳回原因"
					clearable
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, InputNumber, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-edit',
	components: {
		'i-modal': Modal,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-textarea': TextArea
	},
	props: {
		item: Object
	},
	data() {
		return {
			visible: false,
			formdata: {
				point: null,
				...this.item,
			},
			validator: {
				point: [
					{ required: true, type: 'number', message: '请输入评定学分', trigger: 'blur' }
				],
				audit_remarks: [
					{ required: true, message: '请输入驳回原因', trigger: 'blur' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_APPLY_POST',
						type: 'POST',
						loading: false,
						param: this.formdata
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const EditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>