<template>
	<div :style="{ marginTop: routes.length ? '38px' : '0' }" class="v-common-filter">
		<div class="g-m-l-10 g-tabs-card">
			<!-- <ul class="_tabs ivu-tabs ivu-tabs-card">
				<li 
					v-for="(route, i) in routes"
					:class="['g-fl', nowIndex == i ? 'ivu-tabs-tab-active' : '']"
					:key="i"
					class="ivu-tabs-tab"
					@click="handleRouteChange(route, i)">{{ route.label }}</li>
			</ul> -->
			<i-tabs 
				:value="type" 
				:animated="false"
				type="card" 
				@on-click="handleRouteChange"
			>
				<i-tab-pane 
					v-for="(route, i) in routes"
					:key="i"
					:label="route.label" 
					:name="route.label"
				/>
			</i-tabs>
		</div>
		<div class="g-m-l-10">
			<i-select
				v-if="auth.showStaffSearch"
				ref="staff"
				:remote-method="loadStaff"
				:loading="staffLoading"
				:value="staff_id"
				filterable
				clearable
				remote
				label-in-value
				placeholder="请输入员工姓名"
				style="display: inline-block; width: 220px"
				@on-change="handleStaffSearch"
				@on-query-change="handleQueryChange"
			>
				<i-option v-for="(option, index) in staffData" :value="option.value" :key="index">{{ option.label }}</i-option>
			</i-select>

			<i-date-picker
				v-if="auth.showMonthSearch"
				:clearable="false"
				v-model="month"
				class="g-m-l-5"
				type="month"
				style="width: 220px"
				@on-clear="handleMonthClear"
				@on-change="handleSearch"
			/>

			<i-select 
				v-if="auth.showResultSearch"
				v-model="guard_is_victory" 
				class="g-m-l-5" 
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option v-for="(item, i) in result" :key="i" :value="item.value">{{ item.label }}</i-option>
			</i-select>

			<i-select
				v-if="auth.showTypeSearch"
				v-model="pk_type"
				class="g-m-l-5" 
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option :value="0">员工PK</i-option>
				<i-option :value="1">部门PK</i-option>
			</i-select>

			<i-cascader
				v-if="auth.showDepartmentSearch"
				:data="departAllOfSale"
				v-model="depart_id"
				trigger="click"
				style="display: inline-block; width: 220px"
				clearable
				change-on-select
				placeholder="请选择部门"
				class="g-m-l-5"
				@on-change="handleDepartSearch"
			/>
 
			<vc-debounce-click
				v-if="!hideSearchButton"
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				@click="handleSearch">搜索</vc-debounce-click>

			<vc-debounce-click
				v-if="role=='超级管理员' && $route.path.includes('staff')" 
				class="g-m-l-10 g-fr g-red-btn-line" 
				@click="handleImport">导入</vc-debounce-click>
			<vc-debounce-click
				v-if="$auth['640']" 
				class="g-m-l-10 g-fr g-red-btn-line" 
				@click="handleExport">导出</vc-debounce-click>
			<vc-debounce-click
				v-if="$auth['369']" 
				class="g-m-l-10 g-fr g-red-btn-line"
				@click="handlePkNow">PK现场</vc-debounce-click>
		</div>

		<div v-if="showSummary" class="g-m-l-10">
			<oa-pk-summary/>
		</div>
	</div>
</template>

<script>
import { DatePicker, Select, Option, Input, Button, Cascader, Tabs, TabPane } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { pkStaffByMutiTerm, services } from '@stores/services/hr'; // 从人事部门接口获取部门级联
import ROOT_API from '@stores/apis/root';
import moment from 'moment';
import { serviceManager } from '@stores/services/utils'; 
import PkSummary from './pk-summary';
import { PModalImport } from './popup/import-pk-data';

