<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-main-right-side-detail"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div class="g-fs-16 g-c-black g-bb g-pd-b-20">补款通知</div>
		<div class="g-pd-r-20 g-pd-t-20 g-pd-b-20">
			<oa-filter v-model="query" @search="handleSearch"/>
			<oa-list ref="list" :query="query"/>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';
import moment from "moment";
import Filter from "./filter";
import List from "./list";

export default {
	name: "sc-main-detail-drawer",

	components: {
		"i-drawer": Drawer,
		'oa-loading': Loading,
		"oa-filter": Filter,
		"oa-list": List
	},

	data() {
		return {
			loading: false,
			query: {
				search: "", // 公司名称、客户姓名或手机号
				create_staff_search: "", // 公补款人姓名或手机号
				is_ignore: "", // 0全部 1已忽略 2未忽略
				product_id: "", // 下单产品ID
				create_time: ""
			},
			closable: false,
			show: false
		};
	},

	mounted() {	
		this.closable = true;
	},

	methods: {
		handleSearch(v) {
			this.query = { 
				...v,
				create_time_start: v.create_time[0] && moment(v.create_time[0]).format("YYYY-MM-DD"),
				create_time_end: v.create_time[1] && moment(v.create_time[1]).format("YYYY-MM-DD")
			};
			this.$refs.list.handleResetFirst();
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
</style>