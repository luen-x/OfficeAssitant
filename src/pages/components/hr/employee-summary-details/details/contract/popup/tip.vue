<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		title="系统提示"
		width="400px"
		class="v-hr-contract-tip-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-14">
			解除合同后将导致该合同失效，无法再次编辑喔~
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "vc-hr-summary-details-password-modal",
	components: {
		"i-modal": Modal
	},
	props: {
		contract_id: String | Number,
	},
	data() {
		return {
			visible: false
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_RELIEVE_CONTRACT_POST,
				type: "POST",
				param: {
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(res.msg);
			});
		},
		handleCancel() {
			// this.visible = false;
			this.$emit("close");
		}
	}
};

export const TipModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-contract-tip-modal{
	.ivu-modal-content{
		.ivu-modal-body{
			padding:30px;
			text-align: center;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
	
}
</style>
