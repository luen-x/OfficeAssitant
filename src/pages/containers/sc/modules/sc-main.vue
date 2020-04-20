<template>
	<set-title title="立客户中心首页" class="g-flex g-fd-c g-pd-t-20" style="overflow-x: auto;">
		<oa-work-table/>
		<div class="g-flex">
			<div class="g-col g-pd-l-30 g-pd-b-30 g-pd-r-15 g-relative v-sc-main">
				<div class="g-flex">
					<oa-calendar 
						:data-source="remind"
						:date.sync="date"
						:add-sched="handleAddSched"
						class="g-col"
					>
						<oa-reminder 
							ref="reminder"
							:date="date"
						/>
					</oa-calendar>
				</div>

				<div class="g-flex g-jc-sb">
					<oa-options class="g-m-r-10" style="width: 60%;"/>
					<oa-supplment style="width: 516px;"/>
				</div>
			</div>
			<oa-right-side />
		</div>
	</set-title>
</template>

<script>
import Calendar from '@components/_common/calendar/calendar';
import Options from '@components/sc/main/options';
import Reminder from '@components/sc/main/reminder';
import RightSide from '@components/sc/main/right-side';
import Supplement from '@components/sc/main/supplement';
import { AddSchedModal } from '@components/sc/_common/add-sched-modal';
import WorkTable from '@components/tech/_common/work-table/work-table';

export default {
	name: 'oa-sc-main',
	components: {
		'oa-calendar': Calendar,
		'oa-options': Options,
		'oa-reminder': Reminder,
		'oa-right-side': RightSide,
		'oa-supplment': Supplement,
		'oa-work-table': WorkTable
	},
	data() {
		return {
			date: '',
			remind: {}
		};
	},
	watch: {
		date(newVal) {
			this.loadRemid(newVal);
		}
	},
	created() {
		this.loadRemid();
	},
	methods: {
		handleAddSched(dates) {
			AddSchedModal.popup({
				flag: true,
				dates
			}).then(res => {
				this.$refs.reminder.flag = false;
				this.$refs.reminder.page = 1;
				this.$refs.reminder.loadData && this.$refs.reminder.loadData();
			}).catch(res => {});
		},

		loadRemid(date) {
			this.$request({
				url: '_SC_MAIN_DAY_REMIND_GET', // eslint-disable-line
				type: "GET",
				param: {
					month: date
				},
				loading: false
			}).then((res) => {
				res.data.length == 0 ? this.remind = {} : this.remind = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-sc-main{
	height: 880px;
}
</style>