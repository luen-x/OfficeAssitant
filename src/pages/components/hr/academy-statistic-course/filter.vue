<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search.search" 
				placeholder="请输入课程名称进行搜索" 
				style="width: 300px" 
				clearable
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
			<div v-if="$auth[1081]" class="g-fr">
				<vc-debounce-click
					class="g-red-btn-line"
					@click="handleExport">
					导出
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-select
					v-model="search.project_type" 
					transfer
					clearable
					class="g-m-r-5"
					placeholder="请选择项目类型"
					style="width: 220px" 
					@on-change="handleSearch"
				>
					<i-option v-for="item in projectList" :value="item.id" :key="item.id">{{ item.label }}</i-option>
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
				<i-cascader
					v-model="search.echelon_ids"
					:data="planCaTreeAll"
					clearable
					class="g-m-r-5"
					placeholder="请选择人才梯队"
					style="width: 220px"
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择授课时间段"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'time')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'i-datepicker': DatePicker,
	},
	mixins: [
		services.planCaTreeAll()
	],
	data() {
		const { query = {} } = this.$route;
		const project_list = [];
		const echelon_ids = query.echelon_ids ? query.echelon_ids.split(',').map(it => +it) : [];
		if (query.project_id) {
			project_list.push({ project_id: query.project_id * 1, project_topic: query.project_topic });
		}
		return {
			search: {
				...query,
				search: query.search || '',
				project_type: query.project_type || '',
				project_id: query.project_id * 1,
				project_topic: query.project_topic,
				echelon_id: query.echelon_id ? query.echelon_id.split(',').map((item) => Number(item)) : [],
				echelon_ids
			},
			show: false,
			time: [query.start_time, query.end_time],
			project_list_loading: false,
			project_list,
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
		// 时间改变
		handleDateChange(val, name) {
			this.search[`start_time`] = val[0];
			this.search[`end_time`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/statistic/course', 
				{ 
					...this.$route.query,
					...this.search,
					fixPosition: true,
				}
			));
			this.$store.commit('HR_ACADEMY_STATISTIC_COURSE_LIST_INIT');
		}, 300),
		handleExport: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT._HR_ACADEMY_STATISTIC_COURSE_LIST_EXPORT_GET, {
				...query,
				type: String(query.type || "1"),
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
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
