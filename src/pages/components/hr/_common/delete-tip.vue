<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:mask-closable="false"
			class="c-del-modal-container"
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
import { Modal, Form, FormItem, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: 'hr-rank-delete-tip-modal',
	components: {
		'i-modal': Modal,
	},
	mixins: [orderModal],
	props: {
		title: String,
		content: String
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
			// this.$refs.modal.buttonLoading = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const DelTipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-del-modal-container {
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
