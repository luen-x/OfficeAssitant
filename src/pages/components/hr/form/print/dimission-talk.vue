<template>
	<div class="v-hr-form-dimission-talk g-c-black2">
		<div class="g-tc g-fs-24 g-m-t-10">
			离职面谈单{{ info.depart_type== 2 ? '（技术部）' : '' }}
		</div>
		<!-- eslint-disable -->
		<div class="g-tr">
			<span v-if="fill_time.length" class="g-tr" style="margin-right: 200px;">
				{{fill_time[0]}}　年　{{fill_time[1]}}　月　{{fill_time[2]}}　日
			</span>
			<span class="g-tr" style="margin-right: 120px;">编号：</span>
		</div>
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<!-- 技术部 -->
			<tr>
				<td :colspan="3" class="g-tc" style="width: 18.75%">离职员工姓名</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.staff_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">部门</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.depart_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">职务</td>
				<td :colspan="3" style="width: 18.75%">{{ info.position_name }}</td>
			</tr>
			<tr>
				<!-- <td :colspan="3" class="g-tc" style="width: 18.75%">入职日期</td>
				<td :colspan="5" class="g-tc" style="width: 18.75%">{{ info.entry_date }}</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">离职日期</td>
				<td :colspan="5" class="g-tc" style="width: 12.5%">{{ info.leave_time }}</td> -->
				<td :colspan="3" class="g-tc" style="width: 18.75%">入职日期</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.entry_date }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">面谈人</td>
				<td :colspan="3" class="g-tc" style="width: 18.75%">{{ info.interview_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 12.5%">面谈日期</td>
				<td :colspan="3" style="width: 18.75%">{{ info.interview_date }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">离职类别</td>
				<td :colspan="13">
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.leave_type == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;公司辞退</span>
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.leave_type == 2 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;主动离职</span>
					<span><i :class="`iconfont icon-print-${info.leave_type == 3 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他</span>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">离职原因</td>
				<td :colspan="13">
					<span style="word-break: break-all;">
						{{ info.leave_reason_name }}
					</span>
				</td>
			</tr>

			<!-- 其他 -->
			<!-- eslint-disable -->
			<tr v-if="info.depart_type == 1">
				<td :colspan="3" class="g-tc">判断离职原因</td>
				<td :colspan="13">
					<div>
						<p>个人基本问题：</p>
						<p class="g-m-l-5 g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;沉不住，思维没有得到提高</p>
						<p class="g-m-l-5 g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;学不会，底子弱</p>
						<p class="g-m-l-5 g-m-b-10"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;自身（韧性）不够</p>
					</div>
					<div class="g-m-b-10">
						<p class="g-m-b-5">公司管理问题：</p>
						<div class="g-m-l-5">
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;部门问题</span>
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;管理风格</span>
							<span><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;出不了业绩，失去信心</span>
						</div>
						<div class="g-m-l-5">
							<span class="g-m-b-5" style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;支持问题</span>
							<span class="g-m-b-5" style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('5') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;三立学府</span>
							<span class="g-m-b-5"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('6') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;要求不严格，没有落到实处</span>
						</div>
					</div>
					<p>
						其他原因：
						<span style="text-decoration:underline;word-break: break-all;">&nbsp;{{info.other_reason}}</span><!-- eslint-disable-line -->
					</p>
				</td>
			</tr>
			<!-- eslint-enable -->

			<!-- 技术部 -->
			<!-- eslint-disable -->
			<tr v-if="info.depart_type == 2">
				<td :colspan="3" class="g-tc">判断离职原因</td>
				<td :colspan="13">
					<div class="g-m-b-5">
						<p>个人基本问题：</p>
						<div class="g-flex g-fw-w g-m-l-5">
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;不适应加班</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;对未来焦虑</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;压力大</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;学不到技术，无法精进</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('5') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;无法认清自己</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('6') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;自身（韧性）不够</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('7') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;想换个环境，没发展空间</div>
							<div class="g-m-b-5" style="width: 180px"><i :class="`iconfont icon-print-${(info.person_reason || []).indexOf('8') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />
								&nbsp;其他：
							</div>
							<span>
								<span style="word-break: break-all;">
									{{info.other_person_reason}}
								</span>
							</span>
						</div>
					</div>
					<div class="g-m-b-10">
						<p class="g-m-b-5">公司管理问题：</p>
						<div class="g-m-l-5">
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;部门氛围不好</span>
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;管理风格不适应</span>
						</div>
						<div class="g-m-l-5">
							<span><i :class="`iconfont icon-print-${(info.company_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />
								&nbsp;其他：
								<span style="word-break: break-all;">
									{{info.other_company_reason}}
								</span>
							</span>
						</div>
					</div>
					<div class="g-m-b-10">
						<p class="g-m-b-5">其他原因：</p>
						<div class="g-m-l-5 g-m-b-5">
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.other_reason || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;距离太远</span>
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.other_reason || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;薪资福利不够好</span>
						</div>
						<div class="g-m-l-5 g-m-b-5">
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.other_reason || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;家庭因素</span>
							<span style="margin-right: 20px"><i :class="`iconfont icon-print-${(info.other_reason || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;身体原因</span>
						</div>
						<div class="g-m-l-5">
							<i :class="`iconfont icon-print-${(info.other_reason || []).indexOf('5') > -1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;其他：
							<span style="text-decoration:underline;word-break: break-all;">&nbsp;{{info.other_other_reason}}</span><!-- eslint-disable-line -->
						</div>
					</div>
				</td>
			</tr>

			<!-- eslint-disable -->
			<tr>
				<td :colspan="3" class="g-tc">面谈结果对接</td>
				<td :colspan="13">
					<div style="height: 60px" class="g-flex g-fd-c g-jc-sb">
						<p>
							<span class="g-m-r-30">与招聘组反馈/对接</span>
							<span style="margin-right: 20px">是&nbsp;<i :class="`iconfont icon-print-${(info.has_recruit || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
							<span style="margin-right: 20px">否&nbsp;<i :class="`iconfont icon-print-${(info.has_recruit || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
						</p>
						<p>
							<span class="g-m-r-30">与培训组反馈/对接</span>
							<span style="margin-right: 20px">是&nbsp;<i :class="`iconfont icon-print-${(info.has_train || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
							<span style="margin-right: 20px">否&nbsp;<i :class="`iconfont icon-print-${(info.has_train || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
						</p>
					</div>
				</td>
			</tr>
			<!-- eslint-enable -->
			<!-- <tr>
				<td :colspan="3" class="g-tc" style="width: 18.75%">面谈人签字</td>
				<td :colspan="5" class="g-tc" style="width: 18.75%"/>
				<td :colspan="3" class="g-tc" style="width: 18.75%">面谈日期</td>
				<td :colspan="5" class="g-tc" style="width: 12.5%"/>
			</tr> -->
		</table>
	</div>
</template>

<script>
export default {
	name: 'hr-form-print-dimission-talk',
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
.v-hr-form-dimission-talk {
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
