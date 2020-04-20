<template>
	<div class="v-academy-train-schedule-note">
		<div class="_title"/>
		<div class="_wrapper">
			<div class="__head">
				<span v-if="datas.day">{{ datas.day.data.date }}</span>
				<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>
				<span
					class="g-fr g-c-blue-light g-operation"
					@click="handleLecturer()"
				>
					看谁有空
				</span>
			</div>
			<div v-if="datas.item.length" style="height: 100%;">
				<div class="__mid">
					<div v-for="(item, index) in datas.item" :key="index" class="__item">
						<div class="__item-top g-flex g-fs-14" style="color: #000">
							<span
								:class="item.class"
								class="__item-title"
							>
								<span v-if="1">{{ item.name }}</span>
								<i-tooltip
									v-else
									:transfer="true"
									:content="item.name"
									:max-width="300" >
									{{ item.name.slice(0, 11) + '...' }}
								</i-tooltip>
							</span>
						</div>
						<transition name="draw">
							<div class="__item-bottom">
								<div v-if="item.course_type == 2">
									<div class="__item-content">出差人员：
										<span v-for="(ele,index) in item.business_staffs" :key="index">
											<span :style="{color:lecturerList.includes(ele.lecturer_id)?'#E84C57':''}">
												{{ ele.lecturer_name }} </span>
											<span v-if="index!=(item.business_staffs.length-1)" class="g-m-r-5">|</span>
										</span>
									</div>
									<div class="__item-content">出差城市：{{ item.business_city }}</div>
									<div class="__item-content">出发日期：{{ item.start_date }}</div>
									<div class="__item-content">返回日期：{{ item.end_date }}</div>
								</div>
								<div v-if="item.course_type == 3">
									<div class="__item-content">讲课时间：{{ item.start_date }}-{{ item.end_date }}</div>
									<div class="__item-content">
										参与人员：
										<span v-for="(ele,index) in item.join_staff" :key="index">
											<span
												:style="{color:lecturerList.includes(ele.lecturer_id)?'#E84C57':''}">
												{{ ele.lecturer_name }} </span>
											<span v-if="index!=(item.join_staff.length-1)" class="g-m-r-5">|</span>
										</span>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
				<!-- <div
					class="__bottom g-tc"
				>
					开通报名
				</div> -->
			</div>
			<div v-else>
				<div class="__empty">
					<!-- <div class="g-m-10">
						<span v-if="datas.day">{{ datas.day.data.date }}</span>
						<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>
					</div> -->
					<div>
						<img :src="OSS_SEARCH_EMPTY" class="__image" >
						<div class="g-tc g-c-black4 __text">
							暂无课程
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip, Button } from 'iview';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import moment from 'moment';
import { LecturerModal } from './popup/lecturer-modal';
// import { OnlineAddModal } from './popup/online-add-modal';
// import { OfflineAddModal } from './popup/offline-add-modal';


const WEEK = [];

export default {
	name: 'hr-academy-schedule-note',
	components: {
		'i-tooltip': Tooltip,
		'i-button': Button
	},
	props: {
		datas: Object,
		loadData: Function,
		type: String
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
		};
	},
	computed: {
		lecturerList() {
			let { query } = this.$route;
			return query.lecture_id ? query.lecture_id.split(',').map(it => it + "") : [];
		}
	},
	created() {
	},
	methods: {

		// 看谁有空
		handleLecturer() {
			LecturerModal.popup({
				type: this.type,
				date: this.datas.day.data.date
			}).then(res => {
				this.$emit('empty', res);
			});
		},
		getNowWeek() {
			let nowDate = new Date();
			const weekday = ["日", "一", "二", "三", "四", "五", "六"];
			return weekday[nowDate.getDay()];
		}
	},
};
</script>

<style lang="scss" scoped>
.v-academy-train-schedule-note {
    height: 100%;
    ._title {
        height: 60px;
        line-height: 60px;
        padding: 0 10px 0 10px;
        background-color: #f8f8f8;
	}
	.__head{
		height: 50px;
        line-height: 50px;
	}
    ._wrapper {
        position: relative;
        width: 307px;
        max-width: 307px;
        min-width: 307px;
        height:714px;
        margin-left: 4px;
        background:rgba(255,255,255,1);
        font-size: 14px;
        margin-right: 2px;
        .__mid {
			border: 1px solid #d4d4d4;
            width: 100%;
            height: 100%;
            padding: 0 10px 10px 10px;
            overflow-y: auto;
            overflow-x: hidden;
            .__item {
                width: 100%;
                margin: 10px 0 10px 0;
                background-color: #F8F8F8;
                .__item-top {
                    width: 100%;
                    padding: 10px;
                    .__item-title {
                        width: 100%;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .green {
                        color: #4FC43D;
                    }
                    .purple {
                        color: #A760FF;
                    }
                    .light-blue {
                        color: #2397F9;
                    }
                    .orange {
                        color: #ED8F4A;
                    }
                    .red {
                        color: #E84C57;
                    }
                    .blue {
                        color: #04BBD6;
                    }
                }
                .draw-enter-active, .draw-leave-active {
                    transition: all .3s;
                }
                .draw-enter, .draw-leave-to {
                    opacity: 0;
                    transform: scaleY(1);
                }
                .draw-leave, .draw-enter-to {
                    opacity: 1;
                    transform: scaleY(1);
                }
            }
            .__item-bottom {
                .__item-content {
                    padding: 0 10px 7px 10px;
                }
            }
        }

        .__empty {
            .__image {
                margin: 50px 0 20px 0;
            }
            .__text {
                padding: 20px 50px 0 50px;
            }
        }
        .__bottom {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 38px;
            line-height: 38px;
            font-size: 13px;
            background: #ffffff;
            color: #2298fa;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
            cursor: pointer;
        }
    }

}
</style>
