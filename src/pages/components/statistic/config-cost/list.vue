<template>
	<div>
		<div>
			<i-input
				v-model="search.keyword" 
				:maxlength="50"
				clearable
				placeholder="请输入产品名称" 
				style="width: 220px"
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-select
				v-model="search.category_id"
				clearable
				transfer
				style="width:220px"
				class="g-m-r-10"
				placeholder="请选择产品类型"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in list"
					:key="index"
					:value="String(item.category_id)"
				> 
					{{ item.category_name }} 
				</i-option>
			</i-select>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:table-opts="{height: tableHeight}"
			mode="table"
			class="g-m-t-20 v-statistic-config-cost-list"
			@page-size-change="handleChangePageSize"
		/>
	</div>
</template>

<script>
import { Input, Select, Option, Button } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({ expand: false, nav2: false, tab: false })
	],
	data() {
		const { query } = this.$route;

		return {
			search: {
				keyword: String(query.keyword || ''),
				category_id: String(query.category_id || '')
			},
			list: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticConfigCost.listInfo;
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	created() {
		this.loadClass();
	},
	methods: {
		loadClass() {
			this.$request({
				url: "_CONTENT_PRODUCT_CATEGORY_GET",
				type: "GET",
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'STATISTIC_CONFIG_COST_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_CONFIG_COST_LIST_INIT');
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/statistic/config/cost', 
				{ 
					...this.$route.query, 
					...this.search
				}
			));

			this.$store.commit('STATISTIC_CONFIG_COST_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss">
</style>