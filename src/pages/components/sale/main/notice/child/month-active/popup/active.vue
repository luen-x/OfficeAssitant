<template>
	<div
		class="page-active"
		style="max-height: 764px;
			   overflow-y: auto;
			   overflow-x: hidden;">
		<div
			v-for="(tep,i) in monthList"
			:key="i"
			style="overflow:hidden; margin-bottom: 10px ;width:904px"
		>
			<div class="g-m-b-20 _title g-c-black3" >
				<span class="_border-left"> {{ i==0?'本月':'下月' }} ({{ tep.date }}) </span>
				<br>
				<div v-for="(item,index) in tep.list" :key="index+1" class="_body" >
					<img :src="item.cover_image+'!4-4'?item.cover_image+'!4-4':item.cover_image" alt>
					<div
						:class="item.status==5||item.status==3||item.status==4 ? '_cover-show' : '_cover-hide'"
						class="g-flex-cc  g-flex-ac">
						<div v-if="item.status==2" @click="handleSignUp(item.activity_id)">
							给客户报名
							<i class="iconfont icon-more"/>
							<div>{{ item.start_time }}-{{ item.end_time }}</div>
						</div>
						<div v-if="item.status==1">
							活动待报名
							<i class="iconfont icon-more"/>
							<div>{{ item.start_time }}-{{ item.end_time }}</div>
						</div>
						<div v-if="item.status==5||item.status==3||item.status==4">
							报名已结束
							<i class="iconfont icon-more"/>
						</div>
					</div>
					<div class="__name g-fs-14" style="color: #333">{{ item.activity_name }}</div>
					<div class="__month g-c-black4 g-fs-124">
						{{ item.start_date }}-{{ item.end_date }}
					</div>
					<div class=" g-c-red-dark g-fs-14">倒计时：{{ item.future_day }}天</div>
				</div>
			</div>

			<i class="page-clear-both"/>
		</div>
		<div class="_undeline"/>
		<div class="_next" style="overflow:hidden">
			<div class="page-clear-both _title g-c-black3">
				<span class="_border-left">历月</span>
				<span>
					<i-date-picker
						:open="open"
						:value="value3"
						:options="{disabledDate:dateTimeDisable}"
						transfer
						type="month"
						@on-change="handleChange"
						@on-clear="handleClear"
						@on-open-change="handleOpenChange"
						@on-ok="handleOk"
					>
						<a @click="handleOpen">
							<template v-if="value3 === ''">选择月份</template>
							<template v-else>{{ value3 }}</template>
						</a>
					</i-date-picker>
				</span>
			</div>
			<div v-for="(list,index) in oldList" :key="index+587" style="" >
				<div class="_years g-m-b-10">{{ list.date }}</div>
				<div class="g-flex g-m-l-10" style="flex-flow: wrap; width:890px">
					<div v-for="(item,i) in list.list" :key="i" class="_body" >
						<img :src="item.cover_image+'!4-4'?item.cover_image+'!4-4':item.cover_image" alt>
						<div
							:class="item.status==5||item.status==3||item.status==4 ? '_cover-show' : '_cover-hide'"
							class="g-flex-cc  g-flex-ac ">
							<div v-if="item.status==5||item.status==3||item.status==4">
								报名已结束
								<i class="iconfont icon-more"/>
							</div>
							<div v-if="item.status==2" @click="handleSignUp(item.activity_id)">
								给客户报名
								<i class="iconfont icon-more"/>
								<div>{{ item.start_time }}-{{ item.end_time }}</div>
							</div>
						</div>
						<div>
							<i-poptip
								:content="item.activity_name"
								trigger="hover"
								placement="bottom-start">
								<div class="__name g-c-black2">
									{{ item.activity_name }}
								</div>
							</i-poptip>
						</div>
						<div
							class="__month g-c-black4"
						>{{ item.start_date }}-{{ item.end_date }}</div>
					</div>
				</div>
			</div>
			<div v-if="!oldList.length" style="height:200px;" class="g-flex-cc g-flex-ac g-fd-c">
				<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
				暂无历史数据哦~
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { DatePicker, Poptip } from 'iview';
import { OSS_FLOW, OSS_SEARCH_EMPTY } from "@constants/constants";

import API from "@stores/apis/root";
import moment from 'moment';
import { PSignUp } from "./sign-up";

export default {
	components: {
		"i-date-picker": DatePicker,
		"i-poptip": Poptip,

	},
	data() {
		return {
			list: [],
			open: false,	// 日期显示
			value3: '',	// 日期
			monthList: [], // 近月活动
			oldList: [], // 历史活动
			OSS_FLOW,
			OSS_SEARCH_EMPTY

		};
	},
	mounted() {
		this.GetMonthActive();
		this.GetOldActive();
		// let i = moment().month(moment().month() - 1).format('YYYY-MM');
		// this.value3 = i;
	},
	methods: {
		// 选择月份
		dateTimeDisable(date) {
			return moment(date).isAfter(moment().subtract(1, 'month'));
		},
		handleOpenChange(v) {
			this.open = v;
		},
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(date) {
			this.value3 = date;
			this.GetOldActive();
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			this.open = false;
		},
		handleSignUp(i) {
			PSignUp.popup({
				data: {
					activeId: i
				},
			});
		},
		GetMonthActive() {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_MONTH_LIST_GET,
				type: "GET",
				param: {
				}
			}).then(res => {
				this.monthList = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		GetOldActive() {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_OLD_LIST_GET,
				type: "GET",
				param: {
					date: this.value3
				}
			}).then(res => {
				this.oldList = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
	}
};
</script>

<style scoped lang="scss">
.page-active {
	padding: 0 20px;
	.page-clear-both {
		clear: both;
	}
	._title {
		font-size: 14px;
		padding-left: 15px;
		position: relative;
	}
	._undeline {
		width: 200%;
		height: 1px;
		margin-left: -100px;
		margin-bottom: 30px;
		background-color: #d4d7db;
	}
	._border-left {
		display: inline-block;
		margin-bottom: 10px;
	}
	._border-left::before {
		content: '';
		width: 2px;
		height: 14px;
		top: 4px;
		position: absolute;
		left: 0px;
		background-color: #e74854;
	}
	._next {
		padding-bottom: 28px;
		border-bottom: 1px solid #ebeef1;
	}
	._years {
		padding-left: 10px;
		font-size: 14px;
	}
	._body {
		float: left;
		position: relative;
		padding-bottom: 20px;
		img {
			min-width: 128px;
			min-height: 128px;
			border: 1px solid #d4d7db;
			width: 128px;
			height: 128px;
			margin-right: 20px;
		}
		.__name {
			cursor: pointer;
			width: 130px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			font-size: 14px;
		}
		.__month {
			font-size: 12px;
			padding: 2px 0;
		}
	}
	._cover {
		background: #000;
		width: 128px;
		height: 128px;
		text-align: center;
		position: absolute;
		top: 0;
		z-index: 2;
	}
	._cover-show {
		@extend ._cover;
		opacity: 0.7;
		div {
			opacity: 1;
			color: #fff;
		}
	}
	._cover-hide {
		@extend ._cover;
		opacity: 0;
		cursor: pointer;
		&:hover {
			opacity: 0.7;
		}
		div {
			opacity: 1;
			color: #fff;
		}
	}
}
</style>
