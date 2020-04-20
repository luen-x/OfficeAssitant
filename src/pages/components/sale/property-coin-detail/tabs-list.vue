<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label"
			:name="item.value"
		>
			<div class="js-filter g-m-b-20">
				<div>
					<i-select
						v-model="search.category"
						style="width: 300px"
						clearable
						transfer
						placeholder="分类选择"
						@on-change="handleSearch"
					>
						<i-option
							v-for="(v, index) in categoryList"
							:key="index"
							:value="v.value"
						>
							{{ v.label }}
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
						@click="handleToggle(index)"
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
					<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
						<i-datepicker
							v-model="time"
							type="daterange"
							clearable
							transfer
							placeholder="请选择日期"
							separator=" 至 "
							style="width: 220px;"
							class="g-m-r-5"
							@on-change="handleDateChange($event, '')"
						/>
						<i-select
							v-model="search.balance_type"
							style="width: 220px"
							clearable
							transfer
							placeholder="收支选择"
							@on-change="handleSearch"
						>
							<i-option
								v-for="(v, index) in balanceTypeList"
								:key="index"
								:value="v.value"
							>
								{{ v.label }}
							</i-option>
						</i-select>
					</div>
				</vc-expand>
			</div>
			<vc-paging
				:columns="getColumns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:table-opts="{height: tableHeight}"
				:history="true"
				:load-data="loadData"
				class="v-sale-property-coin-detail-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Input, Button, Select, Option, Cascader, DatePicker } from 'iview';
import { Paging, Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'vc-expand': Expand,
	},
	mixins: [item, tableHeight({ nav2: false })],
	data() {
		const { query } = this.$route;

		return {
			show: false,
			search: {
				status: Number(query.status) || null,
				category: Number(query.category) || null,
				balance_type: Number(query.balance_type) || null,
			},
			time: [query.create_time_start, query.create_time_end],
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待结算', value: '0' },
				{ label: '已结算', value: '1' },
				{ label: '已失效', value: '2' }
			],
			categoryList: [],
			balanceTypeList: [
				{
					label: '收入',
					value: 1
				}, {
					label: '支出',
					value: 2
				}
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.salePropertyCoinDetail.listInfo;
		}
	},
	mounted() {
		this.loadCategory();
	},
	methods: {
		handleDateChange(val, name) {
			this.search[`create_time_start`] = val[0];
			this.search[`create_time_end`] = val[1];
			this.handleSearch();
		},
		handleToggle(index) {
			this.$refs.expand[index].toggle();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/property/coin/detail',
				{
					...this.$route.query,
					...this.search,
				}
			));
			this.$store.commit('SALE_PROPERTY_COIN_DETAIL_LIST_INIT');
		}, 300),
		loadCategory() {
			this.$request({
				url: '_CONTENT_REWARD_COIN_CATEGORY_GET',
				type: 'GET',
			}).then((res) => {
				this.categoryList = res.data;
			}).catch((error) => {
				console.error(error, 'error');
			});
		},

		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_PROPERTY_COIN_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					staff_id: this.$route.query.staff_id,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/property/coin/detail', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_PROPERTY_COIN_DETAIL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
