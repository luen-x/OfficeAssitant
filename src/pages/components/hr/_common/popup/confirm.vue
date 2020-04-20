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
			提示
		</div>
		<div class="g-flex g-m-t-20" style="marginLeft: 34px; fontSize: 14px">
			{{ content }}
		</div>
	</i-modal>
</template>

<script>
import { Modal } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-confirm',
	components: {
		'i-modal': Modal
	},
	props: {
		content: {
			type: String,
			default: () => "真的要删除我吗，删除数据后无法恢复"
		}
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
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
	}
};
export const ConfirmModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


