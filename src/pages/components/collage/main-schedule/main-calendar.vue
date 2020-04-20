<template>
	<div class="v-collage-schedule-calendar" style="min-width:750px">
		<vc-calendar
			ref="calendar"
			lang="ch"
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
				:class="{_selected:date === it.data.date,'__red-border':isRedBorder(it) }"
				class="_day g-col"
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
						<div v-if="type == '1'">
							<div 
								v-for="(i, index1) in item.slice(0, 3)" 
								:key="index1" 
								:class="date === it.data.date && '__selected-item'"
								class="__item"
							>
								<span :class="datas.lectureArray.includes(+i.lecturer_id) ? '__red' : ''">
									{{ i.lecturer_name }}
								</span>
							</div>
						</div>
						<div v-if="type == '2'">
							<div 
								v-for="(i, index1) in item.slice(0, 3)" 
								:key="index1" 
								:class="date === it.data.date && '__selected-item'"
								class="__item"
							>
								<span 
									v-for="(k, index2) in i" 
									:key="index2"
								>
									<span :class="datas.lectureArray.includes(+k.lecturer_id) ? '__red' : ''">
										{{ k.lecturer_name }}
									</span>
									<span v-if="index2 !== i.length - 1">|</span>
								</span>
							</div>
						</div>
						<div class="g-flex-cc _add-selected">
							共{{ item.length }}条
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

export default {
	name: 'hr-academy-schedule-calendar',
	components: {
		"vc-calendar": Calendar
	},
	props: {
		type: String,
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
	computed: {
		
	},
	created() {
	},
	mounted() {
		let curDate = this.$refs.calendar.curDate;
		let curDateStr = formatDate(curDate);
		this.setCalendar(curDateStr);
	},
	methods: {
		clearRedParent() {
			let dom = document.querySelectorAll('.__red-border');
			dom.forEach(node => {
				node.classList.remove('__red-border');
			});
		},
		findRedParent(dom) {
			let parent = dom.parentNode;
			if (parent.nodeName === 'BODY') {
				return;
			}
			if (parent.classList.contains('__date-item')) {
				// parent.style.borderColor = 'red';
				// parent.style.zIndex = 2;
				parent.classList.add('__red-border');
			} else {
				this.findRedParent(parent);
			}
		},  
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
		isRedBorder(it) {
			let isRed = '';
			if (this.type == '1') {
				isRed = this.datas[it.data.date] && this.datas[it.data.date].find(item => this.datas.lectureArray.includes(+item.lecturer_id));
			} else if ((this.type == '2')) {
				if (this.datas[it.data.date]) {
					let arr = this.datas[it.data.date].reduce((pre, cur) => {
						return pre.concat(cur);
					}, []);
					isRed = arr.find(item => this.datas.lectureArray.includes(+item.lecturer_id));
				}
			}
			return isRed;
		}
	},
};
</script>

<style lang="scss">
.v-collage-schedule-calendar {
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
    .__red-border {
        z-index: 1;
        border-color: red !important;
    }
    ._day {
        box-sizing: border-box;
        cursor: pointer;
        height: 100%;
        border: 1px solid #d4d4d4;     
        &:hover,&._selected {
            transition: all cubic-bezier(0.78, 0.14, 0.15, 0.86) 0.2s;
            border:none !important;
            min-height: 130px;
            max-height: 300px;
            border-color: transparent;
            box-shadow: 0px 0px 10px #6666664f;
            background: #ffffff;
            z-index: 3;
            transform: scale(1.1);
            ._add-selected {
                display: block;
            }
	    }
        &.__red-border {
            border-color: red !important;
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
        
        .__sech {
            padding: 0 8px 4px 5px;
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
                // white-space: nowrap;
                padding-left:5px;
                 &.__selected-item {
                    color: #fff;
                    background-color: #2397f9;
                }
                .__circle {
                    display: inline-block;
                    width: 6px;
                    font-size: 16px;
                    color: #2397F9;
                }
                .__red {
                    color: #E84C57;
                }
            }
        }
    }
    ._cur-day {
        margin-top: 4px;
        z-index: 2;
        width: 22px;
        height: 22px;
        line-height: 22px;
        border-radius: 20px;
        color: #ffffff;
        background-color: #2397f9;
        box-shadow: 0px 2px 6px #2397f944;
        font-size: 12px;
        text-align: center;
    }
    .__date-item {
        position: relative;
        width: 240px;
        min-height: 120px;
        max-height: 120px;
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
