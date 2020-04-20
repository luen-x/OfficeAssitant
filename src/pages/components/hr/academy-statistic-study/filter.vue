<template>
	<div class="v-academy-statistic-study js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.search"
					clearable
					placeholder="请输入姓名或手机号码搜索"
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
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-cascader
					:data="departAll"
					v-model="search.depart_ids"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleSearch"/>
				<i-cascader
					v-model="search.echelon_ids"
					:data="planCaTreeAll"
					clearable
					class="g-m-r-5"
					placeholder="请选择人才梯队"
					style="width: 220px"
					@on-change="handleSearch"
				/>
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
					v-model="search.project_id"
					:remote-method="(search)=>loadProjectList(search)"
					:loading="project_list_loading"
					filterable
					clearable
					remote
					transfer
					placeholder="请输入项目主题"
					class="g-m-r-5"
					label-in-value
					style="width: 220px" 
					@on-change="handleSearchProject"
				>
					<i-option
						v-for="(item, index) in project_list"
						:key="index"
						:value="item.project_id"
					>{{ item.project_topic }}</i-option>
				</i-select>
				<!-- <i-select
					v-model="search.position_id"
					placeholder="请选择应聘职位"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in allPosition"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select> -->
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import item from './item';

export default {
	name: 'v-academy-statistic-study',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [
		item,
		services.departAll(),
		services.planCaTreeAll()
	],
	data() {
		const { query = {} } = this.$route;
		const course_list = [];
		const project_list = [];
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		const echelon_ids = query.echelon_ids ? query.echelon_ids.split(',').map(it => +it) : [];
		if (query.course_id) {
			course_list.push({ course_id: query.course_id * 1, course_name: query.course_name });
		}
		if (query.project_id) {
			project_list.push({ project_id: query.project_id * 1, project_topic: query.project_topic });
		}
		return {
			project_list_loading: false,
			course_list_loading: false,
			course_list,
			project_list,
			search: {
				depart_id: query.depart_ids ? query.depart_ids.split(',').map((v) => Number(v)) : [],
				echelon_id: query.echelon_ids ? query.echelon_ids.split(',').map((v) => Number(v)) : [],
				...query,
				search: query.search || '',
				project_id: query.project_id * 1,
				course_id: query.course_id * 1,
				project_topic: query.project_topic,
				course_name: query.course_name,
				depart_ids,
				echelon_ids
			},
			show: false,
			projectList: [
				{
					id: '1',
					label: '岗前培训'
				},
				{
					id: '2',
					label: '人才计划'
				},
				{
					id: '3',
					label: '其他'
				}
			],
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		},
		'search.echelon_ids': function (val) {
			this.search.echelon_id = val[val.length - 1] || '';
		},
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/statistic/study', 
				{ 
					...this.$route.query,
					...this.search
				}
			));
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_LIST_INIT');
		}, 300),
		
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
		/**
		 * 根据项目名称获取项目列表
		 */
		loadProjectList(search) {
			this.project_list_loading = true;

			this.$request({
				url: '_SALE_TRAIN_PROJECT_SEARCH_GET',
				type: 'GET',
				loading: false,
				param: {
					search
				},
				autoTip: false
			}).then(res => {
				this.project_list_loading = false;
				if (Array.isArray(res.data)) {
					this.project_list = res.data;
				}
			}).catch(error => {
				this.project_list_loading = false;
				this.$Message.error(error.msg); 
			});
		},
		handleSearchProject(project) {
			if (!project) {
				this.search.project_topic = undefined;
			} else {
				this.search.project_topic = project.label;
			}
			this.handleSearch();
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
