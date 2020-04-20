<template>
	<div>
		<oa-head/>
		<div class="g-m-t-20 g-lh-40 js-filter">
			<i-date-picker
				v-model="create_time_start"
				type="date"
				format="yyyy-MM-dd"
				placeholder="请选择开始日期"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleChangeStartTime"
			/>
			<i-date-picker
				v-model="create_time_end"
				type="date"
				format="yyyy-MM-dd"
				placeholder="请选择结束日期"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleChangeEndTime"
			/>
			<i-select
				v-model="category"
				placeholder="请选择分类"
				style="width: 220px"
				clearable
				transfer
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in categoryList"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>

			</i-select>
			<i-select
				v-model="balance_type"
				placeholder="请选择收支类型"
				style="width: 220px"
				clearable
				transfer
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item,index) in typeList"
					:key="index"
					:value="index+1"
				>{{ item }}</i-option>
			</i-select>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import head from './head';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand,
		'oa-head': head
	},
	data() {
		const { query = {} } = this.$route;
		// const categoryList = ['旧资料更新', '标记资料', 'OA打电话', '跟进记录', '发起举报', '录入到账', '下单', '错误的公司关联', '手动变更', '道具'];
		const typeList = ['收入', '支出'];
		return {
			create_time_start: query.create_time_start || '',
			create_time_end: query.create_time_end || '',
			categoryList: [],
			typeList,
			category: query.category || '',
			balance_type: query.balance_type || '',
		};
	},
	mounted() {
		this.loadCategory();
	},
	methods: {
		loadCategory() {
			this.$request({
				url: '_CONTENT_REWARD_COIN_CATEGORY_GET',
				type: 'GET',
			}).then((res) => {
				this.categoryList = res.data;
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleChangeStartTime(time) {
			this.create_time_start = time;
			this.handleSearch();
		},
		handleChangeEndTime(time) {
			this.create_time_end = time;
			this.handleSearch();
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/personnel/currency',
				{
					...this.$route.query,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					category: this.category,
					balance_type: this.balance_type,
				}
			));
			this.$store.commit('HR_PERSONNEL_CURRENCY_LIST_INIT');
		},
	}
};

</script>

<style lang="scss">

</style>
