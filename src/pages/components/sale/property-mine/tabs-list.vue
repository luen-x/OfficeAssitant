<template>
	<div class="v-property-mine">
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
				<div v-if="type == '2'" class="js-filter g-m-b-20">
					<div>
						<i-input
							v-model="search.search"
							:maxlength="50"
							placeholder="请输入公司名称" 
							style="width: 300px" 
							clearable
							@on-enter="handleSearch"
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
							<i-select
								v-model="search.prop_type"
								style="width: 220px"
								clearable
								transfer
								placeholder="请选择道具"
								@on-change="handleSearch"
							>
								<i-option
									v-for="(v, index) in propertyList"
									:key="index"
									:value="v.type_id"
								>
									{{ v.type_name }}
								</i-option>
							</i-select>
							<i-select
								v-model="search.status"
								style="width: 220px"
								class="g-m-r-5"
								clearable
								transfer
								placeholder="请选择生效状态"
								@on-change="handleSearch"
							>
								<i-option
									v-for="(v, index) in statusList"
									:key="index"
									:value="v.id"
								>
									{{ v.name }}
								</i-option>
							</i-select>
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
					class="v-sale-property-mine-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Input, Button, Select, Option, Cascader, DatePicker } from 'iview';
import { Paging, Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import { tableHeight } from '@extends/mixins/tableHeight';
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
	mixins: [item, tableHeight({ extra: 60 })],
	data() {
		const { query } = this.$route;

		return {
			show: false,
			search: {
				search: query.search || '',
				status: Number(query.status) || null,
				prop_type: Number(query.prop_type) || null,
			},
			time: [query.create_start_time, query.create_end_time],
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '未使用', value: '1' }, 
				{ label: '已使用', value: '2' }
			],
			statusList: [
				{
					id: 1,
					name: '待生效',
				},
				{
					id: 2,
					name: '生效中',
				},
				{
					id: 3,
					name: '已失效',
				}
			],
			propertyList: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.salePropertyMine.listInfo;
		}
	},
	created() {
		this.loadPropertyData();
	},
	methods: {
		handleToggle(index) {
			this.$refs.expand[index].toggle();
		},
		loadPropertyData() {
			this.$request({
				url: "_SALE_PROPERTY_LIST_GET",
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				this.propertyList = res.data;
			});
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search[`create_time_start`] = val[0];
			this.search[`create_time_end`] = val[1];
			this.handleSearch();
		},

		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/property/mine', 
				{ 
					...this.$route.query,
					...this.search,
				}
			));
			this.$store.commit('SALE_PROPERTY_MINE_LIST_INIT');
		}, 300),
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: this.type == '2' ? "_SALE_PROPERTY_MINE_LIST_GET" : "SALE_PROPERTY_MINE_LIST_GET",
				redirect: 'SALE_PROPERTY_MINE_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					type: this.type,
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
			this.$router.replace(getHashUrl('/sale/property/mine', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_PROPERTY_MINE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
