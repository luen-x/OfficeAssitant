<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="obj.search"
					:maxlength="15"
					style="width: 300px;"
					clearable
					placeholder="请输入员工姓名/手机号"
					@on-enter="handleSearch"
					@on-change="handleInputChange"/>

				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch">
					搜索
				</i-button>

				<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
					更多搜索条件
					<i
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
						class="iconfont g-fs-12 g-c-black-dark" />
				</span>
			</div>
			<vc-debounce-click
				class="g-red-btn-line"
				@click="handleOutput">
				导出
			</vc-debounce-click>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-input
					v-model="obj.interview_name"
					:maxlength="10"
					style="width: 220px;"
					clearable
					class="g-m-r-5"
					placeholder="请输入面谈人"
					@on-enter="handleSearch"
					@on-change="handleInputChange"/>

				<i-cascader
					:data="departAll"
					v-model="obj.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"/>

				<i-select
					v-model="obj.position_id"
					placeholder="请选择职位"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select>

				<i-date-picker
					v-model="entry_date"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择入职日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'entry_date')"/>

				<i-date-picker
					v-model="regular_time"
					type="daterange"
					clearable
					transfer
					split-panels
					class="g-m-r-5"
					placeholder="请选择（预计/下次）转正日期"
					style="width: 220px"
					@on-change="handleDateChange($event, 'regular_time')"/>

				<i-select
					v-model="obj.status"
					placeholder="请选择离职情况"
					style="width: 220px"
					clearable
					transfer
					@on-change="handleSearch">
					<i-option
						v-for="item in statusList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from '@stores/services/hr';
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";

export default {
	name: "oa-filter",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		"vc-expand": Expand,
	},
	mixins: [
		services.departAll(),
		staffByMutiTerm
	],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				status: Number(query.status),
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			show: false,
			positionList: [],
			entry_date: [query.start_entry_date, query.stop_entry_date],
			regular_time: [query.start_regular_time, query.stop_regular_time],
			statusList: [
				{ label: '在职', value: 1 },
				{ label: '离职', value: 2 }
			]
		};
	},
	mounted() {
		if (this.obj.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				this.positionList = res.data.filter(item => item.depart_id === this.obj.depart_id[0])[0].positions;
			}).catch((error) => {});
		}
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 选中部门发生变化时
		handleDepartChange(value, selected) {
			this.handleSearch();

			if (value.length === 0) {
				this.obj.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.obj[`start_${name}`] = val[0];
			this.obj[`stop_${name}`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(
				getHashUrl("/hr/employee/relation/try", {
					...this.$route.query,
					...this.obj,
					fixPosition: true,
					depart_id: this.obj.depart_id.length ? this.obj.depart_id : null
				})
			);
			this.$store.commit("HR_EMPLOYEE_RELATION_TRY_LIST_INIT");
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleOutput() {
			let { query = {} } = getParseUrl();

			const url = getHashUrl(API_ROOT['HR_EMPLOYEE_RELATION_TRY_LIST_GET'], {
				...query,
				is_export: 1,
				type: query.type || '1',
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
