<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search.search"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称或姓名或手机号搜索"
				style="width: 300px"
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

		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.staff_search"
					:maxlength="50"
					clearable
					placeholder="请输入邀约人姓名或手机号搜索"
					class="g-m-r-5"
					style="width: 220px;"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-cascader
					v-model="departId"
					:data="date"
					:change-on-select="true"
					trigger="click"
					clearable
					transfer
					placeholder="请选择组织"
					class="g-m-r-5"
					style="width: 220px;"
					@on-change="handleDepartChange"
				/>

				<i-select
					v-model="search.refund_type"
					clearable
					transfer
					style="width:220px;"
					class="g-m-r-10 g-m-t-5"
					placeholder="请选择制作部门"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in refundList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>

				<i-date-picker
					v-model="search.create_time_start"
					clearable
					transfer
					type="date"
					placeholder="申请时间（起始）"
					style="width: 220px;"
					class="g-m-r-5"
					formate="yyyy-MM-dd"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="search.create_time_end"
					clearable
					transfer
					type="date"
					placeholder="申请时间（结束）"
					style="width: 220px;"
					class="g-m-r-5"
					formate="yyyy-MM-dd"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="search.audit_time_start"
					clearable
					transfer
					type="date"
					placeholder="审核时间（起始）"
					style="width: 220px;"
					class="g-m-r-5"
					formate="yyyy-MM-dd"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="search.audit_time_end"
					clearable
					transfer
					type="date"
					placeholder="审核时间（结束）"
					style="width: 220px;"
					class="g-m-r-5"
					formate="yyyy-MM-dd"
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option, Cascader } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import moment from "moment";
import { services } from "@stores/services/sc";

export default {
	name: "oa-filter",

	components: {
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [services.departAll({ autoLoad: false })],
	data() {
		const { query = {} } = this.$route;

		return {
			search: {
				search: String(query.search || ""), // 客户公司、姓名、手机号
				invite_param: String(query.staff_search || ""), // 邀约人姓名、手机号
				refund_type: String(query.refund_type || ""), // 退款类型 1 产品退款 2 换产品退款 3 余额退款
				create_time_start: String(query.create_time_start || ''), // 申请时间（起始）
				create_time_end: String(query.create_time_end || ''), // 申请时间（结束）
				audit_time_start: String(query.audit_time_start || ''), // 申请时间（起始）
				audit_time_end: String(query.audit_time_end || '') // 申请时间（结束）
			},
			show: false,
			departId: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [], // 组织部门id
			refundList: [
				{
					label: '产品退款',
					value: '1'
				},
				{
					label: '余额退款',
					value: '3'
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
		this.Button = Button;
	},
	mounted() {
		this.loadDepartAll();
	},
	methods: {
		handleSearch(event) {
			delete this.$route.query.refund_id;
			delete this.$route.query.jump;

			this.$router.replace(
				getHashUrl("/sc/customer/refund", {
					...this.$route.query,
					fixPosition: true,
					...this.search,
					depart_id: this.departId.length ? this.departId : null,
					create_time_start: this.search.create_time_start && moment(this.search.create_time_start).format("YYYY-MM-DD"),
					create_time_end: this.search.create_time_end && moment(this.search.create_time_end).format("YYYY-MM-DD"),
					audit_time_start: this.search.audit_time_start && moment(this.search.audit_time_start).format("YYYY-MM-DD"),
					audit_time_end: this.search.audit_time_end && moment(this.search.audit_time_end).format("YYYY-MM-DD")
				})
			);

			this.$store.commit("SC_CUSTOMER_REFUND_LIST_INIT");
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
			this.departId = selection;
			this.handleSearch();
		}
	}
};
</script>

<style lang="scss">
</style>