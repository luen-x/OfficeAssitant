<template>
	<div>
		<div @keyup.enter="handleSearch">
			<i-input
				v-model="material_name"
				clearable
				placeholder="请输入素材名称"
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
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10">
				<i-select
					v-model="material_type"
					class="g-m-r-5"
					clearable
					style="width: 220px"
					placeholder="请选择素材类型"
					@on-change="handleSearch">
					<i-option v-for="item in materialType" :key="item.value" :value="item.value+''">{{ item.name }}</i-option>
				</i-select>
				<i-select
					v-model="material_use"
					class="g-m-r-5"
					clearable
					style="width: 220px"
					placeholder="请选择素材用途"
					@on-change="handleSearch">
					<i-option v-for="item in materialUse" :key="item.value" :value="item.value+''">{{ item.name }}</i-option>
				</i-select>
				<i-date-picker
					v-model="create_time_start"
					:options="{disabledDate:startTimeDisable}"
					class="g-m-r-5"
					type="date"
					placeholder="请选择上传时间"
					style="width: 220px"
					@on-change="handleStartTime"
				/>
				<i-date-picker
					v-model="create_time_end"
					:options="{disabledDate:endTimeDisable}"
					type="date"
					placeholder="请选择上传时间（结束）"
					style="width: 220px"
					@on-change="handleEndTime"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Check } from './popup/check';
import util from '../_common/util';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
	},
	mixins: [
		 util
	],
	data() {
		const { query = {} } = this.$route;
		return {
			material_name: String(query.material_name || ''),
			material_type: String(query.material_type || ''),
			material_use: String(query.material_use || ''),
			create_time_start: String(query.create_time_start || ''),
			create_time_end: String(query.create_time_end || ''),
			show: false
		};
	},

	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/config/material/check',
				{
					...this.$route.query,
					material_name: this.material_name,
					material_type: this.material_type,
					material_use: this.material_use,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end,
					fixPosition: true,
				}
			));
			this.$store.commit('CONTENT_CONFIG_MATERIAL_CHECK_LIST_INIT');
		},
		handleStartTime(t) {
			this.create_time_start = t;
			this.handleSearch();
		},
		handleEndTime(t) {
			this.create_time_end = t;
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		startTimeDisable(date) {
			if (!this.create_time_end) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.create_time_end).subtract(1, 'year'))
			&& moment(date).isBefore(moment(this.create_time_end).add(1, 'day')));
		},
		endTimeDisable(date) {
			if (!this.create_time_start) {
				return false;
			}
			return !(moment(date).isBefore(moment(this.create_time_start).add(1, 'year'))
			&& moment(date).isAfter(moment(this.create_time_start).subtract(1, 'day')));
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
