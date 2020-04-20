<template>
	<i-date-picker
		v-model="entry_date"
		type="month"
		clearable
		transfer
		placeholder="请选择月份"
		style="width: 220px;"
		class="g-m-r-5"
		@on-change="handleDateChange($event, 'entry')"
	/>
</template>

<script>
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { DatePicker } from "iview";

export default {
	name: "oa-filter",
	components: {
		"i-date-picker": DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			// entry_date: [query.entry_start, query.entry_end],
			entry_date: "2018-06"
		};
	},
	mounted() {
	},
	methods: {
		// 时间改变
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleSearch() {
			// 搜索
			this.$router.replace(
				getHashUrl("/hr/archives/person/details", {
					type: this.$route.query.type,
					...this.query,
				})
			);
		},
		
	}
};
</script>

<style lang="scss" scoped>
</style>