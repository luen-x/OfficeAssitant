<template>
	<div>
		<div>
			<i-input
				v-model="search.search" 
				class="g-m-r-5"
				placeholder="请输入试卷名称进行搜索" 
				style="width: 320px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
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
			<div class="g-fr">
				<vc-debounce-click
					class="g-red-btn-line g-m-r-5"
					@click="handleAdd">
					新建试卷
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
						v-model="search.exam_again"
						class="g-m-r-5"
						placeholder="请选择是否可以补考"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleSearch"
					>
						
						<i-option
							v-for="(item, index) in methodList"
							:key="index"
							:value="item.id"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select 
						v-model="search.relation_id"
						class="g-m-r-5"
						placeholder="关联事项"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleSearch"
					>
						<i-option :value="0">整个项目</i-option>
						<i-option
							v-for="(course, index) in courseData"
							:key="index"
							:value="course.course_id"
						>
							{{ course.course_name }}
						</i-option>
					</i-select>
					<i-select 
						v-model="search.paper_type"
						placeholder="选择试卷类型"
						style="width: 220px" 
						class="g-m-r-5"
						clearable
						@on-change="handleSearch"
					>
						<i-option :value="1">题目固定</i-option>
						<i-option :value="2">随机试卷</i-option>
					</i-select>
					<i-date-picker
						v-model="time"
						type="daterange"
						split-panels
						separator=" 至 "
						clearable
						transfer
						placeholder="请选择开始结束时间"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'time')"
					/>
				</div>
			</vc-expand>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, DatePicker, Table, Checkbox } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import { selectCourse } from '@stores/services/hr';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-table': Table,
		'i-checkbox': Checkbox,
	},
	mixins: [selectCourse],
	data() {
		const { query = {} } = this.$route;
		return {
			project_id: this.$route.query.project_id,
			search: {
				search: query.search || '',
				exam_again: Number(query.exam_again) || '',
				relation_id: Number(query.relation_id) || '',
				paper_type: Number(query.paper_type) || '',
			},
			time: [query.start_time, query.end_time],
			show: false,
			methodList: [
				{
					id: 1,
					label: '可以补考'
				},
				{
					id: 0,
					label: '不可以补考'
				}
			]
		};
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
			this.search[`start_${name}`] = val[0];
			this.search[`end_${name}`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/paper/0/pass', 
				{ 
					...this.search,
					project_id: this.$route.query.project_id
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd() {
			this.$router.push(getHashUrl(
				'/hr/academy/train/detail/paper/1/add', 
				{ 
					...this.$route.query, 
				}
			));
		}
	}
};

</script>

<style lang="scss" scoped>
</style>
