<template>
	<div class="v-academy-train-schedule-note">
		<div class="_title">
			<span v-if="datas.day">{{ datas.day.data.date }}</span>
			<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>
			<span 
				v-if="$auth[1385] || $auth[1394]"
				class="g-fr g-c-blue-mid g-operation"
				@click="handleLecturer()"
			>
				看谁有空
			</span>
		</div>
		<div v-if="!loading" class="_wrapper">
			<oa-loading />
		</div>
		<div v-else class="_wrapper">
			<i-button v-if="$auth[1388] || $auth[1397]" type="primary" class="g-m-10" @click="handleAddOnline">
				添加课程
			</i-button>
			<div v-if="datas.item.length" style="height: 100%;" class="g-m-t-10">
				<div class="__mid">
					<div v-for="(item, index) in datas.item" :key="index" class="__item">
						<div class="__item-top g-flex g-fs-16" style="color: #000">
							<span 
								:class="item.class" 
								class="__item-title"
							>
								<span v-if="item.name.length < 8">{{ item.name }}</span>
								<i-tooltip 
									v-else 
									:transfer="true" 
									:content="item.name" 
									:max-width="300" >
									{{ item.name.slice(0, 11) + '...' }}
								</i-tooltip>
							</span>

							<div class="g-fr" style="width: 45px;">
								<i 
									v-if="item.enable_edit && ($auth[1390] || $auth[1399])"
									class="iconfont icon-delete g-fs-16 "
									style="cursor: pointer;color:#666666;"
									@click="handleDelete(item, 1)"
								/>
								<i 
									v-if="item.enable_edit && ($auth[1389] || $auth[1398])"
									class="iconfont icon-bianjikecheng g-fs-16"
									style="cursor: pointer;color:#666666;"
									@click="handleAddOnline(item, 1)"
								/>
							</div>
						</div>
						<transition name="draw">
							<div class="__item-bottom">
								<div v-if="type == '1'">
									<div class="__item-content g-m-t-10">公司名称：{{ item.contract_company_name }}</div>
									<div class="__item-content">流程对接人：
										<span>{{ item.process_staff_name }}</span>
									</div>
									<div class="__item-content">上课讲师：
										<span :class="datas.lectureArray.includes(+item.lecturer_id) ? '__red' : ''">
											{{ item.lecturer_staff_name }}
										</span>
									</div>
									<div class="__item-content">开课时间：{{ item.lesson_start_time }}</div>
								</div>
								<div v-if="type == '2'">
									<div v-if="item.course_type == 2">
										<div class="__item-content g-m-t-10">客户公司：{{ item.contract_company_name }}</div>
										<div class="__item-content">流程对接人：
											<span :class="datas.lectureArray.includes(item.process_staff_id) ? '__red' : ''">
												{{ item.process_staff_name }}
											</span>
										</div>
										<div class="__item-content">出差人员：{{ item.business_staffs.map(v => v.lecturer_name).join(' | ') }}</div>
										<div class="__item-content">出差城市：{{ item.business_city }}</div>
										<div class="__item-content">出发日期：{{ item.start_date }}</div>
										<div class="__item-content">返回日期：{{ item.end_date }}</div>
									</div>
									<div v-if="item.course_type == 3">
										<div v-if="item.lecture_date" class="__item-content">讲课时间：{{ item.lecture_date }}</div>
										<div v-else class="__item-content">讲课时间：{{ item.start_date + '-' + item.end_date }}</div>
										<div 
											:class="item.join_staff.map(v => +v.lecture_id).includes(+item.lecturer_id) ? '__red' : ''"
											class="__item-content">
											参与人员：{{ item.join_staff.map(v => v.lecturer_name).join(' | ') }}</div>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
				<!-- <div 
					v-if="$auth[1388] || $auth[1397]"
					class="__bottom g-tc"
					@click="handleAddOnline"
				>
					添加课程
				</div> -->
			</div>
			<div v-else>
				<div class="__empty">
					<div>
						<img :src="OSS_SEARCH_EMPTY" class="__image" >
						<div class="g-tc g-c-black4 __text">
							暂无课程
						</div>
					</div>
					<!-- <div 
						v-if="$auth[1388] || $auth[1397]"
						class="__bottom g-tc"
						@click="handleAddOnline"
					>
						添加课程
					</div> -->
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
import { OnlineAddModal } from './popup/online-add-modal';
import { OfflineAddModal } from './popup/offline-add-modal';


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
		type: String,
		loading: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
		};
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
				res.currentData = this.datas.day;
				this.$emit('empty', res);
			});
		},

		// 课程添加编辑
		handleAddOnline(e, isEdit) {
			if (this.type == '1') {
				OnlineAddModal.popup({
					datas: this.datas,
					edit: isEdit ? 1 : 0,
					calendar_id: e ? e.calendar_id : null
				}).then(res => {
					this.$emit('blank', this.datas.day);
				});
			} else {
				OfflineAddModal.popup({
					datas: this.datas,
					edit: isEdit ? 1 : 0,
					calendar_id: e ? e.calendar_id : null
				}).then(res => {
					this.$emit('blank', this.datas.day);
				});
			}
		},

		// 删除课程
		handleDelete(item) {
			let API = this.type == '1' ? '_COLLAGE_MAIN_SCHEDULE_ONLINE_DELETE_GET' : '_COLLAGE_MAIN_SCHEDULE_OFFLINE_DELETE_GET';
			Confirm.popup({
				msg: '确认删除本课程？',
				title: '提示'
			}).then(res => {
				this.$request({
					url: API,
					type: "GET",
					param: {
						calendar_id: item.calendar_id
					},
					loading: false
				}).then((re) => {
					this.$emit('blank', this.datas.day);
				}).catch((error) => {
				});
			}).catch(() => {});
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
    ._wrapper {
        position: relative;
        width: 307px;
        max-width: 307px;
        min-width: 307px;
        height:714px;
        margin-left: 4px;
        background:rgba(255,255,255,1);
        box-shadow:0px 1px 10px 0px rgba(118,123,136,0.2);
        font-size: 14px;
        margin-right: 2px;
        margin-top: 40px;
        .__mid {
            width: 100%;
            height: 90%;
			margin-top: 10px;
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
                border-top: 1px solid #eaeff0;
                .__item-content {
                    padding: 0 10px 7px 10px;
					.__red {
						color: red
					}
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
