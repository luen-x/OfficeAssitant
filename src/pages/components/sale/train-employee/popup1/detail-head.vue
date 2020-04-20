<template>
	<div class="v-sale-train-employee-detail-head">
		<div>
			<h2 
				class="_detail-header g-fs-16 g-c-red-mid g-pointer"
				@click="handleCourseDetail"
			>
				{{ basicInfo.echelon_name || '--' }}
			</h2>

			<div class="g-flex g-pd-t-20" style="padding-left: 16px;">
				<div>
					<img 
						v-if="basicInfo.head_img" 
						:src="basicInfo.head_img" 
						alt="" 
						class="_img"
					>
					<div 
						v-else 
						class="g-fs-18 g-tc _img"
						style="background-color: #e84854;line-height: 76px;"
					>
						{{ basicInfo.staff_name.substring(basicInfo.staff_name.length - 2) || '--' }}
					</div>
				</div>
				<div 
					class="g-pd-l-20" 
					style="flex: 1;"
				>
					<div 
						class="g-flex g-jc-sb" 
						style="padding-right: 10%;"
					>
						<div>
							<div class="g-m-b-10">
								<span class="g-fs-16 g-c-black1">{{ basicInfo.staff_name || '--' }}</span>
								<span class="g-c-black3 g-pd-l-10">{{ basicInfo.position_name || '--' }}</span>
							</div>
							<div class="g-m-b-10">
								<span class="g-c-black3">{{ basicInfo.depart_name || '--' }}</span>
								<span class="g-c-black3">{{ basicInfo.mobile || '--' }}</span>
							</div>
							<div>
								<span class="g-c-black3">已参加培训总课程：</span>
								<span class="g-c-black3">{{ basicInfo.course.total_num || 0 }}个</span>
							</div>
						</div>
						<div>
							<div class="_info">
								<span>未完成必修课程：</span>
								<span>{{ basicInfo.course.not_complete_compulsory_num || 0 }}个</span>
							</div>
							<div class="_info">
								<span>已完成必修课程：</span>
								<span>{{ basicInfo.course.complete_compulsory_num || 0 }}个</span>
							</div>
							<div class="_info">
								<span>已完成选修课程：</span>
								<span>{{ basicInfo.course.complete_elective_num || 0 }}个</span>
							</div>
						</div>
						<div>
							<div class="_info">
								<span>已完成的内训课程：</span>
								<span>{{ basicInfo.course.complete_internal_num || 0 }}个</span>
							</div>
							<div class="_info">
								<span>已参加项目：</span>
								<span>{{ basicInfo.project_num || 0 }}个</span>
							</div>
						
							<div class="_info">
								<span>目前所得总学分：</span>
								<span>{{ basicInfo.total_credit || 0 }}</span>
							</div>
						</div>
					</div>
					<div class="g-flex _progress">
						<i-progress 
							:percent="Number(basicInfo.schedule) || 0" 
							:stroke-width="5" 
							status="active"
							style="width: 70%;"
						>
							<span/>
						</i-progress>
						<span class="g-c-black3">
							规定课程完成进度（{{ basicInfo.schedule || 0 }}%）
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress } from 'iview';
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-train-employee-detail-head",
	components: {
		'i-progress': Progress
	},
	props: {
		staffId: [String, Number],
		applicantId: [String, Number],
	},
	data() {
		return {
			basicInfo: {
				echelon_id: '',
				echelon_name: '', // 人才梯队名称
				staff_name: '', // 姓名
				position_name: '', // 职位
				depart_name: '', // 部门
				mobile: '', // 手机
				course: {
					total_num: '', // 已参加培训总课程
					not_complete_compulsory_num: '', // 未完成必修课程
					complete_elective_num: '', // 已完成选修课程
					complete_compulsory_num: '', // 已完成必修课程
					complete_internal_num: '', // 已完成的内训课程：
				},
				total_credit: '', // 目前所得总学分
				project_num: '', // 已参加项目
				schedule: '', // 课程完成进度
			}, // 头部信息
		};
	},
	watch: {
		staffId() {
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			const { query } = this.$route;
			this.$request({
				url: API_ROOT._SALE_TRAIN_EMPLOYEE_DETAIL_GET,
				type: 'GET',
				loading: false,
				param: {
					staff_id: this.staffId || query.staff_id,
					applicant_id: this.applicantId || query.applicant_id
				},
				autoTip: false
			}).then(res => {
				this.basicInfo = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleCourseDetail() {
			if (this.$auth[512]) {
				this.$emit('close');
				setTimeout(() => {
					this.$router.push({
						name: 'sale-train-employee-course',
						query: {
							staff_id: this.staffId,
							applicant_id: this.applicantId,
							echelon_id: this.basicInfo.echelon_id
						}
					});
				}, 300);
			}
		}
	}
};

export const TrainEmployeeDetailHead = module.exports.default;
</script>
<style lang="scss">
.v-sale-train-employee-detail-head {
	._detail-header {
		padding: 16px;
		font-weight: normal;
	}
	._img {
		width: 76px;
		height: 76px;
		border-radius: 50%;
		color: #fff;
		border: 1px solid #f5f5f6;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	}
	._info {
		padding-bottom: 14px;
	}
	._progress {
		width: 100%;
		padding-bottom: 16px;
	}
	.ivu-progress-bg {
		background-color: #e84854;
	}
	.ivu-progress-outer {
		padding-right: 15px;
	}
	.ivu-progress-inner {
		background-color: #CFD5E2;
	}
}
</style>
