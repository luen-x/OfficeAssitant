<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-relation-try-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			提示
		</div>
		<div class="g-fs-14 g-flex-ac g-flex-cc">
			重置后将还原到目前配置前的数据，是否确认重置？
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Modal } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";



export default {
	name: "hr-employee-relation-try-modal",
	components: {
		"i-modal": Modal,
	},
	
	data() {
		return {
			visible: false,
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit("sure");	
		},
		handleCancel() {
			this.visible = false;
		}
	}
};
export const TipModal = CreatePortal({}, module.exports.default);
</script>
