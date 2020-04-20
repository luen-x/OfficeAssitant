<template>
	<div class="v-collage-refund-header js-filter">
		<div>
			<i-input
				v-model="search"
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
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="staff_search"
					clearable
					transfer
					placeholder="请输入邀约人姓名或手机号"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				
				<i-date-picker
					v-model="create_time_start"
					clearable
					transfer
					placeholder="申请时间(起始)"
					style="width: 220px;"
					formate="yyyy-MM-dd"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="create_time_end"
					clearable
					transfer
					placeholder="申请时间(结束)"
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
		"vc-expand": Expand,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader
	},

	mixins: [services.departAll({ autoLoad: false })],

	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ""), // 客户公司、姓名、手机号
			staff_search: String(query.staff_search || ""), // 邀约人姓名、手机号
			show: false,
			create_time_start: String(query.create_time_start || ""), // 申请开始时间
			create_time_end: String(query.create_time_end || ""), // 申请结束时间
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [] // 组织部门id
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
				getHashUrl("/collage/customer/refund", {
					...this.$route.query,
					fixPosition: true,
					search: this.search,
					staff_search: this.staff_search,
					depart_id: this.depart_id.length ? this.depart_id : null,
					create_time_start: this.create_time_start && moment(this.create_time_start).format("YYYY-MM-DD"),
					create_time_end: this.create_time_end && moment(this.create_time_end).format("YYYY-MM-DD"),
				})
			);
			
			this.$store.commit("COLLAGE_CUSTOMER_REFUND_LIST_INIT");
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
		}
	}
};
</script>

<style lang="scss" scoped>
</style>