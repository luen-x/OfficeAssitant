<template>
	<div class="js-filter" @keyup.enter="handleSearch">
		<i-input
			v-model="keyword"
			placeholder="请输入员工姓名/手机"
			style="width: 220px"
			class="g-m-r-5"
			@on-change="handleInputChange"
		/>
		<i-date-picker
			v-model="month"
			type="daterange"
			placement="bottom-end"
			placeholder="选择时间范围"
			style="width: 220px"
			@on-change="handleMonthChange"/>
		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<div
			v-if="$auth[1638]"
			class="g-fr g-red-btn-line"
			@click="handleExport">
			导出
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import API from "@stores/apis/root";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			month: []// 时间范围
		};
	},
	methods: {
		handleSearch(event) {
			let [create_time_start, create_time_end] = this.month;
			this.$router.replace(getHashUrl(
				'/academy/support/statistics/manage',
				{
					...this.$route.query,
					keyword: this.keyword,
					create_time_start,
					create_time_end,
				}
			));
			this.$store.commit('ACADEMY_SUPPORT_STATISTICS_MANAGE_LIST_INIT');

		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleMonthChange(e) {
			this.month = e;
			this.handleSearch();
		},
		handleExport() {
			window.open(getHashUrl(API.CONTENT_CONFIG_STATISTICS_MANAGE_LIST_GET, {
				...this.$route.query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
	}
};

</script>

<style lang="scss">
</style>


