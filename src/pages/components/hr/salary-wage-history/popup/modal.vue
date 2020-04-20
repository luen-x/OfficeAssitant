<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-salary-wage-history-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			撤销
		</div>

		<div class="_only-text g-fs-14">
			<p style="color: #333;">{{ tip }}</p>
			<!-- 是否确认撤销？ -->
		</div>

	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal, Copy } from "wya-vc";

export default {
	name: "hr-salary-wage-history",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			tip: ''
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		// 提示语
		this.$request({
			url: '_HR_SALARY_ACTION_TIP_GET',
			type: 'GET',
			param: {
				type: 1
			},
			loading: false
		}).then(res => {
			this.tip = res.data.msg;
		}).catch(err => {});
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			this.$emit('sure');
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-salary-wage-history-modal {
	._only-text {
		padding: 34px;
		padding-top: 44px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>


