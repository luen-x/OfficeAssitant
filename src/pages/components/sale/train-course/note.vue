<template>
	<div class="v-academy-train-schedule-note">
		<div v-if="loading" style="height: 100%;background-color: #fff;">
			<div style="height:60px;background-color: #f8f8f8;"/>
			<div v-if="datas.item.length" style="height: 100%;background-color: #fff;">

				<div class="_top g-m-l-10">
					<span v-if="datas.day">{{ datas.day.data.date }}</span>
					<span v-if="datas.day">周{{ (datas.day.holiday && datas.day.holiday.cnWeekDay) || getNowWeek() }}</span>
				</div>
				<div class="_mid">
					<div v-for="(item, index) in datas.item" :key="index" class="__item">
						<oa-expand-panel v-if="item.course_type==1||item.course_type==2" :border="false">
							<div slot="header">
								<span class="g-c-black2">{{ course_type[item.course_type] }}：</span>
								<span class="g-c-black2 ">
									<oa-auto-tooltip
										:content="item.activity_name ||item.course_name"
										style="width:140px"
										placement="bottom"
										theme="dark"
										label-class="g-c-000"
									/>
								</span>
							</div>
							<template v-if="item.course_type==1" slot="extra">
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
							</template>
							<div v-if="item.course_type==2" class="__item-bottom">
								<div class="__item-content g-m-t-10">授课讲师：{{ item.lecture }}</div>
								<div class="__item-content">授课时间：{{ item.lecture_time }}</div>
								<div class="__item-content">授课地点：{{ item.address }}</div>
								<div v-if="item.is_apply==1" class="__item-content">是否报名：已报名</div>

								<template v-if="item.type==3">
									<div class="__item-content  g-flex">
										<span style="min-width: 100px;">
											参训人员说明：
										</span>
										<div v-if="item.memo&&item.memo.length>23" class=" __right __two-line">
											<i-poptip trigger="hover" placement="bottom">
												<span class=" __right __two-line">
													{{ item.memo }}
												</span>
												<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
													{{ item.memo }}
												</div>
											</i-poptip>
										</div>
										<div v-else>
											{{ item.memo }}
										</div>
									</div>
									<div class="__item-content g-flex" >
										<span style="min-width: 71px;">
											课程简介：
										</span>
										<div v-if="item.brief&&item.brief.length>25" class=" __right __two-line">
											<i-poptip trigger="hover" placement="bottom">
												<span class=" __right __two-line">
													{{ item.brief }}
												</span>
												<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
													{{ item.brief }}
												</div>
											</i-poptip>
										</div>
										<div v-else>
											{{ item.brief }}
										</div>
									</div>
								</template>
							</div>
							<div v-if="item.course_type==1" class="__item-bottom">
								<div class="__item-content g-m-t-10">报名时间：{{ item.apply_time||'--' }}</div>
								<div class="__item-content">活动时间：{{ item.lecture_time||'--' }}</div>
								<div class="__item-content">活动地点：{{ item.address||'--' }}</div>

								<div class="__item-content g-flex">
									<span style="min-width: 71px;">
										活动说明：
									</span>
									<div v-if="item.describe&&item.describe.length>25" class=" __right __two-line">
										<i-poptip trigger="hover" placement="bottom">
											<span class=" __right __two-line">
												{{ item.describe }}
											</span>
											<div slot="content" style="white-space: normal;width: 200px;max-height:500px">
												{{ item.describe }}
											</div>
										</i-poptip>
									</div>
									<div v-else>
										{{ item.describe||'--' }}
									</div>
								</div>
							</div>
							<div class="g-flex-cc">
								<div v-if="item.course_type==2&&item.can_apply" class="__apply g-m-r-10" @click="handleApply(item)" >报名</div>
								<div v-if="item.can_upload" class="__apply" @click="handleUploadProof(item)" >
									{{ item.is_upload ? '重新上传' : '上传作业' }}</div>
							</div>
						</oa-expand-panel>
						<div v-else class="__other g-m-t-10">
							<span class="g-c-black2">{{ course_type[item.course_type] }}：</span>
							<span>
								<oa-auto-tooltip
									:content="item.course_name"
									style="width:140px"
									placement="bottom"
									theme="dark"
									label-class="g-c-000"
								/>
							</span>
						</div>
					</div>
				</div>
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
							还没有安排课程哦。
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
import expandPanel from '@components/_common/expand-panel/expand-panel';
import { PSignUp } from "@components/sale/main/notice/child/month-active/popup/sign-up";
import { Confirm } from "@components/_common/confirm/confirm";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { EnrollModal } from './popup/model-enroll';
import { UploadProof } from '../train-study/popup/upload-proof';