export const getNowMonth = () => {
	const date = new Date();
	const year = date.getFullYear();
	let month = date.getMonth() + 1;
	month = month < 10 ? '0' + month : month;
	return year + '-' + month;
};
export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-cascader': Cascader,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-pk-summary': PkSummary,
	},
	mixins: [pkStaffByMutiTerm, services.departAll()],
	data() {
		const { query = {} } = this.$route;
		return {
			type: '',
			labelData: this.$store.state.saleMainPk.routes.map(v => v.label),
			staff_id: '',
			staff_name: '',
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			department: '',
			staff_type: 0,
			// pk_type: 0,
			pk_type: Number(query.pk_type || 0),
			depart_id: (query.department && query.department.split(',').map(Number)) || [],
			stairDeparts: [],
			result: [
				{ label: '全部', value: 2 },
				{ label: '擂主胜', value: 1 },
				{ label: '擂主负', value: -1 },
				{ label: '平局', value: 0 }],
			param: {
				staff_id: '',
				month: new Date(),
			},
			// guard_is_victory: 2,
			// month: new Date(),
			guard_is_victory: Number(query.guard_is_victory || 2),
			month: query.month || new Date(),
			initAuth: {
				showStaffSearch: false,
				showMonthSearch: false,
				showResultSearch: false,
				showTypeSearch: false,
				showDepartmentSearch: false
			},
		};
	},
	computed: {
		departAllOfSale() {
			if (this.departAll === undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('营销'))[0].children;
			departTree.forEach(v => {
				if (!v.children) {
					v.disabled = true;
				}
			});
			return departTree;
		},
		nowIndex() {
			return this.$store.state.saleMainPk.nowIndex;
		},
		routes() {
			return this.$store.state.saleMainPk.routes;
		},
		hideSearchButton() {
			const role = this.$store.state.saleMainPk.role;
			return (role == '员工' && this.$route.path.includes('staff'))
			 || (role == '经理' && this.$route.path.includes('department'));
		},
		showSummary() {
			const role = this.$store.state.saleMainPk.role;
			if (role == '员工' && this.$route.path.includes('staff')) return true;
			if ((role == '经理' || role == '总监') 
				&& this.$route.path.includes('department')) return true;
			return false;
		},
		hasRequest() {
			return this.$store.state.saleMainPk.hasRequest;
		},
		role() {
			return this.$store.state.saleMainPk.role;
		},
		auth() {
			const role = this.$store.state.saleMainPk.role;
			const nowPath = this.$route.path;
			if (!role) return this.initAuth;
			if (role == '员工') {
				if (nowPath.includes('staff')) {
					return {
					  ...this.initAuth,
					  showMonthSearch: true
					};
				}	
			} else if (role == '经理' || role == '总监') {
				if (nowPath.includes('staff')) {
					return {
						...this.initAuth,
					  showStaffSearch: true,
						showMonthSearch: true,
						showResultSearch: true,
					};
				} else if (nowPath.includes('department')) {
					return {
						...this.initAuth,
						showMonthSearch: true,
					};
				}
			} else if (role == "超级管理员") {
				if (nowPath.includes('staff') || nowPath.includes('department')) {
					return {
						...this.initAuth,
					  showStaffSearch: true,
						showMonthSearch: true,
						showResultSearch: true,
					};
				} else if (nowPath.includes('statistic')) {
					return {
						...this.initAuth,
						showStaffSearch: true,
						showMonthSearch: true,
						showTypeSearch: true,
						showDepartmentSearch: true
					};
				}
			}
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		// if (!this.hasRequest) {
		this.handleRouteByRole();
		// }
		this.$nextTick(v => {
			this.type = this.labelData[this.nowIndex];
		});
		this.type = this.labelData[this.nowIndex];
	},
	methods: {
		handleSearch(event) {
			const nowPath = this.$route.path;
			this.$router.replace(getHashUrl(
				nowPath,
				{ 
					...this.$route.query, 
					keyword: this.keyword,
					name: this.name,
					month: moment(this.month).format('YYYY-MM'),
					// staff_type: this.staff_type,
					pk_type: this.pk_type,
					staff_id: this.staff_id,
					// depart_id: this.depart_id.pop(),
					depart_id: this.depart_id[this.depart_id.length - 1],
					department: this.depart_id,
					guard_is_victory: this.guard_is_victory
				}
			));

			let mitutation = '';
			switch (true) {
				case nowPath.includes('staff'):
					mitutation = 'SALE_MAIN_PK_STAFF_LIST_INIT';
					break;
				case nowPath.includes('department'):
					mitutation = 'SALE_MAIN_PK_DEPARTMENT_LIST_INIT';
					break;
				case nowPath.includes('statistic'):
					mitutation = 'SALE_MAIN_PK_STATISTIC_LIST_INIT';
					break; 
				default:
					console.warn('请检查你的路由是否正确');
					mitutation = [];
					mitutation.push('SALE_MAIN_PK_STAFF_LIST_INIT');
					mitutation.push('SALE_MAIN_PK_DEPARTMENT_LIST_INIT');
					mitutation.push('SALE_MAIN_PK_STATISTIC_LIST_INIT');
			}
			typeof mitutation === 'string'
				? this.$store.commit(mitutation)
				: mitutation.forEach(v => this.$store.commit(v));
		},
		handleDepartSearch(departmentArr) {
			this.depart_id = departmentArr;
			this.handleSearch();
		},
		handleRouteChange(event) {
			let path = '';
			let i = 0;
			this.routes.forEach((v, index) => {
				if (v.label == event) {
					path = v.path;
					i = index;
				}
			});
			if (this.nowIndex == i) return;
			this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: i });
			let query = {
				page: 1,
				pageSize: 10,
				month: getNowMonth(),
				staff_type: 0,
			};
			if (path.includes('staff')) {
				if (this.role == '超级管理员') {
					query.guard_is_victory = 2;
				} else if (this.role == '经理' || this.role == '总监') {
					query.guard_is_victory = 2;
				}
			} else if (path.includes('department')) {
				if (this.role == '超级管理员') {
					query.guard_is_victory = 2;
					query.staff_type = 1;
				}
			} else if (path.includes('statistic')) {
				query.pk_type = 0;
				delete query.staff_type;
			}
			// let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				page: 1,
				pageSize: 10,
				// staff_type,
				...query,
				// type,
				// page: this.current[type]
			};
			this.$router.push(getHashUrl(path, { ...query }));
			// this.$router.push(path);
		},
		// 根据员工角色处理路由
		handleRouteByRole() {
			this.$request({
				url: ROOT_API._SALE_MAIN_PK_STAFF_IDENTIFY_GET,
				type: "GET",
				param: {
					staff_id: this.$global.staff.staff_id
				}
			}).then(({ data }) => {
				let role = data[0];
				// role = '超级管理员';
				// role = '总监';
				// role = '员工';
				this.hanldeRouteTab(role);
				// 防止刷新后丢失状态
				this.handleNowIndex(role);
			}).catch(err => {
				this.$Message.error('员工角色请求错误');
			});
		},
		hanldeRouteTab(role) {
			let routes = [];
			if (role == '经理' || role == '总监') {
				routes = [
					{ label: '部门PK', path: '/sale/main/pk/department' },
					{ label: '员工PK', path: '/sale/main/pk/staff' }
				];
			}
			if (role == '超级管理员') {
				routes = [
					{ label: '员工PK', path: '/sale/main/pk/staff' },
					{ label: '部门PK', path: '/sale/main/pk/department' },
					{ label: 'PK统计', path: '/sale/main/pk/statistic' }
				];
			}
			this.$store.commit('SALE_MAIN_PK_ROUTE', { routes, role });
			// serviceManager.add(() => app.$store.commit('SALE_MAIN_PK_LIST_RESET', {}));
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handlePkNow() {
			this.$router.push('/sale/main/scene');
		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "0"
			};
			const nowPath = this.$route.path;
			let staff_type = '';
			if (nowPath.includes('staff')) {
				staff_type = 0;
			} else if (nowPath.includes('department')) {
				staff_type = 1;
			} else if (nowPath.includes('statistic')) {
				staff_type = 2;
			}
			window.open(getHashUrl(ROOT_API['_SALE_MAIN_PK_EXPORT'], {
				month: query.month,
				is_export: 1,
				staff_type,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleImport() {
			PModalImport.popup({}).then(res => {
			});
		},
		handleMonthClear() {
			this.month = new Date();
		},
		handleNowIndex(role) {
			const nowPath = this.$route.path;
			if (role == '经理' || role == '总监') {
				if (nowPath.includes('staff') && this.nowIndex != 1) {
					this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: 1 });
				} else if (nowPath.includes('department') && this.nowIndex != 0) {
					this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: 0 });
				}
			} else if (role == '超级管理员') {
				if (nowPath.includes('staff') && this.nowIndex != 0) {
					this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: 0 });
				} else if (nowPath.includes('department') && this.nowIndex != 1) {
					this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: 1 });
				} else if (nowPath.includes('statistic') && this.nowIndex != 2) {
					this.$store.commit('SALE_MAIN_PK_NOW_INDEX', { nowIndex: 2 });
				}
			}
		},
		handleStaffSearch(staff = {}) {
			this.staff_id = staff.value || '';
			this.staff_name = staff.label || '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		}
	}
};

</script>

<style lang="scss" scoped>
	.v-common-filter {
		margin-left: -10px;
		min-width: 1140px;
		._tabs {
			height: 30px;
			width: 100%;
			
			// padding-top: 5px;
			margin-bottom: 10px;
			li {
				padding: 5px 16px 4px;
				border: 1px solid #dcdee2;
				min-width: 94px;
				text-align: center;
				cursor: pointer;
			}
		}
		._tabs > .ivu-tabs-tab {
		border-radius: 0 0 0 0 !important;

		&:last-child {
			border-radius: 0 4px 0 0 !important;
		}

		&:nth-child(1) {
			border-radius: 4px 0 0 0 !important;
		}
	}
	}
</style>
