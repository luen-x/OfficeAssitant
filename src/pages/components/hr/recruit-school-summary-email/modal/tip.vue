<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:mask-closable="false"
			class="c-tip-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<div class="_content">
				{{ content }}
			</div>
			<div slot="footer">
				<i-button type="primary" @click="handleOk()">知道了</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Button, Modal, Form, FormItem, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: 'hr-rank-delete-tip-modal',
	components: {
		'i-button': Button,
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
			this.$emit('sure');
		}
	}
};
export const TipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-tip-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		padding: 20px;
		padding-bottom: 0px;
		color: #333333;
		font-size: 14px;
	}
}
</style>
