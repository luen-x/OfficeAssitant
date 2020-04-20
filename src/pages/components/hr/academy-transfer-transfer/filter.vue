<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.search"
					clearable
					placeholder="请输入姓名或手机号码"
					style="width: 300px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch"
				>
					搜索
				</i-button>
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

			<div>
				<vc-debounce-click
					v-if="$auth[928]"
					class="g-red-btn-line"
					@click="handleOutput">
					导出
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-cascader
					:data="departAll"
					v-model="search.try_depart_id"
					:change-on-select="true"
					placeholder="请选择试岗部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleSearch"/>

				<i-cascader
					v-model="search.position_id"
					:data="departPosition"
					clearable
					transfer
					filterable
					trigger="click"
					style="width: 220px;"
					class="g-m-r-5"
					placeholder="请选择应聘职位"
					@on-change="handleSearch"
				/>

				<i-date-picker
					v-model="try_start_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择试岗日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'try_start_time')" />

				<i-date-picker
					v-model="pass_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择试岗离开日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'pass_time')" />

				<i-date-picker
					v-model="entry_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择入职日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'entry_time')" />

				<i-date-picker
					v-model="leave_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择离职日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'leave_time')" />

				<i-date-picker
					v-model="train_start_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择培训开始日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'train_start_time')" />

				<i-date-picker
					v-model="train_end_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择培训结束日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'train_end_time')" />
			</div>
		</vc-expand>
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
		services.departAll(),
		services.departPosition()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				search: query.search ? query.search : '',
				position_id: query.position_id ? query.position_id.split(',').map((item) => Number(item)) : [],
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : []
			},
			show: false,
			// positionList: [],
			try_start_time: [query.try_start_time_start, query.try_start_time_end],
			pass_time: [query.pass_time_start, query.pass_time_end],
			entry_time: [query.entry_time_start, query.entry_time_end],
			leave_time: [query.leave_time_start, query.leave_time_end],
			train_start_time: [query.train_start_time_start, query.train_start_time_end],
			train_end_time: [query.train_end_time_start, query.train_end_time_end]
		};
	},
	mounted() {
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
			this.search[`${name}_start`] = val[0];
			this.search[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/transfer/transfer',
				{
					...this.search,
					fixPosition: true,
				}
			));
			this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 导出当前状态下的所有员工
		handleOutput() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_ACADEMY_TRANSFER_TRANSFER_LIST_GET'], {
				...query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
