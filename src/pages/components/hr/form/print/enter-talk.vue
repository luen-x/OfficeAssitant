<template>
	<div class="v-hr-form-enter-talk g-c-black2">
		<div class="g-tc g-fs-24 g-m-tb-10">
			入职面谈单
		</div>
		<p class="g-tr" style="margin-right: 120px;">编号：</p>
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<!-- 技术部 -->
			<!-- eslint-disable -->
			<template v-if="info.depart_type == 1">
				<tr>
					<td :colspan="3" class="g-tc" style="width: 18.75%">试岗员工姓名</td>
					<td :colspan="3" class="g-tc" style="width: 18.75%">{{info.applicant_name}}</td>
					<td :colspan="2" class="g-tc" style="width: 12.5%">用人部门</td>
					<td :colspan="3" class="g-tc" style="width: 18.75%">{{info.depart_name}}</td>
					<td :colspan="2" class="g-tc" style="width: 12.5%">试岗日期</td>
					<td :colspan="3" style="width: 18.75%">{{info.arrival_time[0]}} - {{info.arrival_time[1]}}</td>
				</tr>
				<tr>
					<td :colspan="3" class="g-tc" style="width: 18.75%">面谈地点</td>
					<td :colspan="5" class="g-tc" style="width: 18.75%">{{info.interview_place}}</td>
					<td :colspan="3" class="g-tc" style="width: 18.75%">面谈日期</td>
					<td :colspan="5" class="g-tc" style="width: 12.5%">{{ info.interview_time }}</td>
				</tr>
				<tr>
					<td :colspan="16" class="g-tc">
						<div style="height: 40px; line-height: 40px">
							<span style="margin-right: 150px">是否了解薪资&nbsp;<i :class="`iconfont icon-print-${(info.is_know_compensation || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
							<span>试岗员工签字:</span>
						</div>
					</td>
				</tr>
			</template>

			<!-- 其他部门 -->
			<template v-if="info.depart_type == 2">
				<tr>
					<td :colspan="3" class="g-tc" style="width: 18.75%">试岗员工姓名</td>
					<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.applicant_name }}</td>
					<td :colspan="2" class="g-tc" style="width: 12.5%">用人部门</td>
					<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.depart_name }}</td>
					<td :colspan="2" class="g-tc" style="width: 12.5%">师傅</td>
					<td :colspan="3" style="width: 18.75%">{{ info.master }}</td>
				</tr>
				<tr>
					<td :colspan="3" class="g-tc">试岗日期</td>
					<td :colspan="5" class="g-tc">{{ info.arrival_time[0] }} - {{ info.arrival_time[1] }}</td>
					<td :colspan="3" class="g-tc">面谈地点</td>
					<td :colspan="5" class="g-tc">{{ info.interview_place }}</td>
				</tr>
				<tr>
					<td :colspan="3" class="g-tc">面谈日期</td>
					<td :colspan="5" class="g-tc">{{ info.interview_time }}</td>
					<td :colspan="3" class="g-tc">试岗员工签字</td>
					<td :colspan="5" class="g-tc"/>
				</tr>
			</template>
			<tr>
				<td :colspan="3" class="g-tc">面谈主要内容</td>
				<td :colspan="13">
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其对公司基本情况的认识</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其试岗期间对公司的感受</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其选择我们公司的原因</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其价值观是否与我们公司相符</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('5') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其工作经历</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('6') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其家庭状况</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('7') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其对工作职位的认知，是否明确工作内容</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('8') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;了解其选择本职职位的原因和对待公司管理的态度</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('9') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;对员工的加入表示欢迎</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_info || []).indexOf('10') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他</p>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">面试结果对接</td>
				<td :colspan="13">
					<p class="g-m-b-10">
						<span style="display: inline-block; width: 200px">与面试官/邀约手对接</span>
						<span style="margin-right: 10px">是&nbsp;<i :class="`iconfont icon-print-${(info.is_butt_joint || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
						<span>否&nbsp;<i :class="`iconfont icon-print-${(info.is_butt_joint || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
					</p>
					<p class="g-m-b-10">
						<span style="display: inline-block; width: 200px">与其他部门管理对接经理/师傅</span>
						<span style="margin-right: 10px">是&nbsp;<i :class="`iconfont icon-print-${(info.is_manager_butt_joint || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
						<span>否&nbsp;<i :class="`iconfont icon-print-${(info.is_manager_butt_joint || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
					</p>
				</td>
			</tr>
			<tr v-if="info.depart_type== 1 || info.depart_type== 2">
				<td :colspan="3" class="g-tc">备注信息</td>
				<td :colspan="13">
					<div style="minHeight: 80px;">
						<pre style="width: 100%;white-space: pre-wrap;word-break: break-all;">{{ info.remark }}</pre>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">面谈人签字</td>
				<td :colspan="13"></td>
			</tr>
			<tr>
				<td :colspan="16">
					<h1>流程</h1>
					<p>1. 由人力资源部带入新人入部门的负责人将入职面谈单交于面谈者。</p>
					<p>2. 在面谈前，由被面谈者先填写表格基本信息后，开始面谈，面谈结束后，面谈者签字。</p>
					<p>3. 面谈结束后，由面谈者（总监、经理、师傅或部门负责人）将入职面谈单交至人力资源部绩效组。</p>
				</td>
			</tr>
		</table>
		<!-- eslint-enable -->
	</div>
</template>

<script>
export default {
	name: 'hr-form-print-enter-talk',
	props: {
		info: {
			type: Object,
			default: () => ({})
		}
	}
};
</script>

<style lang="scss">
.v-hr-form-enter-talk {
	width: 100%;
	table {
		width: 100%;
		// text-align: center;
		td {
			height: 36px;
			border: 1px solid #1b1f28;
			padding: 5px;
		}
	}
}
</style>

