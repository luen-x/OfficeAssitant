<template>
	<i-modal
		ref="model"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-content-manage-prompt"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			温馨提示
		</div>

		<div style="text-align:center;">
			确认删除该服务项吗？
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-cooperate-prompt-modal",

	components: {
		"i-modal": Modal
	},

	props: {
		set_id: Number
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
			this.$request({
				url: API_ROOT._CONTENT_SERVICE_SETTING_DELETE_POST,
				param: {
					set_id: this.set_id
				}
			}).then(async res => {
				await this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);

				this.visible = true;
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const ContentServiceSettingPromptModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>