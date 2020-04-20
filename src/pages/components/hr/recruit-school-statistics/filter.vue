<template>
	<div class="js-filter">
		<!-- <i-input
			v-model="search"
			clearable
			placeholder="请输入关键字搜索"
			style="width: 220px; margin-right: 5px"
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>
		<i-date-picker
			v-model="applicant_time"
			type="daterange"
			transfer
			placeholder="选择招聘会日期"
			style="width: 220px"
			@on-change="handleSearch"
		/> -->
		<i-select
			v-model="search.year" 
			transfer
			clearable
			placeholder="请选择招聘会年份"
			class="g-m-r-5"
			style="width: 300px" 
			@on-change="handleSearch"
		>
			<i-option
				v-for="(item, index) in meetingYear"
				:key="index"
				:value="item.value"
			>
				{{ item.label }}
			</i-option>
		</i-select>
		<i-select
			v-model="search.season" 
			transfer
			clearable
			placeholder="请选择招聘季"
			class="g-m-r-5"
			style="width: 300px" 
			@on-change="handleSearch"
		>
			<i-option
				v-for="(item, index) in seasonType"
				:key="index"
				:value="item.value"
			>
				{{ item.label }}
			</i-option>
		</i-select>
		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<div class="g-fr">
			<div
				class="g-red-btn-line g-m-r-5" 
				@click="handleExport"
			>
				导出
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/hr';
import { services as commonServices } from '@stores/services/common';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [
		services.meetingYear(),
		services.seasonType()
	],
	data() {
		const { query = {} } = this.$route;
		const splitDay = moment().format('YYYY') + '-08-31';
		return {
			search: {
				season: +query.season || moment().isBefore(splitDay) ? 1 : 3,
				year: +query.year || Number(moment().format('YYYY')),
			},
			show: false
		};
	},
	created() {
		this.handleSearch();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/school/statistics',
				{
					...this.$route.query,
					...this.search
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_STATISTICS_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleExport() {
			let { query = {} } = getParseUrl();
			let api;
			if (query.type == '1' || !query.type) {
				api = 'HR_RECRUIT_SCHOOL_STATISTICS_LIST_GET';
			} else if (query.type == '2') {
				api = 'HR_RECRUIT_SCHOOL_STATISTICS_DATA_LIST_GET';
			} else {
				api = 'HR_RECRUIT_SCHOOL_STATISTICS_POSITION_LIST_GET';
			}
			const url = getHashUrl(API_ROOT[api], {
				is_export: 1,
				...query,
				...this.sort,
				"-token": this.$global.token
			});

			window.open(url);
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
