<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="search.staff"
					:maxlength="15"
					style="width: 300px;"
					clearable
					placeholder="请输入员工姓名/手机号"
					@on-enter="handleSearch"
					@on-change="handleInputChange"/>

				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch">
					搜索
				</i-button>

				<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark" />
				</span>
			</div>
			<!-- <oa-label/> -->
			<vc-debounce-click
				class="g-red-btn-line"
				@click="handleOutput">
				导出
			</vc-debounce-click>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select
					ref="product"
					v-model="search.product_id"
					:remote-method="loadProduct"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择产品"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in productList"
						:key="index"
						:value="item.product_id"
					>{{ item.product_name }}</i-option>
				</i-select>
				<i-date-picker
					v-model="search.month"
					type="month"
					clearable
					transfer
					split-panels
					placeholder="请选择服务提成结算月份"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange"/>
				<i-cascader
					:data="departAll"
					v-model="search.depart_ids"
					:change-on-select="true"
					transfer
					clearable
					placeholder="请选择组织"
					trigger="click"
					style="width: 220px;display: inline-block"
					class="g-m-r-5"
					@on-change="handleSearch" />
				<i-select
					v-model="search.service_amount_type"
					style="width: 220px"
					clearable
					transfer
					@on-change="handleSearch">
					<i-option
						v-for="item in typeList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import Label from '../../_common/product-label/product-label';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		'vc-expand': Expand,
		"i-cascader": Cascader,
		'oa-label': Label
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			search: {
				month: query.month || moment().format('YYYY-MM'),
				product_id: Number(query.product_id),
				service_amount_type: +query.service_amount_type || 1,
				depart_id: query.depart_id ? Number(query.depart_id) : null,
				...query,
				depart_ids
			},
			show: false,
			productList: [],
			productLoading: false,
			typeList: [
				{ label: '查看所有员工', value: 0 },
				{ label: '只看有服务提成的员工', value: 1 },
				{ label: '只看无服务提成的员工', value: 2 }
			]
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		}
	},
	methods: {
		loadProduct(query) {
			this.$request({
				url: API_ROOT._FINANCE_PRODUCT_GET,
				type: "GET",
				param: {
					product_name: query
				}
			}).then(res => {
				this.productList = res.data;
			}).catch((error) => {
				this.productList = [];
			});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// handleQueryChange(query = '') {
		// 	let targetQuery = this.search.product_name || '';
		// 	if (targetQuery.length > query.length) {
		// 		this.$refs.product.clearSingleSelect();
		// 	}
		// },
		// handleChange(value) {
		// 	this.search.product_id = value ? value.value : '';
		// 	this.search.product_name = value ? value.label : '';
		// 	this.handleSearch();
		// },
		handleDateChange(val) {
			this.search.month = val;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/services/commission',
				{
					...this.$route.query,
					...this.search,
					month: this.search.month ? moment(this.search.month).format('YYYY-MM') : '',
				}
			));
			this.$store.commit('FINANCE_SERVICES_COMMISSION_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleOutput() {
			let { query = {} } = getParseUrl();

			const url = getHashUrl(API_ROOT['_FINANCE_COMMISSION_LIST_EXPORT_GET'], {
				...query,
				month: moment(this.search.month).format('YYYY-MM'),
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
