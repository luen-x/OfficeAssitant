<template>
	<div class="hr-salary-social-subsidy-filter js-filter">
		<div>
			<i-input
				v-model="query.search" 
				:placeholder="type==='1'?'请输入姓名/身份证号':'请输入姓名/手机/工号'" 
				style="width: 220px" 
				clearable
				@on-change="handleSearch"
			/>
			<i-select
				v-if="type==='1'"
				v-model="query.security_company_id"
				clearable
				transfer
				class="g-m-l-5"
				style="width: 220px"
				placeholder="请选择社保缴纳公司"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in socialContractArr"
					:key="index"
					:value="item.contract_company_id"
				>{{ item.company_name }}</i-option>
			</i-select>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<div class="g-fr">
				<i-dropdown @on-click="handleClick">
					<span 
						v-if="$auth['1132']|| $auth['1133']"
						class="g-red-btn-line"
						@click="handleClick"
					>
						更多
						<i class="icon iconfont icon-triangle-down g-fs-12"/>
					</span>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="$auth['1132']" name="1">导入</i-dropdown-item>
						<i-dropdown-item v-if="$auth['1133']" name="2">导出</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
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
				<i-cascader 
					v-model="query.depart_id" 
					:data="departAll" 
					:change-on-select="true" 
					style="width: 220px; display: inline-block" 
					class="g-m-r-5"
					clearable 
					transfer 
					trigger="click" 
					placeholder="请选择部门" 
					@on-change="handleDepartChange"
				/>
				<i-select
					v-if="type==='2'"
					v-model="query.position_id"
					style="width: 220px;" 
					class="g-m-r-5"
					clearable
					transfer
					placeholder="请选择职位"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in positionArr"
						:key="index"
						:value="item.position_id"
					>{{ item.position_name }}</i-option>
				</i-select>
				<i-select 
					v-if="type==='1'"
					v-model="query.residence_type" 
					placeholder="请选择户籍性质" 
					style="width: 220px" 
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option 
						v-for="(item, index) in residenceList" 
						:key="index" 
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select 
					v-if="type==='1'"
					v-model="query.employment_form" 
					style="width: 220px" 
					class="g-m-r-5"
					placeholder="请选择用工形式" 
					clearable
					transfer
					@on-change="handleSearch">
					<i-option 
						v-for="(item, index) in foremployment" 
						:key="index" 
						:value="item.foremployment_value">
						{{ item.label }}
					</i-option>
				</i-select>
				<i-date-picker 
					v-if="type==='1'"
					v-model="start_month"
					class="g-m-r-5" 
					style="width: 220px" 
					type="month" 
					clearable
					placeholder="请选择开缴日期" 
					@on-change="handleSearch"
				/>
				<i-date-picker 
					v-if="type==='2'"
					v-model="create_time"
					style="width: 220px" 
					type="daterange"
					clearable
					class="g-m-r-5"
					placeholder="请选择入职日期" 
					@on-change="handleDateChange($event, 'create_time')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, Cascader, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/hr";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { inputPModal } from './popup/input.vue';

export default {
	name: 'hr-salary-social-subsidy-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'vc-expand': Expand
	},
	mixins: [
		services.residenceList(),
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			type: String(query.type || '1'),
			socialContractArr: [],
			positionArr: [],
			foremployment: [{
				foremployment_value: 1,
				label: "合同工"
			},
			{
				foremployment_value: 2,
				label: "编外合同工"
			}
			],
			create_time: [query.create_time_start, query.create_time_end],
			start_month: String(query.start_month || ''),
			query: {
				search: String(query.search || ''),
				security_company_id: Number(query.security_company_id) || null,
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
				position_id: Number(query.position_id) || null,
				residence_type: Number(query.residence_type) || null,
				employment_form: Number(query.employment_form) || null,
			},
			show: false
		};
	},
	watch: {
		$route(to, from) {
			if (to.query.type != from.query.type) {
				this.type = String(to.query.type);
			}
		}
	},
	mounted() {
		if (this.query.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: "GET",
			}).then(res => {
				this.positionArr = res.data.filter(item => item.depart_id === this.query.depart_id[0])[0].positions;
			}).catch(error => {});
		}
		this.handleSocialContractCompany();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/salary/social/subsidy', 
				{ 
					...this.$route.query, 
					 ...this.query,
					depart_id: this.query.depart_id.length ? this.query.depart_id : null,
					start_month: this.start_month && moment(this.start_month).format("YYYY-MM")
				}
			));
			this.$store.commit('HR_SALARY_SOCIAL_SUBSIDY_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleChange(value, selectedData) {
			this.formValidate.position_id = "";
			this.positionArr = [];
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API_ROOT.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSocialContractCompany() {
			this.$request({
				url: API_ROOT._HR_STAFF_SOCIAL_CONTRACT_COMPANY_GET,
				type: "GET"
			}).then(res => {
				this.socialContractArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			if (value.length === 0) {
				this.query.position_id = '';
				this.positionArr = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
				}).then((res) => {
					value.length
						? this.positionArr = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {
				});
			}
			this.handleSearch();
		},
		handleExport(page, pageSize) {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1"
			};
			window.open(getHashUrl(API_ROOT.HR_SALARY_SOCIAL_SUBSIDY_LIST_GET, {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		},
		handleInputFile() {
			inputPModal.popup({
				type: this.$route.query.type || "1"
			}).then(res => {}).catch(err => {});
		},
		handleClick(name) {
			switch (name) {
				case '1':
					this.handleInputFile(); 
					break;
				case '2':
					this.handleExport();
					break;
				default:
					break;
			}
		},
	}
};

</script>

<style lang="scss" >
.hr-salary-social-subsidy-filter{
	.ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
		height:32px !important;
	}
}

</style>
