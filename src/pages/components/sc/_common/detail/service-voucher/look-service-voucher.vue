<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="查看服务凭证"
			class="v-sc-look-service-voucher"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div>
				<div class="g-flex">
					<div class="g-tr" style="width: 100px;">服务凭证：</div>
					<oa-upload
						v-model="images" 
						disabled
						style="width: 200px;"
					/>
				</div>
				<div class="g-flex g-m-t-10">
					<div class="g-tr" style="width: 100px;">备注：</div>
					<div style="width: 260px;">{{ obj.remark }}</div>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import Upload from "@components/_common/upload/upload";

export default {
	name: "sc-look-service-vocher-modal",

	components: {
		"i-modal": Modal,
		"oa-upload": Upload
	},

	props: {
		obj: {
			required: true,
			type: Object
		}
	},

	data() {
		return {
			images: [],
			visible: false
		};
	},

	mounted() {
		this.obj.img && this.obj.img.length != 0 && this.obj.img.forEach(item => {
			this.images.push({
				url: item,
				title: item.substring(item.lastIndexOf("/") + 1, item.length),
				type: "." + item.substring(item.lastIndexOf(".") + 1, item.length),
				uid: item,
				file_id: item
			});
		});

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.visible = false;
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const LookServiceVocher = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-look-service-voucher{
	._title {
		display: none;
	}
}
</style>