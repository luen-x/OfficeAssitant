<template>
	<div class="v-archives-person-details-head g-fs-14">
		<div v-if="basicInfo.echelon_name" class="_header g-flex g-fs-16">
			<div class="_line"/>
			<div class="_text">{{ basicInfo.echelon_name }}</div>
		</div>
		<div class="g-flex _detail-content g-m-t-20" style="padding-left: 40px;">
			<div>
				<img :src="basicInfo.head_img" alt class="_img">
				<div class="g-m-t-20 g-fs-14 g-m-b-10">
					<span class="g-c-black4">已参加培训总课程：</span>
					<span class="g-c-black3">{{ basicInfo.course.total_num }}个</span>
				</div>
			</div>
			<div class="g-flex" style="margin-left: -30px;margin-top: -5px;">
				<div>
					<div class="_item">
						<span class="g-fs-18 g-c-black1">{{ basicInfo.staff_name }}</span>
						<span class="g-c-black4 g-fs-14 g-m-l-15">{{ basicInfo.position_name }}</span>
					</div>
					<div class="g-c-black1 _item">{{ basicInfo.mobile }}</div>
					<div class="g-c-black4 _item">{{ basicInfo.depart_name }}</div>
				</div>
				<div class="g-flex">
					<div class="g-c-black1 g-flex" style="margin-left: 100px;">
						<div class="_info g-flex">
							<span class="g-c-black4 _content">未完成必修课程：</span>
							<span class="g-c-black4 _content">已完成必修课程：</span>
							<span class="g-c-black4 _content">已完成选修课程：</span>
						</div>
						<div class="_info g-flex" >
							<span class="_content">{{ basicInfo.course.not_complete_compulsory_num }}个</span>
							<span class="_content">{{ basicInfo.course.complete_compulsory_num }}个</span>
							<span class="_content">{{ basicInfo.course.complete_elective_num }}个</span>
						</div>
					</div>
					<div class="g-c-black1 g-flex" style="margin-left: 100px;">
						<div class="_info g-flex" style="text-align: right">
							<span class="g-c-black4 _content">已完成的内训课程：</span>
							<span class="g-c-black4 _content" >已参加项目：</span>
							<span class="g-c-black4 _content">目前所得总学分：</span>
						</div>
						<div class="_info g-flex" >
							<span class="_content">{{ basicInfo.course.complete_internal_num }}个</span>
							<span class="_content">{{ basicInfo.project_num }}个</span>
							<span class="_content">{{ basicInfo.total_credit }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress } from "iview";
import API_ROOT from "@stores/apis/root";

export default {
	name: "oa-archives-person-details-head",
	components: {
		"i-progress": Progress
	},
	props: {
		staffId: [String, Number]
	},
	data() {
		return {
			basicInfo: {
				echelon_id: "",
				echelon_name: "", // 人才梯队名称
				staff_name: "", // 姓名
				position_name: "", // 职位
				depart_name: "", // 部门
				mobile: "", // 手机
				course: {
					total_num: "", // 已参加培训总课程
					not_complete_compulsory_num: "", // 未完成必修课程
					complete_elective_num: "", // 已完成选修课程
					complete_compulsory_num: "", // 已完成必修课程
					complete_internal_num: "" // 已完成的内训课程：
				},
				total_credit: "", // 目前所得总学分
				project_num: "", // 已参加项目
				schedule: "" // 课程完成进度
			} // 头部信息
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
				type: "GET",
				loading: false,
				param: {
					staff_id: query.staff_id,
					applicant_id: query.applicant_id,
				},
				autoTip: false
			})
				.then(res => {
					this.basicInfo = res.data;
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		}
	}
};

export const TrainEmployeeDetailHead = module.exports.default;
</script>
<style lang="scss" >
.v-archives-person-details-head {
    ._header {
        ._line {
            margin: 3px 16px;
            width: 2px;
            background-color: #e74854;
        }
        .text {
            color: #4b4f57;
        }
    }
    ._detail-content {
        ._img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
        }
        ._item {
            margin-bottom: 20px;
        }
        ._info {
            
			flex-direction:column;
            ._content{
				margin-bottom: 24px;
			}
        }
    }
}
</style>
