<template>
	<div class="v-sale-statistics-student-head g-pd-l-20 g-pd-t-30 g-flex">
		<div class="_image">
			<img :src="headDetail.head_img">
		</div>

		<div class="g-m-l-20">
			<div>
				<span class="g-fs-16 g-c-black1">{{ headDetail.staff_name }}</span>
				<span class="g-m-l-10">{{ headDetail.position_name }}</span>
				<span class="g-m-lr-15">{{ headDetail.depart_name }}</span>
				<span>{{ headDetail.mobile }}</span>
			</div>

			<div class="g-m-t-10">
				<div class="g-flex g-fw-w" style="width: 744px;">
					<div style="width: 33%;">
						<span class="g-c-black4">已参加培训课程：</span>
						<span class="g-c-black1">{{ headDetail.train_course_num }}</span>
					</div>

					<div style="width: 33%;">
						<span class="g-c-black4">已参加谈判训练班期数：</span>
						<span class="g-c-black1">{{ headDetail.negotiation_course_num }}</span>
					</div>

					<div style="width: 33%;">
						<span class="g-c-black4">已参加疑难解惑班期数：</span>
						<span class="g-c-black1">{{ headDetail.difficult_course_num }}</span>
					</div>
				</div>

				<div class="g-flex g-fw-w g-m-t-10" style="width: 744px;">
					<div style="width: 33%;">
						<span class="g-c-black4">第一通话术：</span>
						<span class="g-c-black1">{{ headDetail.first_talk_skill }}</span>
					</div>

					<div style="width: 33%;">
						<span class="g-c-black4">价值传递话术：</span>
						<span class="g-c-black1">{{ headDetail.value_talk_skill }}</span>
					</div>

					<div style="width: 33%;">
						<span class="g-c-black4">选查通关疑难话术：</span>
						<span class="g-c-black1">{{ headDetail.select_check_talk_skill }}</span>
					</div>
				</div>

				<div class="g-flex g-fw-w g-m-t-10" style="width: 744px;">
					<div style="width: 33%;">
						<span class="g-c-black4">抽查通关疑难话术：</span>
						<span class="g-c-black1">{{ headDetail.spot_check_talk_skill }}</span>
					</div>

					<div style="width: 33%;">
						<span class="g-c-black4">通关案例数：</span>
						<span class="g-c-black1">{{ headDetail.pass_case_num }}</span>
					</div>

					<div style="width: 33%;">
						<span class="g-c-black4">内部授课期数：</span>
						<span class="g-c-black1">{{ headDetail.internal_teaching_num }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	nama: 'academy-statistics-student-head',

	props: {
		staffId: {
			required: true,
			type: Number
		}
	},

	data() {
		return {
			headDetail: {}
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
		loadData() {
			this.$request({
				url: "_ACADEMY_STATISTICS_STUDENT_STAFF_DETAIL_GET",
				type: "GET",
				param: {
					staff_id: this.staffId
				},
				loading: false
			}).then(res => {
				this.headDetail = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-sale-statistics-student-head{
    height: 155px;

    ._image{
        img{
            width:76px;
            height:76px;
            border-radius:50%;
        }
    }
}
</style>