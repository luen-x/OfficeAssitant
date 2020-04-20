<template>
	<i-form 
		ref="form"
		:model="formdata"
		:rules="validator"
		class="v-hr-assess-integration-ruleform"
	>
		<div class="_title g-flex g-ai-c g-m-b-20">
			<span class="_dot" />
			<span class="g-m-l-10">展示信息</span>
		</div>
		<oa-integration-show 
			v-if="type === '1'" 
			:id="id"
			:formdata="formdata" />
		<oa-credit-show 
			v-else 
			:id="id"
			:formdata="formdata" />
		<div class="_title g-flex g-ai-c g-m-b-20">
			<span class="_dot" />
			<span class="g-m-l-10">前提条件</span>
		</div>
		<oa-integration-before 
			v-if="type === '1'" 
			:id="id" 
			:formdata="formdata" 
			@change="handleChange"
		/>
		<oa-credit-before 
			v-else 
			:id="id" 
			:formdata="formdata" 
		/>
		<div class="_title g-flex g-ai-c g-m-b-20">
			<span class="_dot" />
			<span class="g-m-l-10">得分条件</span>
		</div>
		<template v-if="type === '1'">
			<oa-integration-goal 
				v-for="(item, index) of formdata.rules"
				:key="item.rule_id"
				:id="id"
				:prop="`rules.${index}`"  
				:formdata="item"
				:system-id="system_id"
				class="g-m-b-10"
				@del="() => handleDel(index)"
			/>
		</template>
		<template v-else>
			<oa-credit-goal 
				v-for="(item, index) of formdata.rules"
				:key="item.rule_id"
				:id="id"
				:prop="`rules.${index}`" 
				:formdata="item"
				class="g-m-b-10"
				@del="() => handleDel(index)"
			/>
		</template>
		<span
			v-if="type === '2' && ['7', '9'].some(item => item === id)" 
			class="g-red-btn-line" 
			@click="handleAdd">添加</span>
		<span
			v-if="type === '1' && !['14', '15', '16', '17', '18'].some(item => item === id)" 
			class="g-red-btn-line" 
			@click="handleAdd">添加</span>				
	</i-form>
</template>

<script>
import { Form } from 'iview';
import IntegrationShow from '../integration-condition/show';
import IntegrationBefore from '../integration-condition/before';
import IntegrationGoal from '../integration-condition/goal';
import CreditShow from '../credit-condition/show';
import CreditBefore from '../credit-condition/before';
import CreditGoal from '../credit-condition/goal';
import CreditRules from '../credit-condition/rules';
import IntegrationRules from '../integration-condition/rules';

const integrationObj = {
	performance_rank_from: null,
	performance_rank_to: null,
	absence_time_from: null,
	absence_time_to: null,
	integral_rank_from: null,
	integral_rank_to: null,
	continue_times: null,
	apprentice_standing_month: null,
	apprentice_num_from: null,
	apprentice_num_to: null,
	position_year: null,
	average_integral_from: null,
	average_integral_to: null,
	performance_from: null,
	performance_to: 0,
	point: null,
	total_maximum: null,
	single_maximum: null,
};

const creditObj = {
	pass_percent: null,
	point: null,
	credit_rank_from: null,
	credit_rank_to: null
};

export default {
	name: 'v-hr-assess-integration-ruleform',
	components: {
		'i-form': Form,
		'oa-integration-show': IntegrationShow,
		'oa-integration-before': IntegrationBefore,
		'oa-integration-goal': IntegrationGoal,
		'oa-credit-show': CreditShow,
		'oa-credit-before': CreditBefore,
		'oa-credit-goal': CreditGoal,
	},
	mixins: [CreditRules, IntegrationRules],
	props: {
		id: String,
		type: String,
		info: Object
	},
	data() {
		const initialObj = this.type === '1' ? integrationObj : creditObj;
		return {
			formdata: {
				rules: [{ ...initialObj }],
				standing_from: null,
				standing_to: null,
				position_month: null,
				...this.info,
			},
			initialObj,
			validator: {},
			system_id: this.info.rank_system_type,
			rankArr: []
		};
	},
	mounted() {
	},
	methods: {
		handleAdd() {
			this.formdata.rules.push({ ...this.initialObj });
		},
		handleDel(index) {
			if (this.formdata.rules.length === 1) {
				this.$Message.error('至少有一项');
				return;
			}
			this.formdata.rules.splice(index, 1);
		},
		handleChange(val) {
			this.system_id = val;
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-assess-integration-ruleform {
	padding: 4px;
	
	& > ._title {
		font-size: 14px;

		._dot {
			display: inline-block;
			width: 2px;
			background: #E74854;
			height: 16px;
		}
	}
}
</style>


