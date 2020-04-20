<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<div slot="extra" style="margin-top: 7px;">
			<span
				v-if="$auth[1271]"
				class="g-pointer g-c-red-mid"
				@click="handleSettingQualityPeriod"
			>
				{{ time }}
			</span>
			<span v-else class="g-c-red-mid">
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
				class="v-sc-manage-inspection-list"
				mode="table"
				@page-change="handlePageChange"
				@page-size-change="handleChangePageSize"
				@selection-change="handleSelectionChange"
				@row-click="handleOpenDrawer"
			>
				<div
					v-if="type != '6'"
					slot="extra"
					class="g-flex-ac"
				>
					<i-checkbox
						v-model="isAll"
						@on-change="handleIsAll"
					>
						全选
					</i-checkbox>
					<i-button 
						v-if="$auth[335] && type != 6" 
						@click="handleAllDitribute"
					>
						批量分配
					</i-button>
					<i-button 
						v-if="type != 1 && type != 6 && $auth[336]" 
						class="g-m-l-10" 
						@click="handleOperate(1)"
					>
						转入待分配
					</i-button>
					<i-button 
						v-if="type != 3 && type !=5 && type != 6" 
						class="g-m-l-10"
						@click="handleOperate(4)"
					>
						转入已质检
					</i-button>
					<i-button 
						v-if="type != 4 && type !=5 && type != 6 && $auth[337]" 
						class="g-m-l-10"
						@click="handleOperate(3)"
					>
						转入无需质检
					</i-button>
					<i-button 
						v-if="type != 5 && type != 6" 
						class="g-m-l-10"
						@click="handleOperate(5)"
					>
						转入系统到期
					</i-button>
				</div>
			</vc-paging>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane,	Button, Checkbox, Message } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
import checkAll from '@extends/mixins/checkAll';
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import { Confirm } from "@components/_common/confirm/confirm";
import item from './item';
import { DistributeModal } from './modal/distribute';
import { SettingQualityPeriodModal } from "./modal/setting-quality-period";

export default {
	name: 'oa-table',
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-button": Button,
		"i-checkbox": Checkbox
	},
	mixins: [
		item,
		checkAll,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待分配", value: "1" }, 
				{ label: "待质检", value: "2" }, 
				{ label: "已质检", value: "3" },
				{ label: "无需质检", value: "4" }, 
				{ label: "系统到期", value: "5" }, 
				{ label: "已失效", value: "6" }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scManageInspection.listInfo;
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
	created() {
		this.loadGetPeriod();
		this.$store.commit("SC_MANAGE_INSPECTION_SELECTED_TAB", this.type);
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			let service_person_depart_id = query.service_person_depart_id 
				? (query.service_person_depart_id + '').split(",")[(query.service_person_depart_id + '').split(",").length - 1] : null;

			return this.request({
				url: 'SC_MANAGE_INSPECTION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					service_person_depart_id
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/sc/manage/inspection');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},

		handleChange(type) {
			if (this.type !== type) {
				this.type = type;
				this.isAll = false;
				this.handleIsAll(false);

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					fixPosition: false,
					type,
					page: this.current[type]
				};

				this.$router.replace(getHashUrl('/sc/manage/inspection', { ...query }));
			}
		},

		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('SC_MANAGE_INSPECTION_LIST_INIT');
		},

		// 点击全选
		handleIsAll(val) {
			this.$refs[`table${this.type}`][0].$refs.tableTarget.selectAll(val);
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
					scenario: 5
				},
				loading: false,
			}).then(res => {
				this.$store.commit("SC_MANAGE_INSPECTION_TITLE_CHANGE", { ...res.data, type: type || '1' });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		// 批量分配
		handleAllDitribute() {
			if (!this.selected.length) {
				Message.warning("请先选择客户再进行分配！");
				return;
			}

			let arr = [];

			this.selected.forEach(element => {
				arr.push(element.quality_id);
			});

			DistributeModal.popup({
				quality_ids: arr
			}).then(res => {
				res && this.$store.commit("SC_MANAGE_INSPECTION_LIST_RESET", { type: this.type });
			});
		},

		handleOperate(name) {
			if (!this.selected.length) {
				Message.warning("请先选择客户再进行转入操作！");
				return;
			}

			let arr = [];

			this.selected.forEach(element => {
				arr.push(element.quality_id);
			});

			let title = ["转入待分配", "", "转入无需质检", "转入已质检", "转入服务到期"][name - 1];
			let msg = ["确认将客户移至待分配？", "", "确认将客户移至无需质检？", "确认将客户移至已质检？", "确认将客户移至服务到期？"][name - 1];

			Confirm.popup({
				title,
				msg
			}).then(() => {
				this.$request({
					url: '_SC_MANAGE_INSPECTION_OPERATE_POST',
					type: 'POST',
					param: {
						quality_ids: arr.join(","),
						operate_type: name
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.$store.commit("SC_MANAGE_INSPECTION_LIST_RESET", { type: this.type });
				}).catch(error => {});
			}).catch(error => {});
		},

		// 修改质检周期
		handleSettingQualityPeriod() {
			SettingQualityPeriodModal.popup({
				name: "2"
			}).then(res => {	
			});
		}
	}
};
</script>

<style lang="scss">
</style>