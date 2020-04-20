<template>
	<div class="g-flex g-jc-sb g-ai-c g-lh-42 v-hr-social-transform-filter">
		<div class="g-fw-w g-lh-42">
			<i-select
				ref="staff"
				v-model="query.staff_id"
				:remote-method="loadStaff"
				:loading="staffLoading"
				class="g-m-r-5"
				style="width: 220px"
				filterable
				remote
				clearable
				transfer
				label-in-value
				placeholder="请输入招聘人员姓名"
				@on-change="handleChange"
				@on-query-change="handleQueryChange"
			>
				<i-option
					v-for="(item, index) in staffData"
					:key="index"
					:value="item.value"
				>{{ item.label }}</i-option>
			</i-select>
			
			<i-select
				v-model="query.position_ids"
				transfer
				clearable
				placeholder="请选择应聘岗位"
				style="width: 220px;"
				class="g-m-r-5 _height"
				multiple 
				filterable
				@on-change="handleSearch">
				<i-option
					v-for="item in recruitAllPosition"
					:key="item.position_id"
					:value="item.position_id">
					{{ item.position_name }}
				</i-option>
			</i-select>
			<i-date-picker
				:value="query.multi_time"
				:split-panels="true"
				transfer
				type="daterange"
				class="g-m-r-5"
				style="width: 220px;"
				placeholder="选择录入时间范围"
				@on-change="handleDateRangeChange($event, 'multi_time')"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div
			class="g-red-btn-line"
			style="margin-top: 2px;"
			@click="handleOutput">
			导出
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { services, createSearch } from '@stores/services/hr';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { Input, Button, Cascader, Select, Option, DatePicker } from 'iview';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
	},
	mixins: [
		// services.recruitDePosition(),
		services.recruitAllPosition(),
		createSearch({ key: 'staff' })
	],
	props: {
		type: {
			type: String,
			default: ""
		},
	},
	data() {
		const { query = {} } = this.$route;
		return {
			staff: query.staff_name || '',
			dataList: [
				{ label: '全部数据', value: '1' },
				{ label: '我的数据', value: '0' }
			],
			staffData: [],
			query: {
				...query,
				is_all: query.is_all || "1",
				staff_id: Number(query.staff_id),
				staff_name: query.staff_name,
				multi_time: query.multi_time_start ? [query.multi_time_start, query.multi_time_end] : '',
				position_ids: query.position_ids ? query.position_ids.split(',').map((item) => Number(item)) : [],
			}
		};
	},
	methods: {
		handleQueryChange(query = '') {
			let targetQuery = this.query.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleChange(staff) {
			this.query.staff_id = staff ? staff.value : '';
			this.query.staff_name = staff ? staff.label : '';
			this.handleSearch();
		},
		// 时间改变
		handleDateRangeChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/recruit/social/statistics',
				{
					...this.query,
					type: this.type,
					position_ids: this.query.position_ids.length ? this.query.position_ids : null,
				}
			));

			this.$store.commit('HR_RECRUIT_SOCIAL_TRANSFORM_LIST_INIT');
		}, 300),
		// 导出数据
		handleOutput: lodash.debounce(function () {
			const { query = {} } = this.$route;
			let url = getHashUrl(API_ROOT['HR_RECRUIT_SOCIAL_TRANSFORM_LIST_GET'], { // eslint-disable-line
				...query,
				is_export: 1,
				'-token': this.$global.token
			});
			window.open(url);
		}, 300),
	}
};
</script>

<style lang="scss" >
.v-hr-social-transform-filter {
	._height .ivu-select-selection{
		min-height: 32px;
		max-height: 60px;
		overflow-y: auto;
	}
}
</style>


