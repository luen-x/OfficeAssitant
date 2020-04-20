<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="query.search"
				:maxlength="15"
				style="width: 300px;"
				clearable
				placeholder="请输入申请人姓名/手机"
				@on-enter="handleSearch"
				@on-change="handleInputChange"/>

			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch">
				搜索
			</i-button>

			<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark" />
			</span>
			<div class="g-fr" >
				<div class="g-red-btn-line" @click="handleAddBtn">新建申请</div>
			</div>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select
					v-model="query.event_type_id"
					placeholder="请选择事项类型"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in eventTypeList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
				<i-date-picker
					v-model="expected_completion_time"
					type="daterange"
					clearable
					transfer
					placeholder="请选择期待完成日期"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'expected_completion_time')"/>

				<i-date-picker
					v-model="create_time"
					type="daterange"
					clearable
					transfer
					placeholder="请选择申请日期"
					style="width: 220px"
					@on-change="handleDateChange($event, 'create_time')"/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, formatMoment } from "@utils/utils";
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { services as adminServices } from '@stores/services/administration';
import { AuditModal } from "../_common/application/audit";

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
		adminServices.eventTypeList()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				search: '',
				...query,
				event_type_id: Number(query.event_type_id),
			},
			show: false,
			positionList: [],
			expected_completion_time: [query.expected_completion_time_start, query.expected_completion_time_end],
			create_time: [query.create_time_start, query.create_time_end]
		};
	},
	mounted() {
	},
	methods: {
		handleAddBtn() {
			AuditModal.popup({ title: "新建申请", staffId: 0 }).then(res => {
				this.$router.replace(
					getHashUrl("/administration/application/mine", {
						...this.$route.query,
					})
				);
				this.$store.commit("ADMINISTRATION_APPLICATION_MINE_LIST_INIT");
			});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleSearch() {
			this.$router.replace(
				getHashUrl("/administration/application/mine", {
					...this.$route.query,
					...this.query,
					fixPosition: true,
				})
			);
			this.$store.commit("ADMINISTRATION_APPLICATION_MINE_LIST_INIT");
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
