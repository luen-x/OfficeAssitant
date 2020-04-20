<template>
	<div class="g-m-t-10" @keyup.enter="handleSearch">
		<div>
			<i-input
				v-model="search"
				clearable
				placeholder="请输入题目关键词搜索"
				style="width: 300px"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle"
			>
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="question_type"
					clearable
					class="g-m-r-5"
					style="width: 220px"
					placeholder="请选择题型"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in typeName"
						:key="index"
						:value="item.value">{{ item.name }}</i-option>
				</i-select>
				<i-date-picker
					v-model="start_time"
					:options="{disabledDate:startTimeDisable}"
					class="g-m-r-5"
					type="date"
					placeholder="请选择发起开始时间"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="end_time"
					:options="{disabledDate:endTimeDisable}"
					class="g-m-r-5"
					type="date"
					placeholder="请选择发起结束时间"
					style="width: 220px"
					@on-change="handleEndTime"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/sale";
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { ChooseMaterial } from './popup/choose-material';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
	},
	mixins: [
		services.departMy()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			typeName: [
				{ name: "单选题", value: "1" },
				{ name: "多选题", value: "2" },
				{ name: "判断题", value: "3" },
				{ name: "填空题", value: "4" },
				{ name: "简答题", value: "5" }
			],
			search: String(query.search || ''),
			start_time: String(query.start_time || ''),
			end_time: String(query.end_time || ''),
			question_type: String(query.question_type || ''),
			show: false,
			depart_id: []
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/train/study/audit',
				{
					...this.$route.query,
					search: this.search,
					question_type: this.question_type,
					start_time: this.start_time,
					end_time: this.end_time,
					fixPosition: true,
				}
			));
			// /sale/train/study/question
			this.$store.commit('SALE_TRAIN_STUDY_AUDIT_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleStartTime(t) {
			this.start_time = t;
			this.handleSearch();
		},
		handleEndTime(t) {
			this.end_time = t;
			this.handleSearch();
		},
		startTimeDisable(date) {
			if (!this.end_time) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.end_time).subtract(1, 'year'))
			 && moment(date).isBefore(moment(this.end_time).add(1, 'day')));
		},
		endTimeDisable(date) {
			if (!this.start_time) {
				return false;
			}
			return !(moment(date).isBefore(moment(this.start_time).add(1, 'year'))
			&& moment(date).isAfter(moment(this.start_time).subtract(1, 'day')));
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
