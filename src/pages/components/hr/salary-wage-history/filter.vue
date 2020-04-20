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
			<vc-debounce-click
				class="g-red-btn-line"
				@click="handleSelectTitle">
				选择表头
			</vc-debounce-click>
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
					v-model="obj.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					clearable
					transfer
					trigger="click"
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleChange"/>

				<i-select
					v-model="obj.position_id"
					placeholder="请选择职位"
					clearable
					transfer
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

				<i-select
					v-model="obj.basic_salary_id"
					clearable
					transfer
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择调整后底薪制度"
					@on-change="handleSearch">
					<i-option
						v-for="(item, index) in baseSalaryList"
						:key="index"
						:value="item.basic_salary_id"
					>
						{{ item.name }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.rate_case_id"
					clearable
					transfer
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择调整后提成制度"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in rateCaseList"
						:key="index"
						:value="item.rate_case_id"
					>
						{{ item.name }}
					</i-option>
				</i-select>

				<i-select
					v-model="obj.t_rate_case_id"
					clearable
					transfer
					style="width:220px"
					class="g-m-r-5"
					placeholder="请选择调整后团队提成"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in teamList"
						:key="index"
						:value="item.t_rate_case_id"
					>
						{{ item.name }}
					</i-option>
				</i-select>

				<i-date-picker
					v-model="adjust_time"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择调整时间"
					style="width: 220px;"
					@on-change="handleDateChange($event)" />

			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { services, staffByMutiTerm } from '@stores/services/hr';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Button, Cascader, DatePicker, Input, Select, Option } from 'iview';
import { TableTitle } from '../../_common/table-title/table-title';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				position_id: Number(query.position_id),
				rate_case_id: Number(query.rate_case_id),
				t_rate_case_id: Number(query.t_rate_case_id),
				basic_salary_id: Number(query.basic_salary_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			show: false,
			positionList: [],
			baseSalaryList: [],
			rateCaseList: [],
			teamList: [],
			adjust_time: [query.start_time, query.stop_time],
		};
	},
	created() {
		if (this.obj.depart_id.length) {
			this.loadPositionList(this.obj.depart_id);
			this.loadBasicSalaryList();
			this.loadRateCaseList();
			this.loadTeamList();
		}
	},
	methods: {
		// 加载职位下拉列表
		loadPositionList(arr) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				arr.length
					? this.positionList = res.data.filter(item => item.depart_id === arr[0])[0].positions
					: '';
			}).catch((error) => {});
		},
		// 加载底薪下拉列表
		loadBasicSalaryList() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DETAILS_BASIC_SALARY_GET',
				type: 'GET',
				param: {
					depart_id: this.obj.depart_id
				},
				loading: false
			}).then((res) => {
				this.baseSalaryList = res.data;
			}).catch((error) => {});
		},
		// 加载提成下拉列表
		loadRateCaseList() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET',
				type: 'GET',
				param: {
					depart_id: this.obj.depart_id
				},
				loading: false
			}).then((res) => {
				this.rateCaseList = res.data;
			}).catch((error) => {});
		},
		// 加载团队提成下拉列表
		loadTeamList() {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET',
				type: 'GET',
				param: {
					depart_id: this.obj.depart_id,
					type: 2
				},
				loading: false
			}).then((res) => {
				this.teamList = res.data;
			}).catch((error) => {});
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		// 选中部门发生变化时
		handleChange(value, selected) {
			this.obj.depart_id = value;
			this.handleSearch();

			if (value.length === 0) {
				this.obj.position_id = '';
				this.positionList = [];
				this.obj.basic_salary_id = '';
				this.baseSalaryList = [];
				this.obj.rate_case_id = '';
				this.rateCaseList = [];
				this.obj.t_rate_case_id = '';
				this.teamList = [];
			} else {
				this.loadPositionList(value);
				this.loadBasicSalaryList();
				this.loadRateCaseList();
				this.loadTeamList();
			}
		},
		handleDateChange(val) {
			this.obj.start_time = val[0];
			this.obj.stop_time = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/salary/wage/history',
				{
					...this.obj,
					depart_id: this.obj.depart_id.length ? this.obj.depart_id : null,
				}
			));
			this.$store.commit('HR_SALARY_WAGE_HISTORY_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.hrSalaryWageHistory.title;
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_HR_RECRUIT_CONFIG_SAVE_POST',
				mutation: 'HR_SALARY_WAGE_HISTORY_TITLE_CHANGE',
				type: '2',
				scenario: 8
			}).then(() => {
				this.$vc.emit('hr-salary-wage-history-title-change');
				this.$store.commit("HR_SALARY_WAGE_HISTORY_LIST_INIT");
			}).catch(err => {
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
