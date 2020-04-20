<template>
	<div :key="id" class="hr-academy-statistic-study-detail-list">
		<div class="_top g-pointer" @click="handleToggle($attrs)" >
			<span class="g-fs-16 g-c-black1 g-m-l-20" style="font-weight: bold;">
				{{ $attrs.subject_name }}
			</span>
			<span 
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer g-fr g-m-r-20"
			>
				<i 
					:class="$attrs.show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"/>
			</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="$attrs.show"
		>
			<div class="_expend">
				<div 
					v-for="(course, i) in $attrs.course"
					:key="i"
				>
					<i-row class="__wrapper">
						<i-col span="8">
							<span 
								v-if="course.lecture.map(v => v.staff_name).join(',').length < 5"
							>
								{{ course.lecture.map(v => v.staff_name).join(',') }}：
							</span>
							<i-tooltip
								v-else
								:content="course.lecture.map(v => v.staff_name).join(',')"
								placement="bottom"
								max-width="250"
								transfer
							>
								<span>{{ course.lecture.map(v => v.staff_name).join(',').substring(0, 5) }}：</span>
							</i-tooltip>
							<span 
								v-if="course.course_type == 1" 
								class="__label" 
								style="background-color: #E84C57"
							>{{ course.course_type_name }}</span>
							<span 
								v-if="course.course_type == 2" 
								class="__label" 
								style="background-color: #ED8F4A"
							>{{ course.course_type_name }}</span>
							<span 
								v-if="course.course_type == 3" 
								class="__label" 
								style="background-color: #2397F9"
							>{{ course.course_type_name }}</span>
							<span v-if="course.course_name.length < 14" class="g-c-blue-light">{{ course.course_name }}</span>
							<i-tooltip
								v-else
								:content="course.course_name"
								placement="bottom"
								max-width="250"
								transfer
							>
								<span class="g-c-blue-light">{{ course.course_name.substring(0, 12) }}...</span>
							</i-tooltip>
						</i-col>
						<i-col span="4" class="__item">
							<i class="iconfont icon-qiandao1" style="color: #2397F9;"/>
							参与状态：{{ course.status_name }}
						</i-col>
						<i-col span="5" class="__item">
							<i class="iconfont icon-kaoshi" style="color: #4FC43D;"/>
							考试：
							<span v-if="course.exam.length">

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
							</span>
							<span v-else>{{ course.exam_status_name }}</span>
						</i-col>
						<i-col span="4" class="__item">
							<i class="iconfont icon-peixun1" style="color: #ED8F4A;"/>
							学分：{{ course.credit }}
						</i-col>
					</i-row >
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Expand } from 'wya-vc';
import { Row, Col, Tooltip } from 'iview';

export default {
	name: "oa-item",
	components: {
		'vc-expand': Expand,
		'i-tooltip': Tooltip,
		'i-row': Row,
		'i-col': Col
	},
	props: {
		id: [String, Number],
		name: String
	},
	methods: {
		handleToggle(event) {
			this.$refs.expand.toggle();
		},
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_DETAIL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_DETAIL_LIST_RESET', { type: this.type });
		}
	}
};
</script>
<style lang="scss" >
.hr-academy-statistic-study-detail-list {
	margin-bottom: 20px;
	box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.15);
	border-radius: 5px;
	._top {
		position: relative;
		overflow: hidden;
		height: 52px;
		line-height: 52px;
		background:#F9F9F9;
		border-bottom: 1px solid #E8E8E8;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	._expend {
		padding: 20px;
		.__wrapper {
			width: 90%;
			margin-left: 53px;
			height: 20px;
			line-height: 20px;
			margin-bottom: 10px;
			.__label {
				color: #fff;
				padding: 1px 3px 1px 3px;
				border-radius: 2px;
			}
			.__item {
				margin-right: 40px;
			}
		}
	}
}
</style>
