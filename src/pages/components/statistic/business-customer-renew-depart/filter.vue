<template>
	<div class="g-lh-42 g-m-t-10">
		<i-select
			v-model="query.staff_id"
			filterable
			clearable
			transfer
			placeholder="请选择员工"
			style="width:220px"
			class="g-m-r-5"
			@on-change="handleSearch"	
		>
			<i-option
				v-for="(item,index) in staffList"
				:key="index"
				:value="item.staff_id"
			>
				{{ item.staff_name }}
			</i-option>
		</i-select>
		<i-select
			v-model="query.year"
			:clearable="false"
			placeholder="年份"
			style="width:220px"
			class="g-m-r-5"
			transfer
			@on-change="handleSearch"		
		>
			<i-option
				v-for="(item,index) in yearList"
				:key="index"
				:value="item.value"
			>
				{{ item.label }}
			</i-option>
		</i-select>
		<i-button 
			type="primary"
			class="g-m-l-10"
			@click="handleSearch"
		>
			搜索
		</i-button>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getYearList } from '@utils/utils';
import { services } from '@stores/services/sale';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option

	},
	mixins: [
		services.staffList()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				year: +query.year,
				depart_id: +query.depart_id,
				staff_id: '',
				type: query.type
			},
			yearList: getYearList()
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/statistic/business/customer/renew/depart', 
				{ 
					...this.$route.query, 
					...this.query
				
				}
			));
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_LIST_INIT');
		},
		
	}
};

</script>

<style lang="scss" scoped>

</style>
