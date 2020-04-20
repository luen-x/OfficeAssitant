<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			:maxlength="50"
			placeholder="请输入公司名称或姓名或手机号"
			style="width: 300px"
			clearable
			@on-change="handleClear"
			@on-enter="handleSearch"
		/>
		<i-button
			slot="prefix"
			type="primary"
			class="g-red-btn g-m-l-10"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer">更多搜索条件</span>
		<div
			class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
			style="padding-top:3px;padding-bottom:7px;"
		>
			<i-input
				v-if="charge"
				v-model="query.staff_search"
				clearable
				placeholder="请输入邀约人姓名或手机号"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleClear"
				@on-enter="handleSearch"
			/>
			<i-select
				v-if="$auth[455]"
				v-model="query.is_own"
				placeholder="请选择客户类型"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option value="1">我的客户</i-option>
				<i-option value="2">全部客户</i-option>
			</i-select>
			<i-cascader
				v-if="departMy.length>0"
				v-model="query.depart_ids"
				:data="departMy"
				clearable
				change-on-select
				placeholder="请选择组织"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearchDepart"
			/>
			<i-select
				v-model="query.refund_type"
				clearable
				placeholder="请选择退款类型"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<!-- <i-option value="1">合同退款</i-option>
				<i-option value="2">换合同退款</i-option> -->
				<i-option value="3">余额退款</i-option>
				<i-option value="1">产品退款</i-option>
				<i-option value="2">换产品退款</i-option>
			</i-select>
			<i-date-picker
				v-model="query.create_time_start"
				type="date"
				placeholder="申请时间（起始）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.create_time_end"
				type="date"
				placeholder="申请时间（结束）"
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
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sale';
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
	mixins: [services.departMy()],
	data() {
		const { query = {} } = this.$route;
		const _query = { ...query };

		return {
			query: {
				search: null,
				staff_search: null,
				refund_type: null,
				depart_id: null,
				type: null,
				is_own: this.$auth[455] ? '2' : '1',
				create_time_start: null,
				create_time_end: null,
	              ...query,
				depart_ids: (query.depart_ids && query.depart_ids.split(',').map(it => parseInt(it, 10))) || [],

			},
			charge: _global.staff.charge
		};
	},
	methods: {

		handleSearch: debounce(function (event) {
			const { query = {} } = this.$route;
			const _query = { ...query };
			if (_query.depart_id) _query.depart_id = _query.depart_id.split(',');
			this.$router.replace(getHashUrl(
				'/sale/customer/deal/refund',
				{
					...this.$route.query,
					...this.formatQuery(this.query),
					fixPosition: true,
				}
			));
			this.$store.commit('SALE_CUSTOMER_DEAL_REFUND_LIST_INIT');
		}, 300),
		handleSearchDepart: debounce(function (departs) {
			this.query.depart_id = departs[departs.length - 1];
			this.$router.replace(getHashUrl(
				'/sale/customer/deal/refund',
				{
					...this.$route.query,
					depart_id: departs[departs.length - 1],
					depart_ids: departs.join(','),
					fixPosition: true,
				}
			));
			this.$store.commit('SALE_CUSTOMER_DEAL_REFUND_LIST_INIT');
		}, 300),
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		}
	}
};

</script>

<style lang="scss" scoped>
</style>
