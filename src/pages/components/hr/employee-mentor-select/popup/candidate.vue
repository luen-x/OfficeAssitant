<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			style="height:120px"
			class="hr-employee-mentor-select-candidata"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">提示</div>
			<div class="g-flex g-flex-cc g-flex-ac _content" >
				<div v-if="type==='1'">是否将该员工移除，移除员工后该员工不再参与此次评选。</div>
				<div v-if="type==='2'">是否通过该员工申请？</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Button } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-employee-mentor-select-candidata",
	components: {
		"i-modal": Modal,
		"i-button": Button,
	},
	props: {
		type: String
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

export const CandidateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>