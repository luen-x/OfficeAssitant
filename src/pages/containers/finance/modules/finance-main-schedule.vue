<template>
	<set-title :routes="routes" title="财务日程安排">
		<oa-calendar 
			:on-refresh="loadData"
		/>
	</set-title>
</template>

<script>

import Calendar from '@components/finance/main-schedule/calendar';

export default {
	name: 'oa-finance-main-schedule',
	components: {
		'oa-calendar': Calendar
	},
	data() {
		return {
			routes: [{
				path: '',
				name: '日程安排'
			}],
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData(month) {
			// 获得某月及其前后一个月所有日程
			this.request({
				url: 'FINANCE_MAIN_SCHEDULE_GET', // eslint-disable-line
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
