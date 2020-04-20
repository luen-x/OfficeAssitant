<template>
	<div class="g-m-t-15">
		<oa-mix-picker 
			v-model="query.time"
			:type="query.type"
			class="g-m-r-5"
			clearable
			@change="handleSearch"
		/>
		<i-select
			v-model="query.depart_id"
			clearable
			placeholder="请选择战区"
			style="width:220px"
			class="g-m-r-5"
			@on-change="handleSearch"
				
		>
			<i-option
				v-for="(item,index) in departList"
				:key="index"
				:value="item.value"
			>
				{{ item.label }}
			</i-option>
		</i-select>
		<i-select
			v-model="query.discount"
			clearable
			placeholder="请选择折扣"
			style="width:220px"
			class="g-m-r-5"
			@on-change="handleSearch"	
		>
			<i-option
				v-for="(item,index) in discountList"
				:key="index"
				:value="item.discount_id"
			>
				{{ item.discount_name }}
			</i-option>
		</i-select>
		<i-button 
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getYearList } from '@utils/utils';
import { services } from '@stores/services/sale';
import MixPicker, { getInitTime, getTargetSeasonTree } from '../_common/mix-picker';
import { departListMixin, getDealFilterQuery } from '../_common/util';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'oa-mix-picker': MixPicker,
	},
	mixins: [departListMixin, services.departAll(), services.firstDepartId(), services.customerTypeList()],

	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...getDealFilterQuery(query),
				discount: +query.discount || '',
			},
			yearList: getYearList(),
			discountList: [
				{ discount_id: 1, discount_name: "8-9折" },
				{ discount_id: 2, discount_name: "9折以上" }
			]
		};
	},
	methods: {
		handleSearch(event) {
			const query = { ...this.query, ...this.query.time };
			delete query.time;
			query.seasons = query.season.join(';');
			query.season = query.season[query.season.length - 1] || '';
			
			this.$router.replace(getHashUrl(
				'/statistic/business/customer/deal/discount', 
				{
					...this.$route.query, 
					...query
				}
			));
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_LIST_INIT');
		},
	}
};

</script>

<style lang="scss" scoped>

</style>


