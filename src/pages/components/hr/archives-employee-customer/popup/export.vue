<template>
	<i-modal
		v-model="visible"
		:width="400"
		:mask-closable="false"
		footer-hide
		class="v-hr-archives-employee-customer"
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
					path: '/hr/archives/employee/output'
				})"
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
	name: "hr-archives-employee-customer-modal",
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
				url: API_ROOT.HR_ARCHIVES_EMPLOYEE_OUTPUT_DOWNLOAD_POST,
				type: "GET",
				param: {
					...this.query
				}
			}).then(res => {
				this.$router.push({
					path: '/hr/archives/employee/output'
				});
				this.visible = false;
			}).catch(error => {
				this.$Message.warning(error.msg);
				this.visible = true;
			});
		}
	}
};
export const exportModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-archives-employee-customer {
	._prompt{
		font-size: 14px;
		color: #333;
		text-align:center;
	}
}
</style>
