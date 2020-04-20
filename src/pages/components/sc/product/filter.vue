<template>
	<div class="v-sc-product-search js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.search"
					:maxlength="50"
					clearable
					placeholder="请输入客户公司、姓名和手机号"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-10 g-red-btn-small"
					style="width: 60px;height:32px"
					@click="handleSearch"
				>
					搜索
				</vc-debounce-click>
				<span
					v-if="(searchData.title_show && searchData.title_show.length > 1 || $auth[322] || $auth[323])"
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
					v-if="$auth[1474]"
					class="g-red-btn-line g-m-r-10"
					@click="$router.push(
						{	
							path: '/sc/product/distribute',
							query: {
								flag: 2
							}
						}
					)"
				>
					工作概况
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
						<i-dropdown-item>
							<span @click="handleSelectList">列表设置</span>
						</i-dropdown-item>
						<i-dropdown-item>
							<span @click="handleSelectTitle">选择表头</span>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid g-flex g-fw-w g-flex-ac"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<div 
					v-for="(item,index) in searchData.title_show" 
					:key="index"
				>
					<i-input
						v-if="Number(item.search_id) === 2"
						v-model="search.invite_param"
						clearable
						placeholder="请输入邀约人姓名或手机号"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-input
						v-if="Number(item.search_id) === 3"
						v-model="search.staff_name"
						clearable
						placeholder="请输入主负责人姓名或负责人姓名"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
					<i-input
						v-if="Number(item.search_id) === 22"
						v-model="search.child_staff_name"
						clearable
						placeholder="请输入负责人姓名"
						style="width: 220px"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>
					<i-input
						v-if="Number(item.search_id) === 4"
						v-model="search.contract_num"
						clearable
						placeholder="请输入合同编号"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-select
						v-if="Number(item.search_id) === 5"
						v-model="search.product_ids"
						clearable
						transfer
						multiple
						style="width:220px;"
						class="g-m-r-10"
						placeholder="请选择下单产品"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in productData"
							:value="item.product_id"
							:key="item.product_id"
						>
							{{ item.product_name }}
						</i-option>
					</i-select>

					<i-input
						v-if="Number(item.search_id) === 6"
						v-model="search.finish_step"
						clearable
						placeholder="请输入完成步骤"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-input
						v-if="Number(item.search_id) === 7"
						v-model="search.wait_step"
						clearable
						placeholder="请输入未完成步骤"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-date-picker
						v-if="Number(item.search_id) === 8"
						v-model="start_end"
						clearable
						transfer
						type="daterange" 
						split-panels
						placeholder="选择下单开始/结束时间"
						style="width: 220px;"
						formate="yyyy-MM-dd"
						class="g-m-r-10"
						@on-change="handleSearch"
					/>

					<i-date-picker
						v-if="Number(item.search_id) === 24"
						v-model="operation_finish_date"
						type="daterange"
						clearable
						transfer
						placeholder="选择运维完成平台时间"
						separator=" 至 "
						style="width: 220px;"
						class="g-m-r-10"
						@on-change="handleDateChange($event, 'operation_finish_date')"
					/>

					<i-date-picker
						v-if="Number(item.search_id) === 25"
						v-model="handover_finish_time"
						type="daterange"
						clearable
						transfer
						placeholder="选择交接完成时间"
						separator=" 至 "
						style="width: 220px;"
						class="g-m-r-10"
						@on-change="handleDateChange($event, 'handover_finish_time')"
					/>

					<i-cascader
						v-if="Number(item.search_id) === 9"
						v-model="department"
						:data="date"
						:change-on-select="true"
						trigger="click"
						clearable
						transfer
						placeholder="请选择下单部门"
						style="width: 220px;"
						class="g-m-r-10"
						@on-change="handleDepartChange"
					/>

					<i-select
						v-if="Number(item.search_id) === 10"
						v-model="search.contract_type"
						clearable
						transfer
						style="width:220px;"
						placeholder="请选择合同类型"
						class="g-m-r-10"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in contract_types"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>

					<i-select
						v-if="Number(item.search_id) === 16"
						v-model="search.valid_type"
						clearable
						transfer
						style="width:220px;"
						placeholder="是否为有效单"
						class="g-m-r-10"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in effective_singles"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>

					<i-date-picker
						v-if="Number(item.search_id) === 12"
						v-model="dis_start_end"
						clearable
						transfer
						type="daterange" 
						split-panels
						placeholder="选择分配开始/结束时间"
						style="width: 220px;"
						class="g-m-r-10"
						@on-change="handleSearch"
					/>

					<i-select
						v-if="Number(item.search_id) === 17"
						v-model="search.tag_type"
						clearable
						transfer
						style="width:220px;"
						class="g-m-r-10"
						placeholder="筛选标签"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in tag_types"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>

					<i-cascader
						v-if="Number(item.search_id) === 18"
						v-model="address"
						:data="regionData"
						:change-on-select="true"
						clearable
						transfer
						trigger="click"
						placeholder="请选择企业地址"
						style="width: 220px;"
						class="g-m-r-10"
						@on-change="handleRegionChange"
					/>

					<i-input
						v-if="Number(item.search_id) === 19"
						v-model="search.subdivision_industry"
						clearable
						placeholder="请输入细分行业"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-input
						v-if="Number(item.search_id) === 20"
						v-model="search.contract_amount"
						clearable
						placeholder="请输入合同金额"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-input
						v-if="Number(item.search_id) === 21"
						v-model="search.brand_name"
						clearable
						placeholder="请输入品牌名称"
						style="width: 220px;"
						class="g-m-r-10"
						@on-enter="handleSearch"
						@on-change="handleInputChange"
					/>

					<i-select
						v-if="Number(item.search_id) === 11"
						v-model="search.status"
						clearable
						transfer
						style="width:220px;"
						class="g-m-r-10"
						placeholder="请选择进度情况"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in status_arr"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>

					<i-select
						v-if="Number(item.search_id) === 23"
						v-model="search.is_discount"
						clearable
						transfer
						style="width:220px;"
						class="g-m-r-10"
						placeholder="客户是否打折"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in discounts"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</div>

				<template>
					<i-select
						v-if="$auth[322]"
						v-model="search.is_all"
						clearable
						transfer
						style="width:220px;"
						placeholder="请选择我的合同类型"
						class="g-m-r-10 g-m-t-5"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in my_type"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>

					<i-select
						v-if="$auth[323]"
						v-model="search.make_department"
						clearable
						transfer
						style="width:220px;"
						placeholder="请选择制作部门"
						class="g-m-r-10 g-m-t-5"
						@on-change="handleSearch"
					>
						<i-option
							v-for="item in makeDepartment"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</template>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option, Cascader, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import lodash from 'lodash';
