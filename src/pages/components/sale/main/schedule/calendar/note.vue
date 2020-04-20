<template>
	<div class="v-sale-main-schedule-note">
		<div class="_title ">
			<span
				class="g-fr g-c-blue-light g-operation"
				style="font-size:14px"
				@click="$emit('toggle-open',false)"
			>
				收起
				<i class="iconfont g-fs-12  icon-up"/>
			</span>

		</div>
		<div class="g-m-t-10 g-flex g-jc-sb">
			<span class="g-black2 g-fs-14" style="line-height: 32px;">{{ date }}</span>
			<i-button type="primary" @click="handleAddSchedule">添加日程</i-button>
		</div>
		<div class="_wrapper">
			<div v-if="datePlan.length" style="height: 100%;">
				<div class="__mid">
					<div
						v-for="(item, index) in datePlan"
						:key="index"
						:class="getItemClass(item)"
						class="__item">
						<div class="__item-top g-flex g-fs-16" style="color: #000">
							<span
								class="__item-title"
							>
								<span class="g-dp-ib g-fs-14" style="width:220px" >{{ typeName[item.type] }}：
									<oa-auto-tooltip
										:content="item.activity_name || item.matter_name||item.course_name"
										style="width:125px"
										placement="bottom"
										theme="dark"
										label-class="g-c-000"
									/>
								</span>
								<span v-if="item.type == 1">
									<i-poptip trigger="hover" placement="bottom-end" @on-popper-show="loadActiveDetail(item.activity_id)">
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
								</span>
							</span>
							<template v-if="item.type == 3&&($global.staff.is_charge == 1 || item.is_self)" >
								<i
									class="icon iconfont icon-edit1 g-c-blue-mid g-pointer g-fs-14 "
									@click="handleEdit(item)"
								/>
								<i
									class="icon iconfont icon-delete g-c-blue-mid g-pointer g-fs-14 g-m-l-5 "
									@click="handleDelete(item)"
								/>
							</template>
						</div>
						<!-- <transition name="draw"> -->
						<div class="__item-bottom">
							<div v-if="item.type == 1">
								<div class="__item-content">
									<div class="__left">报名时间：</div>
									<div class="__right">{{ item.apply_start_time }} 至<br>{{ item.apply_end_time }}</div>
								</div>
								<div class="__item-content">
									<div class="__left">活动时间：</div>
									<div class="__right">{{ item.start_time }} 至<br>{{ item.end_time }}</div>
								</div>
								<div class="__item-content">
									<div class="__left">活动地点：</div>
									<div class="__right">{{ item.address || '--' }}</div>
								</div>
								<div :style="{paddingBottom: item.can_apply?'':'20px'}" class="__item-content">
									<div class="__left">活动说明：</div>
									<div v-if="item.describe.length>25" class=" __right __two-line">
										<i-poptip trigger="hover" placement="bottom" content="item.describe">
											<span class=" __right __two-line">
												{{ item.describe }}
											</span>
											<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
												{{ item.describe }}
											</div>
										</i-poptip>
									</div>
									<div v-else class=" __right __two-line">
										{{ item.describe || '--' }}
									</div>
								</div>
								<div v-if="item.can_apply" class="__item-content">
									<div class="__apply" @click="handleApply(item)" >报名</div>
								</div>
							</div>
							<div v-if="item.type == 3">
								<div class="__item-content">
									<div class="__left">事项时间：</div>
									<div class="__right">{{ item.start_time }} 至<br>{{ item.end_time }}</div>
								</div>
								<div class="__item-content" style="padding-bottom: 20px">
									<div class="__left">备注信息：</div>
									<div v-if="item.remark.length>25" class=" __right __two-line">
										<i-poptip :content="item.remark" placement="bottom" trigger="hover">
											<span class=" __right __two-line">
												{{ item.remark }}
											</span>
											<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
												{{ item.remark }}
											</div>
										</i-poptip>
									</div>
									<div v-else class=" __right __two-line">
										{{ item.remark || '--' }}
									</div>
								</div>
							</div>
							<div v-if="item.type == 2">
								<div class="__item-content">
									<div class="__left">授课讲师：</div>
									<div class="__right">{{ item.lecture }}</div>
								</div>
								<div class="__item-content">
									<div class="__left">授课时间：</div>
									<div class="__right">{{ item.start_time }} 至<br>{{ item.end_time }}</div>
								</div>
								<div class="__item-content">
									<div class="__left">授课地点：</div>
									<div class="__right">{{ item.address }}</div>
								</div>
								<div v-if="item.is_apply==1" class="__item-content">
									<div class="__left">是否报名：</div>
									<div class="__right">已报名</div>
								</div>
								<template v-if="item.course_type == 3">
									<div class="__item-content" style="padding-bottom: 10px">
										<div style="width:100px" class="__left">参训人员说明：</div>
										<div v-if="item.memo.length>25" class=" __right __two-line">
											<i-poptip :content="item.memo" placement="bottom" trigger="hover">
												<span class=" __right __two-line">
													{{ item.memo }}
												</span>
												<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
													{{ item.memo }}
												</div>
											</i-poptip>
										</div>
										<div v-else class=" __right __two-line">
											{{ item.memo || '--' }}
										</div>
									</div>
									<div class="__item-content" style="padding-bottom: 20px">
										<div class="__left">课程简介：</div>
										<div v-if="item.brief.length>25" class=" __right __two-line">
											<i-poptip :content="item.brief" placement="bottom" trigger="hover">
												<span class=" __right __two-line">
													{{ item.brief }}
												</span>
												<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
													{{ item.brief }}
												</div>
											</i-poptip>
										</div>
										<div v-else class=" __right __two-line">
											{{ item.brief || '--' }}
										</div>
									</div>
								</template>
								<div v-if="item.can_apply" class="__item-content">
									<div class="__apply" @click="handleCourseApply(item)" >报名</div>
								</div>
								<div v-if="item.can_upload" class="__item-content">
									<div class="__apply" @click="handleUploadProof(item)" >{{ item.is_upload?'重新上传':'上传作业' }}</div>
								</div>
							</div>
						</div>
						<!-- </transition> -->
					</div>
				</div>
			</div>
			<div v-else>
				<div class="__empty">
					<div>
						<img :src="OSS_SEARCH_EMPTY" class="__image" >
						<div class="g-tc g-c-black4 __text">
							暂无日程
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Tooltip, Button, Poptip } from 'iview';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import moment from 'moment';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { UploadProof } from '@components/sale/train-study/popup/upload-proof';
import { addSchedule } from "../popup/addSchedule";
import { PSignUp } from "../../notice/child/month-active/popup/sign-up";


