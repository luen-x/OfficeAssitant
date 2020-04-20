<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			class="hr-employee-reduce-apprentice"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				师傅取消
			</div>
			<div class="_content">
				真的要取消该员工的师傅之名吗?
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Button } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-employee-reduce-apprentice",
	components: {
		"i-modal": Modal,
		"i-button": Button,
	},
	props: {
		master_id: Number,
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
				url: API_ROOT._HR_MASTER_APPRENTICE_REDUCE_MASTER_GET,
				type: "GET",
				param: {
					master_id: this.master_id,
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
			this.$store.commit('HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT');
		},
	}
};

export const ReduceMentor = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.hr-employee-reduce-apprentice{
	._range-item {
		background-color: #e84c57;
		color: #ffffff;
		padding: 4px 6px;
		display: inline-block;
		border-radius: 4px;
		line-height: 1;
		font-size: 12px;
	}
	._content{
		margin-left:30px;
		margin-top:30px;
	}
}
</style>