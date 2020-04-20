<template>
	<div class="v-integration-condition-goal">
		<template v-if="id === '1'">
			业绩排名在
			<i-formitem :rules="validator.performance_rank_from" :prop="`${prop}.performance_rank_from`">
				<i-input-number
					v-model="rules.performance_rank_from"
					:max="9999"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			名到
			<i-formitem :rules="validator.performance_rank_to" :prop="`${prop}.performance_rank_to`">
				<i-input-number
					v-model="rules.performance_rank_to"
					:max="9999"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			名时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:max="99"
					:min="-99"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '2'">
			业绩排名在
			<i-formitem :rules="validator.performance_rank_from" :prop="`${prop}.performance_rank_from`">
				<i-input-number
					v-model="rules.performance_rank_from"
					:max="9999"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			名到
			<i-formitem :rules="validator.performance_rank_to" :prop="`${prop}.performance_rank_to`">
				<i-input-number
					v-model="rules.performance_rank_to"
					:max="9999"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			名时连续达到
			<i-formitem :rules="validator.continue_times" :prop="`${prop}.continue_times`">
				<i-input-number
					v-model="rules.continue_times"
					:max="99"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			次及以上时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:max="99"
					:min="-99"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>			
		</template>
		<template v-else-if="id === '3'">
			<i-formitem :rules="validator.performance_from" :prop="`${prop}.performance_from`">
				<i-input-number
					v-model="rules.performance_from"
					:min="0"
					:max="99999999"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			≤ 业绩金额 &lt;
			<i-formitem :rules="validator.performance_to" :prop="`${prop}.performance_to`">
				<oa-input-number
					v-model="rules.performance_to"
					:min="0"
					:max="99999999"
					:disabled="disabled"
					style="width: 220px"
					placeholder="输入数字"
				/>
			</i-formitem>
			元时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:max="99"
					:min="-99"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '4'">
			积分排名在
			<i-formitem :rules="validator.integral_rank_from" :prop="`${prop}.integral_rank_from`">
				<i-input-number
					v-model="rules.integral_rank_from"
					:max="99999"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			名到
			<i-formitem :rules="validator.integral_rank_to" :prop="`${prop}.integral_rank_to`">
				<i-input-number
					v-model="rules.integral_rank_to"
					:max="99999"
					:min="0"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			名时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:max="99"
					:min="-99"
					:disabled="disabled"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '5'">
			员工达到
			<i-formitem :rules="!disabled ? validator.rank_id : {}" :prop="`${prop}.rank_id`">
				<i-select
					v-model="rules.rank_id"
					:disabled="disabled"
					placeholder="选择级称"
					transfer
					style="width: 220px;"
				>
					<i-option 
						v-for="item of rankArr"
						:key="item.rank_id"
						:value="item.rank_id"
					>
						{{ item.rank_name }}
					</i-option>
				</i-select>
			</i-formitem>
			时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '6'">
			员工达到
			<i-formitem :rules="!disabled ? validator.position_id : {}" :prop="`${prop}.position_id`">
				<i-select
					v-model="rules.position_id"
					:disabled="disabled"
					placeholder="选择职位"
					transfer
					style="width: 220px;"
				>
					<i-option 
						v-for="item of positionArr"
						:key="item.position_id"
						:value="item.position_id">{{ item.position_name }}</i-option>
				</i-select>
			</i-formitem>
			时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '7'">
			员工达到
			<i-formitem :rules="!disabled ? validator.target_type : {}" :prop="`${prop}.target_type`">
				<i-select
					v-model="rules.target_type"
					:disabled="disabled"
					placeholder="业绩目标"
					transfer
					style="width: 220px;"
				>
					<i-option :value="1">未达到目标</i-option>
					<i-option :value="2">保底目标</i-option>
					<i-option :value="3">平衡目标</i-option>
					<i-option :value="4">冲刺目标</i-option>
				</i-select>
			</i-formitem>
			时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '8'">
			拥有的徒弟工龄达到
			<i-formitem :rules="validator.apprentice_standing_month" :prop="`${prop}.apprentice_standing_month`">
				<i-input-number
					v-model="rules.apprentice_standing_month"
					:disabled="disabled"
					:max="9999"
					:min="0"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			月时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '9'">
			数量为
			<i-formitem :rules="validator.apprentice_num_from" :prop="`${prop}.apprentice_num_from`">
				<i-input-number
					v-model="rules.apprentice_num_from"
					:disabled="disabled"
					:max="999"
					:min="0"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			人到
			<i-formitem :rules="validator.apprentice_num_to" :prop="`${prop}.apprentice_num_to`">
				<i-input-number
					v-model="rules.apprentice_num_to"
					:disabled="disabled"
					:max="999"
					:min="0"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			人时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '10'">
			员工成为
			<i-formitem :rules="!disabled ? validator.position_id : {}" :prop="`${prop}.position_id`">
				<i-select
					v-model="rules.position_id"
					:disabled="disabled"
					placeholder="选择职位"
					transfer
					style="width: 220px;"
				>
					<i-option 
						v-for="item of positionArr"
						:key="item.position_id"
						:value="item.position_id">{{ item.position_name }}</i-option>
				</i-select>
			</i-formitem>
			至今达到
			<i-formitem :rules="validator.position_year" :prop="`${prop}.position_year`">
				<i-input-number
					v-model="rules.position_year"
					:disabled="disabled"
					:max="99"
					:min="0"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			年时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '11'">
			<i-formitem :rules="!disabled ? validator.education : {}" :prop="`${prop}.education`">
				<i-select
					v-model="rules.education"
					:disabled="disabled"
					placeholder="选择知识水平"
					transfer
					style="width: 220px;"
				>
					<i-option 
						v-for="item of educationArr"
						:key="item.value"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-formitem>
			为时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '12'">
			缺勤次数达到
			<i-formitem :rules="validator.absence_time_from" :prop="`${prop}.absence_time_from`">
				<i-input-number
					v-model="rules.absence_time_from"
					:disabled="disabled"
					:max="99"
					:min="0"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			次到
			<i-formitem :rules="validator.absence_time_to" :prop="`${prop}.absence_time_to`">
				<i-input-number
					v-model="rules.absence_time_to"
					:disabled="disabled"
					:max="99"
					:min="0"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			次时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<template v-else-if="id === '13'">
			平均积分在
			<i-formitem :rules="validator.average_integral_from" :prop="`${prop}.average_integral_from`">
				<i-input-number
					v-model="rules.average_integral_from"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分到
			<i-formitem :rules="validator.average_integral_to" :prop="`${prop}.average_integral_to`">
				<i-input-number
					v-model="rules.average_integral_to"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>
			</i-formitem>
			分时，所获得的积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>	
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
		<i-formitem v-else-if="id === '14'">
			基础服务项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '15'">
			咨询服务项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '16'">
			客户回款项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '17'">
			客户满意度项，通过手动评分进行评定
		</i-formitem>
		<i-formitem v-else-if="id === '18'">
			投诉扣分项，通过手动评分进行评定
		</i-formitem>
		<template v-else-if="id === '19'">
			获得微一案师傅称号后，所获得积分为
			<i-formitem :rules="validator.point" :prop="`${prop}.point`">
				<i-input-number
					v-model="rules.point"
					:disabled="disabled"
					:max="99"
					:min="-99"
					style="width: 100px"
					placeholder="输入数字"
				/>	
			</i-formitem>
			分
			<span v-if="!disabled" class="g-operation" @click="$emit('del')">删除</span>
		</template>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, InputNumber } from 'iview';