import { services } from "@stores/services/sc";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import { ListSettingModal } from "@components/_common/list-set/list-setting";
import { TableTitle } from "../../_common/table-title/table-title";

export default {
	name: "oa-filter",

	components: {
		"i-input": Input,
		"i-button": Button,
		"vc-expand": Expand,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},

	mixins: [services.departAll({ autoLoad: false }), services.allRegion()],

	data() {
		const { query = {} } = this.$route;

		return {
			flag: true,
			search: {
				search: String(query.search || ""),
				invite_param: String(query.invite_param || ""),
				staff_name: String(query.staff_name || ""),
				child_staff_name: String(query.child_staff_name || ""), // 负责人
				contract_num: String(query.contract_num || ""),
				product_ids: query.product_ids ? query.product_ids.split(',').map(Number) : [], // 下单产品
				finish_step: String(query.finish_step || ""), // 完成步骤
				wait_step: String(query.wait_step || ""), // 未完成步骤
				contract_type: String(query.contract_type || ""), // 合同类型
				is_all: String(query.is_all || ""), // 1全部合同 2我的合同
				make_department: String(query.make_department || ""), // 制作部门
				valid_type: String(query.valid_type || ""), // 是否为有效单
				tag_type: String(query.tag_type || ""), // 筛选标签
				subdivision_industry: String(query.subdivision_industry || ""), // 细分行业
				contract_amount: String(query.contract_amount || ""), // 合同金额
				brand_name: String(query.brand_name || ""), // 品牌名称
				status: String(query.status || ""), // 	进度情况 1待完成 2已完成
				is_discount: String(query.is_discount || "") // 客户是否打折
			},
			start_end: [query.start_time, query.end_time],
			department: query.department ? query.department.split(',').map((item) => Number(item)) : [], // 部门
			dis_start_end: [query.dis_start_time, query.dis_end_time],
			operation_finish_date: [query.operation_finish_date_start, query.operation_finish_date_end],
			handover_finish_time: [query.handover_finish_time_start, query.handover_finish_time_end],
			address: query.address ? query.address.split(',').map((item) => Number(item)) : [], // 地址
			show: false,
			contract_types: [
				{
					value: "1",
					label: "新建合同"
				},
				{
					value: "2",
					label: "补充协议"
				},
				{
					value: "3",
					label: "续费合同"
				},
				{
					value: "4",
					label: "更换产品"
				}
			],
			my_type: [
				{
					value: "1",
					label: "全部合同"
				},
				{
					value: "2",
					label: "我的合同"
				}
			],
			effective_singles: [
				{
					value: "1",
					label: "是"
				},
				{
					value: "2",
					label: "否"
				}
			],
			tag_types: [
				{
					value: "1",
					label: "紫"
				},
				{
					value: "2",
					label: "红"
				},
				{
					value: "3",
					label: "绿"
				},
				{
					value: "4",
					label: "黄"
				}
			],
			status_arr: [
				{
					value: "1",
					label: "待完成"
				},
				{
					value: "2",
					label: "已完成"
				}
			],
			makeDepartment: [],
			searchData: [],
			discounts: [
				{
					value: "0",
					label: "否"
				},
				{
					value: "1",
					label: "是"
				}
			],
			productData: []
		};
	},

	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return [...this.departAll];
		},

		regionData() {
			if (this.allRegion == undefined) {
				return [];
			}

			return this.allRegion;
		}
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.searchData = this.$store.state.scProduct.searchData;

		this.getMakeDepart();
		this.loadDepartAll();
		this.getProductData();
	},

	methods: {
		getProductData() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET,
				type: 'GET',
				param: {
					is_all: 1
				},
				loading: false
			}).then((res) => {
				this.productData = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		getMakeDepart() {
			this.$request({
				url: API_ROOT._SC_PRODUCT_DEPARTMENT_GET,
				type: 'GET',
				param: {
					type: 2
				},
				loading: false
			}).then((res) => {
				this.makeDepartment = res.data;
				this.search.make_department = +this.$route.query.make_department || null;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(
				getHashUrl("/sc/product", {
					...this.$route.query,
					...this.search,
					fixPosition: true,
					start_time: this.start_end[0] && moment(this.start_end[0]).format("YYYY-MM-DD"),
					end_time: this.start_end[1] && moment(this.start_end[1]).format("YYYY-MM-DD"),
					department: this.department.length ? this.department : null,
					dis_start_time: this.dis_start_end[0] && moment(this.dis_start_end[0]).format("YYYY-MM-DD"),
					dis_end_time: this.dis_start_end[1] && moment(this.dis_start_end[1]).format("YYYY-MM-DD"),
					address: this.address.length ? this.address : null
				})
			);
			
			this.$store.commit("SC_PRODUCT_LIST_INIT");
		}, 300),
		// 时间改变
		handleDateChange(val, name) {
			this.search[`${name}_start`] = val[0];
			this.search[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		handleDepartChange(selection) {
			this.department = selection;

			this.handleSearch();
		},
		
		handleRegionChange(selection) {
			this.address = selection;

			this.handleSearch();
		},

		// 列表设置
		handleSelectList() {
			const sortData = this.$store.state.scProduct.sortData;
			const searchData = this.$store.state.scProduct.searchData;

			ListSettingModal.popup({
				scenario: 2,
				sort_mutation: "SC_PRODUCT_LIST_SORT",
				sortData,
				searchData,
				search_mutation: "SC_PRODUCT_LIST_SEARCH",
				sortUrl: "_SC_CUSTOMER_COOPERATE_SAVE_LABEL_SETTINGS_POST",
				searchUrl: "_SC_CUSTOMER_COOPERATE_SAVE_LABEL_SETTINGS_POST"
			}).then(res => {
				res && this.$store.commit("SC_PRODUCT_LIST_RESET", { type: "" });
			});
		},

		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.scProduct.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_SC_CUSTOMER_COOPERATE_SAVE_LABEL_SETTINGS_POST',
				mutation: 'SC_PRODUCT_TITLE_CHANGE',
				type: this.$route.query.type || "1",
				scenario: 2
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit('sc-product-title-change', { type: this.$route.query.type || "1" });
				this.$store.commit("SC_PRODUCT_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
			});
		},
	}
};
</script>

<style lang="scss">
.v-sc-product-search{
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