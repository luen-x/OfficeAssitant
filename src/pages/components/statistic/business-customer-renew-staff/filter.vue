<template>
	<div class="g-lh-42 g-m-t-10" >
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
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getYearList } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				year: +query.year,
				staff_id: query.staff_id
			},
			yearList: getYearList()
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/statistic/business/customer/renew/staff', 
				{ 
					...this.$route.query, 
					...this.query
				}
			));
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_STAFF_LIST_INIT');
		},
		
	}
};

</script>

<style lang="scss" scoped>

</style>
