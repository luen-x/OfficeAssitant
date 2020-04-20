<template>
	<div>
		<oa-detail-header :data="memberData"/>
		<div>
			<i-input
				v-model="search.search"
				clearable
				placeholder="请输入课题名称搜索"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-l-10"
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
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select
					v-model="search.course_id"
					:remote-method="(search)=>loadCourseList(search)"
					:loading="course_list_loading"
					filterable
					clearable
					remote
					transfer
					placeholder="请输入课程名称"
					class="g-m-r-5"
					label-in-value
					style="width: 220px" 
					@on-change="handleSearchCourse"
				>
					<i-option
						v-for="(item, index) in course_list"
						:key="index"
						:value="item.course_id"
					>{{ item.course_name }}</i-option>
				</i-select>
				<i-select
					v-model="search.course_type" 
					transfer
					clearable
					class="g-m-r-5"
					placeholder="请选择课程类型"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option value="1">必修</i-option>
					<i-option value="2">选修</i-option>
					<i-option value="3">内训</i-option>
				</i-select>
				<i-select
					v-model="search.status" 
					transfer
					clearable
					class="g-m-r-5"
					placeholder="请选择参与状态"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option value="0">未参加</i-option>
					<i-option value="1">已参加</i-option>
				</i-select>
				<i-select
					v-model="search.exam_status" 
					transfer
					clearable
					class="g-m-r-5"
					placeholder="请选择考试情况"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option value="0">未安排</i-option>
					<i-option value="1">已通过</i-option>
					<i-option value="2">未通过</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import DetailHeader from '../academy-statistic-study/popup/detail-header';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'oa-detail-header': DetailHeader,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		const course_list = [];
		if (query.course_id) {
			course_list.push({ course_id: query.course_id * 1, course_name: query.course_name });
		}
		return {
			course_list_loading: false,
			course_list,
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false,
			memberData: {},
			search: {
				...query,
				course_id: query.course_id * 1,
				course_name: query.course_name,
				search: query.search || '',
				course_type: query.course_type || '',
				status: query.status || '', // 参与状态 
				exam_status: query.exam_status || '', // 考试情况 
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/statistic/study/detail', 
				{ 
					...this.$route.query,
					...this.search
				}
			));
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_DETAIL_LIST_INIT');
		},
		loadData() {
			return this.$request({
				url: API_ROOT._HR_ACADEMY_STATISTIC_STUDY_DETAIL_GET,
				type: 'GET',
				param: {
					staff_id: this.$route.query.staff_id,
					applicant_id: this.$route.query.applicant_id,
					echelon_id: this.$route.query.echelon_id
				},
			}).then((res) => {
				this.memberData = res.data;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		/**
		 * 根据课程名称获取课程列表
		 */
		loadCourseList(course_name) {
			this.course_list_loading = true;

			this.$request({
				url: '_HR_ACADEMY_TRAIN_COURSE_ID_NAME_POST',
				type: 'POST',
				loading: false,
				param: {
					search: course_name,
					project_id: 0
				},
				autoTip: false
			}).then(res => {
				this.course_list_loading = false;
				if (Array.isArray(res.data)) {
					this.course_list = res.data;
				}
			}).catch(error => {
				this.course_list_loading = false;
				this.$Message.error(error.msg); 
			});
		},
		handleSearchCourse(course) {
			if (!course) {
				this.search.course_name = undefined;
			} else {
				this.search.course_name = course.label;
			}
			this.handleSearch();
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
