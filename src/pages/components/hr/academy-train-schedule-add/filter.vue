<template>
	<div class="js-filter">
		<div class="g-m-t-20">
			<i-input
				v-model="search.staff_search" 
				placeholder="请输入姓名、手机号码搜索" 
				style="width: 300px;" 
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
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-select
					v-model="search.course_id"
					:remote-method="(search)=>loadCourseList(search)"
					:loading="course_list_loading"
					filterable
					clearable
					remote
					transfer
					placeholder="请输入报名课程"
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
				<i-date-picker
					v-model="search.start_time"
					type="date"
					clearable
					transfer
					placeholder="请选择报名时间"
					style="width: 220px;"
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-select
					v-model="search.apply_type" 
					clearable
					transfer
					class="g-m-r-5"
					placeholder="请选择报名来源"
					style="width: 220px;" 
					@on-change="handleSearch"
				>
					<i-option v-for="item in origin_data" :value="item.id" :key="item.id">{{ item.label }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import { Input, Button, Select, Option, Divider, Tooltip, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl } from '@utils/utils';
import item from './item';
import { TableTitle } from '../../_common/table-title/table-title';

export default {
	name: 'oa-academy-train-schedule-add-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand,
		'i-divider': Divider,
		'i-tooltip': Tooltip,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
	},
	mixins: [item, services.departAll()],
	data() {
		const { query = {} } = this.$route;
		const course_list = [];
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		if (query.course_id) {
			course_list.push({ course_id: query.course_id * 1, course_name: query.course_name });
		}
		return {
			course: query.course_id || '',
			show: false,
			classesList: [],
			origin_data: [
				{
					id: '1',
					label: '线上报名'
				},
				{
					id: '2',
					label: '链接报名'
				}
			],
			entry_date: [],
			course_list_loading: false,
			course_list,
			search: {
				...query,
				course_id: query.course_id * 1,
				course_topic: query.course_topic,
				staff_search: query.staff_search || '',
				depart_id: depart_ids[depart_ids.length - 1] || '',
				apply_type: '',
				start_time: query.start_time ? query.start_time : '',
				depart_ids
			},
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
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
				'/hr/academy/train/schedule/add', 
				{ 
					...this.$route.query,
					...this.formatQuery(this.search),
					fixPosition: true,
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
		}, 300),
		formatQuery() {
			const _query = {};
			Object.keys(this.search).forEach(key => {
				if (this.search[key] instanceof Date) {
					_query[key] = moment(this.search[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.search[key];
				}
			});
			return _query;
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
		handleExport: lodash.debounce(function () {
			// const { query = {} } = this.$route;
			// window.open(getHashUrl(API_ROOT.FINANCE_BILL_OUT_LIST_GET, {
			// 	...search,
			// 	export: 1,
			// 	'-token': getItem(`staff_${this.$global.version}`).token
			// }));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
