<template>
	<div class="g-flex g-jc-sb g-ai-c g-lh-42">
		<div class="g-fw-w g-lh-42">
			<i-select
				v-model="query.is_all"
				class="g-m-r-5"
				style="width: 220px"
				clearable
				transfer
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in dataList"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			<i-input
				v-model="query.interviewer_name"
				clearable
				placeholder="请输入面试官姓名"
				class="g-m-r-5"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-date-picker
				:value="query.year_month"
				type="month"
				clearable
				transfer
				class="g-m-r-5"
				style="width: 220px;"
				placeholder="请选择月份"
				@on-change="handleDateChange($event, 'year_month')"
			/>

			<i-button
				type="primary"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div
			class="g-red-btn-line"
			style="margin-top: 2px;"
			@click="handleOutput">
			导出
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
	},
	mixins: [
	],
	props: {
		type: {
			type: String,
			default: ""
		},
	},
	data() {
		const { query = {} } = this.$route;
		return {
			dataList: [
				{ label: '全部数据', value: '1' },
				{ label: '我的数据', value: '0' }
			],
			staffData: [],
			query: {
				...query,
				is_all: query.is_all || '1',
			}
		};
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDateChange(val, name) {
			this.query[`${name}`] = val;
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics',
				{
					...this.query,
					type: this.type
				}
			));

			this.$store.commit('HR_RECRUIT_INTERVIEWER_STATISTICS_LIST_INIT');
		}, 300),
		// 导出数据
		handleOutput: lodash.debounce(function () {
			const { query = {} } = this.$route;
			let url = getHashUrl(API_ROOT['HR_RECRUIT_INTERVIEWER_STATISTICS_LIST_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				'-token': this.$global.token
			});
			window.open(url);
		}, 300),
	}
};
</script>

<style lang="scss" scoped>

</style>


