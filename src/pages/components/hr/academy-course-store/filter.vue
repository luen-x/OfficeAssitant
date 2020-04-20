<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			placeholder="请输入课程名称搜索"
			style="width: 300px"
			clearable
			@on-change="handleClear"
			@on-enter="handleSearch"
		/>
		<i-button
			slot="prefix"
			type="primary"
			class="g-red-btn g-m-l-10"
			@click="handleSearch"
		>搜索</i-button>
		<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer">更多搜索条件</span>
		<span slot="extra" class="g-fr" >
			<vc-debounce-click
				v-if="$auth[1042]" 
				class="g-red-btn-line g-dp-ib"
				@click="handleAddClass"
			>
				新建课程
			</vc-debounce-click>
			<vc-debounce-click
				v-if="$auth[1041]" 
				class=" g-red-btn-line g-dp-ib g-m-l-5"
				@click="handleExport">
				导出
			</vc-debounce-click>
		</span>
		<div 
			class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
			style="padding-top: 3px;padding-bottom: 7px;"
		>
			<i-input
				v-model="query.course_code"
				placeholder="请输入课程编码"
				style="width: 220px"
				class="g-m-r-5"
				clearable
				@on-change="handleClear"
				@on-enter="handleSearch"

			/>
			<i-cascader
				v-model="query.subject_ids"
				:data="subjectTree"
				clearable
				class="g-m-r-5"
				placeholder="请选择课题"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-select 
				v-model="query.lecture_staff_id"
				:remote-method="handleSearchTeacher"
				:loading="teachersSearchLoading"
				placeholder="输入讲师名称搜索"
				style="width:220px"
				filterable
				remote
				clearable
				label-in-value
				@on-change="handleLectureChange"
			>
				<i-option 
					v-for="staff in teacherList" 
					:key="staff.staff_id" 
					:value="staff.staff_id"
				>{{ staff.staff_name }}</i-option>
			</i-select>
			<i-cascader
				v-model="query.echelon_ids"
				:data="planTree"
				clearable
				class="g-m-r-10"
				placeholder="请选择梯队"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import SaleExpand from '@components/sale/_common/expand';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'oa-sale-expand': SaleExpand
	},
	mixins: [services.subjectTree(), services.planTree()],
	data() {
		const { query = {} } = this.$route;
		const subject_ids = query.subject_ids ? query.subject_ids.split(',').map(it => +it) : [];
		const echelon_ids = query.echelon_ids ? query.echelon_ids.split(',').map(it => +it) : [];
		return {
			query: {
				search: '',
				course_code: '',
				lecture_staff_name: '', // 讲师名称
				...query,
				subject_id: query.subject_id ? +query.subject_id : '', // 课题
				lecture_staff_id: query.lecture_staff_id ? +query.lecture_staff_id : '',
				echelon_id: query.echelon_id ? +query.echelon_id : '',
				subject_ids,
				echelon_ids
			},
			teacherList: query.lecture_staff_id ? [{ staff_name: query.lecture_staff_name, staff_id: +query.lecture_staff_id }] : [],
			teachersSearchLoading: false,
		};
	},
	watch: {
		'query.subject_ids': function (val) {
			this.query.subject_id = val[val.length - 1] || '';
		},
		'query.echelon_ids': function (val) {
			this.query.echelon_id = val[val.length - 1] || '';
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/course/store', {
					...this.query,
					fixPosition: true,
				}
			)); 
			this.$store.commit('HR_ACADEMY_COURSE_STORE_LIST_INIT');
		}, 200),
		handleSearchTeacher(query) {
			this.teachersSearchLoading = true;
			this.$request({
				url: "_HR_NAME_OR_PHONE_STAFF_GET",
				type: 'GET',
				param: {
					search: query.trim()
				},
				loading: false
			}).then((res) => {
				this.teacherList = res.data;
			}).catch((error) => {
				console.error(error);
			}).finally(() => {
				this.teachersSearchLoading = false;
			});
		},
		formatQuery() { 
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleClear(e) {
			if (e.target.value === '') {
				this.handleSearch();
			}
		},
		handleLectureChange(lec = { label: '', value: '' }) {
			this.query.lecture_staff_name = lec.label;
			this.handleSearch();
		},
		handleAddClass() {
			this.$router.push({
				path: '/hr/academy/course/store/add',
				query: {
					action: 'add'
				}
			});

		},
		handleExport() {
			const { query = {} } = getParseUrl();
			window.open(getHashUrl(
				API_ROOT._HR_ACADEMY_COURSE_STORE_EXPORT_GET,
				{
					search: query.search,
					course_code: query.course_code,
					subject_id: query.subject_id,
					echelon_id: query.echelon_id,
					type: query.type || 0,
					'-token': this.$global.token
				}
			), '_blank');
			
		}
	}
};

</script>

<style lang="scss" scoped>
</style>
