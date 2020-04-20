<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			placeholder="请输入合同公司或姓名或手机号搜索"
			style="width: 300px"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"
		/>
		<i-button
			slot="prefix"
			type="primary"
			class="g-red-btn g-m-l-10"
			@click="handleSearch"
		>搜索</i-button>
		<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer">更多搜索条件</span>
		<!-- <span slot="extra" class="g-fs-12 g-fr g-relative" style="top: 6px">
			如何进行录入到账?
			<a class="g-c-blue-mid g-pointer" @click="handleWatchVideo('录入到账','SALE_ADD_PAYMENT')">录入到账</a>、
			<a class="g-c-blue-mid g-pointer" @click="handleWatchVideo('下单','SALE_ORDER')">下单</a>、
			<a class="g-c-blue-mid g-pointer" @click="handleWatchVideo('余额退款','SALE_LEFT_REFUND')">余额退款</a>、
			<a class="g-c-blue-mid g-pointer" @click="handleWatchVideo('更改余额','SALE_CHANGE_LEFT')">更改余额</a>
		</span> -->
		<div 
			class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
			style="padding-top:3px;padding-bottom:7px;"
		>
			<i-input
				v-model="query.customer_search"
				clearable
				placeholder="请输入客户公司或姓名或客户电话搜索"
				style="width: 220px"
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-input
				v-model="query.relation_customer_search"
				clearable
				placeholder="请输入关联公司或姓名或客户电话搜索"
				style="width: 220px"
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-input
				v-if="charge"
				v-model="query.staff_search"
				clearable
				placeholder="请输入邀约人姓名或手机号"
				style="width: 220px"
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-select
				v-if="$auth[439]"
				v-model="query.is_own"
				placeholder="我的客户"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option value="1">我的客户</i-option>
				<i-option value="2">全部客户</i-option>
			</i-select>
			<i-date-picker
				v-model="query.first_deal_time_start"
				type="date"
				placeholder="成交时间（起始）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.first_deal_time_end"
				type="date"
				placeholder="成交时间（结束）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.last_deal_time_start"
				type="date"
				placeholder="最近成交时间（起始）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.last_deal_time_end"
				type="date"
				placeholder="最近成交时间（结束）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader } from 'iview';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import SaleExpand from '../_common/expand';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'oa-sale-expand': SaleExpand,
		'i-cascader': Cascader
	},
	data() {
		const { query = {} } = this.$route;
		const location = query.location ? query.location.split(',').map(i => +i) : [];

		return {
			query: {
				search: '',
				staff_search: '',
				relation_customer_search: '',
				is_own: this.$auth[439] ? '2' : '1',
				first_deal_time_start: '',
				first_deal_time_end: '',
				last_deal_time_start: '',
				last_deal_time_end: '',
				customer_search: '',
				...query
			},
			charge: _global.staff.charge
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/customer/deal/deal',
				{
					...this.$route.query,
					...this.formatQuery(this.query)
				}
			));
			this.$store.commit('SALE_CUSTOMER_DEAL_DEAL_LIST_INIT');
		}, 300),
		formatQuery(query) {
			const _query = { ...this.query };

			Object.keys(_query).forEach(key => {
				if (_query[key] instanceof Date) {
					_query[key] = _query[key].toLocaleString().split(' ')[0].replace(/\//g, '-');
				}
			});
			return _query;
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		/**
		 * 视频教程
		 */
		handleWatchVideo(title, urlType) {
			VideoModal.popup({
				title,
				urlType
			}).then((res) => {

			});
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
