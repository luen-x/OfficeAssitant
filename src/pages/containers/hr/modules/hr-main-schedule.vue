<template>
	<set-title :routes="routes" title="人事日程安排" style="overflow-x: auto">
		<oa-calendar 
			:on-refresh="loadData"
		/>
	</set-title>
</template>

<script>

import Calendar from '@components/hr/main-schedule/calendar';

export default {
	name: 'oa-hr-main-schedule',
	components: {
		'oa-calendar': Calendar
	},
	data() {
		return {
			routes: [{
				path: '',
				name: '日程安排'
			}]
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData(month) {
			// AUTH 招聘组:125, 绩效组:126
			this.request({
				url: 'HR_MAIN_SCHEDULE_GET', // eslint-disable-line
				type: "GET",
				param: {
					month,
					auth: this.$auth[126] ? 126 : 125
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
