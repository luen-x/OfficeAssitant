<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			class="hr-employee-mentor-select-remove"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">提示</div>
			<div class="g-flex g-flex-cc g-m-t-20">
				<div>是否将该员工移除，移除员工后该员工不再参与此次评选。</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Button } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-employee-mentor-select-remove",
	components: {
		"i-modal": Modal,
		"i-button": Button,
	},
	props: {
		master_apply_id: Number
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
			this.$request({
				url: API_ROOT._HR_ARCHIVES_PERSON_CENTER_RECOMMEND_MASTER_EVALUATE_REMOVE_GET,
				type: "GET",
				param: {
					master_apply_id: this.master_apply_id,
				},
				loading: false
			}).then(res => {
				this.$emit("sure");
				this.$Message.success("操作成功");
			}).catch(err => {
				this.$Message.warning(err.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
		}
	}
};

export const RemoveModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>