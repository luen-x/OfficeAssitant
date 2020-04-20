<template>
	<div class="v-sc-manage-inspection js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.company_info"
					:maxlength="50"
					clearable
					placeholder="请输入客户公司、姓名或手机号" 
					style="width: 300px; height:32px;" 
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-5 g-red-btn-small"
					style="width: 60px;height:32px"
					@click="handleSearch"
				>
					搜索
				</vc-debounce-click>
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
				<vc-debounce-click
					v-if="$auth[1271]"
					class="g-red-btn-line g-m-r-10"
					@click="handleSettingQualityPeriod"
				>
					设置质检周期
				</vc-debounce-click>
				<i-dropdown>
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<i-button class="_btn">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</i-button>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item v-if="$auth[338]">
							<span
								class="g-inline-block"
								style="width: 100%;"
								@click="handleExport"
							>
								导出
							</span>
						</i-dropdown-item>
						<i-dropdown-item v-if="$auth[338]">
							<span
								class="g-inline-block"
								style="width: 100%;"
								@click="$router.push({path: '/sc/manage/inspection/grade'})"
							>
								打分项设置
							</span>
						</i-dropdown-item>
						<i-dropdown-item>
							<span
								class="g-inline-block"
								style="width: 100%;"
								@click="handleSelectTitle"
							>
								选择表头
							</span>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.service_people" 
					clearable
					placeholder="请输入邀约人或服务人姓名" 
					style="width: 220px" 
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					ref="staff_quality"
					:value="search.quality_staff_ids"
					:remote-method="remoteQuality"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					multiple
					remote
					clearable
					transfer
					label-in-value
					placeholder="请输入上次质检人员"
					@on-change="handleChange({quality_staff_ids: arguments[0]}, 'quality')"
					@on-query-change="handleChangeQuality"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					ref="staff_assign"
					:value="search.assign_staff_ids"
					:remote-method="remoteAssign"
					:loading="staffNormalLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					multiple
					clearable
					transfer
					label-in-value
					placeholder="请输入本次待质检人员"
					@on-change="handleChange({assign_staff_ids: arguments[0]}, 'assign')"
					@on-query-change="handleChangeAssign"
				>
					<i-option
						v-for="(item, index) in staffNormalData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<span class="g-m-r-5">
					<i-input-number
						v-model="search.min_score" 
						:max="10"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="服务最低分" 
						style="width: 102px" 
						clearable
						@on-change="handleSearch"
					/>
					~
					<i-input-number
						v-model="search.max_score" 
						:max="10"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="服务最高分" 
						style="width: 102px" 
						clearable
						@on-change="handleSearch"
					/>
				</span>

				<i-date-picker
					v-model="place_order"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择下单开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="quality_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择质检开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="product_complete"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择产品完成开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="service_expire_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择服务到期时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
				
				<i-select
					v-model="search.product_id"
					style="width: 220px;"
					class="g-m-r-5"
					clearable
					transfer
					filterable
					multiple
					transfer-class-name="v-sc-manage-inspection-select"
					placeholder="请选择下单产品"
					@on-change="handleSearch"
				>
					<!--防止空格产生BUG-->
					<i-option 
						v-for="item in productList" 
						:value="item.product_id" 
						:key="item.product_id"
					>{{ item.product_name }}</i-option>
				</i-select>
				
				<i-select
					v-model="search.call_status"
					clearable
					transfer
					filterable
					multiple
					style="width:220px;"
					placeholder="请选择上次接通情况"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in calls"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="search.is_follow"
					clearable
					transfer
					style="width:220px;"
					placeholder="是否需要跟进"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in follows"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="search.has_quality_record"
					clearable
					transfer
					style="width:220px;"
					placeholder="有无回访记录"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in qualityRecords"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-cascader
					v-model="service_person_depart_id"
					:data="date"
					:change-on-select="true"
					clearable
					transfer
					trigger="click"
					placeholder="请选择服务人部门"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>

				<div class="g-inline-block g-m-r-5">
					<i-select
						v-model="search.score_id"
						clearable
						transfer
						style="width:143px;"
						placeholder="请选择增值服务评分"
						class="g-m-r-5"
						@on-change="handleSearch"
						@on-clear="handleClear"
					>
						<i-option
							v-for="item in scoreTypeList"
							:value="item.id"
							:key="item.id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
					<i-input-number
						v-model="search.min_service_score"
						style="width:32px"
						class="g-m-r-5"
					/>
					<i-input-number
						v-model="search.max_service_score"
						style="width:32px"
						class="g-m-r-5"
					/>
				</div>

				<i-select
					v-model="search.system_expire"
					clearable
					transfer
					style="width:220px;"
					placeholder="系统是否到期"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in expire"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, DatePicker, Select, Option, InputNumber, Dropdown, DropdownMenu, DropdownItem, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, dataValidity, initTreeData } from '@utils/utils';
