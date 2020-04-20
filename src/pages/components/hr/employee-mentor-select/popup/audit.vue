<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			class="hr-employee-details-contract-company"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">提示</div>
			<div class="g-m-l-30 g-m-t-20">
				<div>是否通过该员工申请？</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Button } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-employee-details-contract-company",
	components: {
		"i-modal": Modal,
		"i-button": Button,
	},
	props: {
		master_apply_id: Number,
		status: Number,
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
				url: API_ROOT._HR_ARCHIVES_PERSON_CENTER_RECOMMEND_MASTER_EVALUATE_AUDIT_POST,
				type: "POST",
				param: {
					master_apply_id: this.master_apply_id,
					status: this.status
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

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>