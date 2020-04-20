<template>
	<div class="v-count-staff-collage-detail-tabs">
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 40px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<vc-paging
					:columns="getColumns"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					:mode="lectureStatus === '3'&&type ==='2'?'piece':'table'"
					class="v-finance-count-staff-detail-list"
					@page-size-change="handleChangePageSize"
				>
					<oa-diamond
						v-if="lectureStatus === '3'&&listInfo['2'].data.is_empty"
						slot-scope="it"
						v-bind="it"
					/>
				</vc-paging>
				<div
					v-if="lectureStatus === '3'&&!listInfo['2'].data.is_empty"
					class="g-tc g-m-t-40"
				>
					<img
						style="width:100px"
						src="https://wya-oa.oss-cn-hangzhou.aliyuncs.com/common/no-message-02.png"
						alt
					>
					<div>暂无数据</div>
				</div>
			</i-tab-pane>
			<div slot="extra">
				<div
					class="_extra g-fr"
					style="width: 286px;height:30px"
				>
					<i-select
						v-if="type==='2'"
						v-model="lectureStatus"
						style="width: 220px;"
						transfer
						class="__select g-fr g-m-l-10"
						@on-change="handleLecture"
					>
						<i-option
							v-for="item in cultivateList"
							:value="item.value"
							:key="item.value"
						>{{ item.label }}</i-option>
					</i-select>
					<vc-debounce-click
						v-if="pathName==='/collage/salary/month'&&lectureStatus!=3&&$auth['1336']"
						class="g-red-btn-line _btn g-fr"
						@click="handleExport"
					>导出</vc-debounce-click>
				</div>
			</div>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Select, Option } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { tableHeight } from "@extends/mixins/table";
// item
import API_ROOT from "@stores/apis/root";
import item from "./item";
import Diamond from "./diamond";
import { PerformanceModal } from "./popup/performance-modal";

export default {
	name: "oa-table",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-select": Select,
		"i-option": Option,
		"oa-diamond": Diamond
	},
	mixins: [
		item,
		tableHeight({
			tabs: true,
			footer: true,
			extraEle: ["v-finance-count-achi-performance"],
			extraHeight: 70
		})
	],
	data() {
		const { query } = this.$route;
		const tabs = [
			{
				label: "促单业绩",
				value: "1"
			},
			{
				label: "讲课记录",
				value: "2"
			},
			{
				label: "退款记录",
				value: "4"
			}
		];
		if (query.is_charge == 1) {
			tabs.splice(1, 0, {
				label: "团队业绩",
				value: "3"
			});
		}

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			lectureStatus: String(query.lectureStatus || "1"),
			tabs,
			typeUrl: "",
			pathName: window.location.pathname,
			cultivateList: [
				{
					value: "1",
					label: "线上培训"
				},
				{
					value: "2",
					label: "线下培训"
				},

				{
					value: "3",
					label: "大课培训"
				}
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCountStaffDetail.listInfo;
		}
	},
	mounted() {
		// this.loadData();
		this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
	},
	methods: {
		loadData(page, pageSize) {
			if (this.type === "1") {
				this.typeUrl = "FINANCE_COUNT_STAFF_DETAIL_STAFF_PERFORMANCE_LIST_GET";
				return this.loadRedirectData(
					page,
					pageSize,
					"FINANCE_COUNT_STAFF_DETAIL_STAFF_PERFORMANCE_LIST_GET"
				);
			} else if (this.type === "3") {
				this.typeUrl = "FINANCE_COUNT_STAFF_DETAIL_MANAGE_PERFORMANCE_LIST_GET";
				return this.loadRedirectData(
					page,
					pageSize,
					"FINANCE_COUNT_STAFF_DETAIL_MANAGE_PERFORMANCE_LIST_GET"
				);
			} else if (this.type === "4") {
				this.typeUrl = "FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_GET";
				return this.loadRedirectData(
					page,
					pageSize,
					"FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_GET"
				);
			} else if (this.type === "2") {
				this.typeUrl = "FINANCE_LECTURE_LIST_GET";
				return this.loadRedirectData(
					page,
					pageSize,
					"FINANCE_LECTURE_LIST_GET"
				);
			}
		},
		loadRedirectData(page, pageSize, url) {
			let { query = {} } = getParseUrl();
			return this.request({
				url,
				redirect: "FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_GET_SUCCESS",
				type: "GET",
				param: {
					type: this.type,
					...query,
					page,
					pageSize
				}
			})
				.then(res => {})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		handleChange(type) {
			this.type = type;
			this.lectureStatus = "1";
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			if (this.$route.path.match("/collage/salary/month")) {
				this.$router.replace(
					getHashUrl("/collage/salary/month", {
						...query,
						lectureStatus: this.lectureStatus
					})
				);
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			} else {
				this.$router.replace(
					getHashUrl("/finance/count/staff/collage/detail", {
						...query,
						lectureStatus: this.lectureStatus
					})
				);
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			}
		},
		handleLecture(event) {
			if (this.$route.path.match("/collage/salary/month")) {
				this.$router.replace(
					getHashUrl("/collage/salary/month", {
						...this.$route.query,
						type: this.type,
						lectureStatus: this.lectureStatus
					})
				);
			} else {
				this.$router.replace(
					getHashUrl("/finance/count/staff/collage/detail", {
						...this.$route.query,
						type: this.type,
						lectureStatus: this.lectureStatus
					})
				);
			}
			this.loadData(this.$route.query.page || "1", this.$route.query.pageSize);
			if (this.$route.path.match("/collage/salary/month")) {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			} else {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			}
		},
		handleChangePageSize() {
			this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
		},
		handleExport() {
			const url = getHashUrl(API_ROOT[this.typeUrl], {
		// eslint-disable-line
				...this.$route.query,
				is_export: 1,
				"-token": getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};
</script>

<style lang="scss">
.v-count-staff-collage-detail-tabs {
  ._extra {
	.__select {
	  .ivu-select-selection {
		height: 26px !important;
		line-height: 26px !important;
	  }
	}
	.ivu-select-selection {
	  min-height: 26px !important;
	}
	.ivu-select-selected-value {
	  height: 26px !important;
	  line-height: 26px !important;
	}
	._btn {
	  height: 24px !important;
	  line-height: 24px !important;
	}
  }

  .ivu-tabs {
	overflow: initial;
  }
}
</style>
