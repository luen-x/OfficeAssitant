<template>
	<set-title title="考试" class="g-tabs-card" style="padding: 20px">
		<oa-filter :enable="enable_upload" :time="time" @change="handleChangeStart" />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/train-plan-detail-exam/list';
import Filter from '@components/academy/train-plan-detail-exam/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-train-plan-detail-exam',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_TRAIN_PLAN_DETAIL_EXAM')],
	data() {
		return {
			enable_upload: 0,
			time: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_GET",
				type: "GET",
				param: {
					course_id: this.$route.query.course_id
				},
				loading: false
			}).then(res => {
				this.enable_upload = res.data.enable_upload;
				this.time.push(res.data.upload_start_time);
				this.time.push(res.data.upload_end_time);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleChangeStart() {
			this.loadData();
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
