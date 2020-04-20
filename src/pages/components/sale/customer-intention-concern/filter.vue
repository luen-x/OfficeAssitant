<template>
	<oa-sale-expand :bar="false" class="js-filter v-sale-customer-intention-concern-filter" style="margin-top:10px">
		<i-input
			slot="prefix"
			v-model="query.search"
			:maxlength="50"
			placeholder="请输入公司名称搜索"
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
		<div
			class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
			style="padding-top:3px;padding-bottom:7px;"
		>
			<i-cascader
				:data="region3"
				v-model="query.location"
				change-on-select
				clearable
				class="g-m-r-5"
				placeholder="选择地区"
				style="width:220px;"
				@on-change="handleSearch"
			/>
			<i-select
				v-model="query.industry_id"
				clearable
				transfer
				style="width:220px;"
				class="g-m-r-5"
				placeholder="选择行业"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in industryList"
					:value="String(item.industry_id)"
					:key="item.industry_id"
				>
					{{ item.industry_name }}
				</i-option>
			</i-select>
			<i-input-number
				v-model="query.capital_min"
				placeholder="注册资金最小值（万）"
				clearable
				style="width: 220px;margin-right:5px !important"
				@keyup.enter.native="handleSearch"
				@on-change="handleClear"
			/>
			<i-input-number
				v-model="query.capital_max"
				placeholder="注册资金最大值（万）"
				clearable
				style="width: 220px;margin-right:5px !important"
				@keyup.enter.native="handleSearch"
				@on-change="handleClear"
			/>
			<i-input-number
				v-model="query.turn_min"
				placeholder="最小转手次数"
				clearable
				style="width: 220px;margin-right:5px !important"
				@keyup.enter.native="handleSearch"
				@on-change="handleClear"
			/>
			<i-input-number
				v-model="query.turn_max"
				placeholder="最大转手次数"
				clearable
				style="width: 220px;margin-right:5px !important"
				@keyup.enter.native="handleSearch"
				@on-change="handleClear"
			/>
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, InputNumber, Button, Icon, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sale';
import { TableTitle } from '@components/_common/table-title/table-title';
import SaleExpand from '@components/sale/_common/expand';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'oa-sale-expand': SaleExpand,
		'i-cascader': Cascader,
	},
	mixins: [services.region3(), services.industryList()],
	data() {
		const query = this.$route.query || {};
		const location = query.location ? query.location.split(',').map(Number) : [];
		return {
			query: {
				search: query.search || '',
				location: query.location ? query.location.split(',').map(Number) : [],
				industry_id: query.industry_id || '',
				capital_min: query.capital_min ? Number(query.capital_min) : null,
				capital_max: query.capital_max ? Number(query.capital_max) : null,
				turn_min: query.turn_min ? Number(query.turn_min) : null,
				turn_max: query.turn_max ? Number(query.turn_max) : null
			},
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.selected = [];
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/sale/customer/intention/concern',
				this.formatQuery(),
				
			));
			this.$store.commit('SALE_CUSTOMER_INTENTION_CONCERN_LIST_INIT');
		}, 200),
		formatQuery() {
			const _query = { ...this.query };
			_query.location[0] && (_query.province = _query.location[0]);
			_query.location[1] && (_query.city = _query.location[1]);
			_query.location[2] && (_query.area = _query.location[2]);
			return _query;
		},
		handleClear(val) {
			if (val === null) {
				this.handleSearch();
				return;
			} else if (typeof val === 'number') {
				return; 
			}
			val = val.target.value;
			
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
	}
};
</script>
<style lang="scss">
.v-sale-customer-intention-concern-filter {
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>
