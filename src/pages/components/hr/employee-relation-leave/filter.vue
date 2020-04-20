<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
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

			<div>
				<vc-debounce-click
					v-if="$auth[224]"
					class="g-red-btn-line g-m-r-5"
					@click="handleAdd">
					新增
				</vc-debounce-click>
				<vc-debounce-click
					class="g-red-btn-line"
					@click="handleOutput">
					导出
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">

				<i-date-picker
					v-model="leaver_time"
					placeholder="请选择预计离职时间/离职时间"
					type="daterange"
					clearable
					transfer
					split-panels
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'leaver_time')"/>

				<i-date-picker
					v-model="entry_date"
					placeholder="请选择入职日期"
					type="daterange"
					clearable
					transfer
					split-panels
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'entry_date')"/>

				<i-date-picker
					v-model="regular_time"
					placeholder="请选择转正日期"
					type="daterange"
					clearable
					transfer
					split-panels
					style="width: 220px;"
					@on-change="handleDateChange($event, 'regular_time')"/>

			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import API_ROOT from "@stores/apis/root";
import { Expand } from "wya-vc";
import { staffByMutiTerm } from '@stores/services/hr';
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { PModal } from './popup/modal.vue';

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
		staffByMutiTerm
	],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				depart_id: []
			},
			show: false,
			leaver_time: [query.start_leaver_time, query.stop_leaver_time],
			entry_date: [query.start_entry_date, query.stop_entry_date],
			regular_time: [query.start_regular_time, query.stop_regular_time],
		};
	},
	// computed: {
	// 	msg() {
	// 		return this.$store.state.hrEmployeeRelationLeave.msg;
	// 	}
	// },
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.obj[`start_${name}`] = val[0];
			this.obj[`stop_${name}`] = val[1];
			this.handleSearch();
		},
		handleAdd() {
			PModal.popup({
				data: {
					action: 'add'
				}
			}).then(res => {
				this.$Message.success('操作成功');
				this.$router.replace(getHashUrl(
					'/hr/employee/relation/leave',
					{ ...this.$route.query }
				));
				this.$store.commit('HR_EMPLOYEE_RELATION_LEAVE_LIST_INIT');
			}).catch(() => {});
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/employee/relation/leave',
				{
					...this.$route.query,
					...this.obj,
					fixPosition: true,
				}
			));
			this.$store.commit('HR_EMPLOYEE_RELATION_LEAVE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleOutput() {
			let { query = {} } = getParseUrl();

			const url = getHashUrl(API_ROOT['HR_EMPLOYEE_RELATION_LEAVE_LIST_GET'], {
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
