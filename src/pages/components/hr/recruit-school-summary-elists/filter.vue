<template>
	<div class="js-filter g-m-t-20">
		<div>
			<i-input
				v-model="search"
				placeholder="请输入邮件主题或发件人"
				style="width: 220px"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-date-picker
				v-model="create_time"
				type="daterange"
				clearable
				transfer
				split-panels
				placeholder="请选择发送时间"
				style="width: 220px;"
				class="g-m-l-5 g-m-r-5"
				@on-change="handleDateChange($event, 'create_time')"/>
			<i-button
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-date-picker": DatePicker,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.name || ''),
			create_time: [query.create_time_start, query.create_time_end]
		};
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.create_time_start = val[0];
			this.create_time_end = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(
				getHashUrl("/hr/recruit/school/summary/elists", {
					...this.$route.query,
					search: this.search,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end
				})
			);
			this.$store.commit("HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_INIT");
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