const WEEK = [];

export default {
	name: 'hr-academy-schedule-note',
	components: {
		'i-tooltip': Tooltip,
		'i-button': Button,
		'i-poptip': Poptip,
		"oa-auto-tooltip": AutoToolTip
	},
	props: {
		date: String,
		filter: Number
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			time: '',
			typeName: {
				1: "活动名称",
				2: "课程名称",
				3: "事项名称"
			},
			daySchedule: {},
			activeDetail: {},

		};
	},
	computed: {
		datePlan() {
			return (this.daySchedule[this.date] || []).filter(ele => {
				if (this.filter == 0) return true;
				else return this.filter == ele.type;
				// if (this.filter == '2') return ele.type == 3;
				// if (this.filter == '3') return ele.type == 1;
				// if (this.filter == '4') return ele.type == 2;
				// return false;
			});
		}

	},
	watch: {
		date(val) {
			this.loadDateSchedule(val);
		}
	},
	created() {
		this.loadDateSchedule(this.date);
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
			// if (item.type == 3) {
			// 	return {
			// 		background: item.push_range == 1 ? '#E8F7EB' : 'rgba(255,144,0,0.1)',
			// 		color: item.push_range == 1 ? '#3AAD4E' : '#D46E24',
			// 	};
			// } else {
			// 	return {
			// 		color: item.type == 2 ? '#3697E7' : '#E74854',
			// 		background: item.type == 2 ? '#E9F4FE' : 'rgba(231, 72, 84, 0.1)',
			// 	};
			// }
		
		},
		handleUploadProof(item) {
			UploadProof.popup({
				data: { ...item },
				title: '上传作业',
				course: item.course_name,
				course_id: item.course_id,
				is_upload: 1,
			}).then(res => {
				this.loadDateSchedule(this.date, true);
			}).catch(err => {});
		},
		handleCourseApply(item) {
			Confirm.popup({
				 msg: `是否确定发起报名，课程名：${item.course_name}？`
			}).then(() => {
				this.$request({
					url: '_SALE_TRAIN_COURSE_RECORD_SIGN_GET',
					type: "POST",
					param: { course_id: item.course_id }
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadDateSchedule(this.date, true);
				}).catch(err => {
					this.$Message.warning(err.msg);
				});
			});
		},
		handleApply(item) {
			PSignUp.popup({
				data: {
					...item,
					activeId: item.activity_id }
			}).then(() => {}).catch(() => {});
		},

		handleAddSchedule() {
			addSchedule.popup({}).then(() => {
				this.$emit('fresh');
				this.fresh();
			}).catch(err => err && console.error(err));
		},
		loadDateSchedule(date, load) {
			if (this.daySchedule[date] && !load) return;
			return this.$request({
				url: '_SALE_MAIN_MATTER_SCHEDULE_DATE_GET',
				type: "GET",
				param: {
					day: date
				},
				loading: false
			}).then((res) => {
				this.$set(this.daySchedule, date, res.data);
			}).catch((error) => {
				error && console.error(error);
			});
		},
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
		fresh() {
			this.daySchedule = {};
			this.loadDateSchedule(this.date);
		},
		handleEdit(item) {
			addSchedule.popup({ matterId: item.matter_id, action: 'update' }).then(() => {
				this.$emit('fresh');
				this.fresh();
			}).catch(err => err && console.error(err));

		},
		handleDelete(item) {
			Confirm.popup({
				title: '确认',
				msg: item.push_range == 1 ? '确认删除该事项?' : '删除该事项会同步删除其他人日历中的信息，确认删除？'
			}).then(() => {
				this.saveDelete(item);
			}).catch({});
		},
		saveDelete(item) {
			this.$request({
				url: "_SALE_MAIN_MATTER_DELETE_POST",
				type: "GET",
				param: {
					matter_id: item.matter_id
				},
				loading: false,

			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('fresh');
				this.fresh();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		formatMatterName(name) {
			if (name.length <= 7) {
				return name;
			} else {
				return name.substr(0, 7) + '...';
			}
		}
	},
};
</script>

<style lang="scss" scoped>
.v-sale-main-schedule-note {
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
		padding-bottom: 10px;
		border: 1px solid #e8e8e8;
		background:rgba(255,255,255,1);
		font-size: 14px;
		margin-top: 10px;
		.__mid {
			width: 100%;
			height: 100%;
			padding: 0 10px;
			overflow-y: auto;
			overflow-x: hidden;
			.__item {
				width: 100%;
				margin: 10px 0 10px 0;
				background-color: #F8F8F8;
				 &.__red {
                    background: #fdedee;
                    // color: white;

                }
                &.__blue {
                    background: #f8fcff;
                    // color: #3697E7;

                }
                &.__green {
                    background: #F7FcF6;
                   //  color: #3EBF2B;

                }
                 &.__orange {
                    background: #FBF8F4;
                    // color: #D46E24;

                }
				.__item-top {
					width: 100%;
					padding: 8px 10px;
					.__item-title {
						width: 100%;
					}
					// .green {
					// 	color: #4FC43D;
					// }
					// .purple {
					// 	color: #A760FF;
					// }
					// .light-blue {
					// 	color: #2397F9;
					// }
					// .orange {
					// 	color: #ED8F4A;
					// }
					// .red {
					// 	color: #E84C57;
					// }
					// .blue {
					// 	color: #04BBD6;
					// }
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
			   //  border-top: 1px solid #eaeff0;
				color:#666;
				.__item-content {
					padding: 0 10px 7px 10px;
					display: flex;
					.__left {
						width: 80px;
					}
					.__right {
						flex: 1;
					}
					.__apply{
						margin: 5px 0 10px 0;
						cursor: pointer;
						line-height: 32px;
						color: #2397f9;
						width:260px;
						height:32px;
						background:rgba(255,255,255,1);
						border:1px dashed rgba(35,151,249,1);
						border-radius:4px;
						text-align: center
					}
				}
				.__two-line{
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
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
	}

}
</style>
