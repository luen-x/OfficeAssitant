<template>
	<div class="v-sale-train-stdy-personal">
		<div class="_title g-fs-16" @click="handleCheck(personal.staff_id,personal.echelon_id)" >{{ personal.echelon_name }}</div>
		<div class="g-m-t-20 g-flex">
			<div class="g-m-r-20" style="min-width: 76px;" >
				<img v-if="personal.head_img" :src=" personal.head_img " class="_img" alt="">
				<img
					v-else
					src="https://timgsa.baidu.com/timg?image&
					quality=80&size=b9999_10000&sec=155712012811
					8&di=5df39c4c7dba815013d60bf51dba30e3&imgtype=0
					&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F69ad
					7a731f43d4b8729f1a2fbe65c43801ca0f033250-EV1vMf_fw658 "
					class="_img"
					alt="">
			</div>
			<div class="g-flex g-jc-sb" style="max-width:1100px;width: 90%;">
				<div>
					<div class="g-m-t-5">
						<span class="g-fs-16 g-c-black1">{{ personal.staff_name }}</span>
						<span class="g-m-l-10 g-c-black2" >{{ personal.position_name }}</span>
					</div>
					<div>
						<span class="g-c-black2 g-m-r-5">{{ personal.depart_name }}</span>
						<span class="g-c-black2">{{ personal.mobile }}</span>
					</div>
				</div>
				<div class="_list">
					<ul class="g-flex g-fw-w">
						<li style="flex: 0 1 25%">
							<span>已参加培训总课程：</span>
							<span class="g-c-black2">{{ personal.train_course_num }}</span>
						</li>
						<li class="g-m-l-60" >
							<span>已参加谈判训练班期数：</span>
							<span class="g-c-black2">{{ personal.negotiation_course_num }}</span>
						</li>
						<li class="g-m-l-60">
							<span>已参加疑难解惑班期数：</span>
							<span class="g-c-black2">{{ personal.difficult_course_num }}</span>
						</li>
						<li>
							<span>第一通话术：</span>
							<span class="g-c-black2">{{ personal.first_talk_skill }}</span>
						</li>
						<li>
							<span>价值传递话术：</span>
							<span class="g-c-black2">{{ personal.value_talk_skill }}</span>
						</li>
						<li>
							<span>选查通关疑难话术：</span>
							<span class="g-c-black2">{{ personal.select_check_talk_skill }}</span>
						</li>
						<li>
							<span>抽查通关疑难话术：</span>
							<span class="g-c-black2">{{ personal.spot_check_talk_skill }}</span>
						</li>
						<li>
							<span>通关案例数：</span>
							<span class="g-c-black2">{{ personal.pass_case_num }}</span>
						</li>
						<li>
							<span>内部授课期数：</span>
							<span class="g-c-black2">{{ personal.internal_teaching_num }}</span>
						</li>
					</ul>
					<!-- <div class="g-m-t-10">
						<i-progress
							:percent="course.schedule"
							:stroke-width="4"
							style="width: 88%;"
							stroke-color="#E84C57"
							status="wrong"
							hide-info/>
					</div>
					<div>规定课程完成进度({{ course.schedule }}%)</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { Progress } from 'iview';
import API from "@stores/apis/root";

export default {
	components: {
		'i-progress': Progress
	},
	data() {
		return {
			personal: {},
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API._SALE_TRAIN_STUDY_STAFF_DETAIL_GET,
				type: 'GET',
				param: {
					// staff_id: _global.staff.staff_id
				},
			}).then((res) => {
				this.personal = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleCheck(staff_id, echelon_id) {
			this.$router.push({ path: '/sale/train/employee/course', query: { staff_id, echelon_id } });
		}
	}

};
</script>

<style  lang="scss">
    .v-sale-train-stdy-personal {
		._title{
			color:#DF4E58;
			font-weight: bold;
			cursor: pointer;
		}
		._img{
			width: 76px;
			height: 76px;
			border-radius: 60%
		}
		._list{
			width:720px;
			li{
				flex:0 1 25%;
				margin-top:10px;
			}
			li:last-child{
				color: #333;
			}
		}

    }
</style>
