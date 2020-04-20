<template>
	<div class="v-sale-train-employee-course-filter js-filter">
		<div>
			<i-input
				v-model="keywords.search"
				clearable
				placeholder="请输入课题名称搜索"
				style="width:300px;height:32px;"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
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
				<i-input
					v-model.trim="keywords.course_name"
					clearable
					placeholder=" 请输入课程名称搜索"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					v-model="keywords.course_type"
					clearable
					transfer
					placeholder="请选择课程类型"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="1">必修课</i-option>
					<i-option value="2">选修课</i-option>
					<i-option value="3">内训课</i-option>
				</i-select>
				<i-select
					v-model="keywords.status"
					clearable
					transfer
					placeholder="请选择参与状态"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="0">未参加</i-option>
					<i-option value="1">已参加</i-option>
				</i-select>
				<i-select
					v-model="keywords.exam_status"
					clearable
					transfer
					placeholder="请选择考试情况"
					class="g-m-r-5"
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
import { debounce } from 'lodash';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-train-employee-course-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				search: '', // 课题名称
				course_name: '', // 课程名称
				course_type: '', // 课程类型
				status: '', // 参与状态
				exam_status: '', // 考试情况
				...query
			}
		};
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/train/employee/course',
				this.keywords
			));
			this.$store.commit('SALE_TRAIN_EMPLOYEE_COURSE_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss">
.v-sale-train-employee-course-filter {
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
}
</style>
