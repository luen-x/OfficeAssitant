<template>
	<div class="v-sale-train-employee-filter js-filter">
		<div>
			<i-input
				v-model="keywords.staff"
				placeholder="请输入姓名、手机号码搜索"
				style="width:300px;height:32px;"
				clearable
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
				<i-cascader
					v-if="is_admin && departMy.length > 0"
					v-model="keywords.depart_id"
					:data="departMy"
					clearable
					change-on-select
					placeholder="请选择部门"
					class="g-m-r-5"
					style="width:220px"
					@on-change="handleSearch"
				/>
				<i-input
					v-model="keywords.course_name"
					placeholder="请输入课程名称进行搜索"
					class="g-m-r-5"
					style="width:220px"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { services as saleService } from '@stores/services/sale';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-train-employee-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'vc-expand': Expand,
	},
	mixins: [saleService.departMy()],
	data() {
		const { query = {} } = this.$route;
		const course_list = [];
		const project_list = [];
		if (query.course_id) {
			course_list.push({ course_id: +query.course_id, course_name: query.course_name });
		}
		if (query.project_id) {
			project_list.push({ project_id: +query.project_id, project_topic: query.project_topic });
		}
		return {
			show: false,
			course_list_loading: false,
			project_list_loading: false,
			course_list, // 课程列表
			project_list,
			keywords: {
				course_name: String(query.course_name || ''),
				staff: String(query.staff || ''),
				depart_id: (query.depart_id ? query.depart_id.split(',').map(item => +item) : [])
			}
		};
	},
	computed: {
		is_admin() {
			const staff_role = this.$global.staff;
			return staff_role['charge'];
		}
	},
	watch: {
		'keywords.depart_ids': function (val) {
			this.keywords.depart_id = val[val.length - 1];
		},
		'keywords.echelon_ids': function (val) {
			this.keywords.echelon_id = val[val.length - 1];
		},

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
				'/sale/train/employee',
				{
					...this.keywords,
					depart_id: this.keywords.depart_id.length ? this.keywords.depart_id : undefined
				}
			));
			this.$store.commit('SALE_TRAIN_EMPLOYEE_LIST_INIT');
		}, 300),
		/**
		 * 根据课程名称获取课程列表
		 */

		/**
		 * 按课程名称搜索
		 */

		/**
		 * 根据项目名称获取项目列表
		 */

		/**
		 * 按项目名称搜索
		 */
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
	}
};

</script>

<style lang="scss">

</style>
