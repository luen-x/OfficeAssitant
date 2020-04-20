<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search.company_info"
				:maxlength="50"
				clearable
				placeholder="请输入客户公司、姓名或手机号" 
				style="width: 300px" 
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
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
		
		<vc-expand ref="expand" v-model="show">
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.quality_staff_name" 
					clearable
					placeholder="请输入质检人员" 
					style="width: 220px" 
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="quality_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择质检开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-select
					v-model="search.call_status"
					clearable
					transfer
					filterable
					multiple
					style="width:220px;"
					placeholder="请选择上次接通情况"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in calls"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="search.product_id"
					style="width: 220px;"
					class="g-m-r-5 _select-input"
					clearable
					transfer
					filterable
					placeholder="请选择下单产品"
					transfer-class-name="v-sc-service-inspection-record-select"
					@on-change="handleSearch"
				>
					<!--防止空格产生BUG-->
					<i-option 
						v-for="item in productList" 
						:value="item.product_id" 
						:key="item.product_id"
					>{{ item.product_name }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import moment from "moment";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-filter",

	components: {
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"vc-expand": Expand
	},

	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				company_info: String(query.company_info || ""), // 客户姓名/手机号/公司名
				quality_staff_name: String(query.quality_staff_name || ""), // 质检人员
				call_status: query.call_status ? query.call_status.split(',').map((item) => item) : [], // 质检接通状况
				product_id: String(query.product_id || "") // 下单产品id
			},
			quality_time: [query.quality_start_time, query.quality_end_time], // 质检开始/结束时间
			show: false,
			calls: [
				{
					label: "正常接通",
					value: "1"
				}, 
				{
					label: "未接",
					value: "2"
				}, 
				{
					label: "无效",
					value: "3"
				}, 
				{
					label: "雷区",
					value: "4"
				}, 
				{
					label: "非雷",
					value: "5"
				}, 
				{
					label: "1正常",
					value: "6"
				}, 
				{
					label: "2非雷",
					value: "7"
				}, 
				{
					label: "2雷区",
					value: "8"
				}, 
				{
					label: "不回访",
					value: "9"
				}, 
				{
					label: "暂不回访",
					value: "10"
				}, 
				{
					label: "到期",
					value: "11"
				}, 
				{
					label: "已退",
					value: "12"
				}, 
				{
					label: "未评",
					value: "13"
				},
				{
					label: "完结",
					value: 14
				}
			],
			productList: []
		};
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.loadProductData();
	},

	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sc/service/inspection/record', 
				{ 
					...this.$route.query, 
					...this.search,
					quality_start_time: this.quality_time[0] && moment(this.quality_time[0]).format("YYYY-MM-DD"),
					quality_end_time: this.quality_time[1] && moment(this.quality_time[1]).format("YYYY-MM-DD"),
					call_status: this.search.call_status.length ? this.search.call_status : null
				}
			));

			this.$store.commit('SC_SERVICE_INSPECTION_RECORD_LIST_INIT');
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		// 下单产品列表
		loadProductData() {
			this.$request({
				url: '_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET',
				type: "GET",
				param: {
					is_all: 0
				}
			}).then(res => {
				res.data.forEach(item => {
					this.productList.push({
						product_id: item.product_id,
						product_name: item.product_name
					});
				});
			}).catch((error) => {
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-service-inspection-record-select{
	max-width: 220px !important;
}
</style>