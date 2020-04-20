<template>
	<div class="v-academy-schedule-calendar">
		<vc-calendar
			ref="calendar"
			lang="ch"
			class="v-hr-main-sched-calendar"
			style="overflow: visible"
		>
			<div slot-scope="month" slot="month" class="_month-header g-flex">
				<div style="width:370px;padding-left:10px;margin-right:-10px">
					<span
						v-for="item in filters"
						:key="item.value"
						:class="{
							__active:activeFilter==item.value,
							[item.class]:true
						}"
						class="g-pointer _filter"
						@click="handleClickFilter(item)"
					>
						{{ item.label }}
					</span>
				</div>
				<div class="g-col g-tc" style="padding-right:60px">
					<i class="iconfont icon-left g-pointer" @click="handlePrev"/>
					<span class="__month">{{ month.data.year }}年{{ MONTH_CN[month.data.month] }}月</span>
					<i class="iconfont icon-right g-pointer" @click="handleNext"/>
				</div>
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
						<span>
							<span
								class="g-fs-12 __holiday"
							>
								{{ it.holiday.holiday ? it.holiday.holiday : it.holiday.lDate }}
							</span>
							<span
								v-if="getShowApply(it.data.date)"
								class="g-bg-blue-mid g-c-white g-fs-12 g-pd-lr-5  g-m-l-5"
								style="border-radius:1px">报名</span>
						</span>
						<span
							:class="it.data.date === it.curDate && '_cur-day g-relative'"
						>
							{{ it.data.day }}
						</span>
					</div>
					<div
						v-for="(item, index) in getDatePlan(it.data.date)"
						:key="index"
						:class="getItemClass(item)"
						class="__item"
					>
						{{ item.schedule_name }}
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
	name: 'hr-academy-schedule-calendar',
	components: {
		"vc-calendar": Calendar
	},
	props: {
		datas: Object,
	},
	data() {
		return {
			MONTH_CN,
			calendarData: {},
			curMonth: moment().format('YYYY-MM'),
			date: '', // 当前选中的日期
			filters: [
				{ label: '全部日程', value: 0, class: "__orange" },
				{ label: '我的日程', value: 3, class: "__red" },
				{ label: '公司大课', value: 1, class: "__green" },
				{ label: '三立课程', value: 2, class: "__blue" }
			],
			activeFilter: 0


		};
	},
	computed: {
		lecturerList() {
			let { query } = this.$route;
			return query.lecture_id ? query.lecture_id.split(',').map(it => it + "") : [];
		}
	},
	mounted() {
		let curDate = this.$refs.calendar.curDate;
		this.loadMonthData(this.curMonth);
	},
	methods: {
		getItemClass(item) {
			if (item.type == 1) { // 活动（公司大课）
				return '__green';
			} else if (item.type == 2) { // 三立培训
				return '__blue';
			} else if (item.type == 3) { // 我的日程
				if (item.push_range == 1) {
					return '__red'; // 自己可见
				} else {
					return '__orange'; // 他人可见（推送给他人）
				}
			} else return '';
		},
		handlePrev() {
			this.$refs.calendar.prev();
			this.curMonth = this.$refs.calendar.showYear
                + "-"
                + this.formateNum(this.$refs.calendar.showMonth + 1);
			this.loadMonthData(this.curMonth);
		},

		handleNext() {
			this.$refs.calendar.next();
			this.curMonth = this.$refs.calendar.showYear
                + "-"
                + this.formateNum(this.$refs.calendar.showMonth + 1);
			this.loadMonthData(this.curMonth);
		},
		formateNum(num) {
			return num < 10 ? "0" + num : num;
		},
		handleClick(it) {
			this.date = it.data.date;
			this.$emit('select', it.data.date);
		},
		setCalendar(curDate) {
			let lunarDate = this.$refs.calendar.date2holiday(curDate);
			this.calendar = {
				week: '星期' + lunarDate.cnWeekDay,
				day: lunarDate.oDate.getDate(),
				lunarDate: '农历' + lunarDate.lMonth + '月' + lunarDate.lDate
			};
		},
		loadMonthData(month) {
			if (this.calendarData[month]) return;
			this.$request({
				url: "_SALE_MAIN_MATTER_SCHEDULE_MONTH_GET",
				type: "GET",
				param: { month },
				loading: false,
			}).then(res => {
				this.$set(this.calendarData, month, res.data);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		getDatePlan(date) {
			const plans = ((this.calendarData[this.curMonth] && this.calendarData[this.curMonth][date]) || []).filter(ele => {
				if (this.activeFilter == 0) return true;
				else return ele.type == this.activeFilter;
			});
			if (plans.length > 3) {
				plans.length = 3;
			}
			return plans;
		},
		getShowApply(date) {
			const arr = this.getDatePlan(date);
			return !!arr.find(item => item.can_apply);
		},
		fresh() {
			this.calendarData = {};
			this.loadMonthData(this.curMonth);
		},
		handleClickFilter(item) {
			this.activeFilter = item.value;
			this.$emit('filter-change', item.value);
		}
	},
};
</script>

<style lang="scss">
.v-academy-schedule-calendar {
    display: inline-block;
    color: #333333;
    box-sizing: content-box;
    overflow: hidden;
    .__calendar-item{
        padding: 10px 20px 20px 0px;
    }
    ._month-header {
        background-color: #f8f8f8;
        // padding-left: 313px;
        line-height: 60px;
         height: 60px;
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
                border-radius: 2px 2px 0 0 ;
                background-color: #E9F4FE;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                border-left: 2px solid currentColor;
                padding-left: 10px;
                &.__red {
                    background: rgba(236,80,91,0.8);
                    color: white;
                    border-color: #E71C2B

                }
                &.__blue {
                    background: rgba(35,151,249,0.05);
                    color: #3697E7;
                    border-color: #2397F9

                }
                &.__green {
                    background: rgba(93,202,77,0.05);
                    color: #3EBF2B;
                    border-color: #3EBF2B;

                }
                 &.__orange {
                    background: rgba(255,144,0,0.05);
                    color: #D46E24;
                    border-color: #FF9000;

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

    .__date-item:hover ._add-selected {
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .__select {
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
    ._add-selected {
        display: none;
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
    ._filter {
        background:white;
        height: 32px;
        width: 80px;
        line-height: 32px;
        text-align: center;
        border:1px solid rgba(232,232,232,1);
        border-radius:3px;
        display: inline-block;
        color: #4B4F57;
        margin-right: 10px;
        &.__orange.__active {
            background: #FF9945;
            border-color: #FF9945;
            color: white;
        }
        &.__green.__active {
            background: #5DCA4D;
            border-color: #5DCA4D;
            color: white;
        }
         &.__red.__active {
            background: #EC505B;
            border-color: #EC505B;
            color: white;
        }
         &.__blue.__active {
            background: #2E9DFA;
            border-color: #2E9DFA;
            color: white;
        }
    }
}
</style>
