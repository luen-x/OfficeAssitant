<template>
	<div v-if="data.length" class="c-academy-statistic-study-detail-expend">
		<div v-for="(item, index) in data" :key="index" class="_expend-detail">
			<div class="__top g-operation" @click="handleToggle($event, index)" >
				<span class="g-fs-14 g-c-black1 g-m-l-20">
					{{ item.project_topic }}
				</span>
				<span class="g-c-black4 g-m-l-30">{{ item.start_time }} 至 {{ item.end_time }}</span>
				<span 
					class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer g-fr g-m-r-20"
				>
					<i 
						:class="item.show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-dark"/>
				</span>
			</div>
			<vc-expand 
				ref="expand"
				v-model="item.show"
			>
				<div class="__expend">
					<div 
						v-for="(course, i) in item.course"
						:key="i"
					>
						<div class="g-m-b-10">
							<span 
								v-if="course.study_type === 1" 
								class="g-bg-red-mid g-m-r-5"
								style="padding-left: 3px;border-radius: 2px;"
							>
								必
							</span>
							<span 
								v-else-if="course.study_type === 2" 
								class="g-bg-orange-mid g-m-r-5"
								style="padding-left: 3px;border-radius: 2px;"
							>
								选
							</span>
							<span 
								v-else 
								class="g-bg-blue-mid g-m-r-5"
								style="padding-left: 3px;border-radius: 2px;"
							>
								内
							</span>
							<span 
								v-if="course.lecture.map(v => v.staff_name).join(',').length < 10" 
								class="g-c-black4"
							>
								{{ course.lecture.map(v => v.staff_name).join(',') }}：
							</span>
							<i-tooltip
								v-else 
								:content="course.lecture.map(v => v.staff_name).join(',')" 
								max-width="250"
								transfer
								placement="right"
								class="g-c-black4"
							>
								<span class="g-c-black4">{{ course.lecture.map(v => v.staff_name).join(',').substr(0, 10) + '...：' }}</span>
							</i-tooltip>
							<span class="g-c-black1">{{ course.course_name.slice(0, 15) }}</span>
							<span class="g-c-black4 g-m-l-5">({{ course.start_time }} 至 {{ course.end_time }})</span>
							<span class="g-c-black4 g-m-l-5 g-fr g-m-r-20">关联课题：
								<span v-if="course.subject.length">
									<span 
										v-if="course.subject.map(v => v.subject_name).join(',').length < 5"
										class="g-c-black2 g-inline-block"
									>
										{{ course.subject.map(v => v.subject_name).join(',') + '  ' }}
									</span>
									<i-tooltip
										v-else 
										:content="course.subject.map(v => v.subject_name).join(',')" 
										placement="left"
										transfer
										max-width="200"
									>
										<span class="g-c-black2">{{ course.subject.map(v => v.subject_name).join(',').substr(0, 4) + '...' }}</span>
									</i-tooltip>
								</span>
								<span v-else>--</span>
							</span>
						</div>
						<div class="__wrapper g-m-b-10">
							<div v-if="course.sign.length" class="g-c-black1 g-m-r-30 __item">
								<i class="iconfont icon-qiandao1" style="color: #2397F9;" />
								签到：<span>{{ course.sign[0].status_name }}</span>
								<span v-if="course.sign[0].time" class="g-c-black4">({{ course.sign[0].time }})</span>
								至
								<span v-if="course.sign.length > 1">
									<span>{{ course.sign[1].status_name }}</span>
									<span v-if="course.sign[1].time" class="g-c-black4">({{ course.sign[1].time }})</span>
								</span>
								<span v-else class="g-c-black4">
									--
								</span>
							</div>
							<div v-else class="g-c-black1 g-m-r-30 __item">
								<i class="iconfont icon-qiandao1" style="color: #2397F9;" />
								签到：<span>--</span>
							</div>
							<div v-if="course.exam.length" class="g-c-black1 __item-second">
								<i class="iconfont icon-kaoshi" style="color: #4FC43D;" />
								考试：
								<span 
									v-if="course.exam.map(v => v.exam_status_name + (v.score ? ('(' + v.score + '分)') : '')).join('/').length < 12"
								>
									{{ course.exam.map(v => v.exam_status_name + (v.score ? ('(' + v.score + '分)') : '')).join('/') }}
								</span>
								<i-tooltip
									v-else
									:content="course.exam.map(v => v.exam_status_name + (v.score ? ('(' + v.score + '分)') : '')).join('/')"
									placement="bottom"
									max-width="250"
									transfer
								>
									<span>
										{{ course.exam.map(v => v.exam_status_name
										+ (v.score ? ('(' + v.score + '分)') : '')).join('/').substring(0, 12) }}...
									</span>
								</i-tooltip>
							</div>
							<div v-else class="g-c-black1 __item-second">
								<i class="iconfont icon-kaoshi" style="color: #4FC43D;" />
								考试：<span>{{ course.exam_status_name }}</span>
							</div>
							<div v-if="course.credit" class="g-c-black1 g-inline-block" style="width: 110px;">
								<i class="iconfont icon-trencher-cap" style="color: #ED8F4A;" />
								学分：<span>{{ course.credit }}</span>
							</div>
						</div>
						<div class="__wrapper g-m-b-10">
							<div class="g-c-black1 g-m-r-30 __item">
								<span v-if="handleIsObj(course.vote)">
									<i class="iconfont icon-toupiao" style="color: #ED8F4A;" />
									投票：{{ course.vote.status_name }}
									<span class="g-c-black4">({{ course.vote.times }}次)</span>
								</span>
								<span v-else>
									<i class="iconfont icon-toupiao" style="color: #ED8F4A;" />
									投票：<span class="g-c-black4">--</span>
								</span>
							</div>
							<div class="g-c-black1 __item-second">
								<span v-if="handleIsObj(course.apply)" >
									<i class="iconfont icon-baoming" style="color: #E74854;" />
									报名：{{ course.apply.status_name }}
									<span class="g-c-black4">({{ course.apply.audit_time }})</span>
								</span>
								<span v-else>
									<i class="iconfont icon-baoming" style="color: #E74854;" />
									报名：<span class="g-c-black4">--</span></span>
							</div>
						</div>
					</div>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import { Drawer, Button, Tabs, TabPane, Progress, Tooltip } from "iview";
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';

