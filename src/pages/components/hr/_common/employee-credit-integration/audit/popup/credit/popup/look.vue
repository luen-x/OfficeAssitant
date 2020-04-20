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
			查看凭证与备注
		</div>
		<i-form
			ref="form"
			:model="formdata"
			:label-width="100"
		>
			<i-formitem label="评价项目:">
				<vc-imgs-preview :data-source="item.url || []" />
			</i-formitem>
			<i-formitem label="服务备注:">
				<div 
					style="width: 220px; wordBreak: break-all; padding: 10px 0; lineHeight: 1">{{ item.remarks }}</div>
			</i-formitem>
			<i-formitem v-if="data.status == 2" label="驳回理由:">
				<div style="width: 220px;wordBreak: break-all; padding: 10px 0; lineHeight: 1">{{ item.audit_remarks }}</div>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';

export default {
	name: 'hr-look',
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-formitem': FormItem,
		'vc-imgs-preview': ImgsPreview
	},
	props: {
		item: Object,
		staffId: Number,
		rule_type: String
	},
	data() {
		return {
			visible: false,
			formdata: {},
			data: this.item
		};
	},
	mounted() {
		this.visible = true;
		this.rule_type === '5' && this.loadData();
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
		loadData() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_GET',
				type: 'POST',
				loading: false,
				param: {
					course_id: this.item.attach_id,
					staff_id: this.staffId
				}
			}).then(res => {
				this.data.url = res.data.voucher; 
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const LookModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>