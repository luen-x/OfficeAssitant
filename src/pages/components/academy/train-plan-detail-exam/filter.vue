<template>
	<div class="v-train-plan-detail-exam-filter">
		<oa-title class="g-m-b-20">
			开启作业考试
		</oa-title>
		<div class="g-m-b-20">
			<div>
				<span class="_left-row g-tr">是否开启作业考试：</span>
				<i-switch 
					v-model="start" 
					:true-value="1" 
					:false-value="0" 
					size="small" 
					@on-change="handleChangeSwitch"/>
				<span class="g-c-black4">开启后，学员必须上传作业，才算考核通过</span>
			</div>
			<div v-if="start" class="g-m-t-10">
				<span class="_left-row g-tr">上传时间：</span>
				<i-datepicker
					v-model="upload_time"
					:options="options"
					type="datetimerange"
					format="yyyy-MM-dd HH:mm"
					clearable
					transfer
					split-panels
					placeholder="请选择上传时间"
					separator=" 至 "
					style="width: 262px;"
					@on-ok="handleChangeTime"
					@on-clear="handleChangeTime('clear')"
				/>
			</div>
		</div>
		<oa-title class="g-m-b-20">
			作业上传列表
		</oa-title>
		<i-input
			v-model="search.staff_info"
			:maxlength="50"
			placeholder="请输入姓名、手机号进行搜索" 
			style="width: 220px" 
			class="g-m-r-5"
			clearable
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>
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
			@on-change="handleSearch"
		/>
		<i-select
			v-model="search.is_upload"
			class="g-m-r-5"
			style="width: 220px;"
			clearable
			transfer
			placeholder="是否上传作业"
			@on-change="handleSearch"
		><i-option :value="1">是</i-option>
			<i-option :value="0">否</i-option>
		</i-select>
		<i-button 
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import { Input, Button, Cascader, Switch, DatePicker, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl } from '@utils/utils';
import Title from '@components/academy/_common/title';

export default {
	name: 'v-train-plan-detail-exam-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-switch': Switch,
		"i-cascader": Cascader,
		"i-datepicker": DatePicker,
		'oa-title': Title,
		'vc-expand': Expand,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'i-select': Select,
		'i-option': Option,
	},
	mixins: [services.departAll()],
	props: {
		enable: {
			type: Number,
			default: 0
		},
		time: {
			type: Array,
			default: () => []
		}
	},
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			search: {
				staff_info: query.staff_info || '',
				is_upload: query.is_upload ? Number(query.is_upload) : null,
				depart_id: query.depart_id ? Number(query.depart_id) : null,
				depart_ids
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			start: this.enable,
			upload_time: this.time
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		},
		'enable': function (val) {
			this.start = val;
		},
	},
	created() {
	},
	methods: {
		handleChangeTime(e) {
			e ? this.upload_time = ['', ''] : '';
			this.$request({
				url: "_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_NOTICE_TIME_CHANGE_POST",
				type: "POST",
				param: {
					course_id: this.$route.query.course_id,
					upload_start_time: this.upload_time[0] ? moment(this.upload_time[0]).format('YYYY-MM-DD HH:mm') : '',
					upload_end_time: this.upload_time[1] ? moment(this.upload_time[1]).format('YYYY-MM-DD HH:mm') : ''
				},
				loading: false
			}).then(res => {
				this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
				this.$Message.success('变更上传时间成功');
			}).catch(error => {
				this.upload_time = ["", ""];
				this.$Message.error(error.msg);
			});
		},
		handleChangeSwitch(e) {
			this.$request({
				url: "_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_CHANGE_GET",
				type: "GET",
				param: {
					course_id: this.$route.query.course_id,
					enable_upload: e
				},
				loading: false
			}).then(res => {
				this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
				e ? this.upload_time = ['', ''] : '';
				this.$Message.success(e ? '开启成功' : '关闭成功');
				this.$emit('change', e);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/academy/train/plan/detail/exam', 
				{ 
					...this.search,
					course_id: this.$route.query.course_id
				}
			));
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss">
.v-train-plan-detail-exam-filter {
	._left-row {
		display: inline-block;
		width: 110px;
	}
}
</style>
