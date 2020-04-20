<template>
	<set-title title="财务首页" class="g-flex g-fd-c g-pd-t-20">
		<oa-work-table/>
		<div class="g-flex">
			<div class="g-col g-pd-l-30 g-pd-b-10 g-pd-r-15">
				<div class="g-flex v-finance-main" >
					<oa-calendar 
						:date.sync="date" 
						:on-refresh="fetchData" 
						:add-sched="handleAddSched"
						class="g-col" 
					>
						<oa-reminder 
							:todo-list="todoList" 
							:fetch-data="fetchData" 
						/>
					</oa-calendar>
					<oa-right-side :compare="info.compare"/>
				</div>
				<oa-options :wait="info.wait_audit" :payment="info.payment"/>
			</div>
		

		</div>
	</set-title>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import Calendar from '@components/_common/calendar/calendar';
import Options from '@components/finance/main/options';
import Reminder from '@components/finance/main/reminder';
import RightSide from '@components/finance/main/right-side';
import moment from "moment";
import { AddSchedModal } from '@components/finance/_common/todo/add-sched-modal';
import WorkTable from '@components/tech/_common/work-table/work-table';

export default {
	name: 'oa-finance-main',
	components: {
		'oa-calendar': Calendar,
		'oa-options': Options,
		'oa-reminder': Reminder,
		'oa-right-side': RightSide,
		'oa-work-table': WorkTable
	},
	data() {
		return {
			date: '',
			info: {},
			todoList: []
		};
	},
	created() {
		// let remind_time = moment().format("YYYY-MM-DD");
		this.loadData();
		this.fetchData();
	},
	mounted() {
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._FINANCE_MAIN_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.info = res.data;
			}).catch(err => {});
		},
		fetchData(remind_time) {
			let time = moment().format("YYYY-MM-DD");
			this.$request({
				url: API_ROOT["_FINANCE_MAIN_SCHEDULE_LIST_GET"], // eslint-disable-line
				type: "GET",
				param: {
					...this.formValidate,
					date: remind_time || time,
					schedule_id: this.schedule_id
				},
				loading: false
			}).then((res) => {
				this.todoList = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleAddSched() {
			AddSchedModal.popup({
			}).then((res) => {
				// this.onRefresh();
				this.fetchData(res);
			}).catch((res) => {});
		},
	},
};
</script>

<style lang="scss" >
.v-finance-main{
	position: relative;
}
</style>
