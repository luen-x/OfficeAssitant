<template>
	<div class="v-sale-main-schedule">
		<div v-show="!showCalendar" class="_schedule">
			<div class="g-c-black1 __head g-tc g-fs-14">
				<div class="g-fr g-operation" style="font-size:14px">
					<span class="g-m-r-5" @click="handleOpenRemind">提醒设置</span>|
					<span
						class="g-m-l-5 g-m-r-20"
						@click="handleToggleOpen(true)">展开
						<i class="iconfont g-fs-12  icon-down"/>
					</span>
				</div>
				日程安排
			</div>
			<div v-if="scheduleList.length" class="g-pd-lr-10">
				<div v-for="(sch,index) in scheduleList" :key="index" class="g-flex g-jc-sb __content g-pd-lr-10">
					<div class="g-c-black2 g-fs-14">
						<i class="__point g-m-r-10"/>
						<span v-if="sch.can_apply" class="__apply">
							报名
						</span>
						{{ sch.schedule_name }}
					</div>
					<div class="g-fs-14" style="color:#818794">{{ sch.start_time }}至{{ sch.end_time }}</div>
				</div>
			</div>
			<div
				v-else
				class="g-flex-cc g-flex-ac"
			>
				<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
			</div>

		</div>
		<oa-calendar v-show="showCalendar" @toggle-open="handleToggleOpen"/>
	</div>
</template>

<script>
import { OSS_SEARCH_EMPTY } from "@constants/constants";
import { remindSet } from './popup/remindSet';
import calendar from './calendar/content';

export default {
	components: {
		'oa-calendar': calendar
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			showCalendar: false,
			scheduleList: [],
			calendarData: {},
		};
	},
	created() {
		this.loadData();

	},
	methods: {
		handleOpenRemind() {
			remindSet.popup({}).then(this.loadData).catch(err => err && console.error(err));
		},
		loadData() {
			this.$request({
				url: "_SALE_MAIN_MATTER_SCHEDULE_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.showCalendar = !!res.data.is_open;
				this.scheduleList = res.data.list.splice(0, 4);
				this.calendarList = res.data.openList;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleToggleOpen(isOpen) {
			this.showCalendar = isOpen;
			this.$request({
				url: "_SALE_MAIN_MATTER_OPEN_POST",
				type: "POST",
				param: {
					is_open: this.showCalendar ? 1 : 0
				},
				loading: false,
			}).then(res => {

			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	},
};
</script>

<style  lang="scss">
.v-sale-main-schedule{
	._schedule{
		height: 220px;
		box-shadow:0px 2px 12px 0px rgba(0, 0, 0, 0.1);
		.__head{
			height: 47px;
			line-height: 47px;
			background: #f8f8f8;
		}
		.__content{
			height: 40px;
			line-height: 40px;
			width: 100%;
			.__point{
				display: inline-block;
				vertical-align: middle;
				width:4px;
				height:4px;
				background:#2397F9;
				border-radius:50%;
			}
			.__apply{
				display: inline-block;
				height: 18px;
				line-height: 18px;
				width:34px;
				font-size:12px;
				font-weight:500;
				color:rgba(231,72,84,1);
				background:rgba(252,233,234,1);
				border-radius:2px;
				text-align: center;
			}
			.——tag{
				vertical-align: text-bottom;
				display: inline-block;
				line-height: 18px;
				text-align: center;
				width:34px;
				height:18px;
				background:#FCE9EA;
				border-radius:2px;
			}
		}
		.__content:nth-child(even){
			background: #f8f8f8
		}
	}
}
</style>
