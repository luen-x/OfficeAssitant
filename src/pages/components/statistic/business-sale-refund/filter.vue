<template>
	<div>
		<div>
			<i-select
				v-model="search.current_tab"
				transfer
				style="width:220px;"
				class="g-m-r-10"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in dateLabel"
					:value="String(item.value)"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>

			<oa-mix-picker
				v-model="time"
				:type="+search.current_tab"
				class="g-m-r-10"
				@change="handleSearch"
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
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-20">
				<i-input
					v-model="search.product_name"
					clearable
					placeholder="产品名称搜索" 
					style="width: 220px" 
					class="g-m-r-10"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				
				<i-select
					v-model="search.reason_category_id"
					transfer
					clearable
					style="width:220px;"
					class="g-m-r-10"
					placeholder="请选择退款原因"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in treeList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="search.category_id"
					transfer
					clearable
					class="g-m-r-10"
					style="width:220px;"
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

				<i-select
					v-model="search.refund_type"
					transfer
					clearable
					class="g-m-r-10"
					style="width:220px;"
					placeholder="请选择退款类型"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in reufundType"
						:key="index"
						:value="item.value"
					> 
						{{ item.label }} 
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import MixPicker, { getInitTime } from '../_common/mix-picker';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'oa-mix-picker': MixPicker,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				current_tab: String(query.current_tab || ''),
				reason_category_id: String(query.reason_category_id || ''),
				category_id: String(query.category_id || ''),
				refund_type: String(query.refund_type || ''),
				product_name: String(query.product_name || '')
			},
			time: {
				year: +query.year,
				season: [+query.season.split(",")[0].split("-")[0], query.season],
				month: query.month
			},
			dateLabel: [
				{
					label: '累计',
					value: 1
				},
				{
					label: '年度',
					value: 2
				},
				{
					label: '季度',
					value: 3
				},
				{
					label: '月度',
					value: 4
				}
			],
			show: false,
			treeList: [],
			list: [],
			reufundType: [
				{
					label: '产品退款',
					value: '1'
				},
				{
					label: '余额退款',
					value: '2'
				}
			]
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	created() {
		this.loadTree();
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
		loadTree() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_REFUND_TREE_GET',
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.treeList = res.data.map(item => {
					return {
						label: item.reason_category_name,
						value: String(item.reason_category_id)
					};
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/statistic/business/sale/refund', 
				{ 
					...this.$route.query, 
					...this.search,
					...this.time,
					season: this.time.season[1],
				}
			));
			this.$store.commit('STATISTIC_BUSINESS_SALE_REFUND_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>