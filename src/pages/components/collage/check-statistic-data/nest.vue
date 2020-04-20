<template>
	<div class="v-collage-statistic-data-nest js-filter">
		<div 
			class="g-bg-gray-mid g-lh-42"
			style="padding: 8px 10px;"
		>
			<i-select
				ref="company"
				:remote-method="loadCompanyMethod"
				:loading="companyLoading"
				:value="search.contract_company_id"
				clearable
				transfer
				filterable
				remote
				label-in-value
				style="width:220px;"
				placeholder="请输入公司名称"
				class="g-m-r-5"
				@on-change="handleCompanySearch"
			>
				<i-option
					v-for="(item,index) in company_arr"
					:value="item.contract_company_id" 
					:key="index"
					style="width:200px"
				>{{ item.contract_company_name }}</i-option>
			</i-select>

			<i-select
				:remote-method="loadStaffMethod"
				:loading="staffLoading"
				:value="search.staff_id"
				clearable
				transfer
				filterable
				remote
				label-in-value
				style="width:220px;"
				placeholder="请输入员工姓名或手机号"
				class="g-m-r-5"
				@on-change="handleStaffSearch"
			>
				<i-option
					v-for="(item,index) in staff_arr"
					:value="item.staff_id" 
					:key="index"
					style="width:200px"
				>{{ item.staff_name }}</i-option>
			</i-select>

			<i-cascader
				v-model="search.depart_id"
				:data="date"
				:change-on-select="true"
				clearable
				transfer
				trigger="click"
				placeholder="请选择部门"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDepartChange"
			/>

			<i-select
				v-model="search.lesson_type"
				clearable
				transfer
				style="width:220px;"
				placeholder="请选择培训类型"
				class="g-m-r-5"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in trains"
					:value="item.value"
					:key="item.value"
				>
					{{ item.label }}
				</i-option>
			</i-select>

			<i-date-picker
				v-model="lecture_time"
				clearable
				transfer
				type="daterange"
				split-panels
				placeholder="请选择课程时间"
				class="g-m-r-5"
				style="width: 220px;"
				@on-change="handleSearch"
			/>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>

		<div v-if="flag && nest_data.lesson_whole_score_static">
			<div class="g-flex g-bb g-pd-b-30" style="padding-left: 40px;">
				<div class="g-pd-r-15" style="width: 50%;">
					<div class="g-fs-14 g-c-black g-pd-t-25">套系总评分统计</div>
					<oa-grade-echars 
						key="1"
						:flag="1" 
						:static_data="nest_data.lesson_whole_score_static"
						style="border-right: 1px dashed #ebeef1;"
					/>
				</div>
				<div class="g-pd-l-15" style="width: 50%;">
					<div class="g-fs-14 g-c-black g-pd-t-25">讲师评分统计</div>
					<oa-grade-echars 
						key="2"
						:flag="2"
						:static_data="nest_data.lecture_score_static"
					/>
				</div>
			</div>
			<div class="g-flex g-pd-b-30" style="padding-left: 40px;">
				<div class="g-pd-r-15" style="width: 50%;">
					<div class="g-fs-14 g-c-black g-pd-t-25">线上流程对接平均分</div>
					<oa-grade-echars 
						key="3"
						:flag="3"
						:static_data="nest_data.process_score_static"
						style="border-right: 1px dashed #ebeef1;"
					/>
				</div>
				<div class="g-pd-l-15" style="width: 50%;">
					<div class="g-fs-14 g-c-black g-pd-t-25">线下主持人平均分</div>
					<oa-grade-echars 
						key="4"
						:flag="4"
						:static_data="nest_data.host_score_static"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { DatePicker, Button, Select, Option, Input, Cascader } from "iview";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import { services } from "@stores/services/sc";
import { getHashUrl } from "@utils/utils";
import { debounce } from 'lodash';
import GradeEchars from "./grade-echars";

