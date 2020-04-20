<template>
	<div class="v-academy-main-note">
		<div style="height: 100%;">
			<div v-if="datas.item.length" style="height: 100%;">
				<div class="_title" />
				<div class="_top g-m-t-10 g-relative" style="margin-bottom: 9px;">
					<span v-if="datas.day">{{ datas.day.data.date }}</span>
					<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>
					<div class="g-fr g-absolute" style="top: -5px; right: 0;">
						<span
							v-if="$auth[1558]"
							class="g-c-blue-mid g-operation g-m-r-20"
							@click="handleEmpty"
						>
							清空
						</span>
						<i-button 
							v-if="$auth[1557]"
							type="primary" 
							@click="handleAdd"
						>
							课程安排
						</i-button>
					</div>
				</div>
				<div class="_mid">
					<div v-for="(item, index) in datas.item" :key="index" class="__item">
						<div class="__item-top g-flex" @click="handleToggle(item)">

							<span v-if="item.course_type == 2 || item.course_type == 1" class="g-m-r-5">
								<i 
									v-if="!item.expend"
									class="iconfont icon-triangle-right g-fs-14" 
									style="cursor: pointer;color:#666666;"
								/>
								<i 
									v-else
									class="iconfont icon-triangle-down g-fs-14" 
									style="cursor: pointer"
								/>
								<i :class="[item.class, item.icon, 'iconfont']" />
							</span>
							<span 
								v-if="item.course_type !== 1"
								:class="item.class" 
								class="__item-title"
								style="cursor: pointer; color: #333;"
							>
								<span v-if="item.course_name.length < 7">
									<span v-if="item.course_type == 2">
										{{ courseNameList[item.course_type - 2] }}
										：
										<span class="g-operation" @click="handleToPar(item)">
											{{ item.course_name }}
										</span>
									</span>
									<span v-else>
										{{ courseNameList[item.course_type - 2] }}
										：
										{{ item.course_name }}
									</span>
								</span>
								<i-poptip 
									v-else 
									:content="item.course_name"
									trigger="hover"
									transfer 
									placement="bottom-end" >
									<span v-if="item.course_type == 2">
										{{ courseNameList[item.course_type - 2] }}
										：
										<span class="g-operation" @click="handleToPar(item)">
											{{ item.course_name.slice(0, 7) + '...' }}
										</span>
									</span>
									<span v-else>
										{{ courseNameList[item.course_type - 2] }}
										：
										{{ item.course_name.slice(0, 7) + '...' }}
									</span>
								</i-poptip>
							</span>
							<span 
								v-if="item.course_type == 1"
								:class="item.class" 
								class="__item-title"
								style="cursor: pointer; color: #333;"
							>
								<span v-if="item.activity_name.length < 7">公司大课：{{ item.activity_name }}</span>
								<i-poptip 
									v-else 
									:transfer="true"
									:content="item.activity_name"
									trigger="hover" 
									placement="bottom-end" >
									公司大课：{{ item.activity_name.slice(0, 7) + '...' }}
								</i-poptip>
							</span>

							<i-poptip 
								v-if="item.course_type == 1" 
								trigger="hover" 
								placement="bottom-end" 
								transfer
								@on-popper-show="loadActiveDetail(item.activity_id)">
								<i style="color:#999" class="iconfont icon-xinxishuoming"/>
								<div slot="title" style="text-aigin: center">活动详情</div>
								<div slot="content" style="font-weight:0" class="api">
									<div slot="content" style="width:350px">
										<div class="g-flex g-m-b-15">
											<div class="g-m-r-5 g-c-black4">活动分类:</div>
											<div class="_fontbold g-c-black2">
												<span>{{ activeDetail.category_name }}</span>
											</div>
										</div>
										<div class="g-flex g-m-b-15">
											<div class="g-m-r-5 g-c-black4">活动名称:</div>
											<div class="g-c-black2 _fontbold">
												<span>{{ activeDetail.activity_name }}</span>
											</div> 
										</div>
										<div class="g-flex g-m-b-15">
											<div class="g-m-r-5 g-c-black4">活动时间:</div>
											<div class="_fontbold g-c-black2">
												<span>{{ activeDetail.start_time }}</span>
												至
												<span>{{ activeDetail.end_time }}</span>
											</div>
										</div>
										<div class="g-flex g-m-b-15">
											<div class="g-m-r-5 g-c-black4">报名时间:</div>
											<div class="_fontbold g-c-black2">
												<span>{{ activeDetail.apply_start_time }}</span>
												至
												<span>{{ activeDetail.apply_end_time }}</span>
											</div>
										</div>
										<div class="g-flex g-m-b-15" style="align-items: baseline;">
											<div class="g-m-r-5 g-c-black4">活动地址:</div>
											<div class="_fontbold g-c-black2">
												<span>{{ activeDetail.address }}</span>
											</div>
										</div>
										<div class="g-flex g-m-b-15 g-jc-sb">
											<div class="g-flex">
												<div class="g-m-r-5 g-c-black4">限制人数:</div>
												<div class="_fontbold g-c-black2">{{ activeDetail.apply_limit }}</div>
											</div>
											<div v-if="activeDetail.show_apply_num==1" class="g-flex">
												<div
													class="g-m-r-5 g-c-black4"
													style="margin-left: -142px;"
												>已报名人数:</div>
												<span
													class="_fontbold g-c-black2"
												>{{ activeDetail.apply_count }}</span>
											</div>
										</div>
										<div class="g-flex g-m-b-15">
											<div class="g-m-r-5 g-c-black4">可超人数:</div>
											<div class="_fontbold g-c-black2">
												<span>{{ activeDetail.extra_apply }}</span>
											</div>
										</div>
										<div class="g-flex g-m-b-15" style="align-items: baseline;">
											<div class="g-m-r-5 g-c-black4">活动说明:</div>
											<div
												style="white-space: normal;"
												class="_fontbold g-c-black2">{{ activeDetail.describe }}</div>
										</div>
									</div>
								</div>
							</i-poptip>

							<div v-if="item.course_type !== 1" class="g-fr g-tr" style="width: 60px;">
								<i 
									v-if="$auth[1560]"
									class="iconfont icon-delete g-fs-14"
									style="cursor: pointer;color:#666666;"
									@click="handleDelete(item)"
								/>
								<i 
									v-if="$auth[1559]"
									class="iconfont icon-bianjikecheng g-fs-14"
									style="cursor: pointer;color:#666666;"
									@click="handleToEdit(item)"
								/>
							</div>
						</div>
						<transition name="draw">
							<div v-if="item.course_type == 1 || item.course_type == 2">
								<div v-show="item.expend" class="__item-bottom">
									<div v-if="item.course_type == 2">
										<div class="__item-content g-m-t-10">
											授课讲师：
											<span>{{ item.lecture }} </span>
										</div>
										<div class="__item-content">授课时间：{{ item.lecture_time }}</div>
										<div class="__item-content">授课地点：{{ item.address }}</div>
										<div v-if="item.type == 1 || item.type == 2">
											<div v-if="item.has_open" class="__item-content">线上报名：已开通</div>
										</div>
										<div v-if="item.type == 3">
											<div class="__item-content">
												<span v-if="item.memo.length < 20">参训人员说明：{{ item.memo || '--' }}</span>
												<span v-else >
													<i-poptip 
														:transfer="true"
														:max-width="300" 
														placement="bottom" 
														trigger="hover"
														style="display: inline-block;"
													>
														参训人员说明：{{ item.memo.slice(0, 20) + '...' }}
														<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
															{{ item.memo }}
														</div>
													</i-poptip>
												</span>
											</div>
											<div class="__item-content">
												<span v-if="item.brief.length < 20">简介：{{ item.brief || '--' }}</span>
												<span v-else >
													<i-poptip 
														:transfer="true"
														:max-width="300" 
														placement="bottom" 
														trigger="hover"
														style="display: inline-block;"
													>
														简介：{{ item.brief.slice(0, 20) + '...' }}
														<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
															{{ item.brief }}
														</div>
													</i-poptip>
												</span>
											</div>
											<div v-if="item.has_open" class="__item-content">线上报名：已开通</div>
										</div>
									</div>
									<div v-if="item.course_type == 1">
										<div class="__item-content g-m-t-10">报名时间：{{ item.apply_time }}</div>
										<div class="__item-content">活动时间：{{ item.lecture_time }}</div>
										<div class="__item-content">活动地点：{{ item.address || '--' }}</div>
										<div class="__item-content">
											<span v-if="item.describe.length < 20">活动说明：{{ item.describe || '--' }}</span>
											<span v-else >
												<i-poptip 
													:transfer="true"
													:max-width="300" 
													placement="bottom" 
													trigger="hover"
													style="display: inline-block;"
												>
													活动说明：{{ item.describe.slice(0, 20) + '...' }}
													<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
														{{ item.describe }}
													</div>
												</i-poptip>
											</span>
										</div>
									</div>
									<div v-if="item.course_type == 2 && item.is_open && $auth[1561]" class="g-flex-cc">
										<div class="__button g-pointer" @click="handleEnroll(item)">{{ item.has_open ? '修改报名' : '开通报名' }}</div>
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
			<div v-else>
				<div class="_title" />
				<div class="_empty">
					<div class="g-m-t-10 g-relative" style="margin-bottom: 9px;">
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
					<div>
						<img :src="OSS_SEARCH_EMPTY" class="__image" >
						<div class="g-tc __text">
							还没有安排课程哦
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip, Button, Poptip } from 'iview';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { Confirm } from "@components/_common/confirm/confirm";
import { AddModal } from './popup/add-modal';
import { EnrollModal } from './popup/enroll-modal';


