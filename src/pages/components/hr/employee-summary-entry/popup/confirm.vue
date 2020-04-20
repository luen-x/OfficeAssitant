<template>

	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-hr-confirm-modal"
		windth="400"
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">系统提示</div>
		<div class="g-m-t-20 _body">
			数据来自招聘，请确认部门/职位无误哦。点击确定后保存。
		</div>
	</i-modal>
	
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "hr-summary-confirm-modal",
	components: { "i-modal": Modal },
	props: {},
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
			this.$emit("close");
		}
	}
};
export const ConfirmModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.v-hr-confirm-modal{
 ._body{
    text-align: center
 }
}

</style>


