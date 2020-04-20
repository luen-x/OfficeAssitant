<template>
	<div class="v-content-reward-block-item-content g-flex g-c-black3 g-m-t-20 g-pd-b-20">
		<span style="width:120px" class="g-m-r-10 g-c-black4 g-m-l-20 g-tr">{{ title }}：</span>
		<div>
			<div class="g-m-b-20 g-flex-ac">
				<template v-if="checkType==1">
					<i-radio-group v-if="Array.isArray(conditionList)" v-model="check_list" class=" g-c-black3">
						<i-radio v-for="(item,index) in conditionList" :key="index" :label="Number(item.value)" >
							{{ item.label }}
						</i-radio>
					</i-radio-group>
					<i-radio v-else-if="conditionList" v-model="check_list" class="g-c-black3">{{ conditionList }}</i-radio>
				</template>
				<template v-else>
					<i-checkbox-group v-if="Array.isArray(conditionList)" v-model="check_list" >
						<i-checkbox
							v-for=" (item,index) in conditionList"
							:key="index"
							:label="Number(item.value)">
							<span class="g-c-black3">{{ item.label }}</span>
						</i-checkbox>
					</i-checkbox-group>
					<i-checkbox v-else-if="conditionList" v-model="check_list" >{{ conditionList }} </i-checkbox>
				</template>
				<slot :rules="rules" name="rule"/>
			</div>
			<div v-if="check_list&&(check_list>0||check_list[0]>0)">
				{{ msg }}<i-input-number :min="1" :max="100" v-model="rules.num"/>条，{{ type==1?'奖励':'扣除' }}<i-input-number
					:min="1"
					:max="100"
					v-model="rules.coins"/>个微币。
				<template v-if="limit" >
					<span style="color:#EBEEF1" class="g-m-lr-20">|</span>
					<i-checkbox v-model="rules.is_limit" :label="1" >获取微币上限 </i-checkbox>
					<template v-if="rules.is_limit">
						<i-select v-model="rules.limit.limit_type" style="width:220px" clearable>
							<i-option v-for="(item,index) in timeList" :key="index" :value="String(index+1)" >{{ item }}</i-option>
						</i-select>
						<i-input-number :min="1" :max="100" v-model="rules.limit.limit_num"/>个微币封顶
					</template>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { CheckboxGroup, Checkbox, InputNumber, Select, Option, Input, Radio, RadioGroup } from 'iview';

export default {
	components: {
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-input-number': InputNumber,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,

	},
	props: {
		dataSource: Array,
		scenes: {
			type: [String, Number],
			default: '1'
		},
		title: {
			type: String,
			default: '标题'
		},
		conditionList: {
			type: [String, Array],
			default: ''
		},
		checkType: {
			type: [String, Number],
			default: '1'// 1单选，2多选
		},
		policyType: {
			type: [String, Number],
			default: '1'// 1奖励，2惩罚
		},
		msg: {
			type: String,
			default: '每标记'
		},
		limit: {
			type: Boolean,
			default: true
		},
		timeList: {
			type: Array,
			default: () => {
				return ['每日', '每周', '每月'];
			}
		}

	},
	data() {
		return {
			scene: this.scenes,
			type: this.policyType,
			check_list: this.checkType == 2 ? [] : '',
			rules: {
				num: null,
				coins: null,
				is_limit: false,
				connect_time: null,
				zan: null,
				limit: {
					limit_type: '1',
					limit_num: null
				}
			}
		};
	},
	watch: {
		dataSource(newVal) {
			if (newVal) {
				const setting = newVal.find(ele => ele.scene == this.scene);
				if (setting) {
					this.check_list = setting.check_list.filter(ele => ele != null);
					if (this.check_list.length) {
						this.rules = setting.rules ? {
							 ...setting.rules,
							 num: Number(setting.rules.num),
							 coins: Number(setting.rules.coins),
							 limit: {
								limit_num: setting.rules.is_limit && setting.rules.limit.limit_num ? Number(setting.rules.limit.limit_num) : null,
								limit_type: (setting.rules.is_limit && setting.rules.limit.limit_type) || '1'
							}
						} : {
							num: null,
							coins: null,
							is_limit: false,
							limit: {
								limit_type: '1',
								limit_num: null
							} };
						this.rules.is_limit = !!this.rules.is_limit;
						if (this.scenes == 3) this.rules.connect_time = setting.rules.connect_time ? Number(setting.rules.connect_time) : null;
						if (this.scenes == 4) this.rules.zan = setting.rules.zan ? Number(setting.rules.zan) : null;
					}
				}
				this.check_list = this.checkType == 2 ? this.check_list : this.check_list[0];
			}
		}
	},
	mounted() {
		if (!this.scenes == 3)	delete this.rules.connect_time;
		if (!this.scenes == 4)	delete this.rules.zan;

	},
};
</script>

<style lang="scss">
.v-content-reward-block-item-content{
	border-bottom: 1px solid #EBEEF1;
}
</style>
