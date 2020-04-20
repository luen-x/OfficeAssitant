<template>
	<div class="g-flex c-calendar-container">
		<vc-calendar 
			ref="calendar"
			lang="en"
			class="c-calendar"
		>
			<div 
				slot-scope="month"
				slot="month"
				class="_month-header g-flex-cc"
			>
				<i 
					class="iconfont icon-left g-pointer" 
					@click="$refs.calendar.prev()"
				/>
				<span class="__month">
					{{ month.data.year }}年{{ MONTH_EN[month.data.month] }}月
				</span>
				<i 
					class="iconfont icon-right g-pointer" 
					@click="$refs.calendar.next()"
				/>
			</div>
			<div 
				slot-scope="it"
				:class="it.data.date === it.curDate ? '_cur-day' : date === it.data.date && '_selected'"
				class="_day g-flex-ac g-fd-c"
				@click="handleClick(it.data.date)"
			>
				<span class="g-fs-14">{{ it.data.day }}</span>
				<span 
					:class="it.holiday.holiday && it.data.date !== it.curDate && 'g-c-red-mid'" 
					class="g-fs-12"
				>
					{{ it.holiday.holiday ? it.holiday.holiday : it.holiday.lDate }}
				</span>
				<span v-if="dataSource[it.data.date]" class="_dot" />
			</div>
		</vc-calendar>
		<div class="g-flex g-fd-c g-col g-m-l-30 g-pd-r-20" style="min-width: 260px;" >
			<div class="c-date-detail g-flex-ac g-jc-sb">
				<div class="g-flex-ac" style="color: #495060">
					<span class="_day">{{ calendar.day }}</span>
					<div class="g-m-l-10">
						<p class="g-fs-14">{{ calendar.week }}</p>
						<p class="g-fs-14">{{ calendar.lunarDate }}</p>
					</div>
				</div>
				<div 
					class="_add g-flex-cc g-pointer" 
					@click="handleAddSched"
				>
					<i class="iconfont icon-add2 g-fs-20" style="color: #4b89f1" />
				</div>
			</div>
			<slot />
		</div>
	</div>
</template>

<script>
import { Calendar } from 'wya-vc';
import { formatDate } from '@utils/utils';
import { MONTH_EN } from '@constants/constants';

export default {
	name: 'hr-main-calendar',
	components: {
		'vc-calendar': Calendar
	},
	props: {
		date: String,
		onRefresh: Function,
		addSched: Function,
		dataSource: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			calendar: {},
			MONTH_EN,
			data() {
				return {
					dates: ""
				};
			}
		};
	},
	created() {
	},
	mounted() {
		let curDate = this.$refs.calendar.curDate;
		let curDateStr = formatDate(curDate);
		this.setCalendar(curDateStr);
	},
	methods: {
		handleClick(date) {
			this.dates = date;
			this.$emit('update:date', date);
			this.setCalendar(date);
			this.onRefresh && this.onRefresh(date);
		},
		handleAddSched() {
			this.addSched && this.addSched(this.dates);
		},
		setCalendar(curDate) {
			let lunarDate = this.$refs.calendar.date2holiday(curDate);
			this.calendar = {
				week: '星期' + lunarDate.cnWeekDay,
				day: lunarDate.oDate.getDate(),
				lunarDate: '农历' + lunarDate.lMonth + '月' + lunarDate.lDate
			};
		},
	},
};
</script>

<style lang="scss">
.c-calendar-container {
	margin-bottom: 30px;
	min-width: 600px;
}
.c-calendar {
	flex: 1;
	min-width: 490px !important;
	box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	._month-header {
		background-color: #f8f8f8;
		line-height: 60px;
		text-align: center; 
		.__month {
			width: 200px;
			font-size: 22px;
			color: #333333;
		}
	}
	._day {
		border: 1px solid transparent;
		position: relative;
		display: black;
		width: 48px;
		height: 48px;
		text-align: center;
		box-sizing: border-box;
		cursor: pointer;
		margin-bottom: 10px;
		&:hover {
			background-color: #F0F4FC;
		}
	}
	._cur-day {
		color: #ffffff;
		background-color: #2397f9;
		box-shadow: 0px 2px 6px #2397f999;
		&:hover {
			background-color: #2397f9;
		}
	}
	._selected {
		border: 1px solid #2397f9; 
		box-shadow: 0px 0px 6px #2397f944;
	}
	._dot {
		position: absolute;
		bottom: 4px;
		left: 0;
		right: 0;
		margin: 0 auto;
		display: block;
		width: 4px;
		height: 4px;
		border-radius: 2px;
		background-color: #2397f9;
	}
	.__calendar-item {
		padding-left: 20px;
		padding-right: 20px;
	}
}
.c-date-detail {
	height: 100px;
	box-sizing: border-box;
	._day {
		font-size: 60px;
		font-weight: bolder;
		font-family: "Microsoft YaHei"
	}
	._add {
		width: 46px;
		height: 46px;
		border: 1px solid #4b89f1;
		border-radius: 50%;
		box-shadow: 2px 6px 10px rgba(75, 137, 241, 0.4);
	}
}
</style>
