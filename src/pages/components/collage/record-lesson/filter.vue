<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="param.lesson_name" 
					placeholder="请输入课程名称" 
					style="width: 320px" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button 
					type="primary"
					class="g-m-l-5 g-red-btn-small"
					@click="handleSearch"
				>
					搜索
				</i-button>

				<!-- <span 
				type="primary"
				class="g-m-l-10 g-m-t-5 g-red-btn-line g-fr"
				@click="handleSelectTitle"
			>
				选择表头
			</span> -->
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
			<div class="g-fr">
				<i-dropdown class="g-fr g-m-l-10 g-m-t-5 g-dp-ib">
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<i-button class="_btn ">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</i-button>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item>
							<span @click="handleSelectTitle">选择表头</span>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
				<span 
					class="g-m-l-10 g-m-t-5 g-red-btn-line g-fr"
					@click="handleAddLesson"
				>
					新增录单
				</span>
			</div>
			

		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
			style="width: 100%"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px; width: 100%"
			>
				<i-select
					ref="staff"
					:remote-method="loadStaffMethod"
					:loading="staffLoading"
					:value="param.record_staff"
					filterable
					clearable
					remote
					label-in-value
					placeholder="录单人/录单人手机"
					style="display: inline-block; width: 220px"
					class="g-m-r-5"
					@on-change="handleStaffSearch"
					@on-query-change="handleQueryChange"
				>
					<i-option v-for="(option, index) in staffData" :value="option.value" :key="index">{{ option.label }}</i-option>
				</i-select>

				<i-select
					v-model="param.lecture_set_id"
					clearable
					transfer
					style="width: 220px;"
					placeholder="请选择课程类型"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in activityCategory"
						:key="item.lecture_set_id"
						:value="item.lecture_set_id">{{ item.name }}</i-option>
				</i-select>

				<i-select
					v-model="param.lesson_hour"
					clearable
					transfer
					style="width: 220px;"
					placeholder="请选择讲课时长"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option 
						v-for="{ label, value } of LESSON_ENUM"
						:key="value"
						:value="value">{{ label }}</i-option>
				</i-select>

				<i-date-picker
					v-model="param.attend_time"
					format="yyyy-MM-dd"
					type="daterange" 
					clearable
					transfer
					style="width: 220px"
					separator=" 至 "
					class="g-m-r-5"
					placeholder="请填写参与日期"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="param.record_time"
					format="yyyy-MM-dd"
					type="daterange" 
					clearable
					transfer
					style="width: 220px"
					separator=" 至 "
					class="g-m-r-5"
					placeholder="请填写录单时间"
					@on-change="handleSearch"
				/>
				
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import { remoteStaffByMutiTerm, services } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import { EditAndAddLesson } from './popup/edit-and-add-lesson';
import { TableTitle } from "../../_common/table-title/table-title";


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},
	mixins: [remoteStaffByMutiTerm, services.departAll()],
	data() {
		const { query = {} } = this.$route;
		this.LESSON_ENUM = [
			{ label: '1h以下', value: 1 },
			{ label: '1h（包含）-1.5h ', value: 2 },
			{ label: '1.5h（包含）-2h ', value: 3 },
			{ label: '2h（包含）-2.5h ', value: 4 },
			{ label: '2.5h（包含）-3h ', value: 5 },
			{ label: '3h及以上', value: 6 }
		];
		return {
			show: false,
			flag: true,
			loadStaffMethod: null,
			activityCategory: [],
			param: {
				record_staff: Number(query.record_staff) || '',
				lesson_name: String(query.lesson_name || ''),
				lecture_set_id: Number(query.lecture_set_id) || '',
				lesson_hour: Number(query.lesson_hour) || '',
				attend_time: [String(query.activity_start_time_start || ''), String(query.activity_start_time_end || '')],
				record_time: [String(query.record_time_start || ''), String(query.record_time_end || '')]
			}
		};
	},
	created() {
		// 为了远程搜索刷新后有默认值
		this.loadStaff();
		this.loadStaffMethod = this.loadStaff;
		this.loadActivityCategoryData();
	},
	methods: {
		handleSearch(event) {
			const {
				param: {
					attend_time: [activity_start_time_start, activity_start_time_end],
					record_time: [record_time_start, record_time_end],
					...validParam
				}
			} = this;
			this.$router.replace(getHashUrl(
				'/collage/record/lesson', 
				{ 
					...this.$route.query, 
					fixPosition: true,
					...validParam,
					activity_start_time_start: activity_start_time_start && moment(activity_start_time_start).format("YYYY-MM-DD"),
					activity_start_time_end: activity_start_time_end && moment(activity_start_time_end).format("YYYY-MM-DD"),
					record_time_start: record_time_start && moment(record_time_start).format("YYYY-MM-DD"),
					record_time_end: record_time_end && moment(record_time_end).format("YYYY-MM-DD"),
				}
			));
			this.$store.commit('COLLAGE_RECORD_LESSON_LIST_INIT');
		},

		handleAddLesson() {
			EditAndAddLesson.popup({
				title: '新增录单'
			}).then(() => {
				this.$store.commit('COLLAGE_RECORD_LESSON_LIST_RESET', { type: this.$route.type || '1' });
			}).catch(() => {});
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleStaffSearch(staff = {}) {
			this.param.record_staff = staff.value || '';
			this.staff_name = staff.label || '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		loadActivityCategoryData() {
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_LECTURE_LIST,
				type: "GET",
				param: { type: 3 }
			}).then(({ data }) => {
				this.activityCategory = data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.collageRecordLesson.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_COLLAGE_BUSINESS_TABLE_SAVE_POST",
				mutation: "COLLAGE_RECORD_LESSON_TITLE_CHANGE",
				type: this.$route.query.type || "1",
				scenario: this.$auth[1408] ? 7 : 5
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("collage-record-lesson-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("COLLAGE_RECORD_LESSON_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => { 
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>
._btn{
		border-color: #e84854;
		color: #e84854;
		height: 32px;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
</style>
