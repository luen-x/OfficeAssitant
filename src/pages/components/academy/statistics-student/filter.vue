<template>
	<div class="v-academy-statistics-student js-filter">
		<div>
			<i-input
				v-model="search.staff"
				:maxlength="50"
				clearable
				placeholder="请输入姓名或手机号搜索"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<vc-debounce-click
				class="g-fr g-red-btn-line"
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
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
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.course_name"
					clearable
					placeholder="请输入课程名进行搜索"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-cascader
					v-model="depart_id"
					:data="departAll"
					:change-on-select="true"
					clearable
					transfer
					filterable
					trigger="click"
					placeholder="请选择部门"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
				<i-input
					v-model="search.pass_course_name"
					clearable
					placeholder="请输入通关课程名进行搜索"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input-number
					v-model="search.pass_count_min"
					:min="1"
					:max="99"
					placeholder="最小通关数"
					style="width: 100px"
					class="g-m-r-5"
					@keyup.native.enter="handleSearch"
					@on-change="handleNumChange"

				/>
				~
				<i-input-number
					v-model="search.pass_count_max"
					:min="1"
					:max="99"
					placeholder="最大通关数"
					style="width: 100px"
					class="g-m-r-5"
					@keyup.native.enter="handleSearch"
					@on-change="handleNumChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, InputNumber } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/hr";
import API from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		'i-input-number': InputNumber,
		'vc-expand': Expand
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				staff: String(query.staff || ''), // 员工姓名
				course_name: String(query.course_name || ''),
				pass_course_name: String(query.pass_course_name || ''),
				pass_count_max: Number(query.pass_count_max) || null,
				pass_count_min: Number(query.pass_count_min) || null,
			},
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [],
			show: false
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadDepartAll();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/statistics/student',
				{
					...this.$route.query,
					...this.search,
					depart_id: this.depart_id.length
						? this.depart_id : null
				}
			));
			this.$store.commit('ACADEMY_STATISTICS_STUDENT_LIST_INIT');
		},
		handleDepartChange(selection) {
			this.depart_id = selection;
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleNumChange(num) {
			if (num === null) {
				this.handleSearch();
			}

		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			const url = getHashUrl(API.ACADEMY_STATISTICS_COURSE_TYPE_LIST_EXPORT, {
				is_export: 1,
				...this.$route.query,
				...this.search,
				depart_id: this.depart_id.length
					? this.depart_id : null,
				"-token": this.$global.token
			});
			window.open(url);
		},
	}
};
</script>

<style lang="scss">
.v-academy-statistics-student{
	.ivu-input-number-handler-wrap{
		display: none;
	}
} 
</style>