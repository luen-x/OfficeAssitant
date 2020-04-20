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
			评分
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="评价项目:">		
				<div style="padding: 10px 0; lineHeight: 1">
					{{ item.display_content }} <span class="g-m-l-20">{{ item.create_time }}</span>
				</div>
			</i-formitem>
			<i-formitem label="评定学分:" prop="point">
				<i-input-number
					v-model="formdata.point"
					:max="99"
					:min="-99"
					placeholder="请输入评定学分（可输入负数扣分）"
					style="width: 220px"
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-grade',
	components: {
		'i-modal': Modal,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-formitem': FormItem,
	},
	props: {
		item: Object
	},
	data() {
		return {
			visible: false,
			formdata: {
				...this.item,
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
export const GradeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>