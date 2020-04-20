<template>
	<div @keyup.enter="handleSearch">
		<div v-if="0" class="g-fr">
			<i-button
				v-if="this.$auth[502]"
				type="primary"
				class="g-m-l-5"
				@click="handleQuestion">
				我要出题
			</i-button>
			<button
				v-if="this.$auth[503]"
				style="line-height: 3px !important;"
				class="g-m-l-5 g-red-btn-line"
				@click="handleExamine"
			>
				查看考试凭证
			</button>
			<button
				v-if="this.$auth[504]"
				style="line-height: 3px !important;"
				class="g-m-l-5 g-red-btn-line"
				@click="handleAudit"
			>
				查看出题审核
			</button>
		</div>
		<oa-personal class="g-m-b-20"/>
		<i-button
			v-if="0&&this.$auth[508]"
			type="primary"
			class="g-m-l-5 g-fr"
			@click="handleChooseMaterial"
		>
			去素材库选课
		</i-button>
		<i-input
			v-model="search"
			clearable
			placeholder="请输入课程名称搜索"
			style="width: 300px"
			@on-change="handleClear"
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
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-date-picker
					v-model="start_time"
					:options="{disabledDate:startTimeDisable}"
					class="g-m-r-5"
					clearable
					type="date"
					placeholder="请选择开始授课时间"
					style="width: 220px"
					@on-change="handleSelectTime"
				/>
				<i-date-picker
					v-model="end_time"
					:options="{disabledDate:endTimeDisable}"
					class="g-m-r-5"
					clearable
					type="date"
					placeholder="请选择结束授课时间"
					style="width: 220px"
					@on-change="handleSelectTime1"
				/>
				<i-select
					v-model="is_sign"
					class="g-m-r-5 "
					clearable
					style="width: 220px"
					placeholder="请选择参与状态"
					@on-change="handleSearch">
					<i-option v-for="(item,index) in statusList" :value="index+''" :key="index+1" clearable>{{ item }}</i-option>
				</i-select>
				<i-select
					v-model="exam_status"
					class="g-m-r-5"
					clearable
					style="width: 220px"
					placeholder="请选择作业状态"
					@on-change="handleSearch">
					<i-option v-for="(item,index) in examList" :value="index-1+''" :key="index+1" clearable>{{ item }}</i-option>
				</i-select>
				<i-select
					v-model="user_source"
					class="g-m-r-5"
					clearable
					style="width: 220px"
					placeholder="请选择课程来源"
					@on-change="handleSearch">
					<i-option
						v-for="(item,index) in sourceList"
						:value="index+1+''"
						:key="index+1"
						clearable>{{ item }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import personal from './personal';
import { ChooseMaterial } from "../../hr/_common/academy-course/modals/choose-material";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'vc-expand': Expand,
		'oa-personal': personal,
	},
	data() {
		const { query = {} } = this.$route;
		const courseList = ['必修课', '选修课', '内训课'];
		const statusList = ['未参加', '已参加'];
		const examList = ['未安排', '未上传', '已上传', '未开始'];
		const projectList = ['岗前培训', '人才计划', '其他 '];
		const sourceList = ['按组织选', '按条件选', '按组织和条件', '线上报名', '手机签到'];

		return {
			courseList,
			statusList,
			examList,
			projectList,
			sourceList,
			search: String(query.search || ''),
			start_time: String(query.start_time || ''),
			end_time: String(query.end_time || ''),
			is_sign: String(query.is_sign || ''),
			exam_status: String(query.exam_status || ''),
			user_source: String(query.user_source || ''),
			show: false
		};
	},
	methods: {
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/train/study',
				{
					...this.$route.query,
					search: this.search,
					is_sign: this.is_sign,
					exam_status: this.exam_status,
					start_time: this.start_time,
					end_time: this.end_time,
					user_source: this.user_source,
					type: 1
				}
			));
			this.$store.commit('SALE_TRAIN_STUDY_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleSelectTime(v) {
			this.start_time = v;
			this.handleSearch();
		},
		handleSelectTime1(v) {
			this.end_time = v;
			this.handleSearch();
		},
		handleExamine() {
			this.$router.push({ path: '/sale/train/study/examine' });
		},
		handleAudit() {
			this.$router.push({ path: '/sale/train/study/audit', });
		},
		handleQuestion() {
			this.$router.push({ path: '/sale/train/study/question',
				query: {
					author: 'sale',
					pathName: '我的学习'
				} });
		},
		handleChooseMaterial() {
			ChooseMaterial.popup({
				author: 'sale'
			}).then((res) => {
				// _SALE_LIBRARY_MATERIAL_LIST_GET销售素材库
				this.request({
					url: '_SALE_TRAIN_STUDY_COURSE_MATERIAL_ELECTIVE_POST',
					type: 'post',
					param: {
						...res,
					},
				}).then((data) => {
					this.handleSearch();
					this.$Message.success(data.msg);
				}).catch((error) => {
					console.error(error);
				});

			});
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
