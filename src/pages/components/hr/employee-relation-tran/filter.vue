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
					v-model="transfer_time"
					placeholder="请选择预计转岗时间/转岗时间"
					type="daterange"
					clearable
					transfer
					split-panels
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'transfer_time')"/>

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
import { staffByMutiTerm } from '@stores/services/hr';
import { Input, Button, Select, Option, DatePicker } from "iview";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import { PModal } from './popup/modal.vue';

export default {
	name: "oa-filter",
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
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
				status: Number(query.status),
			},
			show: false,
			transfer_time: [query.start_transfer_time, query.stop_transfer_time], // 转岗时间
			statusList: [
				{ label: '在职', value: 1 },
				{ label: '离职', value: 2 }
			]
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
			this.obj[`start_${name}`] = val[0];
			this.obj[`stop_${name}`] = val[1];
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(
				getHashUrl("/hr/employee/relation/tran", {
					...this.$route.query,
					...this.obj,
					fixPosition: true,
				})
			);
			this.$store.commit("HR_EMPLOYEE_RELATION_TRAN_LIST_INIT");
		}, 300),
		handleAdd() {
			PModal.popup({
				data: {
					action: 'add'
				}
			}).then(res => {
				this.$Message.success('操作成功');
				this.$router.replace(
					getHashUrl("/hr/employee/relation/tran", {
						...this.$route.query
					})
				);
				this.$store.commit("HR_EMPLOYEE_RELATION_TRAN_LIST_INIT");
			}).catch(() => {});
		},
		handleOutput() {
			let { query = {} } = getParseUrl();

			const url = getHashUrl(API_ROOT['HR_EMPLOYEE_RELATION_TRAN_LIST_GET'], {
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
