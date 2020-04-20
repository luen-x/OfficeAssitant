<template>
	<div>
		<div>
			<i-input
				v-model="search.sign_topic" 
				class="g-m-r-5"
				placeholder="请输入签到名称进行搜索" 
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
					新建签到
				</vc-debounce-click>
			</div>
			<vc-expand 
				ref="expand"
				v-model="show"
			>
				<div
					class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
					style="padding-top: 3px;padding-bottom: 7px;">
					<i-date-picker
						v-model="inTime"
						type="datetimerange"
						format="yyyy-MM-dd HH:mm"
						split-panels
						separator=" 至 "
						clearable
						transfer
						placeholder="开场签到"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'in')"
					/>
					<i-date-picker
						v-model="backTime"
						type="datetimerange"
						format="yyyy-MM-dd HH:mm"
						split-panels
						separator=" 至 "
						clearable
						transfer
						placeholder="离场签退"
						style="width: 220px;"
						class="g-m-r-5"
						@on-change="handleDateChange($event, 'back')"
					/>
					<i-select 
						v-model="search.course_id"
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
						v-model="search.status"
						class="g-m-r-5"
						placeholder="请选择签到状态"
						clearable
						transfer
						style="width: 220px;"
						@on-change="handleSearch"
					>
						<i-option :value="1">进行中</i-option>
						<i-option :value="2">未开始</i-option>
						<i-option :value="3">已截止</i-option>
					</i-select>
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
				sign_topic: query.sign_topic || '',
				course_id: Number(query.course_id) || '',
				status: Number(query.status) || '',
			},
			inTime: [query.in_start_time, query.in_end_time],
			backTime: [query.back_start_time, query.back_end_time],
			show: false,
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
			this.search[`${name}_start_time`] = val[0];
			this.search[`${name}_end_time`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/sign/0/manage', 
				{ 
					...this.search,
					project_id: this.$route.query.project_id
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd() {
			PModalRetatedMatter.popup({ type: 'sign' }).then(res => {

				this.$router.push(getHashUrl(
					'/hr/academy/train/detail/sign/1/add', 
					{ 
						relation_type: res.relation_type,
						label: res.label,
						relation_id: res.relation_id,
						project_id: res.project_id,
					}
				));
			}).catch(res => console.error);
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
