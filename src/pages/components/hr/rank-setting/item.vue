<template>
	<div class="v-rank-setting-item">
		<div class="_title g-pd-lr-20">
			第一阶段
		</div>
		<i-form 
			ref="formValidate" 
			:label-width="114" 
			:model="formValidate"
			:rules="ruleValidate" 
			style="max-width: 1100px"
		>
			<i-form-item label="xxxxxx" class="g-pd-t-20 g-pd-lr-20 g-bb">
				<div class="g-flex-ac g-jc-sb g-m-b-10">
					<p class="g-c-black1">在哪儿退傲娇爱你</p>
					<div 
						class="g-gray-btn-line" 
						style="line-height: 1"
						@click="handleAddRule"
					>新增规则</div>
				</div>
			</i-form-item>
			<i-form-item label="xxxxxx" class="g-pd-t-20 g-pd-lr-20 g-bb">
				<div class="g-flex-ac">
					xx
				</div>
			</i-form-item>
		</i-form>
	</div>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Button, RadioGroup, Radio, Select, Option,
	DatePicker, Message
} from 'iview';
// import { cycleData, effectCycle, usefulCycle } from './constants';
import { AddRulesModal } from './popup/add-rules';
// import { DelTipModal } from '../_common/delete-tip';

export default {
	name: 'c-rank-setting-item',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-date-picker': DatePicker
	},
	props: {
		ranks: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			rules: []
		};
	},
	methods: {
		handleShowAddName(type, id) {
			
		},
		handleDelName(id) {
			
		},
		handleAddRank() {

		},
		handleClose() {

		},
		handleAddRule() {
			AddRulesModal.popup({

			}).then((res) => {
				this.rules = res;
			}).catch((res) => {

			});
		}
	}
};
</script>

<style lang="scss">
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
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 50px;
	}
}
</style>
