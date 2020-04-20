<template>
	<div>
		<i-button 
			v-if="$auth[1759]" 
			type="primary" 
			class="g-fr js-filter" 
			style="margin-top: 6px;" 
			@click="handleAdd">添加案例</i-button>
		<div class="g-lh-42" style="margin-top:-5px">
			<i-input
				v-model="query.keyword" 
				placeholder="请输入素材标题或产品信息" 
				style="width: 220px"
				class="g-m-r-5"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-cascader
				:data="region"
				v-model="query.location"
				change-on-select
				placeholder="请选择地区"
				trigger="click"
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-change="handleSearch"
			/>
			<i-select
				v-model="query.customer_type"
				placeholder="请选择客户类型"
				style="width:220px"
				class="g-m-r-5"
				clearable
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in customerTypeList"
					:value="item.customer_type_id+''"
					:key="item.customer_type_str"
				>
					{{ item.customer_type_str }}
				</i-option>
			</i-select>
			<i-button 
				type="primary"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option } from 'iview';
import { services as commonServices } from '@stores/services/common';
import { services as saleServices } from '@stores/services/sale';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [
		commonServices.region(),
		saleServices.customerTypeList()
	],
	data() {
		const { query = {} } = this.$route;
		let location = query.location ? query.location.split(',').map(Number) : [];
		
		return {
			query: {
				keyword: '',
				customer_type: '',
				province: '',
				city: "",
				area: '',
				...query,
				location,
			},
		};
	},
	watch: {
		'query.location': function (val) {
			this.query.province = val[0] || '';
			this.query.city = val[1] || '';
			this.query.area = val[2] | '';
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/academy/support/case', 
				{ 
					...this.$route.query,
					...this.query
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_CASE_LIST_INIT');
		}, 300),
		handleAdd() {
			this.$router.push('/academy/support/case/add');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
