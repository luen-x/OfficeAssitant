<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ name === "1" ? "发送" : "温馨提示" }}
		</div>

		<div v-if="name === '1'">
			<p>确认发送此邮件？</p>
			<p>温馨提示：通过OA系统发邮件会有10分钟左右的延迟，请稍后查看发送结果。</p>
			<p>注：由于腾讯方日志推送原因，邮件名称过长时(约25字以上），OA系统内查看邮件发送状态可能会一直处于发信中，但实际不影响邮件的发送，请见谅!</p>
		</div>
		<div v-else>
			确认取消？返回后将不会保存此次编辑的内容。
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "sc-customer-send-mail-prompt-modal",
    
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
			this.visible = false;
			this.$emit("sure", true);
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PromptModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>