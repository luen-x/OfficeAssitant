<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="keyword"
				clearable
				placeholder="请输入客户公司、姓名或手机号" 
				style="width: 300px" 
				@on-enter="handleSearch"
				@on-change="handleKeywordSearch"
			/>

			<i-button 
				type="primary"
				class="g-red-btn-small"
				style="margin-left: 6px"
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
					class="iconfont g-fs-12 g-c-black-dark"/>
			</span>

			<vc-debounce-click 
				class="g-fr g-red-btn-line" 
				@click="handleExport"
			>
				导出
			</vc-debounce-click>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="activity_type"
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择活动类型"
					@on-change="handleSearch"
				>
					<i-option :value="1">未结束活动</i-option>
					<i-option :value="2">已结束活动</i-option>
					<i-option :value="3">全部活动</i-option>
				</i-select>

				<i-select
					v-model="category_id"
					clearable
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择活动类型"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in activeType"
						:key="item.category_id"
						:value="item.category_id"
					>
						{{ item.category_name }}
					</i-option>
				</i-select>

				<i-cascader
					:data="departAll"
					v-model="department"
					style="display: inline-block; width: 220px"
					clearable
					transfer
					trigger="click"
					change-on-select
					placeholder="请选择部门"
					class="g-m-r-5"
					@on-change="handleDepartSearch"
				/>

				<i-select
					ref="staff" 
					:remote-method="remote"
					:loading="staffLoading"
					v-model="staff"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					placeholder="请选择对接人"
					style="display: inline-block; width: 220px"
					@on-change="handleStaffSearch"
					@on-query-change="handleQueryChange"
				>
					<i-option 
						v-for="(option, index) in staffData" 
						:value="option.value" 
						:key="index"
					>
						{{ option.label }}
					</i-option>
				</i-select>

				<i-data-picker 
					v-model="create_time" 
					style="width: 220px"
					class="g-m-r-5" 
					clearable
					transfer
					type="daterange"
					split-panels
					placeholder="请选择活动报名日期"
					@on-change="handleSearch"
				/>

				<i-select 
					v-model="customer_type" 
					clearable 
					transfer
					label="请选择客户类型" 
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option 
						v-for="(item, i) in customerType" 
						:value="i" 
						:key="item"
					>
						{{ item }}
					</i-option>
				</i-select>
				
			</div>
		</vc-expand>
	</div>
</template>

<script>
import Vue from 'vue';
import { Input, Button, Select, Option, DatePicker, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, formatDate, initTreeData } from '@utils/utils';
import { services, staffByMutiTerm } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import { services as contentService } from '@stores/services/content';
import API_ROOT from "@stores/apis/root";
import moment from "moment";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'i-cascader': Cascader
	},
	mixins: [services.departAll(), contentService.customerType(), staffByMutiTerm],
	data() {
		const { query = {} } = this.$route;
		return {
			remote: null,
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			create_time: [query.create_time_start, query.create_time_end],
			show: false,
			activeType: [],
			departList: [],
			activity_type: +query.activity_type || 1,
			department: query.department ? query.department.split(',').map(Number) : [],
			apply_time: query.apply_time,
			customer_type: query.customer_type,
			category_id: '',
			staff: '',
			staff_label: ''
		}; 
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.handleActivityType();
		this.handleLoadStaffData(() => {
			this.remote = this.loadStaff();
		});
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/activity/audit', 
				{ 
					...this.$route.query, 
					fixPosition: true,
					keyword: this.keyword,
					customer_type: this.customer_type,
					department: this.department.length ? this.department : '',
					depart_id: this.department[this.department.length - 1],
					staff_id: this.staff ? this.staff : '',
					category_id: this.category_id,
					activity_type: this.activity_type,
					create_time_start: this.create_time[0] && moment(this.create_time[0]).format("YYYY-MM-DD"),
					create_time_end: this.create_time[1] && moment(this.create_time[1]).format("YYYY-MM-DD")
				}
			));
			this.$store.commit('CONTENT_ACTIVITY_AUDIT_LIST_INIT');
		},
		handleDepartSearch(selectDepart) {
			this.department = selectDepart;
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "0",
				activity_type: this.$route.query.activity_type || 1
			};

			window.open(getHashUrl(API_ROOT.CONTENT_ACTIVITY_AUDIT_LIST_GET, {
				...query,
				is_export: 1,
				'-token': this.$global.token
			}));
		},
		handleActivityType() {
			this.$request({
				url: API_ROOT._SALE_MAIN_ACTIVITY_CATEGORY_GET,
				type: "GET",
			}).then((res) => {
				this.activeType = res.data;
				this.category_id = this.$route.query.category_id;
			}).catch((err) => {
				console.error(err);
			});
		},
		handleKeywordSearch(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleStaffSearch(staff = {}) {
			this.staff = staff.value || '';
			this.staff_label = staff.label || '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_label || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		// 设置远程搜索刷新后值保持
		handleLoadStaffData() {
			return this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
				type: 'GET',
				param: {
					search: '1' // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.staff = Number(this.$route.query.staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remote = this.loadStaff;
			}).catch((error) => {
					
			});
		}
	}
};
</script>