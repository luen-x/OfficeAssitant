<template>
	<i-modal
		v-model="visible"
		:width="400"
		:mask-closable="false"
		class="c-modal-sc-mian-del"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>
			温馨提示
		</div>

		<div class="g-flex-cc g-c-black2 g-fs-14" style="height: 50px">确定要删除该提醒吗？</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "sc-del-prompt-modal",

	components: {
		"i-modal": Modal
	},

	props: {
		name: String
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
			this.$emit("sure", true);
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const DelPromptModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>