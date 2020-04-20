<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search.search"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称搜索"
				style="width: 300px;height:32px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
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
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					ref="staff_create"
					:value="search.create_staff_id"
					:remote-method="remote"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请输入举报人搜索"
					@on-change="handleChange({create_staff_id: arguments[0]}, 'create')"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-datepicker
					v-model="time"
					type="daterange"
					clearable
					transfer
					placeholder="请选择举报时间"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, '')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';

import { Tabs, TabPane, Input, Button, Select, Option, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services, createSearch, searchCompany, searchTechStaff, staffByRemove } from '@stores/services/hr';
import { getParseUrl, getHashUrl, dataValidity, initTreeData } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'vc-expand': Expand,
	},
	mixins: [
		staffByRemove
	],
	data() {
		const { query = {} } = this.$route;
		return {
			remote: null,
			search: {
				search: query.search || '',
				create_staff_id: +query.create_staff_id || null,
			},
			time: [query.create_start_time, query.create_end_time],
			name: String(query.name || ''),
			show: false
		};
	},
	created() {
		this.handleLoadStaffData(() => {
			this.$nextTick(() => {
				this.remote = this.loadStaff();
			});
		});
	},
	methods: {
		handleChange(obj, key) {
			let value = obj[`${key}_staff_id`];
			this.search[`${key}_staff_id`] = value ? value.value : '';
			this.search[`${key}_staff_name`] = value ? value.label : '';
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 设置远程搜索刷新后值保持
		handleLoadStaffData() {
			return this.$request({
				url: `_HR_MUTI_TERM_STAFF_GET`,
				type: 'GET',
				param: {
					search: '1', // 为了能搜索到全部的员工数据（手机号码必定有1）
					type: 2,
					is_charge: 1
				},
				loading: false
			}).then((res) => {
				this.staff = Number(this.$route.query.staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remote = this.loadStaff;
			}).catch((error) => {
					
			});
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search[`create_time_start`] = val[0];
			this.search[`create_time_end`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/archives/audit', 
				{ 
					...this.$route.query,
					...this.search,
					fixPosition: true
				}
			));
			this.$store.commit('HR_ARCHIVES_AUDIT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
