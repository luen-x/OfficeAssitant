<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		width="360px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-lr-20 g-m-tb-30 g-fs-14 g-c-black2">
			{{ content }}
		</div>
		<div v-if="noCancel" slot="footer" class="modal-tip-footer">
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-hr-train-detail-delete-tip",
	components: {
		'i-modal': Modal,
		'i-button': Button
	},
	props: {
		title: {
			type: String,
			default: '提示'
		},
		content: {
			type: String,
			default: '删除后不可恢复，是否确认删除？'
		},
		noCancel: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			visible: false,
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('sure', true);
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		}
	}
};
export const ModalTip = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.modal-tip-footer {

}
</style>

