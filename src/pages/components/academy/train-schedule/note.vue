<template>
	<div class="v-academy-train-schedule-note">
		<div style="height: 100%;">
			<div v-if="datas.item.length" style="height: 100%;">
				<div class="_title" />
				<div class="_top g-m-tb-10 g-relative">
					<span v-if="datas.day">{{ datas.day.data.date }}</span>
					<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>

					<i-button 
						type="primary" 
						class="g-fr g-absolute" 
						style="top: -5px; right: 0;"
						@click="handleAdd"
					>
						添加课程
					</i-button>
				</div>
				<div class="_mid">
					<div v-for="(item, index) in datas.item" :key="index" class="__item">
						<div class="__item-top g-flex">

							<span class="g-m-r-5">
								<i 
									v-if="!item.expend"
									class="iconfont icon-triangle-down g-fs-14" 
									style="cursor: pointer;color:#666666;"
									@click="handleToggle(item)"
								/>
								<i 
									v-else
									class="iconfont icon-triangle-up g-fs-14" 
									style="cursor: pointer"
									@click="handleToggle(item)"
								/>
								<i :class="[item.class, item.icon, 'iconfont']" />
							</span>
							<span 
								:class="item.class" 
								class="__item-title"
								style="cursor: pointer"
								@click="handleToggle(item)"
							>
								<span v-if="item.course_name.length < 8">{{ item.method_name }}：{{ item.course_name }}</span>
								<i-tooltip 
									v-else 
									:transfer="true" 
									:content="item.method_name + item.course_name" 
									:max-width="300" >
									{{ (item.method_name + '：' + item.course_name).slice(0, 11) + '...' }}
								</i-tooltip>
							</span>

							<div class="g-fr" style="width: 60px;">
								<i 
									class="iconfont icon-bianjikecheng g-fs-14"
									style="cursor: pointer;color:#666666;"
									@click="handleEdit(item)"
								/>
							</div>
						</div>
						<transition name="draw">
							<div v-show="item.expend" class="__item-bottom">
								<div class="__item-content g-m-t-10">
									授课讲师：
									<span v-for="(i, index) in item.lecture" :key="index">{{ i.staff_name }} </span>
								</div>
								<div class="__item-content">时间：{{ item.start_time }} 至 {{ item.end_time }}</div>
								<div class="__item-content">地点：{{ item.position }}</div>
								<div class="__item-content">参与人员：{{ item.participator_name }}</div>
								<div class="__item-content">线上报名：{{ item.is_open_online_apply ? '已开通' : '未开通' }}</div>
								<div class="g-flex-cc">
									<div class="__button g-pointer" @click="handleEnroll(item)">报名</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
				<!-- <div 
					class="_bottom g-tc"
					@click="handleEnroll()"
				>
					开通报名
				</div> -->
			</div>
			<div v-else>
				<div class="_empty">
					<div class="g-m-10">
						<span v-if="datas.day">{{ datas.day.data.date }}</span>
						<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>
					</div>
					<div>
						<img :src="OSS_SEARCH_EMPTY" class="__image" >
						<div class="g-tc __text">
							还没有安排课程哦
							<div>
								快去进行
								<span 
									class="g-pointer g-c-blue-mid"
									@click="handleArrange"
								>
									课程安排
								</span>
								吧
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip, Button } from 'iview';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { AddModal } from './popup/add-modal';
import { EnrollModal } from './popup/enroll-modal';


const WEEK = [];

export default {
	name: 'hr-academy-schedule-note',
	components: {
		'i-tooltip': Tooltip,
		'i-button': Button
	},
	props: {
		// datas: Object,
		loadData: Function
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			datas: {
				obj: {
					type: this.type,
					depart_id: this.type == '2' ? this.depart_id.toString() : '',
				},
				day: {
					data: {
						date: '2011-12-22'
					}
				},
				item: [{
					method_name: 'dfsdfd',
					course_name: 'dfdsf',
					course_id: 2
				}, {
					method_name: 'dfsdfd',
					course_name: 'dsfdf',
					course_id: 3
				}]
			}
		};
	},
	created() {
	},
	methods: {
		handleAdd() {
			AddModal.popup({
                
			}).then(res => {
			});
		},
		handleToggle(item) {
			this.datas.item.map(v => {
				if (v.course_id == item.course_id) {
					this.$set(v, 'expend', !item.expend);
				}
				return;
			});
		},
		handleEmpty() {
			ModalTip.popup({
				title: '清空全部安排',
				content: '清空所有课程安排后将无法恢复，确认全部清空吗？'
			}).then(res => {
				this.request({
					url: '_HR_TRAIN_SCHEDULE_EMPTY_POST',
					type: "POST",
					param: {
						course_ids: this.datas.obj.course_ids
					},
					loading: false
				}).then((re) => {
					this.$Message.success(`清空成功`);
					this.$emit('empty', this.datas.obj);
				}).catch((error) => {
				});
			});
		},
		handleEnroll() {
			EnrollModal.popup({
				datas: this.datas.item
			}).then(res => {
				this.$emit('empty', this.datas.obj);
			});
		},
		handleArrange() {
			this.$router.push('/academy/train/arrangement/add');
		},
		handleEdit(item) {
			this.$router.push(getHashUrl(
				'/academy/train/detail/basic/2/edit', 
				{ 
					project_id: item.project_id,
					course_id: item.course_id,
					number: this.datas.item.length
				}
			));
			// this.$router.push('/hr/academy/train/detail/basic/2/edit');
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
	// display: inline-block;
	position: relative;
	width: 307px;
	max-width: 307px;
	min-width: 307px;
	height:813px;
	margin-left: 4px;
	background:rgba(255,255,255,1);
	font-size: 14px;
	margin-right: 2px;
    ._title {
        height: 60px;
        line-height: 60px;
        padding: 0 10px;
        background-color: #f8f8f8;
    }
	._mid {
		width: 100%;
		height: 88%;
		padding: 10px;
		overflow-y: auto;
		overflow-x: hidden;
        border: 1px solid #E8E8E8;
		.__item {
			width: 100%;
			margin-bottom: 10px;
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
			}
            .__button {
                width: 90%;
                margin-bottom: 20px;
                margin-top: 10px;
                color: #2397F9;
                background-color: #fff;
                border: 1px dotted #2397F9;
                height: 32px;
                line-height: 32px;
                border-radius: 4px;
                text-align: center;
            }
		}
	}
	
	._empty {
		.__image {
			margin: 50px 0 20px 0;
		}
		.__text {
			padding: 20px 50px 0 50px;
		}
	}
	._bottom {
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
</style>
