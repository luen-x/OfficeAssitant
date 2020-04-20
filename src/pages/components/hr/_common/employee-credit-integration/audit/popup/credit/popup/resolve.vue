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
			通过
		</div>
		<div>是否确认通过该员工的申请，通过后系统将自动为其增加设定好的分值。</div>
	</i-modal>
</template>

<script>
import { Modal } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-resolve',
	components: {
		'i-modal': Modal
	},
	props: {
		item: Object
	},
	data() {
		return {
			visible: false,
			formdata: {}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_APPLY_POST',
				type: 'POST',
				loading: false,
				param: {
					status: 1,
					apply_id: this.item.apply_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const ResolveModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>