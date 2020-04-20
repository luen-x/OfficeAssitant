<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-collage-check-statistic-check-detail"
		@on-close="handleCancel"
	>
		<h3 class="g-fs-16 g-bb g-pd-l-20 g-c-black1">{{ staff_name }}</h3>

		<div class="g-pd-lr-20 g-pd-t-20 g-pd-b-20">
			<oa-filter v-model="query" @search="handleSearch"/>
			<oa-list ref="list" :staff_id="staff_id" :query="query"/> 
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane, Spin } from "iview";
import { CreatePortal } from "wya-vc";
import moment from "moment";
import Filter from "./filter";
import List from "./list";

export default {
	name: "collage-check-statistic-check-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"oa-filter": Filter,
		"oa-list": List
	},

	props: {
		staff_name: String,
		staff_id: Number

	},

	data() {
		return {
			query: {
				company_info: "", // 合同公司名称或客户姓名
				role_type: "", // 角色类型
				quality_date: "", // 质检日期
				min_score: null,
				max_score: null
			},
			closable: false
		};
	},

	mounted() {
		this.closable = true;
	},

	methods: {
		handleSearch(v) {
			this.query = { 
				...v,
				begin_quality_date: v.quality_date[0] && moment(v.quality_date[0]).format("YYYY-MM-DD"),
				end_quality_date: v.quality_date[1] && moment(v.quality_date[1]).format("YYYY-MM-DD")
			};

			this.$refs.list.handleResetFirst();
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const OnlineOfflineDetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-collage-check-statistic-check-detail {
	.ivu-drawer-body{
		padding: 0;
	}

	h3{
		height: 60px;
		line-height: 60px;
	}
}
</style>