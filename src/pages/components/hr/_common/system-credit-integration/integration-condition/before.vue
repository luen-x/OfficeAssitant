<template>
	<div class="v-integration-condition-before">
		<template>
			<i-formitem prop="cycle_month">
				<i-select
					v-model="formdata.cycle_month"
					placeholder="选择周期"
					multiple
					transfer
					style="width: 220px;"
				>
					<i-option
						v-for="(item, index) of monthArr"
						:key="index"
						:value="index + 1">{{ index + 1 }}个月</i-option>
					<i-option
						:key="13"
						:value="13">24个月</i-option>
				</i-select>
			</i-formitem>
			内，评定基准期
			<i-formitem prop="start_month">
				<i-datepicker
					v-model="formdata.start_month"
					type="month"
					transfer
					placeholder="选择开始月份"
					style="width: 220px;"
				/>
			</i-formitem>
		</template>
		<template v-if="id < 7 || id === '13' || id === '19'">
			<i-formitem prop="object">
				<i-select
					v-model="formdata.object"
					placeholder="选择对象"
					transfer
					style="width: 220px;"
				>
					<i-option
						v-for="item of arrHandle"
						:key="item.value"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</i-formitem>
			<span v-if="id < 3">业绩达到</span>
			<i-formitem v-if="id < 3" prop="performance">
				<i-input
					v-model="formdata.performance"
					:maxlength="8"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			<span v-if="id < 3">元</span>
			<span v-if="id < 3">且范围在</span>
			<i-formitem v-if="id < 3" prop="range">
				<i-select
					v-model="formdata.range"
					placeholder="选择范围"
					transfer
					style="width: 220px;"
				>
					<i-option :value="1">一级部门（全营销中心）</i-option>
					<i-option :value="2">二级部门（战区）</i-option>
					<i-option :value="3">三级部门（部门）</i-option>
				</i-select>
			</i-formitem>
			<template v-if="id === '3' && [1,2,3].some(item => formdata.object === item)">
				<span>且成为</span>
				<i-formitem prop="position_id">
					<i-select
						v-model="formdata.position_id"
						placeholder="请选择职位"
						transfer
						style="width: 220px;"
					>
						<i-option
							v-for="item of positionArr"
							:key="item.position_id"
							:value="item.position_id">{{ item.position_name }}</i-option>
					</i-select>
				</i-formitem>
				<span>在</span>
				<i-formitem prop="position_month">
					<i-input-number
						v-model="formdata.position_month"
						:max="999"
						:min="0"
						style="width: 100px;"
						placeholder="输入数字"
					/>
				</i-formitem>
				<span>月内</span>
			</template>
			<span v-if="id === '4'">且在</span>
			<i-formitem v-if="id === '4'" prop="range">
				<i-select
					v-model="formdata.range"
					placeholder="选择范围"
					transfer
					style="width: 220px;"
				>
					<i-option :value="1">一级部门（全营销中心）</i-option>
					<i-option :value="2">二级部门（战区）</i-option>
					<i-option :value="3">三级部门（部门）</i-option>
				</i-select>
			</i-formitem>
			<span v-if="(id < 3 && visible) || id === '4'">内所有工龄在</span>
			<i-formitem v-if="(id < 3 && visible) || id === '4'" prop="standing_from">
				<i-input-number
					v-model="formdata.standing_from"
					:max="9999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			<span v-if="(id < 3 && visible) || id === '4'">月到</span>
			<i-formitem v-if="(id < 3 && visible) || id === '4'" prop="standing_to">
				<i-input-number
					v-model="formdata.standing_to"
					:max="9999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			<span v-if="(id < 3 && visible) || id === '4'">月内的员工中</span>
			<span v-if="id === '5'">针对</span>
			<i-formitem v-if="id === '5'" prop="rank_system_type">
				<i-select
					v-model="formdata.rank_system_type"
					placeholder="选择级称体系"
					style="width: 220px;"
					transfer
					@on-change="handleChange"
				>
					<i-option
						v-for="item of systemArr"
						:key="item.rank_system_id"
						:value="item.rank_system_id">{{ item.system_name }}</i-option>
				</i-select>
			</i-formitem>
			<span v-if="id === '5'">级称体系</span>
			<template v-if="id === '13'">
				的员工，针对
				<i-formitem prop="integral_type">
					<i-select
						v-model="formdata.integral_type"
						placeholder="选择积分类型"
						transfer
						style="width: 220px;"
					>
						<i-option :value="1">基础服务</i-option>
						<i-option :value="2">咨询服务</i-option>
						<i-option :value="3">客户跟踪结果</i-option>
						<i-option :value="4">客户满意度</i-option>
						<i-option :value="5">投诉指数</i-option>
						<i-option :value="6">基础服务+咨询服务</i-option>
					</i-select>
				</i-formitem>
				服务积分类型所获得的积分
			</template>
		</template>
		<template v-if="id > 13 && id < 19">
			整体得分上限
			<i-formitem prop="total_maximum">
				<i-input-number
					v-model="formdata.total_maximum"
					:max="9999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
			单客户得分上限
			<i-formitem prop="single_maximum">
				<i-input-number
					v-model="formdata.single_maximum"
					:max="9999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
			</i-formitem>
		</template>
		<template v-if="id === '9' || id === '8'">
			<i-formitem prop="master_type">
				<i-select
					v-model="formdata.master_type"
					placeholder="选择师傅类型"
					style="width: 220px;"
					transfer
				>
					<i-option :value="1">普通师傅</i-option>
					<i-option :value="2">微一案师傅职称</i-option>
				</i-select>
			</i-formitem>
			的师傅
			<span v-if="id === '9'">需要拥有工龄 </span>
			<i-formitem v-if="id === '9'" prop="standing_from">
				<i-input-number
					v-model="formdata.standing_from"
					:max="9999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
				月到
			</i-formitem>
			<i-formitem v-if="id === '9'" prop="standing_to">
				<i-input-number
					v-model="formdata.standing_to"
					:max="9999"
					:min="0"
					style="width: 100px;"
					placeholder="输入数字"
				/>
				月的徒弟
			</i-formitem>
		</template>
		<span v-if="id === '19'">的员工</span>
		<i-formitem v-if="['7', '10', '11', '12'].some(item => item === id)">
			无
		</i-formitem>
	</div>
