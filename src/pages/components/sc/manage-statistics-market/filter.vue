<template>
	<div>
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div class="g-flex g-flex-ac">
				<i-select 
					v-model="search.staff_id"
					placeholder="请输入选择服务人或管理人姓名" 
					style="width:300px" 
					clearable 
					transfer
					filterable
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item in staff" 
						:value="item.staff_id" 
						:key="item.staff_id"
					>
						{{ item.staff_name }}
					</i-option>
				</i-select>
				<i-button 
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span 
					class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
					@click="handleToggle" 
				>
					更多搜索条件
					<i 
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>

			<div v-if="$auth[1485]" class="g-flex">
				<vc-debounce-click class="g-red-btn-line g-m-r-5" @click="handleExport">
					导出
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-10 g-lh-42 g-bg-gray-mid g-flex"
			>
				<i-date-picker
					v-model="placeOrderTime"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择客户合作时间段"
					style="width: 220px;"
					class="g-m-r-10"
					@on-change="handleSearch"
				/>

				<i-cascader
					v-model="service_person_depart_id"
					:data="date"
					:change-on-select="true"
					trigger="click"
					clearable
					transfer
					placeholder="请选择部门"
					style="width: 220px;"
					class="g-m-r-10"
					@on-change="handleDepartChange"
				/>

				<i-select
					v-model="search.customer_type"
					transfer
					clearable
					style="width:220px;"
					placeholder="请选择查看范围"
					class="g-m-r-10"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in scope"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import moment from "moment";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from "@stores/services/sc";
import { ExportModal } from "./popup/export";

export default {
	name: 'oa-filter',

	components: {
		'i-input': Input,
		'i-button': Button,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		'vc-expand': Expand
	},

	mixins: [services.departAll({ autoLoad: false })],

	data() {
		const { query = {} } = this.$route;
		return {
			flag: true,
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			search: {
				customer_type: String(query.customer_type || "3"),
				staff_id: Number(query.staff_id) || null
			},
			placeOrderTime: [query.place_order_start_time, query.place_order_end_time],
			service_person_depart_id: query.service_person_depart_id ? query.service_person_depart_id.split(',').map((item) => Number(item)) : [], // 部门
			show: false,
			scope: [
				{
					value: "1",
					label: "查看所有（包含到期、退款）"
				},
				{
					value: "2",
					label: "只看未退款客户"
				},
				{
					value: "3",
					label: "只看未退款未到期客户"
				}
			],
			staff: []
		};
	},

	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return [...this.departAll];
		}
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.loadDepartAll();
		this.loadStaffData();
	},

	methods: {
		loadStaffData() {
			this.$request({
				url: "_HR_MUTI_TERM_STAFF_DEPART_GET",
				type: "GET",
				param: {}
			}).then(res => {
				this.staff = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sc/manage/statistics/market', 
				{ 
					...this.$route.query,
					...this.search,
					fixPosition: true,
					keyword: this.keyword,
					name: this.name,
					place_order_start_time: this.placeOrderTime[0] && moment(this.placeOrderTime[0]).format("YYYY-MM-DD"),
					place_order_end_time: this.placeOrderTime[1] && moment(this.placeOrderTime[1]).format("YYYY-MM-DD"),
					service_person_depart_id: this.service_person_depart_id.length 
						? this.service_person_depart_id : null
				}
			));
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_LIST_INIT');
		},
		
		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleExport() {
			const { query = {} } = this.$route;
			query.customer_type = query.customer_type || "3";
			query.type = query.type || 1;
			query.service_person_depart_id = query.service_person_depart_id 
				? (query.service_person_depart_id + '').split(",")[(query.service_person_depart_id + '').split(",").length - 1] : null;
			query.page = "";
			query.pageSize = "";

			ExportModal.popup({
				query
			}).then(res => {
			});
		},

		handleDepartChange(selection) {
			this.service_person_depart_id = selection;
			this.handleSearch();
		}
	}
};
</script>

<style lang="scss" scoped>
</style>