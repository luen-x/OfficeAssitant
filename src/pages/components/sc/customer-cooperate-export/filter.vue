<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c g-m-t-20">
			<div style="margin-left:20px">
				<i-input
					v-model="keyword"
					clearable
					placeholder="请输入模板名称"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-5 g-red-btn-small"
					@click="handleSearch"
				>
					搜索
				</vc-debounce-click>
			</div>

			<div>
				<vc-debounce-click
					class="g-red-btn-line"
					@click="handleNewTemplate"
				>
					新建模板
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import { ExportSettingModal } from "./popup/export-setting";

export default {
	name: "oa-filter",

	components: {
		"i-input": Input,
		"i-button": Button,
		"vc-expand": Expand,
	},

	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ""),
			name: String(query.name || ""),
			show: false
		};
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	methods: {
		handleSearch(event) {
			this.$router.replace(
				getHashUrl("/sc/customer/cooperate/export", {
					...this.$route.query,
					keyword: this.keyword,
					name: this.name
				})
			);
			this.$store.commit("SC_CUSTOMER_COOPERATE_EXPORT_LIST_INIT");
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		// 新建模板
		handleNewTemplate() {
			ExportSettingModal.popup({}).then(res => {});
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>