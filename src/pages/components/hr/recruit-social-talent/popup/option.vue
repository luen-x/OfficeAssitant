<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="canDel"
			:mask-closable="false"
			class="c-talent-option-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				{{ type === 'del' ? '删除' : '恢复' }}
			</div>
			<div class="_content">
				{{ type === 'del' ? '是否将应聘者删除？' : '是否将应聘者恢复到待沟通状态？' }}
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
		type: {
			type: String,
			validator(value) {
				return ['recover', 'del'].indexOf(value) !== -1;
			}
		}
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
			let url = this.type === 'del' ? "HR_RECRUIT_APPLICANT_DEL_POST" : 'HR_RECRUIT_APPLICANT_RECOVER_POST';
			app.$store.dispatch("request", {
				url,
				type: 'POST',
				param: {
					applicant_id: this.applicantIds
				}
			}).then((res) => {
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
export const OptionTipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-talent-option-modal {
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
