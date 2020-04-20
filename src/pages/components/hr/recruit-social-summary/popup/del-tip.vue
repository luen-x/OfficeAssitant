<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="canDel"
			:mask-closable="false"
			class="c-social-summary-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				删除候选人
			</div>
			<div class="_content">
				是否确认删除候选人？
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Message } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-position-delete-modal',
	components: {
		'i-modal': Modal,
	},
	props: {
		title: String,
		content: String,
		applicantIds: Array,
		canDel: Boolean,
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			app.$store.dispatch("request", {
				url: 'HR_RECRUIT_APPLICANT_DEL_POST',
				type: 'POST',
				param: {
					applicant_id: this.applicantIds
				}
			}).then((res) => {
				res.msg && this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const DelTipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-summary-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		height: 50px;
		padding: 40px;
		color: #333333;
		font-size: 14px;
	}
}
</style>