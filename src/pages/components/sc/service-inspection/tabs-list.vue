<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div slot="extra" style="margin-top: 7px;">
			<span class="g-c-red-mid">
				{{ time }}
			</span>
		</div>

		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="`${item.label} ${listInfo.count[index]}`"
			:name="item.value"
		>
			<vc-paging
				:ref="'table' + item.value"
				:columns="columns[item.value]"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-sc-service-inspection-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleOpenDrawer"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { autoFix } from '@extends/mixins/auto-fix';
import { tableHeight } from '@extends/mixins/table';
import moment from "moment";
import API_ROOT from "@stores/apis/root";
// item
import item from './item';
import { SettingQualityPeriodModal } from "../manage-inspection/modal/setting-quality-period";

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
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
				{ label: "待质检", value: "1" }, 
				{ label: "已质检", value: "2" }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scServiceInspection.listInfo;
		},

		time() {
			let date = new Date() && moment(new Date()).format("YYYY-MM-DD");
			let dates = this.$store.state.scManageInspection.time;

			if (moment(date).isBefore(dates.begin_time)) {
				return "下次质检周期：" + (dates.begin_time ? dates.begin_time : "--") + "~" 
				+ (dates.end_time ? dates.end_time : "--");
			} else if (moment(dates.end_time).isBefore(date)) {
				return "上次质检周期：" + (dates.begin_time ? dates.begin_time : "--") + "~"
				+ (dates.end_time ? dates.end_time : "--");
			} else {
				return "本次质检周期：" + (dates.begin_time ? dates.begin_time : "--") + "~"
				+ (dates.end_time ? dates.end_time : "--");
			}
		}
	},
	mounted() {
		this.loadGetPeriod();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let service_person_depart_id = query.service_person_depart_id 
				? (query.service_person_depart_id + '').split(",")[(query.service_person_depart_id + '').split(",").length - 1] : null;

			return this.request({
				url: 'SC_SERVICE_INSPECTION_LIST_GET',
				type: 'GET',
				param: {
					customer_type: '1',
					...query,
					type: this.type,
					page,
					pageSize,
					service_person_depart_id
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/sc/service/inspection');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},

		handleChange(type) {
			if (this.type !== type) {
				this.type = type;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync

				query = {
					...query,
					fixPosition: false,
					type,
					page: this.current[type]
				};

				this.$router.replace(getHashUrl('/sc/service/inspection', { ...query }));
			}
		},

		handleChangePageSize() {
			this.$store.commit('SC_SERVICE_INSPECTION_LIST_INIT');
		},

		loadGetPeriod() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_SET_PERIOD_GET,
				type: "GET",
				param: {
					type: 2
				},
				loading: false
			}).then(res => {
				this.$store.commit("SC_MANAGE_INSPECTION_PERIOD", res.data);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		loadTableTitle(type) {
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 6
				},
				loading: false,
			}).then(res => {
				this.$store.commit("SC_SERVICE_INSPECTION_TITLE_CHANGE", { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>

<style lang="scss">
</style>