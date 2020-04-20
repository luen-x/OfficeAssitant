<template>
	<div>
		<div @keyup.enter="handleSearch">
			<i-input
				v-model="search"
				placeholder="请输入姓名/手机"
				style="width: 300px"
			/>
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
			<div class="g-m-t-10 g-bg-gray-mid g-pd-10">
				<i-cascader
					v-if="Array.isArray(departMy)"
					v-model="depart_id"
					:data="departMy"
					class="g-m-r-5"
					style="width: 220px; display: inline-block"
					clearable
					transfer
					change-on-select
					trigger="click"
					placeholder="请选择组织"
					@on-change="handleDepartChange"
				/>
				<i-select
					v-model="position_id"
					placeholder="请选择职位"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id"
					>{{ item.position_name }}</i-option>
				</i-select>
				<i-date-picker
					v-model="create_time_start"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择申请日期"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleDateChange"
				/>
				<i-date-picker
					v-model="audit_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择审核时间"
					style="width: 220px"
					class="g-m-r-5"
					@on-change="handleChangeAuditTime"
				/>
			</div>
		</vc-expand>
	</div>
</template>
<script>
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { Expand } from 'wya-vc';
import { services } from "@stores/services/sale";
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
		'vc-expand': Expand,
	},
	mixins: [
		services.departMy()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			positionList: [],
			search: String(query.search || ''),
			position_id: String(query.position_id || ''),
			create_time_start: '',
			audit_time: '',
			show: false,
			depart_id: (query.depart_id || '').split(',').map((item) => Number(item)),
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/config/material/role',
				{
					...this.$route.query,
					search: this.search,
					position_id: this.position_id,
					depart_id: this.depart_id,
					create_time_start: this.create_time_start[0],
					create_time_end: this.create_time_start[1],
					audit_time_start: this.audit_time[0],
					audit_time_end: this.audit_time[1],
					fixPosition: true,

				}
			));
			this.$store.commit('CONTENT_CONFIG_MATERIAL_ROLE_LIST_INIT');
		},
		handleDateChange(v) {
			this.create_time_start = v;
			this.handleSearch();
		},
		handleChangeAuditTime(v) {
			this.audit_time = v;
			this.handleSearch();
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleDepartChange(value, selected) {
			this.depart_id = value;
			if (value.length === 0) {
				this.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: '_HR_DEPART_POSITION_GET',
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
			this.handleSearch();
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