import OAInputNumber from '@components/hr/_common/input-number';
import Rules from './rules';

export default {
	name: 'hr-integration-condition-goal',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'oa-input-number': OAInputNumber
	},
	mixins: [Rules],
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		},
		prop: String,
		systemId: Number,
		disabled: Boolean
	},
	data() {
		return {
			positionArr: [],
			rankArr: [],
			educationArr: [],
			rules: this.formdata
		};
	},
	watch: {
		formdata(val) {
			if (this.disabled) {
				this.rules = val;
			}
		},
		systemId(val) {
			val && this.loadSystem(val);
		}
	},
	mounted() {
		(this.id === '6' || this.id === '10') && this.loadPosition();
		this.id === '5' && this.systemId && this.loadSystem(this.systemId);
		this.id === '11' && this.loadEducation();
	},
	methods: {
		loadPosition() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				param: {
					depart_id: query.depart_id
				},
			}).then(res => {
				this.positionArr = res.data[0].positions;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadSystem(val) {
			this.$request({
				url: '_HR_SYSTEM_RANK_SELECT_GET',
				type: 'GET',
				param: {
					rank_system_id: val
				},
			}).then(res => {
				this.rankArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadEducation(val) {
			this.$request({
				url: '_HR_STAFF_EDUCATION_GET',
				type: 'GET',
			}).then(res => {
				this.educationArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-integration-condition-goal{
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
	}
}
</style>


