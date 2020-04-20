<template>
	<div class="v-hr-rank-info">
		<!-- header -->
		<i-form 
			ref="formValidate" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="114"
		>
			<div class="g-flex-ac">
				<i-form-item 
					label="级称体系名称:"
					prop="system_name"
				>
					<i-input 
						v-model="formValidate.system_name"
						:maxlength="10" 
						clearable
						style="width: 300px; margin-left: 0"
						placeholder="请输入级称体系名称，10字以内"
					/>
				</i-form-item>
				<i-form-item 
					style="margin-left: 70px"
					label="级称体系类型:"
					prop="type"
				>
					<i-radio-group v-model="formValidate.type">
						<i-radio :label="1">晋级体系</i-radio>
						<i-radio :label="2" style="marginLeft:24px">称号体系</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<div
				v-for="(item, index) in formValidate.periods"
				:key="index" 
				class="_item"
			>
				<div class="__title g-pd-lr-20">
					<span v-if="index === 0">{{ item.period_num }}(默认项，不可删除)</span>
					<span v-else>{{ item.period_num }}</span>
					<span 
						v-if="index > 0" 
						class="g-operation g-m-l-10"
						@click="handleRemoveLevel(item.sort_id)"
					>
						删除
					</span>
				</div>
				<div style="max-width: 1100px" class="g-m-t-20">
					<i-form-item 
						:prop="'periods.' + index + '.ranks'"
						:rules="ruleValidate.ranks" 
						required
						label="级称设置：">
						<oa-rank 
							v-model="item.ranks"
						/>
					</i-form-item>
					<i-form-item 
						:prop="'periods.' + index + '.ranges'"
						:rules="ruleValidate.ranges" 
						required
						class="g-m-t-20"
						label="适用范围："
					>
						<oa-range 
							v-model="item.ranges"
							:depart-id="$route.query.depart_id"
						/>
					</i-form-item>
					<i-form-item required label="评定周期：" class="g-c-black1 g-m-t-20 _cycle">
						<div class="g-flex-ac g-fw-w" style="line-height: 50px">
							<i-form-item>每 &nbsp;</i-form-item>
							<i-form-item 
								:prop="'periods.' + index + '.cycle_month'" 
								:rules="ruleValidate.cycle_month"
								class="g-m-b-20"
							>
								<i-select
									v-model="item.cycle_month" 
									style="width: 220px" 
									transfer
									clearable 
									placeholder="请选择周期"
								>
									<i-option 
										v-for="(item, index) in cycleData"
										:key="index"
										:value="item.value"
									>
										{{ item.label }}
									</i-option>
								</i-select>
							</i-form-item>
							<template>
								<i-form-item>&nbsp; 评定一次；评定基准期为 &nbsp;</i-form-item>
								<i-form-item 
									:prop="'periods.' + index + '.start_month'" 
									:rules="ruleValidate.start_month"
								>
									<i-select
										v-model="item.start_month" 
										style="width: 220px" 
										transfer
										clearable 
										placeholder="请选择开始月份"
									>
										<i-option 
											v-for="(item, index) in monthData"
											:key="index"
											:value="item.value"
										>
											{{ item.label }}
										</i-option>
									</i-select>
								</i-form-item>
							</template>
							<i-form-item>,&nbsp; 评定后 &nbsp;</i-form-item>
							<i-form-item 
								:prop="'periods.' + index + '.effect_type'" 
								:rules="ruleValidate.effect_type"
							> 
								<i-select 
									v-model="item.effect_type" 
									style="width: 220px" 
									transfer
									clearable 
									placeholder="请选择时间"
								>
									<i-option 
										v-for="(item, index) in effectCycle"
										:key="index"
										:value="item.value"
									>
										{{ item.label }}
									</i-option>
								</i-select>
							</i-form-item>
							<i-form-item>&nbsp; 生效，且有效期为 &nbsp;</i-form-item>
							<i-form-item 
								:prop="'periods.' + index + '.validity_type'" 
								:rules="ruleValidate.validity_type"
							> 
								<i-select 
									v-model="item.validity_type" 
									style="width: 220px" 
									clearable 
									transfer
									placeholder="请选择期限"
								>
									<i-option 
										v-for="(item, index) in usefulCycle"
										:key="index"
										:value="item.value"
									>
										{{ item.label }}
									</i-option>
								</i-select>
							</i-form-item>
						</div>
					</i-form-item>
					<i-form-item 
						:prop="'periods.' + index + '.has_subsidy'" 
						:rules="ruleValidate.has_subsidy"
						label="固定补贴保留："
					>
						<div class="g-flex">
							<i-radio-group v-model="item.has_subsidy">
								<i-radio :label="0">无</i-radio>
								<i-radio :label="1">有</i-radio>
								<!-- <i-radio v-else :label="1">保留至有效期结束</i-radio> -->
							</i-radio-group> 
							<div class="g-flex">
								<i-form-item 
									v-if="item.has_subsidy == 1" 
									:prop="'periods.' + index + '.subsidy_keep_month'" 
									:rules="ruleValidate.subsidy_keep_month"
								> 
									<span class="g-c-black">
										<i-input-number
											v-model="item.subsidy_keep_month" 
											:min="0"
											:max="99"
											style="width: 100px" 
										/> 个月
									</span>
								</i-form-item>
							</div>
							<span
							 
								class="g-c-black4 g-m-l-30 g-col _tip">当员工不属于该级称阶段范围内时，将会为其保留规定时间的当前级称固定补贴</span>
						</div>
					</i-form-item>
					<i-form-item 
						:prop="'periods.' + index + '.has_commission'" 
						:rules="ruleValidate.has_commission"
						class="g-m-t-10"
						label="业绩提成保留："
					>
						<div class="g-flex">
							<i-radio-group v-model="item.has_commission">
								<i-radio :label="0">无</i-radio>
								<i-radio :label="1">有</i-radio>
								<!-- <i-radio v-else :label="1">保留至有效期结束</i-radio> -->
							</i-radio-group> 
						
							<div class="g-flex">
								<i-form-item 
									v-if="item.has_commission == 1" 
									:prop="'periods.' + index + '.commission_keep_month'" 
									:rules="ruleValidate.commission_keep_month"
								> 
									<span class="g-c-black">
										<i-input-number
											v-model="item.commission_keep_month" 
											:min="0"
											:max="99"
											style="width: 100px" 
										/> 个月
									</span>
								</i-form-item>
							</div>
							<span 
							 
								class="g-c-black4 g-m-l-30 g-col _tip">当员工的级称不再为该阶段的级称时，将会为其保留规定时间的当前级称业绩提成</span >
						</div>
					</i-form-item>
				</div>
			</div>
		</i-form>

		<button 
			class="g-red-btn-line"
			style="marginTop: 15px;"
			@click="handleAddLevel"
		>
			新增阶段
		</button>

		<div style="height: 20px"/>

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
	DatePicker, Message
} from 'iview';
import { debounce } from 'lodash';
import API_ROOT from '@stores/apis/root';
import { cycleData, effectCycle, usefulCycle, monthData } from './constants';
import { DelTipModal } from '../_common/delete-tip';
import Rank from './form/rank';
import Range from './form/range';
import Item from './item';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		// 'oa-item': Item,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-date-picker': DatePicker,
		'oa-rank': Rank,
		'oa-range': Range,
	},
	data() {
		const validateEmpty = (rule, value, callback) => {
			if (!value || value.length === 0) {
				callback(new Error(rule.message));
			} else {
				callback();
			}
		};
		const validateName = (rule, value, callback) => {
			this.$request({
				url: API_ROOT['_HR_RANK_INFO_VALIDATE_NAME_GET'],
				type: "GET",
				param: {
					depart_id: this.$route.query.depart_id,
					system_name: value,
					rank_system_id: this.$route.query.rank_system_id,
				},
				loading: false
			}).then(res => {
				callback();
			}).catch(error => {
				callback(new Error(error.msg));
			});
		};

		return {
			cycleData,
			effectCycle,
			usefulCycle,
			monthData,
			formValidate: {
				type: 1,
				system_name: '',
				periods: [{ 
					sort_id: new Date().getTime(),
					ranks: [],
					ranges: [],
					cycle_month: '',
					start_month: '',
					effect_type: '',
					validity_type: '',
					has_subsidy: '',
					has_commission: '',
					subsidy_keep_month: null,
					commission_keep_month: null
				}]
			},
			ruleValidate: {
				system_name: [
					{ required: true, message: '请输入级称体系名称', trigger: 'blur' },
					{ validator: validateName, trigger: 'blur' }
				],
				ranks: [
					{ validator: validateEmpty, message: '请设置级称', trigger: 'change' }
				],
				ranges: [
					{ validator: validateEmpty, message: '请设置适用范围', trigger: 'change' }
				],
				cycle_month: [
					{ required: true, type: 'number', message: '请选择周期', trigger: 'change' }
				],
				start_month: [
					{ required: true, message: '请选择开始月份', trigger: 'change' }
				],
				effect_type: [
					{ required: true, type: 'number', message: '请选择生效时间', trigger: 'change' }
				],
				validity_type: [
					{ required: true, type: 'number', message: '请选择有效期', trigger: 'change' }
				],
				has_subsidy: [
					{ required: true, type: 'number', message: '请设置固定补贴保留', trigger: 'change' }
				],
				has_commission: [
					{ required: true, type: 'number', message: '请设置业绩提成保留', trigger: 'change' }
				],
				subsidy_keep_month: [
					{ required: true, type: 'number', message: '请设置保留时间', trigger: 'change' }
				],
				commission_keep_month: [
					{ required: true, type: 'number', message: '请设置保留时间', trigger: 'change' }
				],
			},
		};
	},
	created() {
		let systemId = this.$route.query.rank_system_id;
		systemId && this.$request({
			url: API_ROOT['_HR_RANK_INFO_GET'], // eslint-disable-line
			type: "POST",
			param: {
				rank_system_id: systemId
			}
		}).then((res) => {
			res.data.periods.forEach(v => {
				v.sort_id = Math.random();
			});
			this.formValidate = res.data;
		}).catch((error) => {
			this.$Message.error(error.msg);
		});
	},
	methods: {
		handleSave() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT['_HR_RANK_INFO_SAVE_POST'], // eslint-disable-line
						type: "POST",
						param: {
							depart_id: this.$route.query.depart_id,
							...this.formValidate
						}
					}).then((res) => {
						Message.success(res.msg);
						this.$router.back();
					}).catch((error) => {
						Message.error(error.msg);
					});
				}
			});
		},
		handleAddLevel() {
			this.formValidate.periods.push({ sort_id: new Date().getTime() });
		},
		handleRemoveLevel(sort_id) {
			this.formValidate.periods = this.formValidate.periods.filter((item) => item.sort_id != sort_id);
		},
		validateEmpty(rule, value, callback) {
			if (!value || value.length === 0) {
				callback(new Error(rule.message));
			} else {
				callback();
			}
		}
	},
};
</script>

<style lang="scss">
.v-hr-rank-info {
	padding: 20px 40px 60px 40px;
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	._item {
		.__title {
			height: 40px;
			line-height: 40px;
			background-color: #f0f4fd;
			color: #000000;
		}
		.ivu-form .ivu-form-item-label {
			color: #838695 !important;
		}
		.ivu-form-item {
			margin-bottom: 0px !important;
		}
		.ivu-radio-wrapper:first-child {
			margin-right: 35px;
		}
	}
	._cycle {
		.ivu-form-item {
			margin-bottom: 20px !important;
		}
	}
	._tip{
		padding-top:2px;
	}
}
</style>
