<template>
	<i-modal 
		ref="model"
		v-model="visible" 
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="vhr-personal-center-pass-apply-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			提示
		</div>
		<div class="_prompt">是否通过该员工的申请？</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-personal-center-pass-apply-modal",
	components: {
		"i-modal": Modal
	},
	props: {
		master_apply_id: Number,
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
				url: API_ROOT._HR_PERSONNEL_MEMBER_MASTER_PASS_APPLY_POST,
				type: "GET",
				param: {
					master_apply_id: this.master_apply_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure");
				this.$store.commit('HR_PERSONNEL_MEMBER_MASTER_LIST_INIT');
			}).catch(error => {
			});
		},
        
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const TipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.vhr-personal-center-pass-apply-modal{
	._prompt{
		text-align:center;
		font-size: 14px;
		color: #333;
	}
}
</style>


