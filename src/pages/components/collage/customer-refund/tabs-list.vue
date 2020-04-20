<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		class="g-tabs-card"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="getColumns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-collage-customer-refund-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleOpenDrawer"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Paging } from "wya-vc";
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from "@utils/utils";
import { tableHeight } from '@extends/mixins/table';
// item
import item from "./item";
// 抽屉
import { DetailDrawer } from "./popup/detail.vue";
import { AuditModal } from "./popup/audit.vue";

export default {
	name: "oa-table",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane
	},

	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
		}),
		autoFix()
	],

	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待审核", value: "1" },
				{ label: "已通过", value: "2" },
				{ label: "未通过", value: "3" }
			],
		};
	},

	computed: {
		listInfo() {
			return this.$store.state.collageCustomerRefund.listInfo;
		}
	},

	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let depart_id = query.depart_id 
				? (query.depart_id + '').split(",")[(query.depart_id + '').split(",").length - 1] : null;

			return this.request({
				url: "COLLAGE_CUSTOMER_REFUND_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					plate: 4,
					depart_id
				}
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/collage/customer/refund');
			}).catch(error => {});
		},

		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync

			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};

			this.$router.replace(
				getHashUrl("/collage/customer/refund", { ...query })
			);
		},

		handleChangePageSize() {
			this.$store.commit("COLLAGE_CUSTOMER_REFUND_LIST_INIT");
		}
	}
};
</script>

<style lang="scss">
</style>