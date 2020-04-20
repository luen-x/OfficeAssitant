<template>
	<i-modal
		v-model="visible"
		:width="400"
		:mask-closable="false"
		footer-hide
		class="v-sc-cooperate-wp"
	>
		<div slot="header" class="g-tc">
			导出
		</div>

		<div class="g-m-t-20" style="text-align:center;">
			<vc-debounce-click class="g-red-btn-line g-m-r-10" @click="handleExport">	
				导出列表数据
			</vc-debounce-click>

			<vc-debounce-click
				class="g-red-btn-line"
				@click="$router.push({
					path: '/sc/customer/cooperate/exporttask'
				});"
			>
				查看导出任务
			</vc-debounce-click>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button } from "iview";
import { CreatePortal } from "wya-vc";
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import moment from "moment";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-warm-prompt-modal",
	components: {
		"i-modal": Modal,
		"i-button": Button
	},
	props: {
		query: Object
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
			this.$emit("sure");
		},
		handleCancel() {
			this.$emit("close");
		},
        
		handleExport() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_DOWNLOAD_GET,
				type: "GET",
				param: {
					...this.query
				}
			}).then(res => {
				if (res.msg == "成功") {
					this.$router.push({
						path: '/sc/customer/cooperate/exporttask'
					});
					this.visible = false;
				} else {
					this.$Message.warning(res.msg);
					this.visible = true;
				}
			}).catch(error => {}); 
		}
	}
};
export const ExportModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-sc-cooperate-wp{
	._prompt{
		font-size: 14px;
		color: #333;
		text-align:center;
	}
}
</style>