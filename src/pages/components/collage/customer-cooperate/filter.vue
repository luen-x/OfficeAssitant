<template>
	<div class="v-collage-cooperate-header js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.search"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称、客户姓名和手机号"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-5 g-red-btn-small"
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
					v-if="$auth[1291]"
					class="g-red-btn-line g-m-r-10"
					@click="handleExport"
				>
					导出
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
							<span @click="handleSelectTitle">选择表头</span>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>

		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.staff_search"
					clearable
					placeholder="请输入邀约人姓名或手机号"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="search.product_name"
					clearable
					placeholder="请输入产品名称"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="search.audit_staff_search"
					clearable
					placeholder="请输入审核人姓名或手机号"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-input
					v-model="search.contract_num"
					clearable
					placeholder="请输入合同编号"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="start_time"
					clearable
					transfer
					placeholder="下单时间(起始)"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="end_time"
					clearable
					transfer
					placeholder="下单时间(结束)"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-cascader
					v-model="depart_id"
					:data="date"
					:change-on-select="true"
					trigger="click"
					clearable
					transfer
					placeholder="请选择组织"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>

				<i-select
					v-model="search.contract_type"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择合同类型"
					class="g-m-r-5"
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
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option, Cascader, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import { services } from "@stores/services/sc";
import moment from "moment";
import API_ROOT from '@stores/apis/root';
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

	mixins: [services.departAll({ autoLoad: false })],

	data() {
		const { query = {} } = this.$route;
		return {
			flag: true,
			search: {
				search: String(query.search || ""), // 客户公司、姓名、手机号
				staff_search: String(query.staff_search || ""), // 邀约人姓名、手机号
				audit_staff_search: String(query.audit_staff_search || ""), // 审核人姓名、手机号
				product_name: String(query.product_name || ""), // 产品名称
				contract_num: String(query.contract_num || ""), // 合同编号
				contract_type: String(query.contract_type || ""), // 合同类型
			},
			start_time: String(query.start_time || ""),
			end_time: String(query.end_time || ""),
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [], // 部门
			show: false,
			contract_types: [
				{
					value: "0",
					label: "新建合同"
				},
				{
					value: "1",
					label: "补充协议"
				},
				{
					value: "2",
					label: "更换产品"
				},
				{
					value: "3",
					label: "续费合同"
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
		this.loadDepartAll();
	},

	methods: {
		handleSearch(event) {
			this.$router.replace(
				getHashUrl("/collage/customer/cooperate", {
					...this.$route.query,
					...this.search,
					fixPosition: true,
					start_time: this.start_time && moment(this.start_time).format("YYYY-MM-DD"),
					end_time: this.end_time && moment(this.end_time).format("YYYY-MM-DD"),
					depart_id: this.depart_id.length ? this.depart_id : null
				})
			);

			this.$store.commit("COLLAGE_CUSTOMER_COOPERATE_LIST_INIT");
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
			this.depart_id = selection;

			this.handleSearch();
		},

		handleExport() {
			const url = getHashUrl(API_ROOT["COLLAGE_CUSTOMER_COOPERATE_LIST_GET"], {
				export: 1,
				type: this.$route.query.type || "1",
				...this.$route.query,
				"-token": this.$global.token
			});

			window.open(url);
		},

		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.collageCustomerCooperate.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_COLLAGE_BUSINESS_TABLE_SAVE_POST",
				mutation: "COLLAGE_CUSTOMER_COOPERATE_TITLE_CHANGE",
				type: this.$route.query.type || "1",
				scenario: 1
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("collage-customer-cooperate-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("COLLAGE_CUSTOMER_COOPERATE_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-cooperate-header{
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