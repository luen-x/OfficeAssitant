<template>
	<div class="v-hr-form-dimission-apply g-c-black2">
		<div class="g-tc g-fs-24 g-m-t-10">
			员工离职申请表
		</div>
		<div style="padding-left: 50px">
			<!-- eslint-disable -->
			填表日期：　　　　　
			<span v-if="fill_time.length" class="g-tr" style="margin-right: 200px;">
				{{fill_time[0]}}　年　{{fill_time[1]}}　月　{{fill_time[2]}}　日
			</span>
			<!-- eslint-enable -->
		</div>
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<tr>
				<td :colspan="3" class="g-tc" style="width: 18.75%">姓名</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.staff_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">部门</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.depart_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">职位</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.position_name }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">工号</td>
				<td :colspan="3" class="g-tc">{{ info.staff_number }}</td>
				<td :colspan="2" class="g-tc">入职时间</td>
				<td :colspan="3" class="g-tc">{{ info.entry_date }}</td>
				<td :colspan="2" class="g-tc">学历</td>
				<td :colspan="3" class="g-tc">{{ info.education }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">离职类别</td>
				<td :colspan="13">
					<div class="g-flex-ac" style="height: 60px; line-height: 60px;">
						<!-- eslint-disable -->
						<span style="margin-right: 20px"><i :class="`iconfont icon-print-${info.leave_type == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;公司辞退</span>
						<span style="margin-right: 20px"><i :class="`iconfont icon-print-${info.leave_type == 2 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;主动离职</span>
						<span style="margin-right: 60px"><i :class="`iconfont icon-print-${info.leave_type == 3 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他</span>
						<span style="margin-right: 20px"><span style="text-decoration:underline">&nbsp;　　　　　　　　　</span>（部门经理签字）</span>
						<!-- eslint-enable -->
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">申请离职日期</td>
				<td :colspan="5" class="g-tc">{{ info.apply_date }}</td>
				<td :colspan="3" class="g-tc">截止上班日期</td>
				<td :colspan="5" class="g-tc">{{ info.stop_date }}</td>
			</tr>
			<tr>
				<!-- eslint-disable -->
				<td :colspan="16">
					离职原因　
					<span style="word-break: break-all;">
						{{ info.leave_reason_name }}
					</span>
				</td>
				<!-- eslint-enable -->
			</tr>
			<tr>
				<td :colspan="8">
					<div style="min-height: 200px">
						<p>个人原因：</p>
						<!-- eslint-disable -->
						<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;家庭因素：<span style="text-decoration:underline;">&nbsp;{{info.other_family_reason}}</span></p>
						<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;身体因素：<span style="text-decoration:underline;">&nbsp;{{info.other_body_reason}}</span></p>
						<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;赚不到钱：<span style="text-decoration:underline;">&nbsp;{{info.other_money_reason}}</span></p>
						<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他：<span style="text-decoration:underline;word-break: break-all;">&nbsp;{{info.other_other_reason}}</span></p>
						<!-- eslint-enable -->
					</div>
				</td>
				<td :colspan="8">
					<div style="min-height: 200px">
						<p>公司原因：</p>
						<!-- eslint-disable -->
						<p><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;对公司人文环境不满意</p>
						<p><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;与上司或同事不和</p>
						<p><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;对薪资待遇不满意</p>
						<p><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;想从事其他行业</p>
						<p><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('5') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;加班太多，休息太少</p>
						<p class="g-m-b-10"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('6') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;学不到东西，没有平台</p>
						<p><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('7') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他：<span style="text-decoration:underline;word-break: break-all;">&nbsp;{{info.other_company_reason}}</span></p>
						<!-- eslint-enable -->
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">部门审批</td>
				<td :colspan="13">
					<div style="height: 100px; position: relative">
						<p>部门经理意见：</p>
						<span style="position: absolute; bottom: 0; right: 150px">签名：</span>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">高管审批</td>
				<td :colspan="13">
					<div style="height: 100px; position: relative">
						<p>总监意见：</p>
						<span style="position: absolute; bottom: 0; right: 150px">签名：</span>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">备注</td>
				<td :colspan="13">
					<!-- eslint-disable -->
					<p>1、本表依人事部管理审批权限逐级核准，</p>
					<p>　&nbsp;&nbsp;基层：各部门经理 → 战区总监</p>
					<p>　&nbsp;&nbsp;中层：本部门经理 → 综合部经理 → 总监 → 总经理</p>
					<p>　&nbsp;&nbsp;高层：公司高管 → 总经理</p>
					<!-- eslint-enable -->
					<p>2、离职申请递交周期：员工按照主管要求履行（商务代表：7个工作日内的工作交接，已交社保者：30个工作日内的工作交接，公司基层管理岗位以上选择社保补贴者，15个工作日内工作交接，其他事业部工作人员30个工作日工作交接）</p>
					<p>3、离职申请一经提交任何休假公司将不予批准并请于核准离职日期之前办理相应的工作交接</p>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	name: 'hr-form-print-dimission-apply',
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
.v-hr-form-dimission-apply {
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
