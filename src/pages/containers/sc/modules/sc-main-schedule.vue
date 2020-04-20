<template>
	<set-title :routes="routes" title="立客户中心日程安排" style="overflow-x: auto">
		<oa-calendar 
			:on-refresh="loadData"
		/>
	</set-title>

</template>

<script>

import Calendar from '@components/sc/main-schedule/calendar';

export default {
	name: 'oa-sc-main-schedule',

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
			this.request({
				url: 'SC_MAIN_SCHEDULE_GET',
				type: "GET",
				param: {
					month,
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
