<template>
	<div>
		<vc-calendar ref="calendar" lang="ch" class="v-finance-main-sched-calendar" style="overflow: visible">
			<div slot-scope="month" slot="month" class="_month-header g-flex-cc">
				<i class="iconfont icon-left g-pointer" @click="handlePrev" />
				<span class="__month">
					{{ month.data.year }}年{{ MONTH_CN[month.data.month] }}月
				</span>
				<i class="iconfont icon-right g-pointer" @click="handleNext" />
			</div>
			<div slot-scope="week" slot="week" class="_week-header g-flex-ac">
				<span v-for="(item, index) in week.data" :key="index" class="g-col g-tc _week-item">
					周{{ item }}
				</span>
			</div>
			<div slot-scope="it" class="_day">
				<div class="__sech">
					<div class="g-flex-ac g-jc-sb">
						<span class="g-fs-12 __holiday">
							{{ it.holiday.holiday ? it.holiday.holiday : it.holiday.lDate }}
						</span>
						<span :class="it.data.date === it.curDate && '_cur-day g-relative'">{{ it.data.day }}</span>
					</div>
	
					<!-- todo-list -->
					<div class="_todo-container">
						<oa-todo-list 
							:data-source="todoList[it.data.date] ? todoList[it.data.date] : []" 
							:on-refresh="onRefresh" 
						/>
					</div>
	
				</div>
				<div class="_add-btn g-flex-cc" @click="handleAddSched">
					<i class="iconfont icon-add2 g-fs-12" />添加提醒事项
				</div>
			</div>
		</vc-calendar>
	</div>
</template>

<script>
import { Calendar } from 'wya-vc';
import { formatDate } from '@utils/utils';
import { MONTH_CN } from '@constants/constants';
import TodoList from '../_common/todo/todo-list';
import { AddSchedModal } from '../_common/todo/add-sched-modal';

export default {
	name: 'oa-finance-main-sche-calendar',
	components: {
		'vc-calendar': Calendar,
		'oa-todo-list': TodoList
	},
	props: {
		onRefresh: Function
	},
	data() {
		return {
			calendar: {},
			MONTH_CN
		};
	},
	computed: {
		todoList() {
			return this.$store.state.financeMainSchedule.data;
		}
	},
	created() {},
	mounted() {
		let curDate = this.$refs.calendar.curDate;
		let curDateStr = formatDate(curDate);
		let lunarDate = this.$refs.calendar.date2holiday(curDateStr);
		this.calendar = {
			week: '星期' + lunarDate.cnWeekDay,
			day: lunarDate.oDate.getDate(),
			lunarDate: '农历' + lunarDate.lMonth + '月' + lunarDate.lDate
		};
	},
	methods: {
		handleAddSched() {
			AddSchedModal.popup({}).then((res) => {
				this.onRefresh();
			}).catch((res) => {

			});
		},
		handlePrev() {
			this.$refs.calendar.prev();
			let date = this.$refs.calendar.showYear + '-' + this.formateNum(this.$refs.calendar.showMonth + 1);
			this.onRefresh && this.onRefresh(date);
		},
		handleNext() {
			this.$refs.calendar.next();
			let date = this.$refs.calendar.showYear + '-' + this.formateNum(this.$refs.calendar.showMonth + 1);
			this.onRefresh && this.onRefresh(date);
		},
		formateNum(num) {
			return num < 10 ? '0' + num : num;
		}
	},
};
</script>

<style lang="scss">
.v-finance-main-sched-calendar {
	padding: 0px 30px;
	color: #333333;
	box-sizing: content-box;
	width: 96% !important;
	._month-header {
		background-color: #f8f8f8;
		line-height: 60px;
		text-align: center;
		.__month {
			width: 200px;
			font-size: 26px;
			color: #333333;
		}
	}
	._week-item {
		height: 40px;
		line-height: 40px;
	}
	._day {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		display: black;
		text-align: center;
		box-sizing: border-box;
		cursor: pointer;
		.__sech {
			padding: 0 12px 4px 12px;
			min-height: 96px;
			max-height: 96px;
			overflow: auto;
			.__holiday {
				color: lightgray;
			}
		}
	}
	._cur-day {
		position: absolute;
		top: 4px;
		right: 4px;
		z-index: 2;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		color: #ffffff;
		background-color: #2397f9;
        box-shadow: 0px 2px 6px #2397f944;
		margin-right: -12px;
	}
	.__date-item ._day:hover {
		width: 110%;
		left: -5%;
		top: -8px;
		min-height: 116px;
		max-height: 268px;
		border-color: transparent;
		box-shadow: 0px 0px 10px #6666664f;
		background: #ffffff;
		z-index: 3;
		transition: all cubic-bezier(.78, .14, .15, .86) 0.2s;
		.__sech {
			// min-height: 116px;
			max-height: 230px;
			overflow: auto;
		}
	}
	.__date-item {
		position: relative;
		width: 240px;
		min-height: 120px;
		max-height: 120px;
		border: 1px solid #d4d4d4;
		margin-right: -1px;
		margin-bottom: -1px;
		align-items: flex-start !important;
		justify-content: flex-start !important;
		._todo-container {
			margin-bottom: 40px;
			.__empty {
				height: 0px;
				margin-top: 0px;
				img {
					height: 0px;
				}
			}
			.__item {
				height: 0px;
				padding: 11px 4px;
			}
			.__title {
				height: 26px !important;
				line-height: 26px !important;
				padding: 0 20px 0 6px !important;
				color: #ffffff;
				border-radius: 4px;
				background-color: #3da2f7 !important;
				.__tip {
					z-index: -100;
				}
			}
			.ivu-poptip:hover {
				color: #3da2f7;
			}
		}
	}
	.__date-item:hover ._add-btn {
		display: block;
	}
	._add-btn {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 38px;
		line-height: 38px;
		display: none;
		font-size: 13px;
		background: #ffffff;
		color: #2298fa;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08)
	}
}
</style>
