<template>
	<div class="v-hr-recruit-notes">
		<div class="_title">
			个人信息
		</div>
		<div
			class="g-flex g-js-sb g-fw-w"
			style="max-width: 900px; min-width: 440px;justify-content: space-between;margin-left: -143px;"
		>
			<div class="g-flex" style="width: 440px" >
				<span class="g-tr _label" >试岗员工姓名：</span>
				<span >{{ info.applicant_name ? info.applicant_name : '--' }}</span>
			</div>
			<div class="g-flex" style="width: 440px" >
				<span class="g-tr _label">用人部门：</span>
				<span>{{ info.depart_name ? info.depart_name : '--' }}</span>
			</div>
			<div class="g-flex g-m-t-20" style="width: 440px" >
				<span class="g-tr _label" >师傅：</span>
				<span>{{ info.master ? info.master : '--' }}</span>
			</div>
			<div class="g-flex g-m-t-20" style="width: 440px" >
				<span class="g-tr _label" >试岗日期：</span>
				<span v-if="info.arrival_time">{{ info.arrival_time[0] }}至{{ info.arrival_time[1] }}</span>
				<span v-else>--</span>
			</div>
			<div class="g-flex g-m-t-20" style="width: 440px" >
				<span class="g-tr _label">面谈地点：</span>
				<span>{{ info.interview_place ? info.interview_place : '--' }}</span>
			</div>
		</div>
		<div class="_title ">
			面谈信息
		</div>
		<div >
			<i-checkbox-group
				v-model="info.interview_info"
				style="max-width: 900px; min-width: 440px; margin-left:104px;"
				class="g-flex g-fw-w g-jc-sb">
				<i-checkbox
					v-for="(item,index) in Interview"
					:key="index"
					:label="item.value"
					disabled
					class="g-m-t-20 "
					style="width: 440px" >{{ item.label }}</i-checkbox>
			</i-checkbox-group>
		</div>
		<div class="_title">
			对接结果
		</div>
		<div
			class="g-flex g-jc-sb g-fw-w"
			style="max-width: 900px; min-width: 440px; margin-left: -60px"
		>
			<div class="g-flex g-m-t-20" style="width: 440px">
				<div style="width: 286px" class="g-tr">与面试官/邀约手对接:</div>
				<i-radio-group
					v-model="info.is_butt_joint"
					style="width: 300px;"
					class=" g-m-l-10"
				>
					<i-radio disabled label="1">是</i-radio>
					<i-radio disabled label="0">否</i-radio>
				</i-radio-group>
			</div>
			<div class="g-flex g-m-t-20" style="width: 440px">
				<div style="width: 286px" class="g-tr">试岗通过:</div>
				<i-radio-group
					v-model="info.is_pass_arrival"
					style="width: 300px;"
					class=" g-m-l-10"
				>
					<i-radio disabled label="1">是</i-radio>
					<i-radio disabled label="0">否</i-radio>
				</i-radio-group>
			</div>
			<div class="g-flex g-m-t-20" style="width: 440px">
				<div style="width: 286px" class="g-tr" >与其他部门管理对接经理/师傅:</div>
				<i-radio-group
					v-model="info.is_manager_butt_joint"
					class=" g-m-l-10"
					style="width: 300px;"
				>
					<i-radio disabled label="1">是</i-radio>
					<i-radio disabled label="0">否</i-radio>
				</i-radio-group>
			</div>
		</div>
		<div class="g-flex g-m-t-20" style="max-width: 900px; min-width: 440px;">
			<span style="width: 147px" class="g-tr">备注:</span>
			<span class=" g-m-l-10">
				{{ info.remark ? info.remark : '--' }}
			</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { CheckboxGroup, Checkbox, RadioGroup, Radio } from 'iview';

const Interview = [
	{ label: '了解其对公司基本情况的认识', value: '1' },
	{ label: '了解其试岗期间对公司的感受', value: '2' },
	{ label: '了解其选择我们公司的原因', value: '3' },
	{ label: '了解其价值观是否与我们公司相符', value: '4' },
	{ label: '了解其工作经历', value: '5' },
	{ label: '了解其家庭状况', value: '6' },
	{ label: '了解其对工作职位的认知，是否明确工作内容', value: '7' },
	{ label: '了解其选择本职职位的原因和对待公司管理的态度', value: '8' },
	{ label: '对员工的加入表示欢迎', value: '9' },
	{ label: '其他', value: '10' }
];
export default {
	components: {
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	props: {
		info: Object
	},
	data() {
		return {
			Interview,
		};
	},
	watch: {
		applicant_id() {
			this.loadData();
		}
	},
	methods: {
	}
};
</script>

<style  lang="scss">
.v-hr-recruit-notes{
	._title {
		margin-left: 35px !important;
		margin-top: 20px;
		color: #e74854;
		padding-left: 10px;
		font-size: 14px;
		line-height: 14px;
		font-weight: 400;
		margin-bottom: 10px;
	}
	._title::before{
		content: '|';
		color: #e74854;
	}
	._label{
		padding-right:10px;
		width: 286px;
	}
	.ivu-checkbox{
		margin-right: 10px !important;
	}

}
</style>
