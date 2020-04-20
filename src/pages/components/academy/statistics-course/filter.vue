<template>
	<div class="js-filter">
		<!-- <i-select
			v-if="+type === 3"
			v-model="search.practice_type"
			transfer
			style="width:300px;"
			class="g-m-r-5"
			placeholder="请选择课程"
			@on-change="handleSearch"
		>
			<i-option
				v-for="item in courseList"
				:value="item.value"
				:key="item.value"
			>
				{{ item.label }}
			</i-option>
		</i-select> -->

		<i-input
			v-if="search.practice_type != 1"
			v-model="search.course_name"
			:maxlength="50"
			clearable
			placeholder="请输入课程名称进行搜索"
			style="width: 300px;"
			class="g-m-r-5"
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>

		<i-date-picker
			v-model="time"
			clearable
			transfer
			type="daterange"
			split-panels
			placeholder="授课时间"
			style="width: 300px;"
			@on-change="handleSearch"
		/>
		<!-- <i-date-picker
			v-model="start_time"
			:options="{disabledDate:startTimeDisable}"
			placeholder="授课开始时间"
			class="g-m-r-5"
			type="date"
			style="width: 220px"
			@on-change="handleSearch"
		/>
		<i-date-picker
			v-model="end_time"
			:options="{disabledDate:endTimeDisable}"
			placeholder="授课结束时间"
			type="date"
			style="width: 220px"
			@on-change="handleSearch"
		/> -->
		<vc-debounce-click
			:tag="Button"
			type="primary"
			class="g-m-l-5 g-red-btn-small"
			style="width: 60px;height:32px"
			@click="handleSearch"
		>
			搜索
		</vc-debounce-click>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from "moment";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker
	},
	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				practice_type: String(query.practice_type || '0'),
				course_name: String(query.course_name || '')
			},
			time: [query.start_time, query.end_time] || [],
			courseList: [
				{
					value: '0',
					label: '课程名称'
				},
				{
					value: '1',
					label: '课程类型'
				}
			],
			show: false
		};
	},
	computed: {
		type() {
			return this.$route.query.type || '1';
		}
	},
	watch: {
		type(val) {
			if (val != 3) {
				return this.search.practice_type = '0';
			}
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/statistics/course',
				{
					...this.$route.query,
					...this.search,
					fixPosition: true,
					start_time: this.time[0] && moment(this.time[0]).format("YYYY-MM-DD"),
					end_time: this.time[1] && moment(this.time[1]).format("YYYY-MM-DD"),
					practice_type: this.type === '3' ? this.search.practice_type : null
				}
			));
			this.$store.commit('ACADEMY_STATISTICS_COURSE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// startTimeDisable(date) {
		// 	if (!this.end_time) {
		// 		return false;
		// 	}
		// 	return !(moment(date).isAfter(moment(this.end_time).subtract(6, 'month')) && moment(date).isBefore(moment(this.end_time)));
		// },
		// endTimeDisable(date) {
		// 	if (!this.start_time) {
		// 		return false;
		// 	}
		// 	return !(moment(date).isBefore(moment(this.start_time).add(6, 'month')) && moment(date).isAfter(moment(this.start_time)));
		// },
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>