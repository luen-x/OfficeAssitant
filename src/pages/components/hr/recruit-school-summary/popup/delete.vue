<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-recruit-school-delete"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			删除
		</div>

		<div class="_only-text g-fs-14">
			是否确认删除应聘者？
		</div>

	</i-modal>
</template>

<script>
import moment from "moment";
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Modal } from "iview";

export default {
	name: "hr-recruit-school-summary-delete",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy
	},
	props: {
		data: Object
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
			let arr = [this.data.selected.applicant_id];

			app.$store
				.dispatch("request", {
					url: "HR_RECRUIT_SCHOOL_DEL_POST",
					type: "POST",
					param: {
						applicant_id: arr
					},
					loading: false
				})
				.then(res => {
					this.$refs.modal.buttonLoading = false;
					this.visible = false;
					this.$emit("sure");
				})
				.catch(error => {
					this.$Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const delPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.v-hr-recruit-school-delete {
	._only-text {
		padding: 34px;
		padding-top: 40px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>
