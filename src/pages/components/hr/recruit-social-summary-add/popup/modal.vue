<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-recruit-social-confirm"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			确认
		</div>

		<div class="_only-text g-fs-14">
			返回之前的页面你所填写的内容将无法恢复，确认返回吗？
		</div>

	</i-modal>
</template>

<script>
import moment from "moment";
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Modal } from "iview";

export default {
	name: "hr-recruit-social-summary-confirm",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy
	},
	props: {
	},
	data() {
		return {
			visible: false
		};
	},
	computed: {},
	created() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			this.$emit("sure");
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-recruit-social-confirm {
	._only-text {
		padding: 34px;
		padding-top: 40px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>
