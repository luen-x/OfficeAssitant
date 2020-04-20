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
			驳回
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
			:rules="validator"
		>
			<i-formitem label="驳回服务:">
				<div v-if="!item.length" style="padding: 10px 0; lineHeight: 1">
					<span>{{ item.service_item_name }}</span>
					<span>{{ item.create_time }}</span>
				</div>
				<div v-else style="padding-top: 10px; lineHeight: 1">
					<div
						v-for="(info, index) of data"
						:key="info.apply_id"
						:style="{paddingBottom: (index === data.length - 1) ? '0px' : '20px'}"
					>
						<span>{{ info.service_item_name }}</span>
						<span>{{ info.create_time }}</span>
						<!-- <span v-if="index > 0" class="g-operation" @click="handleDel">移出</span> -->
					</div>
				</div>
			</i-formitem>
			<i-formitem label="驳回原因:" prop="audit_remarks">
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
import { Modal, Form, FormItem, Input, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-reject',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-textarea': TextArea
	},
	props: {
		item: Object | Array
	},
	data() {
		return {
			data: [...this.item],
			visible: false,
			formdata: {},
			validator: {
				audit_remarks: [
					{ required: true, message: '请输入驳回原因', trigger: 'blur' }
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
					const apply_id = this.item.length ? this.data.map(info => info.apply_id) : this.item.apply_id;
					this.$request({
						url: '_HR_EMPLOYEE_SCORE_INTEGRATION_REJECT_POST',
						type: 'POST',
						loading: false,
						param: {
							...this.formdata,
							apply_id
						}
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
export const RejectModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>