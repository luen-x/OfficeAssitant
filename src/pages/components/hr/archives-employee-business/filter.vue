<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div class="g-lh-42">
				<i-input
					v-model="search.keyword"
					clearable
					placeholder="请输入员工姓名"
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-cascader
					:data="businessDepart"
					v-model="search.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"/>

				<i-date-picker
					v-model="search.month"
					type="month"
					clearable
					transfer
					placeholder="请选择月份"
					style="width: 220px;"
					@on-change="handleDateChange" />

				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>

			<div>
				<vc-debounce-click
					v-if="$auth[1102]"
					class="g-red-btn-line"
					@click="handleOutput">
					导出
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	mixins: [
		services.businessDepart(),
		services.allPosition()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				keyword: query.keyword ? query.keyword : '',
				month: query.month ? query.month : '',
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			positionList: [],
		};
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.search.month = val;
			this.handleSearch();
		},
		handleDepartChange(val) {
			this.search.depart_id = val;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/archives/employee/business',
				{
					...this.$route.query,
					...this.search
				}
			));
			// this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_CHANGE', {page: this.$route.query.page || 1});
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_INIT');
		}, 300),
		// 导出当前状态下的所有员工
		handleOutput() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_GET'], {
				...query,
				...this.search,
				export: 1,
				table_type: query.type ? query.type : '1',
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
