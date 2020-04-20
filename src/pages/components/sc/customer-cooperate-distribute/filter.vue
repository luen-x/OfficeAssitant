<template>
	<div class="v-sc-cooperate-distribute-filter g-m-t-20">
		<div>
			<i-input
				v-model="staff_name" 
				clearable
				placeholder="请输入员工姓名" 
				style="width: 300px;" 
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5 g-red-btn-small"
				style="width: 60px;height:32px;"
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
			<div v-if="moreShow" class="g-fr g-flex">
				<vc-debounce-click
					v-if="+$route.query.flag === 2"
					class="g-m-r-10 g-red-btn-line"
					@click="handleWorkRegister"
				>
					工作登记
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
						<i-dropdown-item v-if="volumeShow">
							<div @click="handleSetting">单量设置</div>
						</i-dropdown-item>
						<i-dropdown-item v-if="exportShow">
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
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-if="+$route.query.type === 2 || +$route.query.type === 4"
					v-model="contract_company_name"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称" 
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-if="+$route.query.type === 4"
					v-model="product_name" 
					clearable
					placeholder="请输入产品名称" 
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-if="+$route.query.type === 4"
					v-model="contract_num" 
					clearable
					placeholder="请输入合同编号" 
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-datepicker 
					v-if="+$route.query.type != 4"
					v-model="month"
					type="month" 
					clearable
					transfer
					placeholder="请选择月份" 
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-datepicker
					v-if="+$route.query.type === 4"
					v-model="assign_time"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="选择分配开始/结束时间"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-cascader
					v-if="+$route.query.type != 2 && +$route.query.type != 4"
					v-model="depart_id"
					:data="date"
					:change-on-select="true"
					clearable
					transfer
					trigger="click"
					placeholder="请选择员工部门"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from "@stores/services/sc";
import API_ROOT from "@stores/apis/root";
import moment from "moment"; 
import { OrderModal } from "./popup/order-modal";
import { WorkRegister } from "./popup/work-register";

export default {
	name: 'oa-filter',

	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		"i-cascader": Cascader,
		"i-datepicker": DatePicker,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},

	mixins: [services.departAll({ autoLoad: false })],

	data() {
		const { query = {} } = this.$route;
		return {
			flag: true,
			staff_name: String(query.staff_name || ''),
			product_name: String(query.product_name || ''),
			contract_num: String(query.contract_num || ''),
			contract_company_name: String(query.contract_company_name || ''),
			month: String(query.month || ''),
			assign_time: [query.assign_time_begin, query.assign_time_end],
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [], // 部门ID
			show: false
		};
	},

	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return [...this.departAll];
		},

		// 是否展示单量设置
		volumeShow() {
			return !!(+this.$route.query.flag === 1 && this.$auth[1007]);
		},

		// 是否展示导出
		exportShow() {
			return !!((+this.$route.query.flag === 1 && this.$auth[1469]) 
			|| (+this.$route.query.flag === 2 && this.$auth[1476]));
		},

		//  是否展示更多更能
		moreShow() {
			return this.volumeShow || this.exportShow;
		}
	},

	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},

	mounted() {
		this.loadDepartAll();
	},

	methods: {
		handleSearch(event) {
			let month = this.month && moment(this.month).format("YYYY-MM");
			let url = +this.$route.query.flag === 1 ? '/sc/customer/cooperate/distribute'
				: '/sc/product/distribute';

			this.$router.replace(getHashUrl(
				url, 
				{ 
					...this.$route.query,
					staff_name: this.staff_name,
					product_name: this.product_name,
					contract_num: this.contract_num,
					contract_company_name: this.contract_company_name,
					depart_id: this.depart_id.length ? this.depart_id : null,
					month,
					assign_time_begin: this.assign_time[0] && moment(this.assign_time[0]).format("YYYY-MM-DD"),
					assign_time_end: this.assign_time[1] && moment(this.assign_time[1]).format("YYYY-MM-DD"),
					fixPosition: true,
				}
			));

			this.$store.commit('SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_INIT');
		},

		handleSetting() {
			OrderModal.popup({}).then(res => {
				
			});
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleDepartChange(selection) {
			this.depart_id = selection;

			this.handleSearch();
		},

		handleExport() {
			const url = getHashUrl(API_ROOT["SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_GET"], {
				export: 1,
				type: this.$route.query.type || "1",
				...this.$route.query,
				"-token": this.$global.token
			});

			window.open(url);
		},

		// 工作登记
		handleWorkRegister() {
			WorkRegister.popup({
			}).then(res => {
				this.$store.commit("SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_GET", { type: this.type });
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-cooperate-distribute-filter{
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