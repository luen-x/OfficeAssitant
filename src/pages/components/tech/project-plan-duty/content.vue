<template>
	<div class="v-tech-project-plan-duty">
		<div class="g-pd-b-15">
			<i-select 
				v-model="project_id"
				style="width: 220px"
				@on-change="handleProjectChange"
			>
				<i-option 
					v-for="{ project_name, project_id } of projectList"
					:value="project_id"
					:key="project_id"
				>{{ project_name }}</i-option>
			</i-select>
			<span v-if="$auth[1421]" class="g-red-btn-line g-fr" @click="handleEditDuty">编辑排班</span>
		</div>
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
				:class="{'_selected': nowDate === it.data.date }"
				class="_day"
				@click="$auth[1421] && handleClick(it)"
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

					<div 
						v-if="nowDate !== it.data.date && detailData[it.data.date] && detailData[it.data.date].staff_name"
						class="g-c-blue-mid __content g-fs-14 g-tc">
						{{ detailData[it.data.date].staff_name }}
					</div>
					<div v-if="nowDate === it.data.date" class="__content">
						<i-input
							:ref="`${it.data.date}_index`"
							v-model="detailData[it.data.date].staff_name"
							:maxlength="10"
							:autofocus="true"
							style="width: 80%; margin-left: 10%"
							placeholder="请输入值班人姓名"
							@on-blur="handleBlur(it)"
						/>
					</div>
				</div>

			</div>
		</vc-calendar>
	</div>
</template>

<script>
import { Calendar } from 'wya-vc';
import { MONTH_CN } from "@constants/constants";
import { Input, Select, Option, Button } from 'iview';
import moment from 'moment';
import { EditDutyModal } from './popup/edit-duty';

export default {
	name: 'oa-tpl',
	components: {
		'vc-calendar': Calendar,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button
	},
	data() {
		return {
			MONTH_CN,
			nowDate: '',
			nowStaffName: '',
			project_id: '',
			projectList: [],
			detailData: {}
		};
	},
	async created() {
		await this.loadProjectList();
		await this.loadProjectData(moment().format("YYYY-MM"));
	},
	methods: {
		async loadProjectList() {
			const { data } = await this.$request({
				url: '_TECH_PROJECT_PLAN_DUTY_PROJECT_LIST_GET',
				param: { is_page: 0 },
				type: "GET",
				loading: false
			});
			this.projectList = data.list;
			this.project_id = this.$route.query.project_id || (this.projectList[0]).project_id;
		},
		async loadProjectData(month) {
			const { data } = await this.$request({
				url: '_TECH_PROJECT_PLAN_DUTY_PROJECT_DETAIL_GET',
				type: "GET",
				param: { 
					project_id: this.project_id,
					month 
				},
				loading: false
			});
			this.$refs.calendar.dateArr.data.forEach(dateItem => {
				data[dateItem.date] = data[dateItem.date] || { staff_name: '' };
			});
			this.detailData = data;
		},
		handleClick(it) {
			this.nowDate = it.data.date;
			this.$emit('select', it);
		},
		handlePrev() {
			this.$refs.calendar.prev();
			this.loadProjectData(this.handleGetCurCalendarMonth());
		},
		handleNext() {
			this.$refs.calendar.next();
			this.loadProjectData(this.handleGetCurCalendarMonth());
		},
		handleGetCurCalendarMonth() {
			const { month, year } = this.$refs.calendar.dateArr;
			return year + '-' + String(month).padStart(2, 0);
		},
		handleBlur(it) {
			this.$request({
				url: '_TECH_PROJECT_PLAN_DUTY_EDIT_CAL_POST',
				param: { 
					staff_name: this.detailData[it.data.date].staff_name,
					schedule_id: this.detailData[it.data.date].schedule_id,
					project_id: this.project_id,
					date: it.data.date
				},
				type: "POST",
				loading: false
			}).then(async (res) => {
				await this.loadProjectData(moment(it.data.date).format("YYYY-MM"));
				this.$Message.success(res.msg);
			}).catch(err => {
				// this.$Message.error(err.msg);
			});
		},
		handleProjectChange() {
			this.nowDate = '';
			this.loadProjectData(moment().format("YYYY-MM"));
		},
		handleEditDuty() {
			EditDutyModal.popup({
				projectList: this.projectList
			}).then(() => {
				this.loadProjectData(moment().format("YYYY-MM"));
			});
		}
	},
};
</script>

<style lang="scss">
.v-tech-project-plan-duty {
	display: flex;
    padding: 20px;
    color: #333333;
    box-sizing: content-box;
    overflow: hidden;
	flex-direction: column;
	.ivu-select-selection {
		// border: none!important;
		// box-shadow: none!important;
		line-height: 30px!important;
	}
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
        text-align: left;
        box-sizing: border-box;
        cursor: pointer;
        .__sech {
            padding: 0 12px 4px 12px;
            min-height: 116px;
            height: 115px;
			position: relative;
			.__content {
				position: absolute;
				top: 50%;
				width: 80%;
				left: 50%;
				transform: translate(-50%, -35%);
			}
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
                padding-left:5px;
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
            .__selected-item {
                color: #fff;
                width: 100%;
                height: 18px;
                line-height: 18px;
                font-size: 12px;
                margin-bottom: 4px;
                margin-top: 4px;
                border-radius: 2px;
                background-color: #2397f9;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                .__selected-circle {
                    color: #fff;
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
}
</style>
