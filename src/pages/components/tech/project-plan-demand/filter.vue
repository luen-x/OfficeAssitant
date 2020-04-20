<template>
	<div class="v-tech-project-plan-demand-filter js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model.trim="keywords.search" 
					clearable
					placeholder="请输入需求点/所属板块/所属经理搜索" 
					style="width:300px;height:32px;" 
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-button
					type="primary"
					class="g-m-r-5"
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
			<div v-if="$auth[1416]">
				<i-button class="g-m-r-5 _btn" @click="handleAdd">新增规划</i-button>
				<i-select
					ref="my-select"
					clearable
					transfer
					placeholder="更多功能"
					class="_more"
					style="width: 90px;"
					@on-change="handleMoreChange"
				>
					<i-option value="1">导入</i-option>
				</i-select>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-date-picker
					v-model="keywords.online_time"
					format="yyyy-MM-dd"
					type="daterange"
					clearable
					split-panels
					placeholder="请选择预计上线时间"
					class="g-m-r-5"
					style="width: 250px;"
					@on-change="handleOnlineDateChange"
				/>
				<i-date-picker
					v-model="keywords.create_time"
					format="yyyy-MM-dd"
					type="daterange"
					clearable
					split-panels
					placeholder="请选择发布时间"
					class="g-m-r-5"
					style="width: 250px;"
					@on-change="handleCreateDateChange"
				/>
				<i-select
					v-model="keywords.rate_id"
					clearable
					transfer
					placeholder="请选择需求进度"
					class="g-m-r-5"
					style="width: 220px;"
					@on-change="handleSearch"
				>
					<i-option 
						v-for="(item, index) in rateList[project_id]" 
						:key="index" 
						:value="item.rate_id"
					>{{ item.rate_name }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import moment from "moment";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { setTimeout } from 'timers';
import { ProjectPlanImport } from './popup/import';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
	},
	data() {
		const { query = {} } = this.$route;
		const _query = { ...query };
		delete _query.project_id;
		const project_id = query.project_id && +query.project_id;
		const rateList = {};
		if (project_id) {
			rateList[project_id] = [];
		}
		return {
			show: false,
			project_id,
			rateList,
			keywords: {
				search: '', // 功能点、所属板块、提出人
				online_time_start: '', // 上线开始时间
				online_time_end: '', // 上线结束时间
				create_time_start: '', // 发布开始时间
				create_time_end: '', // 发布结束时间
				..._query,
				rate_id: _query.rate_id && +_query.rate_id, // 需求进度
				online_time: [query.online_time_start, query.online_time_end], // 预计上线时间
				create_time: [query.create_time_start, query.create_time_end], // 发布时间
			}
		};
	},
	mounted() {
		this.$vc.on("TECH_PROJECT_PLAN_DEMAND_PROJECT_CHANGE", ({ project_id }) => {
			this.project_id = project_id;
			this.loadRateList();
		});
		this.$vc.on("TECH_PROJECT_PLAN_DEMAND_PROJECT_LOAD", ({ tabs }) => {
			this.project_id = tabs[0].project_id;
			tabs.forEach(tab => {
				if (!this.rateList[tab.project_id])	{
					this.$set(this.rateList, tab.project_id, []);
				}
			});
			this.loadRateList();
		});
	},
	beforeDestroy() {
		this.$vc.off("TECH_PROJECT_PLAN_DEMAND_PROJECT_CHANGE");
		this.$vc.off("TECH_PROJECT_PLAN_DEMAND_PROJECT_LOAD");
	},
	methods: {
		loadRateList() {
			if (this.rateList[this.project_id].length) return; 
			this.$request({
				url: '_TECH_PROJECT_NEED_RATE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					project_id: this.project_id,
					type: 2
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data) && res.data.length) {
					this.rateList[this.project_id] = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 预计上线时间
		 */
		handleOnlineDateChange(arr) {
			this.keywords.online_time_start = arr[0];
			this.keywords.online_time_end = arr[1];
			this.handleSearch();
		},
		/**
		 * 发布时间
		 */
		handleCreateDateChange(arr) {
			this.keywords.create_time_start = arr[0];
			this.keywords.create_time_end = arr[1];
			this.handleSearch();
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			let { query = {} } = getParseUrl();
			this.$router.replace(getHashUrl(
				'/tech/project/plan/demand',
				{
					...query,
					...this.keywords,
					online_time: undefined,
					create_time: undefined
				}
			));
			this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		/**
		 * 新增需求
		 */
		handleAdd() {
			this.$router.push({
				name: 'tech-project-plan-demand-add',
				query: {
					title: '新增需求'
				}
			});
		},
		handleMoreChange(val) {
			let { query = {} } = getParseUrl();
			if (val === '1') {
				ProjectPlanImport.popup().then(({ project_id }) => {
					this.$router.replace(getHashUrl(
						'/tech/project/plan/demand',
						{
							...query,
							project_id
						}
					));
					this.$store.commit('TECH_PROJECT_PLAN_DEMAND_LIST_INIT');
				}).catch(error => {
					error && console.error(error);
				});
				this.$refs["my-select"].clearSingleSelect();
			}
		}
	}
};

</script>

<style lang="scss">
.v-tech-project-plan-demand-filter {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
	._more {
		.ivu-select-selection {
			border-color: #e84854;
			color: #e84854;
		}
		.ivu-select-placeholder {
			color: #e84854!important;
		}
		.ivu-icon-ios-arrow-down:before {
			color: #e84854!important;
		}
	}
}
</style>
