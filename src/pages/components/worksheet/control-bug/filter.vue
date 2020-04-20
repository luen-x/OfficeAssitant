<template>
	<div class="js-filter v-worksheet-control-bug-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.info"
					placeholder="请输入工单编号或bug标题关键字" 
					style="width: 300px" 
					clearable
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
			<div class="g-flex">
				<span
					v-if="$auth[1506] && role !== 3"
					class="g-red-btn-line g-m-r-10"
					@click="handleAdd"
				>
					创建bug
				</span>
				<i-dropdown v-if="$auth[1665]">
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
				<i-cascader
					v-if="+$route.query.system_id"
					:data="moduleList"
					v-model="search.module_ids"
					change-on-select
					placeholder="请选择所属模块"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
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
					placeholder="请输入bug创建人"
					@on-change="handleChange({create_staff_id: arguments[0]}, 'create')"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					ref="staff_solve"
					:value="search.solve_staff_id"
					:remote-method="remote"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请输入bug解决人"
					@on-change="handleChange({solve_staff_id: arguments[0]}, 'solve')"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					ref="staff_assign"
					:value="search.assign_staff_id	"
					:remote-method="remote"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请输入bug当前指派"
					@on-change="handleChange({assign_staff_id	: arguments[0]}, 'assign')"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-datepicker
					v-model="create_time"
					type="daterange"
					clearable
					transfer
					placeholder="选择创建时间"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'create_')"
				/>
				<i-datepicker
					v-model="solve_time"
					type="daterange"
					clearable
					transfer
					placeholder="选择解决时间"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'solve_')"
				/>
				<i-datepicker
					v-model="close_time"
					type="daterange"
					clearable
					transfer
					placeholder="选择关闭时间"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'close_')"
				/>
				<i-select
					v-model="search.label_type"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					transfer
					placeholder="请选择标签"
					@on-change="handleSearch"
				><i-option
					v-for="(v, index) in selectList"
					:key="index"
					:value="v.value"
				>{{ v.label }}</i-option>
				</i-select>
				<i-select
					v-model="search.solve_type"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					transfer
					placeholder="请选择解决方案"
					@on-change="handleSearch"
				><i-option
					v-for="(v, index) in resolveList"
					:key="index"
					:value="v.id"
				>{{ v.name }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { services, createSearch, searchCompany, searchTechStaff, staffByRemove } from '@stores/services/hr';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, dataValidity, initTreeData } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: 'v-worksheet-control-bug-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-cascader': Cascader,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},
	mixins: [
		staffByRemove,
		searchCompany,
		searchTechStaff
	],
	props: {
		system: {
			type: Number,
			default: 0
		}
	},
	data() {
		const { query = {} } = this.$route;
		const module_ids = query.module_ids ? query.module_ids.split(',').map(it => +it) : [];
		return {
			flag: true,
			remote: null,
			show: true,
			role: '',
			search: {
				...query,
				info: query.info || '',
				module_id: query.module_ids ? query.module_ids.split(',').map((item) => Number(item)) : [],
				system_id: +query.system_id || 0,
				label_type: +query.label_type || null,
				solve_type: +query.solve_type || null,
				create_staff_id: +query.create_staff_id || null,
				create_staff_name: +query.create_staff_name || '',
				solve_staff_id: +query.solve_staff_id || null,
				solve_staff_name: +query.solve_staff_name || '',
				assign_staff_id: +query.assign_staff_id || null,
				assign_staff_name: +query.assign_staff_name || '',
				module_ids
			},
			create_time: [query.create_start_time, query.create_end_time],
			solve_time: [query.solve_start_time, query.solve_end_time],
			close_time: [query.close_start_time, query.close_end_time],
			lessonList: [],
			selectList: [
				{
					value: 1,
					label: '待您反馈'
				},
				{
					value: 2,
					label: '待您确认'
				},
				{
					value: 3,
					label: '待您验证'
				},
				{
					value: 4,
					label: '超时提醒'
				}
			],
			resolveList: [
				{
					id: 1,
					name: '设计如此',
				},
				{
					id: 2,
					name: '重复bug',
				},
				{
					id: 3,
					name: '外部原因',
				},
				{
					id: 4,
					name: '已解决',
				},
				{
					id: 5,
					name: '无法重现',
				},
				{
					id: 6,
					name: '延期处理',
				},
				{
					id: 7,
					name: '不予解决',
				}
			],
			moduleList: [],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.worksheetControlBug.listInfo;
		}
	},
	watch: {
		'search.module_ids': function (val) {
			this.search.module_id = val[val.length - 1] || '';
		},
		'$route.query.system_id': function (val) {
			let num_val = +val;
			if (num_val) {
				this.search.system_id = num_val;
				this.handleModuleList(this.system);
			}
			this.search.module_id = '';
			this.search.module_ids = [];
			this.handleSearch();
		},
	},
	created() {
		this.handleLoadStaffData(() => {
			this.$nextTick(() => {
				this.remote = this.loadStaff();
			});
		});
		this.loadRole();
		if (+this.$route.query.system_id) {
			this.handleModuleList(+this.$route.query.system_id);
		}
	},
	methods: {
		handleChange(obj, key) {
			let value = obj[`${key}_staff_id`];
			this.search[`${key}_staff_id`] = value ? value.value : '';
			this.search[`${key}_staff_name`] = value ? value.label : '';
			this.handleSearch();
		},
		// 设置远程搜索刷新后值保持
		handleLoadStaffData() {
			return this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
				type: 'GET',
				param: {
					search: '1', // 为了能搜索到全部的员工数据（手机号码必定有1）
					type: 2
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
		// 获取模块列表
		async loadRole() {
			return this.$request({
				url: '_WORKSHEET_CONTROL_TECH_ROLE_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.role = res.data.role;
			}).catch((error) => {
				console.error(error);
			});
		},
		// 获取模块列表
		async handleModuleList(e) {
			return this.$request({
				url: '_WORKSHEET_CONTROL_BUG_MODULE_GET',
				type: "GET",
				param: {
					system_id: e
				},
				loading: false
			}).then((res) => {
				let arr = [];
				this.moduleList = this.formatModule(res.data);
			}).catch((error) => {
				console.error(error);
			});
		},
		formatModule(arr) {
			const target = arr.map(it => {
				const result = {
					label: it.module_name || '',
					value: it.module_id || null,
					children: it.children || []
				};
				if (result.children.length > 0) {
					result.children = this.formatModule(result.children);
				} else {
					delete result.children;
				}
				return result;
			});
			return target;
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search[`${name}start_time`] = val[0];
			this.search[`${name}end_time`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/worksheet/control/bug', 
				{ 
					...this.$route.query,
					...this.search,
					system_id: this.$route.query.system_id || this.system,
					fixPosition: true,
				}
			));
			this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleAdd() {
			this.$router.push({
				path: '/worksheet/control/bug/add',
				query: {
					system_id: this.$route.query.system_id
				}
			});
		},
		handleExport() {
			window.open(getHashUrl(API_ROOT._WORKSHEET_CONTROL_BUG_EXPORT_GET, {
				...this.$route.query,
				export: 1,
				'-token': this.$global.token
			}));
		}
	}
};

</script>

<style lang="scss">
.v-worksheet-control-bug-filter {
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
