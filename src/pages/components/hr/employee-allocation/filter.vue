<template>
	<div class="g-fw-w g-lh-42 js-filter">
		<i-input
			v-model="obj.search"
			placeholder="请输入姓名/手机号"
			clearable
			style="width: 220px"
			class="g-m-r-5"
			@on-enter="handleSearch"
			@on-change="handleInputChange" />
		<i-input
			v-model="obj.college"
			placeholder="请输入学校名称"
			clearable
			style="width: 220px"
			class="g-m-r-5"
			@on-enter="handleSearch"
			@on-change="handleInputChange" />
		<i-cascader
			:data="departAll"
			v-model="obj.try_depart_id"
			:change-on-select="true"
			transfer
			clearable
			placeholder="请选择试岗部门"
			trigger="click"
			style="width: 220px;display: inline-block"
			class="g-m-r-5"
			@on-change="handleSearch" />

		<i-select
			v-model="obj.sex"
			transfer
			clearable
			placeholder="请选择性别"
			style="width: 220px;"
			class="g-m-r-5"
			@on-change="handleSearch">
			<i-option
				v-for="item in sexList"
				:key="item.value"
				:value="item.value">
				{{ item.label }}
			</i-option>
		</i-select>

		<i-date-picker
			v-model="reply_time"
			type="daterange"
			transfer
			clearable
			placeholder="请选择回复报到时间"
			style="width: 220px; "
			@on-change="handleDateChange($event, 'reply_time')"/>

		<i-button
			type="primary"
			class="g-m-l-5"
			@click="handleSearch"
		>
			搜索
		</i-button>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, DatePicker, Cascader } from "iview";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr';

export default {
	name: 'oa-filter',
	components: {
		"i-input": Input,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-cascader": Cascader,
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				sex: Number(query.sex),
				try_depart_id: query.try_depart_id ? query.try_depart_id.split(',').map((item) => Number(item)) : []
			},
			reply_time: [query.reply_time_start, query.reply_time_end],
			sexList: [
				{ label: '男', value: 0 },
				{ label: '女', value: 1 }
			]
		};
	},
	methods: {
		handleSearch: lodash.debounce(function (event) {
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/hr/employee/allocation',
				{
					...this.obj,
					type: query.type,
					try_depart_id: this.obj.try_depart_id.length ? this.obj.try_depart_id : null,
				}
			));
			this.$store.commit('HR_RECRUIT_SCHOOL_WAR_LIST_INIT');
		}, 300),
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
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
