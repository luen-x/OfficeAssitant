<template>
	<div class="v-hr-personnel-member-member-staff-filter">
		<i-input
			v-model="query.search" 
			clearable
			placeholder="请输入姓名/手机/工号" 
			style="width: 220px" 
			class="g-m-r-5"
			@on-change="handleSearch"
		/>
		<i-cascader 
			v-model="query.depart_id" 
			:data="departArr" 
			:change-on-select="true" 
			class="g-m-r-5"
			style="width: 220px;display:inline-block" 
			clearable 
			transfer 
			trigger="click" 
			placeholder="请选择部门" 
			@on-change="handleDepartChange"
		/>
		
		<i-button 
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
			更多搜索条件
			<i
				:class="show ? 'icon-triangle-up' : 'icon-triangle-down'"
				class="iconfont g-fs-12 g-c-black-dark"
			/>
		</span>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="query.condition"
					clearable
					transfer
					style="width: 220px;display:inline-block;height:32px" 
					placeholder="请选择筛选条件"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in conditionArr"
						:key="item.value"
						:value="String(item.value)"
					>{{ item.label }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>	
</template>

<script>
import { Input, Button, Select, Option, Cascader } from 'iview';
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/hr";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl, getItem, initTreeData } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"vc-expand": Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			conditionArr: [
				{
					value: '1',
					label: '只看师傅'
				},
				{
					value: '2',
					label: '只看管理'
				}
			],
			departArr: [],
			show: false,
			query: {
				search: String(query.search || ''),
				condition: String(query.condition || ''),
				depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : [],
			},
		};
	},
	mounted() {
		this.loadDepart(this.$global.staff.depart_id);
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/personnel/member/staff', 
				{ 
					...this.$route.query, 
					...this.query,
				}
			));
			this.$store.commit('HR_PERSONNEL_MEMBER_MEMBER_STAFF_LIST_INIT');
		},
		handleDepartChange(value, selected) {
			this.query.depart_id = value;
			this.handleSearch();
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		loadDepart(depart_id) {
			this.$request({
				url: "_HR_EMPLOYEE_CI_DEPART_SON_GET",
				type: "GET",
				param: {
					depart_id
				},
				loading: false
			}).then(res => {
				this.departArr = initTreeData(
					res.data,
					"depart_id",
					"depart_name"
				);
			}).catch(err => {});
		},
	}
};

</script>

<style lang="scss">
.v-hr-personnel-member-member-staff-filter{
	.ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-selected-value{
		line-height: 32px !important;
		height: 32px !important;
	}
}

</style>