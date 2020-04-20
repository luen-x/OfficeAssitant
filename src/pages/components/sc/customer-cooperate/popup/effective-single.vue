<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-cooperate-es"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>
			计为有效单
		</div>

		<div v-if="name=='1'" class="_content">
			确定将此单计为有效单？（计为有效单后，会计入到员工的完成单量）
		</div>
		<div
			v-else
			class="_content"
			style="text-align:center;"
		>
			确定将此单取消计为有效单？
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-effctive-single-modal",

	components: {
		"i-modal": Modal
	},

	props: {
		name: String,
		project_id: Number
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
			if (this.name == "1") {
				this.$request({
					url: API_ROOT._SC_CUSTOMER_COOPERATE_VALID_POST,
					type: "POST",
					param: {
						project_id: this.project_id,
						valid_type: 2
					}
				})
					.then(res => {
						this.$Message.success(res.msg);
					})
					.then(() => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit("sure", true);
					})
					.catch(error => {
						this.$Message.error(error.msg);

						this.$refs.modal.buttonLoading = false;
					});
			} else {
				this.$request({
					url: API_ROOT._SC_CUSTOMER_COOPERATE_VALID_POST,
					type: "POST",
					param: {
						project_id: this.project_id,
						valid_type: 1
					}
				})
					.then(res => {
						this.$Message.success(res.msg);
					})
					.then(() => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit("sure", true);
					})
					.catch(error => {
						this.$Message.error(error.msg);

						this.$refs.modal.buttonLoading = false;
					});
			}
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const EffectiveSingleModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-sc-cooperate-es {
	color: #333;
	
	._content {
		font-size: 14px;
		margin: 30px 0px 10px 38px;
		padding-right: 25px;
	}
}
</style>