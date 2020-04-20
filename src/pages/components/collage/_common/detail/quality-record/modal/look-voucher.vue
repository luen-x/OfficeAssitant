<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-collage-cooperate-look-vocher"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			查看凭证
		</div>

		<div style="margin-left: -8px;">
			<div class="g-flex g-m-t-20">
				<span class="g-inline-block" style="width: 100px;text-align: right;">查看凭证：</span>
				<oa-upload
					v-model="resume" 
					disabled
					style="width: 200px"
				/>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import Upload from "@components/_common/upload/upload";

export default {
	name: "collage-service-refund-voucher-modal",

	components: {
		"i-modal": Modal,
		"oa-upload": Upload
	},

	props: {
		fileImage: Array
	},

	data() {
		return {
			resume: [],
			visible: false
		};
	},

	mounted() {
		this.fileImage && this.fileImage.length && this.fileImage.forEach(item => {
			this.resume.push({
				url: item.img_url,
				title: item.img_url.substring(item.img_url.lastIndexOf("/") + 1, item.img_url.length),
				type: "." + item.img_url.substring(item.img_url.lastIndexOf(".") + 1, item.img_url.length),
				uid: item.img_url,
				file_id: item.img_url
			});
		});
                
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
export const LookVoucher = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-cooperate-look-vocher{
	.ivu-modal-body{
		max-height: 388px;
		overflow: auto;
	}
}
</style>