<template>
	<div class="v-rank-level-item">
		<div class="_title g-pd-lr-20">
			<span v-if="index === 0">第一阶段(默认项，不可删除)</span>
			<span v-else>第{{ index + 1 }}阶段</span>
			<span 
				v-if="index > 0" 
				class="g-operation g-m-l-10"
				@click="handleDel(formValidate.period_id)"
			>
				删除
			</span>
		</div>
		<div style="max-width: 1100px" class="g-m-tb-20">
			<i-form-item label="级称设置：" prop="ranks">
				<oa-rank 
					v-model="formValidate.ranks"
				/>
			</i-form-item>
			<i-form-item label="适用范围：" prop="ranges">
				<oa-range 
					v-model="formValidate.ranges"
					:depart-id="$route.query.depart_id"
				/>
			</i-form-item>
			<i-form-item label="评定周期：" class="g-c-black1">
				<div class="g-flex-ac g-fw-w" style="margin-top: -10px; line-height: 50px">
					每 &nbsp; 
					<i-form-item prop="cycle_month">
						<i-select
							v-model="formValidate.cycle_month" 
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
					&nbsp; 评定一次；评定基准期为 &nbsp; 
					<i-form-item prop="start_month">
						<i-select
							v-model="formValidate.start_month" 
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
					
					,&nbsp; 评定后 &nbsp;
					<i-form-item prop="effect_type"> 
						<i-select 
							v-model="formValidate.effect_type" 
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
					&nbsp; 生效，且有效期为 &nbsp;
					<i-form-item prop="validity_type"> 
						<i-select 
							v-model="formValidate.validity_type" 
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
			<i-form-item label="固定补贴保留：">
				<div class="g-flex-ac g-fw-w">
					<i-form-item prop="has_subsidy"> 
						<i-radio-group v-model="formValidate.has_subsidy">
							<i-radio label="0">无</i-radio>
							<i-radio label="1">有</i-radio>
						</i-radio-group> 
					</i-form-item>  
					
					<i-form-item 
						v-if="formValidate.has_subsidy == 1" 
						prop="subsidy_keep_month"
					> 
						<span class="g-c-black">
							<i-input-number
								v-model="formValidate.subsidy_keep_month" 
								style="width: 100px" 
							/> 个月
						</span>
					</i-form-item>
					<span class="g-c-black4 g-m-l-30">当员工不属于该级称阶段范围内时，将会为其保留规定时间的当前级称固定补贴</span>
				</div>
			</i-form-item>
			<i-form-item label="业绩提成保留：">
				<div class="g-flex-ac g-fw-w">
					<i-form-item prop="has_commission"> 
						<i-radio-group v-model="formValidate.has_commission">
							<i-radio label="0">无</i-radio>
							<i-radio label="1">有</i-radio>
						</i-radio-group> 
					</i-form-item>  

					<i-form-item 
						v-if="formValidate.has_commission == 1" 
						prop="commission_keep_month"
					> 
						<span class="g-c-black">
							<i-input-number
								v-model="formValidate.commission_keep_month" 
								style="width: 100px" 
							/> 个月
						</span>
					</i-form-item>
					<span class="g-c-black4 g-m-l-30">当员工的级称不再为该阶段的级称时，将会为其保留规定时间的当前级称业绩提成</span>
				</div>
			</i-form-item>
		</div>
	</div>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Button, RadioGroup, Radio, Select, Option,
	DatePicker, Message
} from 'iview';

import { cycleData, effectCycle, usefulCycle, monthData } from './constants';
import { DelTipModal } from '../_common/delete-tip';
import Rank from './form/rank';
import Range from './form/range';

export default {
	name: 'c-rank-level-item',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-date-picker': DatePicker,
		'oa-rank': Rank,
		'oa-range': Range,
	},
	props: {
		index: Number,
		info: {
			type: Object,
			default() {
				return {};
			}
		},
		ruleValidate: Object,
		onDel: Function
	},
	data() {
		let validateEmpty = (rule, value, callback) => {
			if (!value || value.length === 0) {
				callback(new Error(rule.message));
			} else {
				callback();
			}
		};
		return {
			cycleData,
			effectCycle,
			usefulCycle,
			monthData,
			formValidate: this.info
		};
	},
	methods: {
		handleValidate() {
			this.$refs.formValidate.validate((valid) => {
				
			});
		},
		handleDel(periodId) {
			this.onDel && this.onDel(periodId);
		}
	}
};
</script>

<style lang="scss">
.v-rank-level-item {
	._title {
		height: 40px;
		line-height: 40px;
		background-color: #f0f4fd;
		color: #000000;
	}
	.ivu-form .ivu-form-item-label {
		color: #838695 !important;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 50px;
	}
}
</style>