import moment from "moment";
import { services } from "@stores/services/sc";
import { pkStaffByMutiTerm, staffByNormal } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { SettingQualityPeriodModal } from "./modal/setting-quality-period";
import { TableTitle } from '../../_common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-input-number": InputNumber,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [pkStaffByMutiTerm, staffByNormal, services.departAll({ autoLoad: false })],
	data() {
		const { query = {} } = this.$route;
		return {
			flag: true,
			remoteQuality: null,
			remoteAssign: null,
			search: {
				company_info: String(query.company_info || ""), // 客户公司、姓名或手机号
				service_people: String(query.service_people || ""), // 邀约人或服务人姓名
				quality_staff_ids: query.quality_staff_ids ? query.quality_staff_ids.split(',').map(Number) : [], 
				quality_staff_name: query.quality_staff_name ? query.quality_staff_name.split(',') : [], 
				assign_staff_ids: query.assign_staff_ids ? query.assign_staff_ids.split(',').map(Number) : [], 
				assign_staff_name: query.assign_staff_name ? query.assign_staff_name.split(',') : [], 
				call_status: query.call_status ? query.call_status.split(',').map((item) => item) : [], // 质检接通状况
				is_follow: String(query.is_follow || ""), // 是否需要跟进 // 0 否 1 是
				min_score: Number(query.min_score) || null, // 质检分数最小值
				max_score: Number(query.max_score) || null, // 质检分数最大值
				has_quality_record: String(query.has_quality_record || ""), // 	是否有质检记录: 0 否 1 是
				score_id: String(query.score_id || ""), // 评分筛选
				product_id: query.product_id ? query.product_id.split(',').map((item) => Number(item)) : [], // 下单产品id
				min_service_score: Number(query.min_service_score) || null,
				max_service_score: Number(query.max_service_score) || null,
				system_expire: String(query.system_expire || ""), // 系统是否到期
			},
			place_order: [query.place_order_start_time, query.place_order_end_time], // 下单开始/结束时间
			quality_time: [query.quality_start_time, query.quality_end_time], // 质检开始/结束时间
			service_expire_time: [query.service_expire_start_time, query.service_expire_end_time], // 服务到期时间
			product_complete: [query.product_complete_start_time, query.product_complete_end_time], // 产品完成开始/结束时间
			service_person_depart_id: query.service_person_depart_id ? query.service_person_depart_id.split(',').map((item) => Number(item)) : [], // 部门
			show: false,
			calls: [
				{
					label: "正常接通",
					value: "1"
				}, 
				{
					label: "未接",
					value: "2"
				}, 
				{
					label: "无效",
					value: "3"
				}, 
				{
					label: "雷区",
					value: "4"
				}, 
				{
					label: "非雷",
					value: "5"
				}, 
				{
					label: "1正常",
					value: "6"
				}, 
				{
					label: "2非雷",
					value: "7"
				}, 
				{
					label: "2雷区",
					value: "8"
				}, 
				{
					label: "不回访",
					value: "9"
				}, 
				{
					label: "暂不回访",
					value: "10"
				}, 
				{
					label: "到期",
					value: "11"
				}, 
				{
					label: "已退",
					value: "12"
				}, 
				{
					label: "未评",
					value: "13"
				},
				{
					label: "完结",
					value: 14
				}
			],
			follows: [
				{
					label: "是",
					value: "1"
				}, 
				{
					label: "否",
					value: "0"
				}
			],
			qualityRecords: [
				{
					label: "有",
					value: "1"
				}, 
				{
					label: "无",
					value: "0"
				}
			],
			scoreTypeList: [],
			productList: [],
			expire: [
				{
					label: "否",
					value: "0"
				}, 
				{
					label: "是",
					value: "1"
				}
			]
		};
	},

	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return this.departAll;
		}
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		const { query = {} } = this.$route;
		this.handleLoadQualityStaffData(() => {
			this.$nextTick(() => {
				this.remoteQuality = this.loadStaff();
			});
		});
		this.handleLoadAssignStaffData(() => {
			this.$nextTick(() => {
				this.remoteAssign = this.loadNormalStaff();
			});
		});
		this.loadScoreData();
		this.loadDepartAll();
		this.loadProductData();
	},
	
	methods: {
		handleChangeQuality(e) {
			if (!e) {
				this.handleLoadQualityStaffData();
			}
		},
		handleChangeAssign(e) {
			if (!e) {
				this.handleLoadAssignStaffData();
			}
		},
		handleChange(obj, key) {
			let value = obj[`${key}_staff_ids`];
			this.search[`${key}_staff_ids`] = value.map(v => v.value);
			this.search[`${key}_staff_name`] = value.map(v => v.label);
			this.handleSearch();
		},
		// 设置远程搜索刷新后值保持
		handleLoadQualityStaffData() {
			return this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_DEPART_GET,
				type: 'GET',
				param: {
					search: '1', // 为了能搜索到全部的员工数据（手机号码必定有1）
					type: 2,
					is_charge: 1
				},
				loading: false
			}).then((res) => {
				// this.staff = Number(this.$route.query.staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remoteQuality = this.loadStaff;
			}).catch((error) => {
					
			});
		},
		// 设置远程搜索刷新后值保持
		handleLoadAssignStaffData() {
			return this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_DEPART_GET,
				type: 'GET',
				param: {
					search: '1', // 为了能搜索到全部的员工数据（手机号码必定有1）
					type: 1,
					is_charge: 1
				},
				loading: false
			}).then((res) => {
				// this.staff = Number(this.$route.query.staff_id);
				this.staffNormalData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remoteAssign = this.loadNormalStaff;
			}).catch((error) => {
					
			});
		},
		loadScoreData() {
			this.$request({
				url: '_SC_SERVICE_MANAGE_GRADE_SCORE_LIST_GET',
				type: "GET",
				param: {}
			}).then(res => {
				this.scoreTypeList = res.data;
			}).catch((error) => {
			});
		},

		handleClear() {
			this.search.min_service_score = null;
			this.search.max_service_score = null;
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sc/manage/inspection', 
				{ 
					...this.$route.query,
					...this.search, 
					fixPosition: true,
					place_order_start_time: this.place_order[0] && moment(this.place_order[0]).format("YYYY-MM-DD"),
					place_order_end_time: this.place_order[1] && moment(this.place_order[1]).format("YYYY-MM-DD"),
					quality_start_time: this.quality_time[0] && moment(this.quality_time[0]).format("YYYY-MM-DD"),
					quality_end_time: this.quality_time[1] && moment(this.quality_time[1]).format("YYYY-MM-DD"),
					service_expire_start_time: this.service_expire_time[0] && moment(this.service_expire_time[0]).format("YYYY-MM-DD"),
					service_expire_end_time: this.service_expire_time[1] && moment(this.service_expire_time[1]).format("YYYY-MM-DD"),
					product_complete_start_time: this.product_complete[0] && moment(this.product_complete[0]).format("YYYY-MM-DD"),
					product_complete_end_time: this.product_complete[1] && moment(this.product_complete[1]).format("YYYY-MM-DD"),
					product_id: this.search.product_id.length ? this.search.product_id : null,
					call_status: this.search.call_status.length ? this.search.call_status : null,
					service_person_depart_id: this.service_person_depart_id.length 
						? this.service_person_depart_id : null
				}
			));

			this.$store.commit('SC_MANAGE_INSPECTION_LIST_INIT');
		}, 300),

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		// 导出
		handleExport() {
			let service_person_depart_id = this.$route.query.service_person_depart_id 
				? (this.$route.query.service_person_depart_id + '').split(",")[
					(this.$route.query.service_person_depart_id + '').split(",").length - 1] 
				: null;

			const url = getHashUrl(API_ROOT["_SC_MANAGE_INSPECTION_EXPORT_POST"], {
				is_export: 1,
				type: this.$route.query.type || "1",
				...this.$route.query,
				service_person_depart_id,
				"-token": this.$global.token
			});

			window.open(url);
		},

		// 设置质检周期
		handleSettingQualityPeriod() {
			SettingQualityPeriodModal.popup({
				name: "1"
			}).then(res => {	
			});
		},

		// 下单产品列表
		loadProductData() {
			this.$request({
				url: '_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET',
				type: "GET",
				param: {
					is_all: 0
				}
			}).then((res) => {
				res.data.forEach(item => {
					this.productList.push({
						product_id: item.product_id,
						product_name: item.product_name
					});
				});
			}).catch((error) => {
			});
		},

		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.scManageInspection.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_SC_CUSTOMER_COOPERATE_SAVE_LABEL_SETTINGS_POST",
				mutation: "SC_MANAGE_INSPECTION_TITLE_CHANGE",
				type: this.$route.query.type || "1",
				scenario: 5
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("sc-manage-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("SC_MANAGE_INSPECTION_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
			});
		},

		handleDepartChange(selection) {
			this.service_person_depart_id = selection;
			this.handleSearch();
		}
	}
};

</script>

<style lang="scss">
.v-sc-manage-inspection {
	.ivu-input-number-handler-wrap {
        display: none !important;
	}

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

.v-sc-manage-inspection-select{
	max-width: 220px !important;
}
</style>