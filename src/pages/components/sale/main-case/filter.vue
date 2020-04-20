<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.keyword"
			:maxlength="50"
			placeholder="请输入案例内容、产品信息进行搜索"
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
				:data="region"
				v-model="query.location"
				change-on-select
				placeholder="请选择地区"
				class="g-m-r-5"
				style="width:220px"
				clearable
				transfer
				@on-change="handleSearch"
			/>
			
			<i-select
				v-model="query.industry_id"
				clearable
				placeholder="请选择行业"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option 
					v-for="item in industryList"
					:value="item.industry_id"
					:key="item.industry_id"
				>
					{{ item.industry_name }}
				</i-option>
			</i-select>
			<i-select
				v-model="query.customer_type"
				clearable
				placeholder="请选择客户类型"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option 
					v-for="item in customerTypeList"
					:value="item.customer_type_id"
					:key="item.customer_type_id"
				>
					{{ item.customer_type_str }}
				</i-option>
			</i-select>
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, InputNumber, Button, Icon, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services as commonService } from '@stores/services/common';
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
	mixins: [commonService.region(), services.industryList(), services.customerTypeList()],
	data() {
		const query = this.$route.query || {};
		const location = query.location ? query.location.split(',').map(Number) : [];

		return {
			query: {
				keyword: '',
				province: '',
				city: '',
				industry_id: "",
				customer_type: '',
				...query,
				location,
				
			},
			list: []
		};
	},
	watch: {
		'query.location': function (val) {
			this.query.province = val[0] || '';
			this.query.city = val[1] || '';

		}

	},
	mounted() {
	},
	methods: {
		handleSearch: debounce(function (event) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/sale/main/case',
				{

					...this.$route.query,
					...this.query
				}
			));
			this.$store.commit('SALE_MAIN_CASE_LIST_INIT');
		}, 200),
		
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
	}
};
</script>