<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<oa-echarts v-if="item.value==1" :month="month" :depart_id="depart_id"/>
			<oa-ranking v-else :month="month"/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from "iview";
import { getParseUrl, getHashUrl } from "@utils/utils";
// item
import echarts from "./echarts-bar";
import Ranking from "./ranking/ranking";

export default {
	name: "oa-table",
	components: {
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-echarts": echarts,
		"oa-ranking": Ranking
	},
	props: {
		depart_id: Array,
		month: String
	},
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [{ label: "数据表", value: "1" }, { label: "排名", value: "2" }]
		};
	},
	computed: {},
	mounted() {},
	methods: {
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type
			};
			this.$router.replace(getHashUrl("/finance/count/achi", { ...query }));
		}
	}
};
</script>

<style lang="scss">
</style>
