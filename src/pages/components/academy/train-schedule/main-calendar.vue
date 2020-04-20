<template>
	<div class="v-academy-train-schedule-calendar">
		<vc-calendar
			ref="calendar"
			lang="ch"
			class="v-hr-main-sched-calendar"
			style="overflow: visible"
		>
			<div slot-scope="month" slot="month" class="_month-header g-flex-cc">
				<i class="iconfont icon-left g-pointer" @click="handlePrev"/>
				<span class="__month">{{ month.data.year }}年{{ MONTH_CN[month.data.month] }}月</span>
				<i class="iconfont icon-right g-pointer" @click="handleNext"/>
			</div>
			<div slot-scope="week" slot="week" class="_week-header g-flex-ac">
				<span
					v-for="(item, index) in week.data"
					:key="index"
					class="g-col g-tc _week-item"
				>周{{ item }}</span>
			</div>
			<div 
				slot-scope="it" 
				:class="date === it.data.date && '_selected '"
				class="_day"
				@click="handleClick(it)"
			>
				<div class="__sech">
					<div class="g-flex-ac g-jc-sb">
						<span
							class="g-fs-12 __holiday"
						>{{ it.holiday.holiday ? it.holiday.holiday : it.holiday.lDate }}</span>
						<span
							:class="it.data.date === it.curDate && '_cur-day g-relative'"
						>{{ it.data.day }}</span>
					</div>

					<!-- todo-list -->
					<div 
						v-for="(item, index) in datas[it.data.date] ? [datas[it.data.date]] : []"
						:key="index"
					>
						<div 
							v-for="(i, index1) in item.slice(0, 3)" 
							:key="index1" 
							:class="i.is_open_online_apply && '__selected-item'"
							class="__item"
						>
							
							<!-- <div 
								
								:class="date === it.data.date && '__selected-circle'" 
								class="__circle"
							/> -->
							<span 
								:class="i.is_open_online_apply && '__selected-name'" 
								class="__item-name"
							>
								{{ i.course_name }}
							</span>
						</div>
						<div :class="date === it.data.date ? '_add-selected' : '_add-btn'" class="g-flex-cc">
							已安排{{ item.length }}节课
						</div>
					</div>
				</div>

			</div>
		</vc-calendar>
	</div>
</template>

<script>
import { Calendar } from "wya-vc";
import { formatDate } from '@utils/utils';
import { MONTH_CN } from "@constants/constants";
import moment from 'moment';
import { setTimeout } from 'timers';

export default {
	name: 'v-train-academy-schedule-calendar',
	components: {
		"vc-calendar": Calendar
	},
	props: {
		datas: Object,
		onRefresh: Function,
	},
	data() {
		const date = moment(new Date()).format('YYYY-MM-DD');
		return {
			MONTH_CN,
			calendar: {},
			date,
			classNumber: ''
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
		handlePrev() {
			this.$refs.calendar.prev();
			let date = this.$refs.calendar.showYear
                + "-"
                + this.formateNum(this.$refs.calendar.showMonth + 1);
			this.onRefresh && this.onRefresh(date);
		},

		handleNext() {
			this.$refs.calendar.next();
			let date = this.$refs.calendar.showYear
                + "-"
                + this.formateNum(this.$refs.calendar.showMonth + 1);
			this.onRefresh && this.onRefresh(date);
		},
		formateNum(num) {
			return num < 10 ? "0" + num : num;
		},
		handleClick(it) {
			this.date = it.data.date;
			this.$emit('select', it);
			// this.setCalendar(it.data.date);
			// this.onRefresh && this.onRefresh();
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
.v-academy-train-schedule-calendar {
    display: inline-block;
    padding: 0px 20px 30px 0;
    color: #333333;
    box-sizing: content-box;
    overflow: hidden;
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
        text-align: left;
        box-sizing: border-box;
        cursor: pointer;
        .__sech {
            padding: 0 12px 4px 12px;
            min-height: 116px;
            height: 115px;
            pointer-events: none;
            .__holiday {
                color: lightgray;
            }
            .__item {
                color: #000;
                width: 100%;
                height: 18px;
                line-height: 18px;
                font-size: 12px;
                margin-bottom: 4px;
                margin-top: 4px;
                border-radius: 2px;
                background-color: #E9F4FE;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                &.__selected-item {
                    background-color: #FDECEE;
                }
                .__item-name {
                    padding-left: 10px;
                    border-left: 2px solid #2397F9;
                }
                .__selected-name {
                    border-left: 2px solid #E74854;
                }
            }
        }
    }

    ._cur-day {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 2;
        width: 22px;
        height: 22px;
        line-height: 22px;
        border-radius: 20px;
        color: #ffffff;
        background-color: #2397f9;
        box-shadow: 0px 2px 6px #2397f944;
        margin-right: -12px;
        font-size: 12px;
        text-align: center;
    }
    ._selected {
		width: 110%;
        height: 112%;
        left: -5%;
        top: -8px;
        min-height: 130px;
        max-height: 300px;
        border-color: transparent;
        box-shadow: 0px 0px 10px #6666664f;
        background: #ffffff;
        z-index: 3;
        transition: all cubic-bezier(0.78, 0.14, 0.15, 0.86) 0.2s;
	}

    .__date-item ._day:hover {
        width: 110%;
        height: 112%;
        left: -5%;
        top: -8px;
        min-height: 130px;
        max-height: 300px;
        border-color: transparent;
        box-shadow: 0px 0px 10px #6666664f;
        background: #ffffff;
        z-index: 5;
        transition: all cubic-bezier(0.78, 0.14, 0.15, 0.86) 0.2s;
        .__sech {
            min-height: 116px;
            max-height: 230px;
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
        ._item {
            margin: 4px 0px !important;
            .ivu-poptip {
                margin-top: 0px;
                padding: 2px 0px !important;
                font-size: 12px !important;
            }
            .ivu-poptip:hover {
                color: #3da2f7;
            }
            .__icon {
                i {
                    color: #fff !important;
                    font-size: 12px !important;
                }
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
        }
    }

    .__date-item:hover ._add-btn {
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    ._add-selected {
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 39px;
        line-height: 39px;
        font-size: 13px;
        text-align: center;
        background: #ffffff;
        color: #2298fa;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
    }
    ._add-btn {
        width: 100%;
        height: 39px;
        line-height: 39px;
        display: none;
        font-size: 13px;
        text-align: center;
        background: #ffffff;
        color: #2298fa;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
    }
}
</style>
