<template>
	<div class="v-hr-form-regular-talk g-c-black2">
		<div class="g-tc g-fs-24 g-m-t-10">
			转正面谈单
		</div>
		<div class="g-tr">
			<!-- eslint-disable -->
			<span v-if="fill_time.length" class="g-tr" style="margin-right: 200px;">
				{{fill_time[0]}}　年　{{fill_time[1]}}　月　{{fill_time[2]}}　日
			</span>
			<!-- eslint-enable -->
			<span class="g-tr" style="margin-right: 120px;">编号：</span>
		</div>
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<!-- 技术部 -->
			<tr>
				<td :colspan="3" class="g-tc" style="width: 18.75%">转正员工姓名</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.staff_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">用人部门</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.depart_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">上级主管</td>
				<td :colspan="3" style="width: 18.75%">{{ info.supervisor }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="width: 18.75%">转正日期</td>
				<td :colspan="5" class="g-tc" style="width: 18.75%">{{ info.regular_date }}</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">面谈地点</td>
				<td :colspan="5" class="g-tc" style="width: 12.5%">{{ info.interview_place }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="width: 18.75%">面谈日期</td>
				<td :colspan="5" class="g-tc" style="width: 18.75%">{{ info.interview_date }}</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">转正员工签字</td>
				<td :colspan="5" class="g-tc" style="width: 12.5%"/>
			</tr>

			<!-- eslint-disable -->
			<tr>
				<td :colspan="3" class="g-tc">面谈主要内容</td>
				<td :colspan="13">
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;你是否感觉你对公司和工作的期望得到了满足？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;试用期间对工作适应与否？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;试用期间自己主要的工作任务达成情况？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;您觉得目前自己的工作量是否饱和？工作中你是怎么分配时间的？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('5') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;你喜欢公司的地方是什么？最不喜欢的是什么？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('6') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;同事间的工作氛围、工作环境的感受，有何建议？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('7') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;自我感觉不足的地方是什么？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('8') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;以后准备从哪些方面完善自己，把工作做好？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('9') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;目前工作存在哪些方面的困难？需要什么样的帮助？</p>
					<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.interview_msg || []).indexOf('10') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他</p>
				</td>
			</tr>
			<!-- eslint-enable -->
			<tr>
				<td :colspan="3" class="g-tc">备注信息</td>
				<td :colspan="13">
					<div style="minHeight: 80px;">
						<pre style="width: 100%;white-space: pre-wrap;word-break: break-all;">{{ info.interview_result }}</pre>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">面谈人签字</td>
				<td :colspan="13"/>
			</tr>
			<tr>
				<td :colspan="16">
					<h1>流程</h1>
					<p>1. 由转正人员或上级主管到人力资源绩效组领取转正面谈单</p>
					<p>2. 在面谈前，由被面谈者先填写表格基本信息后，开始面谈，面谈结束后，面谈者签字。</p>
					<p>3. 面谈结束后，由面谈者（总监、经理或部门负责人）将入职面谈单交至人力资源部绩效组。</p>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	name: 'hr-form-print-regular-talk',
	props: {
		info: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		fill_time() {
			return this.info.full_time ? this.info.full_time.split('-') : [];
		}
	}
};
</script>

<style lang="scss">
.v-hr-form-regular-talk {
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
