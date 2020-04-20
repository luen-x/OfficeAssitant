<template>
	<div>
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
				查看
			</div>

			<div>
				<div>
					<span 
						class="g-inline-block g-tr" 
						style="width: 80px;"
					>
						消息类型：
					</span>
					<span>{{ detail.type_name }}</span>
				</div>
				<div class="g-flex g-m-t-10">
					<span 
						class="g-inline-block g-tr" 
						style="width: 80px;"
					>
						模板ID：
					</span>
					<span class="g-inline-block">{{ detail.template_id }}</span>
				</div>
				<div class="g-m-t-10">
					<span 
						class="g-inline-block g-tr" 
						style="width: 80px;"
					>
						所属板块：
					</span>
					<span>{{ detail.project_type_name }}</span>
				</div>
				<div class="g-m-t-10 g-flex">
					<div
						class="g-tr" 
						style="width: 80px;"
					>
						通知样式：
					</div>
					<div v-html="detail.style"/>
				</div>
				<div class="g-m-t-10">
					<span 
						class="g-inline-block g-tr" 
						style="width: 80px;"
					>
						接收人：
					</span>
					<span>{{ detail.receiver }}</span>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";

export default {
	name: "content-wechat-look-modal",

	components: {
		"i-modal": Modal
	},

	props: {
		detail: Object
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
			this.visible = false;
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const WeChatLook = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>