const WEEK = [];

export default {
	name: 'hr-academy-schedule-note',
	components: {
		'i-tooltip': Tooltip,
		'i-button': Button,
		'i-poptip': Poptip,
	},
	props: {
		datas: Object,
		loadData: Function
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			courseNameList: ['培训课程', '公司大课', '其他'],
			activeDetail: {},
		};
	},
	computed: {
		day() {
			let day = {
				data: {
					date: this.$route.query.date
				}
			};
			return day;
		}
	},
	created() {
	},
	methods: {
		loadActiveDetail(active_id) {
			this.$request({
				url: '_SALE_MAIN_ACTIVEITY_DETAIL_GET',
				type: "get",
				param: {
					id: active_id
				}
			}).then(res => {
				this.activeDetail = res.data;
			});
		},
		handleToPar(item) {
			this.$auth[1593] && this.$auth[1594] ? this.$router.push({
				path: '/academy/train/plan/detail/participate',
				query: {
					course_id: item.course_id
				}
			}) : '';
		},
		handleToEdit(item) {
			if (item.course_type == 2) {
				let router = item.type == 2 ? '/academy/train/plan/train' : '/academy/train/plan/manage';
				this.$router.push({
					path: router,
					query: {
						edit: 1,
						course_id: item.course_id,
						date_time: this.$route.query.date,
						type: this.$route.query.type,
						depart_id: this.$route.query.depart_id
					}
				});
			} else {
				AddModal.popup({
					date: this.datas.day.data.date,
					edit: true,
					data: item,
					course_name: item.course_name,
					course_type: item.course_type
				}).then(res => {
					this.$emit('empty', this.day);
				});
			}
		},
		handleDelete(item) {
			Confirm.popup({ title: '提示', msg: '确定删除该课程安排吗？', showIcon: true })
				.then((res) => {
					let obj = {};
					let api = '';
					if (item.course_type !== 2) {
						obj.course_schedule_id = item.course_schedule_id;
						obj.course_type = item.course_type;
						api = '_ACADEMY_MAIN_SCHEDULE_COURSE_DELETE_GET';
					} else {
						api = '_ACADEMY_SUPPORT_TRAIN_COURSE_DELETE_POST';
						obj.course_id = item.course_id;
					}
					this.$request({
						url: api,
						type: "GET",
						param: obj,
						loading: false
					}).then((re) => {
						this.$Message.success(`删除成功`);
						this.$emit('empty', this.day);
					}).catch((error) => {
						console.error(error);
					});
				}).catch((error) => {
					console.error(error);
				});
		},
		handleAdd() {
			AddModal.popup({
				date: this.datas.day.data.date,
			}).then(res => {
				let data = {
					data: {
						date: this.$route.query.date
					}
				};
				this.$emit('empty', this.day);
			});
		},
		handleToggle(item) {
			if (item.course_type == 2 || item.course_type == 1) {
				this.datas.item.map(v => {
					if (v.id == item.id) {
						this.$set(v, 'expend', !item.expend);
					}
					return;
				});
			}
		},
		handleEmpty() {
			Confirm.popup({
				title: '清空全部安排',
				msg: '清空所有课程安排后将无法恢复，确认全部清空吗？',
				showIcon: true,
			}).then(res => {
				this.$request({
					url: '_ACADEMY_MAIN_SCHEDULE_COURSE_EMPTY_GET',
					type: "GET",
					param: {
						type: this.$route.query.type || 1,
						course_date: this.datas.day.data.date
					},
					loading: false
				}).then((re) => {
					this.$Message.success(`清空成功`);
					this.$emit('empty', this.day);
				}).catch((error) => {
					console.error('error');
				});
			});
		},
		handleEnroll(item) {
			EnrollModal.popup({
				data: item
			}).then(res => {
				item.has_open ? this.$Message.success('修改报名成功')
					: this.$Message.success('开通报名成功');
				this.$emit('empty', this.day);
			});
		},
		// handleArrange() {
		// 	this.$router.push('/academy/train/arrangement/add');
		// },
		getNowWeek() {
			let nowDate = new Date();
			const weekday = ["日", "一", "二", "三", "四", "五", "六"];
			return weekday[nowDate.getDay()];
		}
	},
};
</script>

<style lang="scss">
.v-academy-main-note {
	// display: inline-block;
	position: relative;
	width: 307px;
	max-width: 307px;
	min-width: 307px;
	height:813px;
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
        border: 1px solid #d4d4d4;
		.__item {
			width: 100%;
			margin-bottom: 10px;
			background-color: rgb(248, 248, 248);
			.__item-top {
				width: 100%;
				padding: 8px 10px 8px 10px;
				.__item-title {
					width: 100%;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
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
			background-color: rgb(248, 248, 248);
			padding-bottom: 10px;
			.__item-content {
				padding: 0 10px 0 10px;
				color: #666;
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
