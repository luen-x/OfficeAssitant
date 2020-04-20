<template>
	<div class="g-lh-42 g-m-b-15" >
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
		<i-select
			v-if="type==1"
			v-model="query.zone_depart_id"
			clearable
			placeholder="请选择战区"
			style="width:220px"
			class="g-m-r-5"
			transfer
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
			v-if="type==2"
			:data="saleDepartTree"
			v-model="query.depart_ids"
			change-on-select
			placeholder="请选择部门"
			trigger="click"
			class="g-m-r-5"
			style="width:220px"
			clearable
			transfer
			@on-change="handleSearch"
		/>
		<i-select
			v-if="type==3"
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
import { mixins } from '../_common/util';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		"i-option": Option,
		'i-cascader': Cascader
	},
	mixins: [
		mixins.departList, 
		mixins.saleDepartTree, 
		services.departAll(), 
		services.firstDepartId(),
		services.staffList()
	],
	props: {
		type: String,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				year: +query.year,
				zone_depart_id: +query.zone_depart_id || '',
				depart_ids: [+query.zone_depart_id || ''].filter(Boolean),
				staff_id: ''
			},
			yearList: getYearList()
		};
	},
	methods: {
		handleSearch(event) {
			// this.$emit('search', { ...this.query, type: this.type });
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_INIT', { type: this.type });
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
