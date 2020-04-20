<template>
	<div class="v-sale-train-employee-course-item">
		<i-collapse v-model="arrow" simple>
			<i-panel :hide-arrow="true" :name="subject_name">
				<div class="g-flex g-jc-sb g-pd-r-10">
					<div>
						<span class="g-fs-14 g-c-black1">课题{{ subjectIndex }}：</span>
						<span class="g-fs-14 g-c-black1">{{ subject_name }}</span>
					</div>
					<i 
						v-if="arrow.includes(subject_name)" 
						class="icon iconfont icon-triangle-up g-fs-10"
					/>
					<i 
						v-else 
						class="icon iconfont icon-triangle-down g-fs-10"
					/>
				</div>
				<div slot="content">
					<div class="g-pd-t-15">
						<div 
							v-for="(item, index) in course" 
							:key="index"
							:class="{'g-m-b-10': index !== course.length - 1}"
						>
							<div class="g-flex g-ai-c">
								<div class="_tip">
									<span 
										v-if="item.lecture.length" 
										class="g-c-black7"
									>
										<i-tooltip 
											v-if="item.lecture.length > 2"
											:content="item.lecture.map(it => it.staff_name).join('，')"
											:max-width="250"
											transfer
											theme="light"
										>
											<span>
												{{ item.lecture.slice(0, 2).map(it => it.staff_name).join('，') + '...：' }}
											</span>
										</i-tooltip>
										<span v-else class="g-c-black7">
											{{ item.lecture.map(it => it.staff_name).join('，') + '：' }}
										</span>
									</span>
									<span v-else class="g-c-black7">--</span>
									<span 
										:class="{
											'g-bg-red-mid': item.course_type === 1,
											'g-bg-orange-mid': item.course_type === 2,
											'g-bg-blue-mid': item.course_type === 3
										}"
										class="g-fs-12 g-m-r-10"
										style="border-radius: 2px;padding: 1px 2px 1px 5px;"
									>
										{{ item.course_type_name }}
									</span>
									<i-tooltip 
										v-if="item.course_name.length > 20"
										:content="item.course_name"
										max-width="250"
										theme="light"
									>
										<span class="g-c-blue-mid">
											{{ item.course_name.substr(0, 20) + '...' }}
										</span>
									</i-tooltip>
									<span v-else class="g-c-blue-mid">{{ item.course_name }}</span>
								</div>
								<div class="_tip">
									<i class="icon iconfont icon-qiandao g-c-blue-mid"/>
									<span class="g-c-black3">参与状态：</span>
									<span class="g-c-black3">{{ item.status_name || '--' }}</span>
								</div>
								<div class="_tip g-flex">
									<i class="icon iconfont icon-kaoshi g-c-green-mid g-m-r-5"/>
									<span class="g-c-black3">考试情况：</span>
									<span v-if="item.exam_status">
										<span v-if="item.exam.length">
											<oa-auto-tooltip 
												:content="item.exam.map(it=>{
													return it.score ? `${it.exam_status_name}（${it.score}）` : ` ${it.exam_status_name}`
												}).join(' ')"
												width="120px"
												label-class="g-c-black3"
											/>
										</span>
										<span v-else>--</span>
									</span>
									<span v-else>未安排</span>
								</div>
								<div 
									v-if="item.credit" 
									class="_tip"
								>
									<i 
										class="icon iconfont icon-toupiao g-c-orange-mid"
										style="margin-right: 2px;"
									/>
									<span class="g-c-black3">学分：</span>
									<span class="g-c-black3">{{ item.credit }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</i-panel>
		</i-collapse>
	</div>
</template>

<script>
import { Collapse, Panel, Tooltip } from "iview";
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	name: "oa-train-employee-course-item",
	components: {
		"i-collapse": Collapse,
		"i-panel": Panel,
		'i-tooltip': Tooltip,
		'oa-auto-tooltip': AutoTooltip
	},
	props: {
		subject_name: String,
		course: {
			type: Array,
			default() {
				return [];
			}
		},
		subjectIndex: Number
	},
	data() {
		return {
			arrow: [this.subject_name]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_TRAIN_EMPLOYEE_COURSE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_TRAIN_EMPLOYEE_COURSE_LIST_RESET', { type: this.type });
		}
	}
};
</script>
<style lang="scss">
.v-sale-train-employee-course-item {
	._tip {
		width: 25%;
		word-break: break-all;
	}
	.ivu-form-item-content {
        margin-left: 0;
    }
    .ivu-form .ivu-form-item-label {
        width: 125px;
		text-align: left;
    }
    .ivu-form-item-content {
        width: 80%;
    }
    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
        height: 40px;
		background-color: #f6f6f6;
    }
    .ivu-collapse {
        width: 100%;
        border: none;
    }
    .ivu-collapse > .ivu-collapse-item {
        border-radius: 5px;
        margin-bottom: 10px;
		border-top: none;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    }
}
</style>

