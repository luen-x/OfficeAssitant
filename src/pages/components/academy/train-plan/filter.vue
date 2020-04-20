<template>
	<div class="v-academy-plan-filter js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.course_name"
					:maxlength="50"
					placeholder="请输入课程名称进行搜索" 
					style="width: 300px" 
					class="g-m-r-5"
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
			</div>
			<div class="g-flex">
				<vc-debounce-click
					v-if="$auth[1588]"
					class="g-red-btn-line g-m-r-10"
					@click="handleAdd"
				>
					新建课程
				</vc-debounce-click>
				<i-dropdown v-if="$auth[1587]">
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<i-button class="_btn">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</i-button>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item>
							<div @click="handleExport">导出</div>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-select
					v-model="search.lecture"
					style="width: 220px"
					class="g-m-r-5"
					filterable
					clearable
					transfer
					placeholder="请输入授课讲师进行搜索"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in personList"
						:key="index"
						:value="item.staff_id"
					>
						{{ item.staff_name }}
					</i-option>
				</i-select>
				<i-date-picker
					v-model="time"
					type="daterange"
					clearable
					transfer
					placeholder="请选择授课时间"
					style="width: 220px;"
					class="g-m-r-5" 
					@on-change="handleDateChange($event, 'time')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, Select, Option, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { TrainAddModal } from '@components/academy/_common/course-add/train-add-modal';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'vc-expand': Expand,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		return {
			flag: true,
			show: false,
			search: {
				course_name: query.course_name || '',
				lecture: null || Number(query.lecture),
			},
			time: [query.lecture_start_time, query.lecture_end_time],
			personList: []
		};
	},
	created() {
		this.getPersonList();
	},
	methods: {
		// 时间改变
		handleDateChange(val, name) {
			this.search[`lecture_start_${name}`] = val[0];
			this.search[`lecture_end_${name}`] = val[1];
			this.handleSearch();
		},
		getPersonList() {
			this.$request({
				url: '_HR_STAFF_GET',
				type: 'GET',
				param: {
					// search: this.search
				},
				loading: false
			}).then((res) => {
				this.personList = res.data;
			}).catch((err) => {
				this.loading = false;
			});
		},
		handleAdd() {
			TrainAddModal.popup({
                
			}).then(res => {
			});
		},
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
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/academy/train/plan', 
				{ 
					...this.$route.query,
					...this.search,
				}
			));
			this.$store.commit('ACADEMY_TRAIN_PLAN_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			window.open(getHashUrl(API_ROOT._ACADEMY_TRAIN_PLAN_DETAIL_EXPORT_GET, {
				...this.$route.query,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}
	}
};

</script>

<style lang="scss" scoped>
.v-academy-plan-filter {
	._btn{
		border-color: #e84854;
		color: #e84854;
		height: 32px;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
}
</style>
