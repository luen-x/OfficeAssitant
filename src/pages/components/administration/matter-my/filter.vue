<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="obj.search"
				:maxlength="15"
				style="width: 300px;"
				clearable
				placeholder="请输入申请人姓名/手机号"
				@on-enter="handleSearch"
				@on-change="handleInputChange"/>
			<i-button
				type="primary"
				class="g-m-l-5"
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
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">

				<i-select
					v-model="obj.is_all"
					placeholder="请选择事项归属"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch">
					<i-option
						v-for="item in isAllList"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.event_type_id"
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
					v-model="obj.depart_id"
					:change-on-select="true"
					placeholder="请选择申请人部门"
					trigger="click"
					clearable
					transfer
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleDepartChange"/>

				<i-select
					v-model="obj.position_id"
					transfer
					clearable
					placeholder="请选择申请人职位"
					style="width: 220px;"
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
					type="datetimerange"
					transfer
					clearable
					split-panels
					placeholder="请选择期待完成日期"
					style="width: 220px; "
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'expected_completion_time')"/>

				<i-date-picker
					v-model="create_time"
					type="daterange"
					transfer
					clearable
					split-panels
					placeholder="请选择申请时间"
					style="width: 220px; "
					@on-change="handleDateChange($event, 'create_time')"/>

			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/administration';
import { Input, Button, Select, Option, DatePicker, Cascader } from 'iview';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		'vc-expand': Expand,
	},
	mixins: [
		services.departAll(),
		services.eventTypeList()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				event_type_id: Number(query.event_type_id),
				is_all: Number(query.is_all),
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			show: false,
			isAllList: [
				{ label: '我的事项', value: 0 },
				{ label: '全部事项', value: 1 }
			],
			positionList: [],
			expected_completion_time: [query.expected_completion_time_start, query.expected_completion_time_end],
			create_time: [query.create_time_start, query.create_time_end],
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
		handleSearch: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/administration/matter/my',
				{
					...query,
					...this.obj,
					fixPosition: true,
					depart_id: this.obj.depart_id.length ? this.obj.depart_id : null,
				}
			));
			this.$store.commit('ADMINISTRATION_MATTER_MY_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 时间改变
		handleDateChange(val, name) {
			this.obj[`${name}_start`] = val[0];
			this.obj[`${name}_end`] = val[1];
			this.handleSearch();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
