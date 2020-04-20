<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb g-ai-c g-lh-42">
			<div class="g-fw-w g-lh-42">
				<i-select
					ref="staff"
					v-model="query.staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择招聘人姓名"
					@on-change="handleChange"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-date-picker
					:value="query.create_month"
					:split-panels="true"
					clearable
					transfer
					type="daterange"
					class="g-m-r-5"
					style="width: 220px;"
					placeholder="选择录入时间范围"
					@on-change="handleDateChange($event, 'create_month')"
				/>
				<i-select
					v-model="query.depart_id"
					placeholder="请选择部门"
					clearable
					transfer
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item of stairArr"
						:key="item.depart_id"
						:value="item.depart_id">{{ item.depart_name }}</i-option>
				</i-select>
				<i-button type="primary" @click="handleSearch">搜索</i-button>
				<!-- <span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span> -->
			</div>
			<div>
				<div 
					v-if="$auth[1524]"
					class="g-red-btn-line" 
					style="margin-top: 2px;" 
					@click="handleAdd">添加</div>
				<div
					class="g-red-btn-line g-m-l-5"
					style="margin-top: 2px;"
					@click="handleOutput"
				>导出</div>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from "lodash";
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { createSearch } from "@stores/services/hr";
import { getParseUrl, getHashUrl, getItem } from "@utils/utils";
import { Input, Button, Cascader, Select, Option, DatePicker } from "iview";
import { AuditModal } from "../tabs/position-analyze/popup/add";

export default {
	name: "oa-filter",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-cascader": Cascader,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"vc-expand": Expand
	},
	mixins: [
		createSearch({ key: "staff" })
	],
	props: {
		type: {
			type: String,
			default: ""
		}
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...query,
				staff_id: Number(query.staff_id),
				search: query.search,
				depart_id: Number(query.depart_id),
				create_month: query.create_month_start
					? [query.create_month_start, query.create_month_end]
					: []
			},
			show: false,
			staffData: [],
			stairArr: [],
			staff: query.search || ""
		};
	},
	 mounted() {
		 this.loadStairDepart();
	},
	methods: {
		loadStairDepart() {
			return this.$request({
				url: 'HR_STAIR_DEPART_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.stairArr = res.data;
			}).catch(err => {});
		},
		handleQueryChange(query = "") {
			let targetQuery = this.query.search || "";
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleChange(staff) {
			this.query.staff_id = staff ? staff.value : "";
			this.query.search = staff ? staff.label : "";
			this.handleSearch();
		},
		// 日期改变
		handleDateChange(val, name) {
			if (name == "create_month" && val[0] == '') {
				delete this.query.create_month;
			}
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		// 搜索方法
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(
				getHashUrl("/hr/recruit/social/statistics", {
					...this.query,
					type: this.type,
				})
			);
			this.$store.commit("HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_INIT");
		}, 300),
		// 导出数据
		handleOutput: lodash.debounce(function () {
			const { query = {} } = this.$route;
			let url = getHashUrl(
				API_ROOT["HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_GET"],
				{
					// eslint-disable-line
					...query,
					is_export: 1,
					"-token": this.$global.token
				}
			);
			window.open(url);
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd() {
			AuditModal.popup({ title: "添加需求", action: 'add' }).then(res => {
				this.$store.commit("HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_INIT");
			}).catch(err => err && console.error(err.msg));
		}
	}
};
</script>

<style lang="scss" scoped>
</style>


