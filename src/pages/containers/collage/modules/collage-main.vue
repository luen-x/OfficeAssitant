<template>
	<set-title
		title="商学院首页"
		class="g-flex g-fd-c"
		style="overflow-x: auto; padding-top: 20px">
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
							:data="info_list"
						/>
					</oa-calendar>
				</div>
				<oa-record />
			</div>
			<oa-right-side />
		</div>
	</set-title>
</template>

<script>
import Calendar from '@components/_common/calendar/calendar';
import Record from '@components/collage/main/record';
import Reminder from '@components/collage/main/reminder';
import RightSide from '@components/collage/main/right-side';
import moment from 'moment';
import { AddSchedModal } from '@components/hr/_common/add-sched-modal';
import WorkTable from '@components/tech/_common/work-table/work-table';

export default {
	name: 'oa-collage-main',
	components: {
		'oa-calendar': Calendar,
		'oa-record': Record,
		'oa-reminder': Reminder,
		'oa-right-side': RightSide,
		'oa-work-table': WorkTable
	},
	data() {
		const date = moment(new Date()).format('YYYY-MM-DD');
		return {
			info_list: [],
			date,
		};
	},
	computed: {
		scheduleDate() {
			let schedule = {};
			if (Array.isArray(this.$store.state.collageMain.data.schedule_date)) {
				schedule = {};
			} else {
				schedule = this.$store.state.collageMain.data.schedule_date;
			}
			return schedule;
		},
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.request({
				url: 'COLLAGE_MAIN_GET', // eslint-disable-line
				type: "GET",
				param: {
					date: this.date,
					// auth: this.$auth[1290] ? 126 : 125
				},
				loading: false
			}).then((res) => {
				this.info_list = res.data.left_info;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleAddSched() {
			if (this.$auth[734] || this.$auth[1391]) {
				this.$router.push({
					path: '/collage/main/schedule',
					query: {
					}
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
