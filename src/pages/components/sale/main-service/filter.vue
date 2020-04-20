<template>
	<div @keyup.enter="handleSearch">
		<div style="margin-top:15px">
			<i-input
				v-model="company_info"
				placeholder="请输入公司名称或客户姓名"
				style="width: 300px"
				clearable
				@on-change="handleInputChange"
			/>
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
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top:3px;padding-bottom:7px;"
			>
				<i-select
					ref="provider"
					v-model="staff_id"
					:remote-method="remote1"
					:loading="loading"
					placeholder="请输入服务人姓名"
					filterable
					clearable
					transfer
					remote
					class="g-m-r-5"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(option, index) in staffList"
						:value="option.staff_id"
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
				<i-cascader
					v-model="depart_id"
					:data="departAll"
					style="width: 220px; display: inline-block"
					class="g-m-r-5"
					clearable
					transfer
					change-on-select
					trigger="click"
					placeholder="请选择服务人部门"
					@on-change="handleDepartSearch"
				/>
				<i-input-number
					v-model="min_score"
					:min="0"
					:max="99"
					:precision="2"
					:active-change="false"
					placeholder="服务人最低分"
					style="width: 100px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				~
				<i-input-number
					v-model="max_score"
					:min="0"
					:max="99"
					:precision="2"
					:active-change="false"
					placeholder="服务人最高分"
					style="width: 100px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				<i-date-picker
					v-model="month"
					format="yyyy-MM-dd"
					type="daterange"
					split-panels
					style="width: 220px"
					class="g-m-r-5"
					transfer
					placeholder="请选择客户合作时间段"
					@on-change="handleMonth"
				/>
				<i-select
					v-model="customer_type"
					placeholder="请选择查看范围"
					clearable
					transfer
					class="g-m-r-5"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in customerScope"
						:value="item.value"
						:key="index"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					v-model="is_quality"
					placeholder="客户是否已质检"
					clearable
					transfer
					class="g-m-r-5"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in qualityScope"
						:value="item.value"
						:key="index"
					>{{ item.label }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>
<script>
import { Input, Button, Cascader, InputNumber, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/sale";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { serviceDetail } from './popup/serviceDetail';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-date-picker': DatePicker,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll()
	],
	data() {
		const customerScope = [
			{ label: '查看（包含退款，到期客户）', value: '1' },
			{ label: '只查看未退款客户', value: '2' },
			{ label: '只看未退款未到期客户', value: '3' }];
		const qualityScope = [
			{ label: '查看未质检客户', value: '0' },
			{ label: '查看已质检客户', value: '1' }
		];
		const { query = {} } = this.$route;
		return {
			customerScope,
			qualityScope,
			staffList: [],
			month: [query.place_order_start_time, query.place_order_end_time] || [],
			show: false,
			loading: false,
			customer_type: query.customer_type || '',
			is_quality: query.is_quality || '',
			company_info: String(query.company_info || ''),
			min_score: Number(query.min_score) || null,
			max_score: Number(query.max_score) || null,
			staff_id: Number(query.staff_id) || '',
			depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
			service_person_depart_id: query.service_person_depart_id || '',
		};
	},
	mounted() {
		this.remote1('', true);
	},
	methods: {
		handleMonth(v) {
			this.month = v;
			setTimeout(() => {
				this.handleSearch();
			});
		},
		handleDepartSearch(depart_ids) {
			this.depart_id = depart_ids;
			let ids = [...depart_ids];
			this.service_person_depart_id = ids[ids.length - 1];
			this.handleSearch();
		},
		handleSearch(event) {
			const { query } = this.$route.query;
			this.$router.replace(getHashUrl(
				'/sale/main/service',
				{
					...query,
					company_info: this.company_info,
					place_order_start_time: this.month[0],
					place_order_end_time: this.month[1],
					min_score: this.min_score,
					max_score: this.max_score,
					staff_id: this.staff_id,
					service_person_depart_id: this.service_person_depart_id,
					is_quality: this.is_quality,
					customer_type: this.customer_type,
					depart_id: this.depart_id
				}
			));
			this.$store.commit('SALE_MAIN_SERVICE_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleServiceDetail() {
			serviceDetail.popup({}).then().catch();
		},
		remote1(query, all) {
			if (query !== '' || all) {
				this.loading = true;
				return this.$request({
					url: "_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET",
					type: 'GET',
					param: {
						search: query == 1 ? '' : query // 为了能搜索到全部的员工数据（手机号码必定有1）
					},
					loading: false
				}).then((res) => {
					this.loading = false;
					this.staffList = res.data;
				});
			}
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