export default {
	name: "v-hr-academy-statistic-study-detail",
	components: {
		'oa-loading': Loading,
		'vc-expand': Expand,
		'i-tooltip': Tooltip,
	},
	props: {
		data: {
			type: Array,
		},
	},
	data() {
		return {
			show: false
		};
	},
	computed: {

	},
	watch: {

	},
	created() {
		if (this.data) {
			this.data.forEach(v => {
				this.$set(v, 'show', true);
			});
		}
	},
	mounted() {
	},
	methods: {
		handleIsObj(obj) {
			return JSON.stringify(obj) !== '{}';
		},
		handleToggle(event, index) {
			this.$refs.expand[index].toggle();
		},
	}
};
</script>
<style lang="scss" >
.c-academy-statistic-study-detail-expend {
	border-radius: 0;
	box-shadow: none;
	.ivu-tabs-content {
		padding-bottom: 25px;
	}
	._expend-detail {
		margin: 0 20px 20px 20px;
		box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		border-radius: 5px;
		.__top {
			position: relative;
			overflow: hidden;
			height: 52px;
			line-height: 52px;
			background:#F9F9F9;
			border-bottom: 1px solid #E8E8E8;
			border-top-left-radius: 5px;
			border-top-right-radius: 5px;
		}
		.__expend {
			padding: 20px 10px 20px 20px;
			.__wrapper {
				margin-left: 65px;
				.__item {
					display: inline-block;
					width: 330px;
				}
				.__item-second {
					display: inline-block;
					width: 220px;
				}
			}
		}
	}
}
</style>
