<template>
	<div style="margin-top: -10px">
		<div>
			<i-input
				v-model="param.search" 
				placeholder="请输入报名主题进行搜索" 
				style="width: 320px" 
				clearable
				@on-change="handleChange"
				@on-enter="handleSearch"
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
			<vc-debounce-click
				class="g-red-btn-line g-m-r-5 g-fr"
				@click="handleNewEnroll">
				新建报名
			</vc-debounce-click>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select
					v-model="param.course_id"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请选择关联事项"
					@on-change = "handleSearch"
				>
					<i-option 
						v-for="course in courseData"
						:key="+course.course_id"
						:value="course.course_id">{{ course.course_name }}</i-option>
				</i-select>

				<i-data-picker 
					v-model="param.start_time" 
					type="date"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请选择报名日期"
					format="yyyy-MM-dd"
					@on-change="handleSearch"
				/>

				<!-- <i-data-picker 
					v-model="param.end_time"
					type="date"
					clearable
					style="width: 220px"
					class="g-m-r-5"
					placeholder="请选择报名结束日期"
					format="yyyy-MM-dd"
					@on-change="handleSearch"	
				/> -->
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, formatDate } from '@utils/utils';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { PModalRetatedMatter } from '../academy-train-detail/_common/popup/related-matter';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			param: {
				search: String(query.search || ''),
				course_id: Number(query.course_id) || '',
				start_time: query.start_time,
				// end_time: query.end_time
			},
			courseData: []
		};
	},
	created() {
		this.loadCourse();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/enroll/0/manage', 
				{ 
					...this.$route.query, 
					...this.param,
					start_time: this.param.start_time && formatDate(this.param.start_time),
					// end_time: this.param.end_time && formatDate(this.param.end_time)
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_MANAGE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleNewEnroll() {
			PModalRetatedMatter.popup({ type: 'enroll' }).then(res => {
				this.$router.push(getHashUrl(
					'/hr/academy/train/detail/enroll/1/add', 
					{ 
						relation_type: res.relation_type,
						label: res.label,
						relation_id: res.relation_id,
						project_id: res.project_id,
					}
				));
			}).catch(res => console.error);
		},
		async loadCourse() {
			const { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_PROJECT_COURSE_SEARCH_GET,
				type: 'GET',
				param: {
					project_id: this.$route.query.project_id,
				},
				loading: false
			});
			this.courseData = data;
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
