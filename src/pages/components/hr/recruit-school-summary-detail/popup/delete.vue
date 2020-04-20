<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-recruit-school-remark-delete"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			删除
		</div>

		<div class="_only-text g-fs-14">
			是否确认删除此备注，删除后此数据不会显示在备注中。
		</div>

	</i-modal>
</template>

<script>
import { CreatePortal, Copy } from "wya-vc";
import { Modal } from "iview";

export default {
	name: "hr-recruit-school-reamrk-delete",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy
	},
	props: {
		info: Object
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
			this.$request({
				url: "HR_RECRUIT_SCHOOL_REMARK_DEL_POST",
				type: "POST",
				param: {
					remark_id: this.info.remark_id
				},
				loading: false
			})
				.then(res => {
					this.$Message.success('操作成功');
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
.v-hr-recruit-school-remark-delete {
	._only-text {
		padding: 34px;
		padding-top: 40px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>
