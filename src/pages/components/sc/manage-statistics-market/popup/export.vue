<template>
	<i-modal
		v-model="visible"
		:width="400"
		:mask-closable="false"
		footer-hide
	>
		<div slot="header" class="g-tc">
			导出
		</div>

		<div class="g-m-t-20 g-tc">
			<vc-debounce-click class="g-red-btn-line g-m-r-10" @click="handleExport">	
				导出列表数据
			</vc-debounce-click>

			<vc-debounce-click
				class="g-red-btn-line"
				@click="$router.push({
					path: '/sc/manage/statistics/market/export'
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
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-manage-statistics-market-modal",
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
				url: "_SC_SERVICE_MANAGE_STATISTICS_MARKET_EXPORT_GET",
				type: "GET",
				param: {
					...this.query
				}
			}).then(res => {
				if (+res.status === 1) {
					this.$router.push({
						path: '/sc/manage/statistics/market/export'
					});

					this.visible = false;
				} else {
					this.$Message.warning(res.msg);
					this.visible = true;
				}
			}).catch(error => {
				this.$Message.warning(error.msg);
			}); 
		}
	}
};
export const ExportModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>