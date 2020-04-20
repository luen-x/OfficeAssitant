<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			查看凭证
		</div>
		<div class="g-flex g-m-t-20 g-m-l-30">
			<span>质检凭证：</span>
			<oa-upload
				v-model="fileImage" 
				disabled
				style="width: 260px"
			/>
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-service-voucher-modal",

	components: {
		"i-modal": Modal,
		"oa-upload": Upload
	},

	props: {
		fileImage: Array,
	},

	data() {
		return {
			resume: [],
			visible: false
		};
	},

	mounted() {
		// this.fileImage.forEach(item => {
		// 	this.resume.push({
		// 		url: item.img_url,
		// 		title: item.img_url.substring(item.img_url.lastIndexOf("/") + 1, item.img_url.length),
		// 		type: "." + item.img_url.substring(item.img_url.lastIndexOf(".") + 1, item.img_url.length),
		// 		uid: item.relation_id,
		// 		file_id: item.relation_id
		// 	});
		// });
                
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$emit("close");
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const VoucherModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>