const WEEK = [];

export default {
	name: 'hr-academy-schedule-note',
	components: {
		'oa-expand-panel': expandPanel,
		'i-poptip': Poptip,
		"oa-auto-tooltip": AutoToolTip
	},
	props: {
		record: Number,
		datas: Object,
		loadData: Function
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			course_type: ['', '公司大课', '培训课程', '公司大课', '其他'],
			activeDetail: {},
			loading: true,
		};
	},
	created() {
	},
	methods: {
		handleApply(item) {
			Confirm.popup({
				 msg: `是否确定发起报名，课程名：${item.course_name}？`
			}).then(() => {
				this.$request({
					url: '_SALE_TRAIN_COURSE_RECORD_SIGN_GET',
					type: "POST",
					param: { course_id: item.course_id }
				}).then(res => {
					this.$Message.success(res.msg);
					this.$vc.emit('SALE_APPLY_COURSE', { date: this.datas.day.data.date });
					this.loading = false;
					setTimeout(() => {
						this.loading = true;
					});
				 }).catch(err => {
					this.$Message.warning(err.msg);
				});
			});
		},
		handleUploadProof(item) {
			UploadProof.popup({
				data: { ...item },
				title: '上传作业',
				course: item.course_name,
				course_id: item.course_id,
				is_upload: 1,
			}).then(res => {
				this.$vc.emit('SALE_APPLY_COURSE', { date: this.datas.day.data.date });
			}).catch(err => {});
		},

		handleToggle(item) {
			this.datas.item.map(v => {
				if (v.course_id == item.course_id) {
					this.$set(v, 'expend', !item.expend);
				}
				return;
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
		handleEmpty() {
			ModalTip.popup({
				title: '清空全部安排',
				content: '清空所有课程安排后将无法恢复，确认全部清空吗？'
			}).then(res => {
				this.request({
					url: '_HR_TRAIN_SCHEDULE_EMPTY_GET',
					type: "GET",
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
				datas: this.datas.item.filter(v => v.is_open_online_apply === 1 && !v.is_apply)
			}).then((re) => {
				this.$emit('empty', this.datas.obj);
			}).catch(error => {

			});
		},
		handleArrange() {
			this.$router.push('/hr/academy/train/arrangement/add');
		},
		getNowWeek() {
			let nowDate = new Date();
			const weekday = ["日", "一", "二", "三", "四", "五", "六"];
			return weekday[nowDate.getDay()];
		}
	},
};
</script>

<style lang="scss">
.v-academy-train-schedule-note {
	// display: inline-block;
	position: relative;
	width: 307px;
	max-width: 307px;
	min-width: 307px;
	height:813px;
	background:rgba(255,255,255,1);
	font-size: 14px;
	._top{
		padding-top: 9px;
		padding-bottom: 10px;
	}
	._mid {
		width: 100%;
		height: 88%;
		padding: 0 10px 10px 10px;
		overflow-y: auto;
		overflow-x: hidden;
		border: 1px solid #d4d4d4;
		.__item {
			width: 100%;
			margin-bottom: 10px;
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
			background: #f8f8f8 !important;
			.__item-content {
				padding: 0 10px 7px 10px;
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
		.__other{
			height: 40px;
			line-height: 40px;
			background: #f8f8f8;
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
		bottom: -10px;
		width: 100%;
        height: 38px;
        line-height: 38px;
        font-size: 13px;
        background: #ffffff;
        color: #2298fa;
        box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		cursor: pointer;
	}
	.c-components-common-expand-panel{
		._expand-top{
			background: #f8f8f8 !important
		}
	}
}
</style>
