<template>
	<set-title title="人事首页" class="g-flex g-fd-c g-pd-t-20" style="overflow-x: auto">
		<oa-work-table/>
		<div class="g-flex">
			<div class="g-col" style="padding: 0px 15px 10px 25px">
				<div class="g-flex">
					<oa-calendar 
						:data-source="scheduleDate"
						:date.sync="date"
						:on-refresh="loadData"
						:add-sched="handleAddSched"
						class="g-col" 
					>
						<oa-reminder 
							:on-refresh="loadData"
						/>
					</oa-calendar>
				</div>
				<oa-options />
			</div>
			<oa-right-side />
		</div>
	</set-title>
</template>

<script>
import Calendar from '@components/_common/calendar/calendar';
import Options from '@components/hr/main/options';
import Reminder from '@components/hr/main/reminder';
import RightSide from '@components/hr/main/right-side';
import { AddSchedModal } from '@components/hr/_common/add-sched-modal';
import WorkTable from '@components/tech/_common/work-table/work-table';

export default {
	name: 'oa-hr-main',
	components: {
		'oa-calendar': Calendar,
		'oa-options': Options,
		'oa-reminder': Reminder,
		'oa-right-side': RightSide,
		'oa-work-table': WorkTable
	},
	data() {
		return {
			date: ''
		};
	},
	computed: {
		scheduleDate() {
			return this.$store.state.hrMain.data.schedule_date || {};
		},
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			// AUTH 招聘组:22, 绩效组:23
			this.request({
				url: 'HR_MAIN_GET', // eslint-disable-line
				type: "GET",
				param: {
					date: this.date,
					auth: this.$auth[126] ? 126 : 125
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleAddSched() {
			AddSchedModal.popup({
				type: this.$auth[126] ? 'hr' : 'recruit',
				remindTime: this.date
			}).then((res) => {
				this.loadData();
			}).catch((res) => {
			});
		},
	},
};
</script>

<style lang="scss" scoped>
</style>