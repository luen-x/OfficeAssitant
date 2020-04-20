<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			一键评分
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem prop="radio">
				<i-radio-group v-model="formdata.rule_type" class="g-flex g-fd-c">
					<i-radio label="6">选修课条件项</i-radio>
					<i-radio label="7">素材上传条件项</i-radio>
					<i-radio label="8">培训开课条件项</i-radio>
					<i-radio label="10">自定义审核项</i-radio>
				</i-radio-group>
			</i-formitem>
			<i-formitem v-if="formdata.rule_type === '8'" label="评定学分" prop="point">
				<i-input-number 
					v-model="formdata.point"
					:max="99"
					:min="-99"
					placeholder="请输入评定学分（可输入负数扣分）"
					style="width: 80%"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Radio, RadioGroup, Input, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-goal',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-radio': Radio,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-radio-group': RadioGroup
	},
	data() {
		return {
			visible: false,
			formdata: {
				point: null
			},
			validator: {
				point: [
					{ required: true, type: 'number', message: '请输入评定学分', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(item => {
				this.$refs.modal.buttonLoading = false;
				if (item) {
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_POST',
						type: 'POST',
						param: this.formdata,
						loading: false
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
export const GoalModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.ivu-radio-group {
	display: flex;
}
</style>