</template>

<script>
import { FormItem, Input, Select, Option, DatePicker, InputNumber } from 'iview';

export default {
	name: 'hr-integration-condition-before',
	components: {
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-datepicker': DatePicker
	},
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			arr: [
				{
					label: '本人',
					value: 1
				},
				{
					label: '徒弟',
					value: 2
				},
				{
					label: '下属员工',
					value: 3
				},
				{
					label: '下属二级部门(战区)',
					value: 5
				},
				{
					label: '下属三级部门(部门)',
					value: 6
				}
			],
			arrOther: [
				{
					label: '本人',
					value: 1
				},
				{
					label: '徒弟',
					value: 2
				},
				{
					label: '下属员工',
					value: 3
				}
			],
			arrThree: [
				{
					label: '下属管理',
					value: 4
				},
				{
					label: '下属员工（入职三个月以上）',
					value: 8
				}
			],
			systemArr: [],
			positionArr: [],
			monthArr: Array.from({ length: 12 })
		};
	},
	computed: {
		arrHandle() {
			if (this.id === '13') {
				return this.arrThree;
			} else if (['5', '6', '19'].some(item => item === this.id)) {
				return this.arrOther;
			} else if (this.id === '4') {
				const arr = [...this.arr];
				arr.splice(3, 2);
				return arr;
			} else if (this.id === '1' || this.id === '3') {
				const arr = [...this.arr];
				arr.splice(3, 0, {
					label: '新晋总监的战区',
					value: 9
				});
				return arr;
			} else {
				return this.arr;
			}
		},
		visible() {
			return [1, 2, 3].some(item => this.formdata.object === item);
		}
	},
	mounted() {
		this.id === '3' && this.loadPosition();
		this.id === '5' && this.loadSystem();
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
		loadSystem() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_SYSTEM_RANK_SYSTEM_NAME_GET',
				type: 'GET',
				param: {
					depart_id: query.depart_id
				},
			}).then(res => {
				this.systemArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(val) {
			this.$emit('change', val);
		}
	}
};
</script>

<style lang="scss" scoped>
.v-integration-condition-before{
	.ivu-form-item {
		display: inline-block;
		vertical-align: baseline;
	}
}
</style>


