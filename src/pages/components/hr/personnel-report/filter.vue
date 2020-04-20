<template>
	<oa-sale-expand :bar="false" class="js-filter v-hr-academy-course-question-filter" style="margin-top:0px">
		<i-input
			slot="prefix"
			v-model="query.search"
			placeholder="请输入公司名称搜索"
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
		<div
			class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
			style="padding-top: 3px;padding-bottom: 7px;"
		> 
			<i-date-picker
				v-model="query.create_time"
				type="daterange"
				placeholder="请选择举报/被举报时间"
				clearable
				split-panels
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.audit_time"
				type="daterange"
				class="g-m-r-5"
				placeholder="请选择审核时间"
				clearable
				split-panels
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-select 
				v-model="query.status"
				placeholder="选择举报状态"
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-change="handleSearch"
			>
				<i-option value="1">待辩护</i-option>
				<i-option value="2">待审核</i-option>
				<i-option value="3">已通过</i-option>
				<i-option value="4">未通过</i-option>
			</i-select>
			<i-select 
				v-model="query.report_type"
				placeholder="选择举报类型"
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-change="handleSearch"
			>
				<i-option value="1">错误关联举报</i-option>
				<i-option value="2">跟进记录举报</i-option>
			</i-select>
			<i-select 
				v-model="query.is_defend"
				placeholder="选择辩护状态"
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-change="handleSearch"
			>
				<i-option value="1">未辩护</i-option>
				<i-option value="2">已辩护</i-option>
			</i-select>
			
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, Button, Icon, Select, Option, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { debounce } from 'lodash';
import moment from 'moment';
import { Upload } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import SaleExpand from '@components/sale/_common/expand';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { OSS_TEMPLATE_FILE04 } from '@constants/constants';


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
		'oa-sale-expand': SaleExpand,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'vc-upload': Upload

	},
	data() {
		const { query = {} } = this.$route;

		 
		return {
			query: {
				search: query.search || '',
				report_type: query.report_type || '', // 举报类型：1-错误关联举报，2-跟进记录举报
				status: query.status || '', // 举报状态：1-待辩护，2-待审核，3-举报通过，4-举报驳回
				is_defend: query.is_defend || '', // 是否已辩护：0-未选，1-未辩护，2-已辩护
				create_time: [query.create_time_start, query.create_time_end],
				audit_time: [query.audit_time_start, query.audit_time_end],
			},
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/personnel/report',
				{
					...this.$route.query,
					...this.formatQuery()
				}
			));
			this.$store.commit('HR_PERSONNEL_REPORT_LIST_INIT');
		}, 300),
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		formatQuery() {
			const _query = { ...this.query };
			_query.create_time_start = _query.create_time[0] && moment(_query.create_time[0]).format("YYYY-MM-DD");
			_query.create_time_end = _query.create_time[1] && moment(_query.create_time[1]).format("YYYY-MM-DD");
			delete _query.create_time;
			_query.audit_time_start = _query.audit_time[0] && moment(_query.audit_time[0]).format("YYYY-MM-DD");
			_query.audit_time_end = _query.audit_time[1] && moment(_query.audit_time[1]).format("YYYY-MM-DD");
			delete _query.audit_time;
			return _query;


			// Object.keys(this.query).forEach(key => {
			// 	if (this.query[key] instanceof Date) {
			// 		_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
			// 	} else {
			// 		_query[key] = this.query[key];
			// 	}
			// });
			// return _query;
		},
	}
};

</script>

<style lang="scss">
</style>
