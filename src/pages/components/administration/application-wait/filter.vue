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
				<i-cascader
					:data="departAll"
					v-model="query.depart_id"
					:change-on-select="true"
					placeholder="请选择申请人部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"/>

				<i-select
					v-model="query.position_id"
					placeholder="请选择申请人职位"
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
import { services, staffByMutiTerm } from '@stores/services/hr';
import { services as adminServices } from '@stores/services/administration';
import { getParseUrl, getHashUrl, formatMoment } from "@utils/utils";
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
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
		services.departAll(),
		staffByMutiTerm,
		adminServices.eventTypeList()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				...query,
				search: query.search,
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [],
				event_type_id: Number(query.event_type_id),
				
			},
			show: false,
			positionList: [],
			expected_completion_time: [query.expected_completion_time_start, query.expected_completion_time_end],
			create_time: [query.create_time_start, query.create_time_end]
		};
	},
	mounted() {
		if (this.query.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				this.positionList = res.data.filter(item => item.depart_id === this.query.depart_id[0])[0].positions;
			}).catch((error) => {});
		}
	},
	methods: {
		handleAddBtn() {
			AuditModal.popup({ title: "新建申请", staffId: 0 }).then(res => {
				this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
			});
		},
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
				this.query.position_id = '';
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
			this.query[`${name}_start`] = val[0];
			this.query[`${name}_end`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(
				getHashUrl("/administration/application/wait", {
					...this.$route.query,
					...this.query,
					fixPosition: true,
					depart_id: this.query.depart_id.length ? this.query.depart_id : null
				})
			);
			this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
