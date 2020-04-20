<template>
	<div>
		<div>
			<i-input
				v-model="search.name" 
				:placeholder="namePlaceholder[Number(this.$route.query.type || 1) - 1]" 
				style="width: 300px" 
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
			<span
				v-if="($route.query.type == '1' || !$route.query.type) && $auth[1315]"
				class="g-red-btn-line g-fr"
				@click="handleAddCourse(1)"
			>
				新增套系
			</span>
			<span
				v-if="$route.query.type == '2' && $auth[1318]"
				class="g-red-btn-line g-fr"
				@click="handleAddCourse(2)"
			>
				新增课程
			</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-datepicker
					v-model="create_start_time"
					type="date"
					clearable
					transfer
					placeholder="选择创建时间（开始）"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'create_start_')"
				/>
				<i-datepicker
					v-model="create_end_time"
					type="date"
					clearable
					transfer
					placeholder="选择创建时间（结束）"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'create_end_')"
				/>
				<i-datepicker
					v-model="update_start_time"
					type="date"
					clearable
					transfer
					placeholder="选择更新时间（开始）"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'update_start_')"
				/>
				<i-datepicker
					v-model="update_end_time"
					type="date"
					clearable
					transfer
					placeholder="选择更新时间（结束）"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'update_end_')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { CourseModal } from './popup/course-modal';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			namePlaceholder: ['请输入套系名称', '请输入课程类型', '请输入活动类型'],
			show: false,
			search: {
				name: '',
			},
			create_start_time: String(query.create_start_time || ''),
			create_end_time: String(query.create_end_time || ''),
			update_start_time: String(query.update_start_time || ''),
			update_end_time: String(query.update_end_time || ''),
		};
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 新增套系
		handleAddCourse(item) {
			CourseModal.popup({
				type: item,
			}).then(res => {
				this.$store.commit('COLLAGE_SETTING_COURSE_LIST_INIT');
			});
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search[`${name}time`] = val;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/collage/setting/course', 
				{ 
					...query,
					...this.search,
				}
			));
			this.$store.commit('COLLAGE_SETTING_COURSE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
