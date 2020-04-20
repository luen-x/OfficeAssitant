<template>
	<div>
		<div class="g-m-t-20 js-filter">
			<i-input
				v-model="search.course_name"
				clearable
				placeholder="请输入课程名称进行搜索"
				style="width: 220px"
				class="g-m-r-5 g-m-l-10"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-date-picker
				v-model="date"
				type="datetimerange"
				split-panels
				format="yyyy-MM-dd HH:mm"
				separator=" 至 "
				clearable
				transfer
				placeholder="请选择报名时间"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'time')"
			/>
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
import lodash from 'lodash';
import moment from 'moment';
import { Input, Button, Select, Option, Divider, Tooltip, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand,
		'i-divider': Divider,
		'i-tooltip': Tooltip,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				course_name: query.course_name || '',
			},
			date: [query.start_time, query.end_time],
			show: false,
			origin_data: [
				{
					id: '1',
					label: '线上报名'
				},
				{
					id: '2',
					label: '链接报名'
				}
			],
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
			this.search[`start_${name}`] = val[0];
			this.search[`end_${name}`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/train/course/detail',
				{
					...this.$route.query,
					...this.search,
					date: this.date,
					fixPosition: true
				}
			));
			this.$store.commit('SALE_TRAIN_COURSE_DETAIL_LIST_INIT');
		}, 300),
		formatQuery() {
			const _query = {};
			Object.keys(this.search).forEach(key => {
				if (this.search[key] instanceof Date) {
					_query[key] = moment(this.search[key]).format("YYYY-MM-DD HH:mm");
				} else {
					_query[key] = this.search[key];
				}
			});
			return _query;
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
