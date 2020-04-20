<template>
	<div class="v-hr-rank-setting">
		<!-- title -->
		<div class="_title g-flex g-ai-c g-m-b-20">
			<span class="__left" />
			<span class="g-fs-16 g-c-red-dark">
				{{ $route.query.name }}
				<span class="g-fs-12 g-c-black2">{{ $route.query.type == 1 ? '晋级' : '称号' }}设置</span>
			</span>
		</div>
		<!-- content -->
		<i-form
			ref="formValidate"
			:model="formValidate"
			:label-width="120"
			:rules="ruleValidate"
		>
			<div
				v-for="(period, periodIndex) in formValidate.periods"
				:key="period.period_id"
				class="v-rank-setting-item"
			>
				<div class="_title g-pd-lr-20 g-flex g-jc-sb">
					<span>{{ period.period_num }}</span>
					<i-checkbox 
						v-model="period.critical_alert"
						:true-value="1"
						:false-value="0"
					>临界值提醒</i-checkbox>
				</div>
				<div
					v-for="(rank, rankIndex) in period.ranks"
					:key="rank.rank_id"
				>
					<i-form-item :label="rank.rank_name" class="g-pd-t-20 g-pd-lr-20 g-bb">
						<div class="g-flex g-jc-sb g-m-b-10 g-m-l-30">
							<p v-if="rank.rules.length === 0" class="g-c-black1" style="marginLeft:10px">
								{{ rank.level == 1 ? `暂无条件，到评定期后无“${$route.query.name}”的范围内员工，自动晋级该级别` : `暂无条件，到评定期后“${$route.query.name}”低于该级别一个级别的范围内员工，自动晋级该级别` }} <!-- eslint-disable-line -->
							</p>
							<div v-else class="g-flex g-fd-c g-col" style="paddingTop:10px;marginLeft:10px">
								<div
									v-for="(rule, index) in rank.rules"
									:key="index"
									class="g-m-b-10"
								>
									<oa-rule-title
										v-if="rule.rule_id == 1"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:index="index"
										:checked="!!period.critical_alert"
										:system-data="titleSelectData"
										:on-del="handleDel"
									/>
									<oa-rule-rise
										v-if="rule.rule_id == 2"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:index="index"
										:checked="!!period.critical_alert"
										:system-data="riseSelectData"
										:on-del="handleDel"
									/>
									<oa-rule-total
										v-if="rule.rule_id == 3"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-min
										v-if="rule.rule_id == 4"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-work-age
										v-if="rule.rule_id == 5"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-course
										v-if="rule.rule_id == 6"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-case
										v-if="rule.rule_id == 7"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-grade-num
										v-if="rule.rule_id == 8"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-grade-percent
										v-if="rule.rule_id == 9"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-complain
										v-if="rule.rule_id == 10"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-point
										v-if="rule.rule_id == 11"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
									<oa-rule-average-point
										v-if="rule.rule_id == 12"
										:rule="rule"
										:rule-validate="ruleValidate"
										:period-index="periodIndex"
										:rank-index="rankIndex"
										:checked="!!period.critical_alert"
										:index="index"
										:on-del="handleDel"
									/>
								</div>
							</div>
							<div
								class="g-gray-btn-line g-m-l-20"
								@click="handleAddRule(periodIndex, rankIndex, rank.rules.length)"
							>新增规则</div>
						</div>
					</i-form-item>
				</div>
			</div>
		</i-form>

		<!-- footer -->
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="$router.back()">取消</div>
			<vc-debounce-click class="g-red-btn-small" @click="handleSave">保存</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber,
	Button, RadioGroup, Radio, Select, Option,
	DatePicker, Message, Checkbox
} from 'iview';
import API_ROOT from '@stores/apis/root';
import { AddRulesModal } from './popup/add-rules';
import Item from './item';
// rules
import { Rules } from './rules/root';

