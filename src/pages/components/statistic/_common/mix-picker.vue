<template>
	<i-select
		v-if="typeName==='year'"
		v-model="query.year"
		:clearable="clearable"
		placeholder="年份"
		style="width:220px"
		@on-change="handleYearChange"		
	>
		<i-option
			v-for="(item,index) in yearList"
			:key="index"
			:value="item.value"
		>
			{{ item.label }}
		</i-option>
	</i-select>

	<i-cascader
		v-else-if="typeName==='season'"
		:data="seasonTree_"
		v-model="query.season"
		:clearable="clearable"
		placeholder="季度"
		trigger="click"
		style="width: 220px"
		@on-change="handleSeasonChange"
	/>
	<i-date-picker
		v-else-if="typeName==='month'"
		:value="query.month"
		:clearable="clearable"
		:options="dateOption"
		type="month"
		placeholder="月份"
		style="width: 220px"
		@input="handleDateInput"
		@on-change="handleMonthChange"
	/>
</template>
<script>
import { Input, Button, Select, Option, Cascader, DatePicker } from 'iview';
import moment from 'moment';
import { getSeasonTree, getYearList } from '@utils/utils';
import { services } from '@stores/services/sale';


const typeNameMap = {
	1: '',
	2: 'year',
	3: 'season',
	4: 'month'
};
const seasons = [
	{ label: '1月-3月', value: ['01', '03'] },
	{ label: '4月-6月', value: ['04', '06'] },
	{ label: '7月-9月', value: ['07', '09'] },
	{ label: '10月-12月', value: ['10', '12'] }
];
export const getInitTime = (startMonth = "2018-01", endMonth) => {
	const mon = moment(endMonth);
	const curYear = mon.get('year');
	const curMonth = mon.get('month');
	const curSeason = parseInt(curMonth / 3, 10) + 1;
	const value = seasons[curSeason - 1].value;
	const curSeasonValue = `${curYear}-${value[0]},${curYear}-${value[1]}`;
	return {
		year: curYear,
		season: [curYear, curSeasonValue],
		month: mon.format("YYYY-MM"),
	};
};
export const getTargetSeasonTree = (data) => {
	const result = [];
	const now = [];
	data.forEach(item => {
		const arr1 = item.start_time.split('-');
		const arr2 = item.end_time.split('-');
		const year = arr1[0];
		const year2 = arr2[0];
		const monthStart = +arr1[1];
		const monthEnd = +arr2[1];
		if (item.default) {
			now.push(year);
			now.push(item.config_id);
		}
		let exist = result.find(it => it.value === year);
		if (!exist) {
			exist = { label: year + '年', value: year, children: [] };
			result.push(exist);
		}
		let label;
		if (year === year2) {
			label = monthStart + '月-' + monthEnd + '月';
		} else { // 如果存在跨年的情况
			label = item.start_time + '~' + item.end_time;
		}
		exist.children.push({ label, value: item.config_id });
	});
	return { tree: result, value: now };
};

export default {
	name: 'oa-statistic-common-mix-picker',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select, 
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
	},
	model: {
		event: 'change',
		prop: 'value'
	},
	props: {
		type: [String, Number], // month, season, year
		startMonth: {
			type: [String, Date],
			default: '2018-01'
		},
		endMonth: {
			type: [String, Date],
			default: () => new Date()
		},
		value: Object, // {month:'',season:[],year:2018}
		seasonTree: Array,
		clearable: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			query: {
				...this.value
			},
			// seasonTree_: this.seasonTree || getSeasonTree(this.startMonth, this.endMonth),
			yearList: getYearList(moment(this.startMonth).get('year'), moment(this.endMonth).get('year')),
			dateOption: {
				disabledDate: (date) => {
					return !(moment(date).isSameOrAfter(this.startMonth, 'month') && moment(date).isSameOrBefore(this.endMonth, 'month'));
				}
			}
		};
	},
	computed: {
		typeName() {
			if (typeof this.type === 'string') {
				return this.type;
			} else if (typeNameMap[this.type]) {
				return typeNameMap[this.type];
			} else {
				// console.error('mix-picker: unknow type ' + this.type);
				return '';
			}
		},
		seasonTree_() {
			return this.seasonTree || getSeasonTree(this.startMonth, this.endMonth);
		}

	},
	watch: {
		value(val) {
			this.query = val;
		}
	},
	methods: {
		handleMonthChange(month) {
			this.$emit('month-change', moment(month).format('YYYY-MM'));
			this.$emit('change', { ...this.query, month: this.formatMonth(month) });
		},
		handleYearChange(year) {
			this.$emit('year-change', year);
			this.$emit('change', { ...this.query, year, month: this.formatMonth() });
		},
		handleSeasonChange(season) {
			this.$emit('season-change', season);
			this.$emit('change', { ...this.query, season, month: this.formatMonth() });
		},
		getInitTime() {
			return getInitTime(this.startMonth, this.endMonth);
		},
		handleDateInput(month) {
			this.query.month = moment(month).format('YYYY-MM'); 
		},
		formatMonth(month) {
			month = (month || this.query.month);
			if (month && month != 'Invalid date') {
				return moment(month).format('YYYY-MM');
			} else {
				return '';
			}
		}
		// reset(type) {
		// 	if (type === undefined) {
		// 		this.query = this.getInitTime();
		// 	} else if (type === 'year') {
		// 		this.query.year = moment(this.endMonth).get('year');
		// 	} else if (type === 'month') {
		// 		this.query.month = this.endMonth;
		// 	} else if (type === 'season') {
		// 		const curMonth = moment(this.endMonth).get('month');
		// 		const curSeason = parseInt(curMonth / 3, 10) + 1;

		// 		this.query.season = curSeason;
		// 	}
		// }
	}
};
</script>
<style lang="scss">
</style>