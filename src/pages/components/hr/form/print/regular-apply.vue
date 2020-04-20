<template>
	<div class="v-hr-form-regular-apply g-c-black2">
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<tr>
				<td :colspan="20">
					<p class="g-fs-24 g-tc">转正申请书</p>
				</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc" style="width: 10%">姓名</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{ info.staff_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">性别</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{ info.sex == '1' ? '女' : '男' }}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">所属部门</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{ info.depart_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">填表日期</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{ currentDate }}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">入职日期</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{ info.entry_date === 'Invalid date' ? '' : info.entry_date }}</td>
			</tr>
			<!-- 职能部门 & 产品技术部 -->
			<template v-if="info.depart_type == 1 || info.depart_type == 2">
				<tr>
					<td :colspan="6">试用期间实际工作日（月数）</td>
					<td :colspan="4">{{ info.work_day }}</td>
					<td :colspan="4">转正后期待岗位（选择性填写）</td>
					<td :colspan="6">{{ info.forward_position_name }}</td>
				</tr>
				<!-- 职能部门 -->
				<tr v-if="info.depart_type == 2">
					<td :colspan="6">试用期实发平均月薪</td>
					<td :colspan="14">{{ info.actual_salary }}</td>
				</tr>
			</template>
			<!-- 市场部 -->
			<template v-if="info.depart_type == 3">
				<tr>
					<td :colspan="6">试用期间实际工作日（月数）</td>
					<td :colspan="4">{{ info.work_day }}</td>
					<td :colspan="4">试用期月均约见客户数</td>
					<td :colspan="6">{{ info.interview_num }}</td>
				</tr>
				<tr>
					<td :colspan="6">试用期实际出单业绩</td>
					<td :colspan="14">{{ info.performance }}</td>
				</tr>
			</template>

			<!-- eslint-disable -->
			<tr>
				<td :colspan="20" class="g-tc">
					<span style="margin-right: 150px">转正形式</span>
					<span style="margin-right: 150px"><i :class="`iconfont icon-print-${(info.regular_type || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;提前转正</span>
					<span><i :class="`iconfont icon-print-${(info.regular_type || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;正常转正　</span> <!-- eslint-disable-line -->
				</td>
			</tr>
			<tr>
				<td :colspan="20" class="g-tc">
					<span style="margin-right: 150px">申请次数</span>
					<span style="margin-right: 150px"><i :class="`iconfont icon-print-${(info.apply_num || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;首次申请</span>
					<span><i :class="`iconfont icon-print-${(info.apply_num || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;第二次申请</span>
				</td>
			</tr>
			<!-- eslint-enable -->
			<tr>
				<td :colspan="20">
					<p class="g-tc g-fs-24">申请正文</p>
					<div class="g-fs-18" style="minHeight: 400px">
						1.试用期间我所做的工作及取得的结果:
						<br>
						<pre style="width: 100%;white-space: pre-wrap;word-break: break-all;">{{ info.work_result }}</pre>
					</div>
					<div class="g-fs-18" style="minHeight: 400px">
						2.工作中我对自己的精进:
						<br>
						<pre style="width: 100%;white-space: pre-wrap;word-break: break-all;">{{ info.work_progress }}</pre>
					</div>
					<div class="g-fs-18" style="minHeight: 200px">
						3.我对公司的价值:
						<br>
						<pre style="width: 100%;white-space: pre-wrap;word-break: break-all;">{{ info.worth_money }}</pre>
					</div>
					<div class="g-fs-18" style="minHeight: 200px">
						4.接下来半年我在本岗位的基本计划:
						<br>
						<pre style="width: 100%;white-space: pre-wrap;word-break: break-all;">{{ info.plan }}</pre>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="20" class="g-tc">
					<div style="height: 40px; line-height: 40px">
						<span style="margin-right: 200px">申请人签字:</span>
						<span style="text-decoration:underline">&nbsp;　　　　</span><!-- eslint-disable-line -->
						<span>年</span>
						<span style="text-decoration:underline">&nbsp;　　　　</span><!-- eslint-disable-line -->
						<span>月</span>
						<span style="text-decoration:underline">&nbsp;　　　　</span><!-- eslint-disable-line -->
						<span>日</span>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="20" class="g-tc">以下由相关负责人填写</td>
			</tr>
			<!-- eslint-disable -->
			<tr>
				<td :colspan="7">
					<div style="height: 300px; position: relative">
						<p>{{ info.depart_type == 3 ? '经理意见：' : '主管意见：'}}</p>
						<div class="g-m-tb-10">
							<span style="margin-right: 30px"><i :class="`iconfont icon-print-${false ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;同意</span>
							<span><i :class="`iconfont icon-print-${false ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;不同意</span>
						</div>
						<p>理由：（不少于3点）</p>
						<div style="position: absolute; bottom: 10px; right: 10px">
							<p class="g-tr">签字：　　　　　　　　　</p><!-- eslint-disable-line -->
							<div class="g-m-t-10">
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>年</span>
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>月</span>
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>日</span>
							</div>
						</div>
					</div>
				</td>
				<td :colspan="7">
					<div style="height: 300px; position: relative">
						<p>{{ info.depart_type == 3 ? '总监意见：' : '经理意见：'}}</p>
						<div class="g-m-tb-10">
							<span style="margin-right: 30px"><i :class="`iconfont icon-print-${false ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;同意</span>
							<span><i :class="`iconfont icon-print-${false ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;不同意</span>
						</div>
						<p>理由：（不少于3点）</p>
						<div style="position: absolute; bottom: 10px; right: 10px">
							<p class="g-tr">签字：　　　　　　　　　</p><!-- eslint-disable-line -->
							<div class="g-m-t-10">
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>年</span>
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>月</span>
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>日</span>
							</div>
						</div>
					</div>
				</td>
				<td :colspan="7">
					<div style="height: 300px; position: relative">
						<p>{{ info.depart_type == 3 ? '人力资源部意见：' : '总监意见：'}}</p>
						<div class="g-m-tb-10">
							<span style="margin-right: 30px"><i :class="`iconfont icon-print-${false ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;同意</span>
							<span><i :class="`iconfont icon-print-${false ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;不同意</span>
						</div>
						<p>理由：（不少于3点）</p>
						<div style="position: absolute; bottom: 10px; right: 10px">
							<p class="g-tr">签字：　　　　　　　　　</p><!-- eslint-disable-line -->
							<div class="g-m-t-10">
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>年</span>
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>月</span>
								<span style="text-decoration:underline">&nbsp;　　　</span><!-- eslint-disable-line -->
								<span>日</span>
							</div>
						</div>
					</div>
				</td>
			</tr>
			<!-- eslint-enable -->

			<!-- 职能部门 & 产品技术部 -->
			<tr v-if="info.depart_type == 1 || info.depart_type == 2">
				<td :colspan="20">
					<div style="height: 60px">
						<span style="margin-right: 200px">人力资源对接人:</span>
					</div>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
import moment from 'moment';

export default {
	name: 'hr-form-print-regular-apply',
	props: {
		info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			currentDate: moment().format('YYYY-MM-DD')
		};
	}
};
</script>

<style lang="scss">
.v-hr-form-regular-apply {
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