export default {
	name: 'oa-rank-setting',
	components: {
		'oa-item': Item,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-date-picker': DatePicker,
		'i-checkbox': Checkbox,
		// rules
		'oa-rule-title': Rules.RuleTitle,
		'oa-rule-rise': Rules.RuleRise,
		'oa-rule-total': Rules.RuleTotal,
		'oa-rule-min': Rules.RuleMin,
		'oa-rule-work-age': Rules.RuleWorkAge,
		'oa-rule-course': Rules.RuleCourse,
		'oa-rule-case': Rules.RuleCase,
		'oa-rule-grade-num': Rules.RuleGradeNum,
		'oa-rule-grade-percent': Rules.RuleGradePercent,
		'oa-rule-complain': Rules.RuleComplain,
		'oa-rule-point': Rules.RulePoint,
		'oa-rule-average-point': Rules.RuleAveragePoint
	},
	data() {
		return {
			formValidate: {
				periods: []
			},
			checked: false,
			ruleValidate: {
				need_rank_system_id: [
					{ required: true, type: 'number', message: '请选择级称体系' }
				],
				need_rank_id: [
					{ required: true, type: 'number', message: '请选择级称名称' }
				],
				need_rank_times: [
					{ required: true, type: 'number', message: '请输入次数' }
				],
				accumulate_month: [
					{ required: true, type: 'number', message: '请选择时间段' }
				],
				total_performance: [
					{ required: true, type: 'number', message: '请输入金额' }
				],
				monthly_performance: [
					{ required: true, type: 'number', message: '请输入金额' }
				],
				position_id: [
					{ reuqired: true, type: 'number', message: '请选择职位' }
				],
				standing_month: [
					{ required: true, type: 'number', message: '请输入工龄' }
				],
				start_month: [
					{ required: true, message: '请选择开始月份' }
				],
				course: [
					{ required: true, type: 'number', message: '请输入开课次数' }
				],
				material_person_type: [
					{ reuqired: true, type: 'number', message: '请选择核算者' }
				],
				material_type: [
					{ reuqired: true, type: 'number', message: '请选择素材类型' }
				],
				case: [
					{ required: true, type: 'number', message: '请输入案例个数' }
				],
				client_score_type: [
					{ required: true, type: 'number', message: '请选择评分类型' }
				],
				client_score: [
					{ required: true, type: 'number', message: '请输入评分分数' }
				],
				evaluate_type: [
					{ required: true, type: 'number', message: '请选择评分类型' }
				],
				evaluate_value: [
					{ required: true, type: 'number', message: '请输入评分值' }
				],
				complaint_num: [
					{ required: true, type: 'number', message: '请输入投诉量' }
				],
				material_num: [
					{ required: true, type: 'number', message: '请输入数字' }
				],
				depart_monthly_performance: [
					{ required: true, type: 'number', message: '请输入金额' }
				],
				depart_average_performance: [
					{ required: true, type: 'number', message: '请输入金额' }
				],
				critical_num: [
					{ required: true, type: 'number', message: '请输入临界值' }
				]
			},
			titleSelectData: [],
			riseSelectData: [],
		};
	},
	created() {
		this.loadSetting();
		this.loadSelectData(1);
		this.loadSelectData(2);
	},
	methods: {
		loadSetting() {
			this.$request({
				url: API_ROOT['_HR_RANK_SETTING_GET'], // eslint-disable-line
				type: "GET",
				param: {
					rank_system_id: this.$route.query.rank_system_id
				}
			}).then((res) => {
				this.formValidate.periods = res.data;
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		loadSelectData(type) {
			this.$request({
				url: API_ROOT['_HR_SYSTEM_SELECT_DATA_GET'], // eslint-disable-line
				type: "GET",
				param: {
					depart_id: this.$route.query.depart_id,
					type
				}
			}).then((res) => {
				if (type == 1) {
					this.riseSelectData = res.data;
				} else {
					this.titleSelectData = res.data;
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleAddRule(periodIndex, rankIndex, length) {
			length < 10 && AddRulesModal.popup({
				disabled: this.$route.query.type == 1 ? ['2'] : ['1', '2']
			}).then((res) => {
				let rules = res.map((item) => {
					let obj = {
						rule_id: item,
						critical_num: null
					};
					switch (item) {
						case "1":
							obj = {
								...obj,
								need_rank_system_id: null,
								need_rank_id: null,
								need_rank_times: null
							};
							return obj;
						case "2":
							obj = {
								...obj,
								need_rank_system_id: null,
								need_rank_id: null,
							};
							return obj;
						case "3":
							obj = {
								...obj,
								accumulate_month: null,
								total_performance: null,
							};
							return obj;
						case "4":
							obj = {
								...obj,
								accumulate_month: null,
								monthly_performance: null,
							};
							return obj;
						case "5":
							obj = {
								...obj,
								standing_month: null,
							};
							return obj;
						case "6":
							obj = {
								...obj,
								accumulate_month: null,
								material_num: null,
							};
							return obj;
						case "7":
							obj = {
								...obj,
								accumulate_month: null,
								case: null,
							};
							return obj;
						case "8":
							obj = {
								...obj,
								accumulate_month: null,
								client_score_type: null,
								client_score: null,
								evaluate_type: null,
								evaluate_value: null,
							};
							return obj;
						case "9":
							obj = {
								...obj,
								accumulate_month: null,
								client_score_type: null,
								client_score: null,
								evaluate_type: null,
								evaluate_value: null,
							};
							return obj;
						case "10":
							obj = {
								...obj,
								accumulate_month: null,
								complaint_num: null,
							};
							return obj;
						case "11":
							obj = {
								...obj,
								depart_monthly_performance: null,
							};
							return obj;
						case "12":
							obj = {
								...obj,
								depart_average_performance: null,
							};
							return obj;
						default:
							return obj;
					}
				});

				this.formValidate.periods[periodIndex].ranks[rankIndex].rules.push(...rules);
			}).catch((res) => {

			});
		},
		handleDel(periodIndex, rankIndex, index) {
			this.formValidate.periods[periodIndex].ranks[rankIndex].rules.splice(index, 1);
		},
		handleSave() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT['_HR_RANK_SETTING_SAVE_POST'], // eslint-disable-line
						type: "POST",
						param: this.formValidate.periods
					}).then((res) => {
						this.$Message.success('保存成功');
						this.$router.back();
					}).catch((error) => {
						Message.error(error.msg);
					});
				}
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-rank-setting {
	padding: 20px 40px 60px 40px;
	._title {
		.__left {
			background: #e84854;
			width: 2px;
			height: 16px;
			display: inline-block;
			margin-right: 10px;
		}
	}
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
.v-rank-setting-item {
	._title {
		height: 40px;
		line-height: 40px;
		background-color: #f0f4fd;
		color: #000000;
	}
	._name-talbe {
		border: 1px solid #d9dde0;
		border-radius: 4px;
		margin-right: 140px;
		.__item {
			position: relative;
			height: 40px;
			line-height: 40px;
			.__options {
				position: absolute;
				top: 0;
				bottom: 0;
				right: -80px;
				margin: auto 0;
			}
		}
	}
	._rank-item {
		background-color: #e84c57;
		color: #ffffff;
		padding: 4px 6px;
		display: inline-block;
		border-radius: 4px;
		line-height: 1;
		font-size: 12px;
	}
	.ivu-form .ivu-form-item-label {
		color: #838695 !important;
		padding: 0px 12px 10px 0 !important;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 50px;
	}
}
</style>