export default {
	name: "oa-nest",

	components: {
		"i-date-picker": DatePicker,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-cascader": Cascader,
		"oa-grade-echars": GradeEchars
	},
    
	mixins: [services.departAll({ autoLoad: false })],
    
	data() {
		const { query = {} } = this.$route;

		return {
			flag: false,
			nest_data: {},
			staffLoading: false,
			companyLoading: false,
			staff_arr: [],
			company_arr: [],
			loadCompanyMethod: null,
			loadStaffMethod: null,
			search: {
				staff_name: String(query.staff_name || ""),
				contract_company_name: String(query.contract_company_name || ""),
				contract_company_id: Number(query.contract_company_id) || "", 
				staff_id: Number(query.staff_id) || "",
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [], // 部门
				lesson_type: String(query.lesson_type || "")
			},
			lecture_time: [query.lecture_start_time, query.lecture_end_time],
			trains: [
				{
					value: "1",
					label: "线上培训"
				},
				{
					value: "2",
					label: "线下培训"
				}
			]
		};
	},
    
	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return [...this.departAll];
		}
	},
    
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
    
	mounted() {
		// 为了远程搜索刷新后有默认值
		this.loadCompanyData();
		this.loadCompanyMethod = this.loadCompanyData;
		this.loadStaffData();
		this.loadStaffMethod = this.loadStaffData;
		this.loadLessonData();
		this.loadDepartAll();
	},
    
	methods: {
		loadLessonData() {
			const { query } = this.$route;
			this.flag = false;

			let depart_id;
			query.depart_id ? depart_id = query.depart_id.split(",") : depart_id = null;

			this.$request({
				url: "_COLLAGE_CHECK_SERVICE_LESSON_SCORE_STATIC_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id,
					...query,
					depart_id: depart_id ? depart_id[depart_id.length - 1] : null
				},
				loading: false
			}).then(res => {
				this.nest_data = res.data;
				this.flag = true;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		loadCompanyData(query = this.$route.query.contract_company_name) {
			this.companyLoading = true;

			if (query) {
				this.$request({
					url: "_COLLAGE_SERVICE_APPEAL_COMPANY_GET",
					type: "GET",
					param: {
						contract_company_name: query.trim()
					}
				}).then(res => {
					this.companyLoading = false;
					this.company_arr = res.data;
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			} else {
				this.companyLoading = false;
				this.company_arr = [];
			}
			
		},

		loadStaffData(query) {
			query = query || (this.$route.query.staff_name && this.$route.query.staff_name.split('/')[0]);
			this.staffLoading = true;

			if (query) {
				this.$request({
					url: "_SC_MANAGE_INSPECTION_QUALITY_GET_STAFF_GET",
					type: "GET",
					param: {
						search: query.trim()
					}
				}).then(res => {
					this.staffLoading = false;
					this.staff_arr = res.data;
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			} else {
				this.companyLoading = false;
				this.staff_arr = [];
			}
		},

		handleSearch: debounce(function () {
			this.$router.replace(
				getHashUrl("/collage/check/statistic/data", {
					...this.$route.query,
					...this.search,
					depart_id: this.search.depart_id.length ? this.search.depart_id : null,
					lecture_start_time: this.lecture_time[0] && moment(this.lecture_time[0]).format("YYYY-MM-DD"),
					lecture_end_time: this.lecture_time[1] && moment(this.lecture_time[1]).format("YYYY-MM-DD")
				})
			);

			this.loadLessonData();
		}, 300),

		handleDepartChange(selection) {
			this.search.depart_id = selection;
			this.handleSearch();
		},

		handleCompanySearch(company = {}) {
			this.search.contract_company_id = company.value || '';
			this.search.contract_company_name = company.label || '';
			this.handleSearch();
		},

		handleStaffSearch(staff = {}) {
			this.search.staff_id = staff.value || '';
			this.search.staff_name = staff.label || '';
			this.handleSearch();
		}
	}
};
</script>

<style lang="scss">
.v-collage-statistic-data-nest{
    height: 810px;
    border: 1px solid #ebeef1;

	&:hover{
		box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
    }

	.ivu-select-dropdown-transfer{
		max-width: 220px !important;
	}

	.ivu-select-selection{
		padding-right: 0px !important;
	}

	.ivu-select-input{
		padding-right: 0px;
	}
}
</style>