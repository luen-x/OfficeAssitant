<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			:maxlength="50"
			placeholder="请输入公司名称或姓名或手机号搜索"
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
		>
			搜索
		</i-button>
		<div slot="prefix" class="g-dp-ib">
			<div v-for="img in testImgs" :key="img.key" class="g-dp-ib">
				<vc-copy :value="img.key">
					<img :src="img.url" style="max-width:200px;max-height:200px"><br>
					{{ img.key }}
				</vc-copy>
			</div>
		</div>
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
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-select
				v-if="$auth[413]"
				v-model="query.is_own"
				placeholder="选择客户"
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
			<i-date-picker
				v-model="query.deal_month_start"
				type="month"
				placeholder="成交月份（起始）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.deal_month_end"
				type="month"
				placeholder="成交月份（结束）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.actual_month_start"
				type="month"
				placeholder="业绩归属月份（起始）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.actual_month_end"
				type="month"
				placeholder="业绩归属月份（结束）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.create_time_start"
				type="date"
				placeholder="录入时间（起始）"
				clearable
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.create_time_end"
				type="date"
				placeholder="录入时间（结束）"
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
import { Copy } from 'wya-vc';
import moment from 'moment';
import { debounce } from 'lodash';
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
		'i-cascader': Cascader,
		'oa-sale-expand': SaleExpand,
		'vc-copy': Copy
	},
	mixins: [services.departMy()],
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				search: '',
				staff_search: '',
				is_own: this.$auth[413] ? '2' : '1',
				depart_id: undefined,
				status: null,
				deal_month_start: '',
				deal_month_end: '',
				create_time_start: '',
				create_time_end: '',
				actual_month_start: '',
				actual_month_end: '',
				...query,
				depart_ids: (query.depart_ids && query.depart_ids.split(',').map(it => parseInt(it, 10))) || [],
			},
			charge: _global.staff.charge,
			testImgs: []
		};
	},
	mounted() {
		if (this.$route.query.test) {
			this.getConstants();
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/customer/deal/arrive',
				{
					...this.$route.query,
					fixPosition: true,
					...this.formatQuery()
				}
			));
			this.$store.commit('SALE_CUSTOMER_DEAL_ARRIVE_LIST_INIT');
		}, 300),
		handleSearchDepart: debounce(function (departs) {
			this.query.depart_id = departs[departs.length - 1];
			this.$router.replace(getHashUrl(
				'/sale/customer/deal/arrive',
				{
					...this.$route.query,
					depart_id: departs[departs.length - 1],
					fixPosition: true,
					depart_ids: departs.join(',')
				}
			));
			this.$store.commit('SALE_CUSTOMER_DEAL_ARRIVE_LIST_INIT');
		}, 300),
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					if (key == 'actual_month_start' || key == 'actual_month_end' || key == "deal_month_start" || key == "deal_month_end") {
						_query[key] = moment(this.query[key]).format("YYYY-MM");
					} else {
						_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
					}
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		getConstants() {
			const constants = require('../../../constants/constants');
			const arr = [];
			Object.keys(constants).forEach(key => {
				if (key.includes('OSS_')) {
					arr.push({ key, url: constants[key] });
				}
			});
			this.testImgs = arr;	
		},
	}
};
</script>