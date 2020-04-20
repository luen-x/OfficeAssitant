<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-recruit-school-recover"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div slot="header" class="g-tc">
			恢复
		</div>
		<div v-if="(data.type == '0'||data.type == '11'||data.type === '10')&&data.info.is_reminder==0" class="_only-text g-fs-14">
			是否确认恢复到待沟通状态？
		</div>
		<div v-else-if="(data.type == '0'||data.type == '11'||data.type === '10')&&data.info.is_reminder==1" class="_only-text g-fs-14">
			该数据为三立学府淘汰，恢复后该应聘者将重新培训，是否确定？
		</div>
		<div v-else-if="(data.type == '0'||data.type == '11'||data.type === '10')&&data.info.is_reminder==2" class="_only-text g-fs-14">
			是否确认恢复到已报到？
		</div>
		<div v-else>
			是否确认恢复？
		</div>
	</i-modal>
</template>

<script>
import moment from "moment";
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Modal } from "iview";

export default {
	name: "hr-recruit-school-summary-recover",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy
	},
	props: {
		data: Object,
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

			let id = '';
			this.data.info
				? id = this.data.info.applicant_id
				: id = this.data.selected.map(item => item.applicant_id).join(',');

			app.$store.dispatch("request", {
				url: 'HR_RECRUIT_SCHOOL_SUMMARY_RECOVER_POST',
				type: 'POST',
				param: {
					applicant_id: id
				},
				loading: false
			}).then((res) => {
				this.$emit("sure");
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const recoverPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-recruit-school-recover {
	._only-text {
		padding: 34px;
		padding-top: 40px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>
