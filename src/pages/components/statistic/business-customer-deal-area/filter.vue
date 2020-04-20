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
		<i-cascader
			:data="areaRegion"
			v-model="query.area"
			change-on-select
			placeholder="选择地区"
			trigger="click"
			class="g-m-r-5"
			clearable
			transfer
			@on-change="handleSearch"
		/>
		<i-button 
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, getYearList } from '@utils/utils';
import { services } from '@stores/services/sale';
import { aliasService } from '@stores/services/common';
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
		'i-cascader': Cascader,
		'oa-mix-picker': MixPicker,

	},
	mixins: [departListMixin, services.departAll(), services.firstDepartId(), aliasService.areaRegion()],
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...getDealFilterQuery(query),
				area: query.area ? query.area.split(',').map(Number) : [],
			},
			yearList: getYearList()
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			const query = { ...this.query, ...this.query.time };
			delete query.time;
			query.seasons = query.season.join(';');
			query.season = query.season[query.season.length - 1] || '';
			
			this.$router.replace(getHashUrl(
				'/statistic/business/customer/deal/area', 
				{ 
					...this.$route.query, 
					...query
				}
			));
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_DEAL_AREA_LIST_INIT');
		}, 100),
		handleTimeChange() {
			this.handleSearch();
		}
	
	}
};

</script>

<style lang="scss" scoped>

</style>
