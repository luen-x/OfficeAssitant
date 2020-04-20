<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-manage-refund-vocher"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			查看凭证
		</div>

		<div style="margin-left: -8px;">
			<div>
				<span class="g-inline-block" style="width: 100px;text-align: right;">回款金额：</span>
				<span>{{ refundVoucher.return_amount }}</span>
			</div>
			<div class="g-m-t-20">
				<span class="g-inline-block" style="width: 100px;text-align: right;">代理人数：</span>
				<span>{{ refundVoucher.agent_num }}</span>
			</div>
			<div class="g-flex g-m-t-20">
				<span class="g-inline-block" style="width: 100px;text-align: right;">凭证：</span>
				<oa-upload
					v-model="resume" 
					disabled
					style="width: 200px"
				/>
			</div>
			<div class="g-m-t-20 g-flex">
				<span class="g-inline-block" style="width: 100px;text-align: right;">备注：</span>
				<span class="g-inline-block" style="width: 220px;"> {{ refundVoucher.remarks }}</span>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-manage-inspection-refund-voucher-modal",

	components: {
		"i-modal": Modal,
		"oa-upload": Upload
	},

	props: {
		refundVoucher: Object
	},

	data() {
		return {
			resume: [],
			visible: false
		};
	},

	mounted() {
		this.refundVoucher && this.refundVoucher.fileImage.length != 0 && this.refundVoucher.fileImage.forEach(item => {
			this.resume.push({
				url: item.img_url,
				title: item.img_url.substring(item.img_url.lastIndexOf("/") + 1, item.img_url.length),
				type: "." + item.img_url.substring(item.img_url.lastIndexOf(".") + 1, item.img_url.length),
				uid: item.img_url,
				file_id: item.relation_id
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
export const RefundVoucherModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-manage-refund-vocher{
	.ivu-modal-body{
		max-height: 388px;
		overflow: auto;
	}
}
</style>