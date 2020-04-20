<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="canDel"
			:mask-closable="false"
			class="c-position-del-modal-container"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<div class="_content">
				{{ content }}
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
		positionIds: Array,
		canDel: Boolean
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
			if (!this.canDel) {
				// this.$refs.modal.buttonLoading = false;
				this.$emit('close');
			} else {
				app.$store.dispatch("request", {
				url: "HR_POSITION_DEL_POST", // eslint-disable-line
					type: 'POST',
					param: {
						position_id: this.positionIds
					}
				}).then((res) => {
					this.$refs.modal.buttonLoading = false;
					this.visible = false;
					this.$emit('sure');
				}).catch((error) => {
					Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
			}
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const DelTipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-position-del-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		height: 100px;
		padding: 40px;
		color: #333333;
		font-size: 14px;
	}
}
</style>