<template>
	<div class="v-hr-form-interview g-c-black2">
		<div class="g-tc g-fs-20">
			面试记录表
		</div>
		<div class="g-flex-ac g-jc-sb g-fs-16 g-m-t-10 g-m-b-10">
			<p class="g-col g-m-l-30">应聘者姓名：&nbsp;{{ info.applicant_name }}</p>
			<p class="g-col">应聘岗位：&nbsp;{{ info.position_name }}</p>
		</div>
		<!-- eslint-disable -->
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<tr>
				<td :rowspan="7" :colspan="2" class="g-tc">应聘者个人信息</td>
				<td :colspan="2" style="width: 16%" >年龄</td>
				<td :colspan="3" >{{ info.age }}</td>
				<td :colspan="2" >婚否</td>
				<td :colspan="3" >
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.is_married == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.is_married == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
			</tr>
			<tr>
				<td :colspan="2" >是否有小孩</td>
				<td :colspan="3" >
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.has_kids == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.has_kids == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
				<td :colspan="2" >是否有对象</td>
				<td :colspan="3" >
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.has_partner == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.has_partner == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
			</tr>
			<tr>
				<td :colspan="2">另一半所在公司地址</td>
				<td :colspan="8">{{info.partner_company_address}}</td>
			</tr>
			<tr>
				<td :colspan="2">另一半所在公司所属行业</td>
				<td :colspan="8">{{info.partner_company_industry}}</td>
			</tr>
			<tr>
				<td :rowspan="3" :colspan="2">家庭基本情况</td>
				<td :colspan="2" style="width: 16%">家庭成员</td>
				<td :colspan="6">{{info.family_member}}</td>
			</tr>
			<tr>
				<td :colspan="2">父母工作</td>
				<td :colspan="6">{{info.family_job}}</td>
			</tr>
			<tr>
				<td :colspan="2">是否有车有房</td>
				<td :colspan="6">{{info.has_car_house_name}}</td>
			</tr>
			<!-- 工作经历 -->
			<tr>
				<td :rowspan="14" :colspan="2" class="g-tc">应聘者工作经历</td>
				<td :colspan="2" >是否是应届生</td>
				<td :colspan="8" style="padding-left: 100px">
					<span style="margin-right: 150px"><i :class="`iconfont icon-print-${info.is_this_year_graduate == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.is_this_year_graduate == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
			</tr>
			<tr>
				<td :rowspan="13" :colspan="2" class="g-tc" >工作经验</td>
				<td style="width: 10%">本岗位做了多久</td>
				<td :colspan="3" style="width: 20%">{{info.this_job_time}}</td>
				<td style="width: 10%">原公司所属行业</td>
				<td :colspan="3">{{info.last_company_industury}}</td>
			</tr>
			<tr>
				<td style="width: 16%">团内承担角色</td>
				<td :colspan="8">{{info.role_in_team}}</td>
			</tr>
			<tr>
				<td style="width: 16%">是否有突出结果</td>
				<td :colspan="8">{{info.has_excellent_result}}</td>
			</tr>
			<tr>
				<td style="width: 16%">职位知识及技巧掌握情况</td>
				<td :colspan="8">{{info.technology}}</td>
			</tr>
			<tr>
				<td style="width: 16%">上家公司离职原因</td>
				<td :colspan="8">{{info.last_leave_reason}}</td>
			</tr>
			<tr>
				<td style="width: 16%">开始找工作至今时间</td>
				<td :colspan="8">{{info.start_find_work_time}}</td>
			</tr>
			<tr>
				<td style="width: 16%">找不到合适工作原因</td>
				<td :colspan="8">{{info.unable_to_find_work_reason}}</td>
			</tr>
			<tr>
				<td style="width: 16%">是否认真了解过本公司</td>
				<td :colspan="8">{{info.is_know_company}}</td>
			</tr>
			<tr>
				<td style="width: 16%">选择本公司的原因</td>
				<td :colspan="8">{{info.choose_company_reason}}</td>
			</tr>
			<tr>
				<td style="width: 16%">遇到问题的专研能力</td>
				<td :colspan="8">{{info.study_skill}}</td>
			</tr>
			<tr>
				<td style="width: 16%">有主见还是随遇而安</td>
				<td :colspan="8">{{info.has_ideas}}</td>
			</tr>
			<tr>
				<td style="width: 16%">对金钱的欲望是否强烈</td>
				<td :colspan="3" style="width: 20%">
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.money_appetency == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.money_appetency == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
				<td style="width: 10%">是否注重平台和学习机会</td>
				<td :colspan="3">
					<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.attention_platform == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.attention_platform == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
			</tr>
			<tr>
				<td style="width: 16%">是否特别在意休息和吃喝玩乐</td>
				<td :colspan="7" style="padding-left: 100px">
					<span style="margin-right: 150px"><i :class="`iconfont icon-print-${info.attention_relax == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.attention_relax == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;否</span>
				</td>
			</tr>

			<!-- 综合评价 -->
			<tr>
				<td :rowspan="8" :colspan="2" class="g-tc">综合评价</td>
				<td :rowspan="5" :colspan="2" style="width: 10%" >应聘者</td>
				<td :colspan="8">
					<i :class="`iconfont icon-print-${(info.excellent || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /> &nbsp;偏踏实、勤奋
				</td>
			</tr>
			<tr>
				<td :colspan="8">
					<i :class="`iconfont icon-print-${(info.excellent || []).indexOf('2') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /> &nbsp;脑袋灵活反应快
				</td>
			</tr>
			<tr>
				<td :colspan="8">
					<i :class="`iconfont icon-print-${(info.excellent || []).indexOf('3') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /> &nbsp;表达条例清晰知识面广
				</td>
			</tr>
			<tr>
				<td :colspan="8">
					<i :class="`iconfont icon-print-${(info.excellent || []).indexOf('4') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /> &nbsp;知识面一般但注重学习可培养
				</td>
			</tr>
			<tr>
				<td :colspan="1">其他</td>
				<td :colspan="7">{{info.else_valuate}}</td>
			</tr>
			<!-- eslint-enable -->
			<!-- eslint-disable -->
			<tr>
				<td :colspan="3">是否对底薪有基本底线</td>
				<td :colspan="7">
					<span style="margin-right: 150px"><i :class="`iconfont icon-print-${info.has_salary_line == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;&nbsp;是</span>
					<span><i :class="`iconfont icon-print-${info.has_salary_line == 0 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;&nbsp;否</span>
				</td>
			</tr>
			<!-- eslint-enable -->
			<!-- eslint-disable -->
			<tr>
				<td :colspan="3">无底线原因</td>
				<td :colspan="7">{{ info.has_no_line_reason }}</td>
			</tr>
			<tr>
				<td :colspan="3">对于我们这个岗位而言是否合适</td>
				<td :colspan="7" style="padding: 40px">
					<div>
						<span class="g-m-r-20">面试结果:</span>
						<span style="margin-right: 50px"><i :class="`iconfont icon-print-${info.interview_result == 1 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;通过</span>
						<span><i :class="`iconfont icon-print-${info.interview_result == 2 ? 'checked' : 'uncheck'} g-fs-14`" />&nbsp;Pass</span>
					</div>
					<br>
					<br>
					<div class="g-flex-cc g-fd-c g-tr">
						<p style="width: 100px; margin-bottom: 20px">面试官签名：</p>
						<p style="width: 100px">日期：</p>
					</div>
				</td>
			</tr>
			<!-- eslint-enable -->
		</table>
	</div>
</template>

<script>
export default {
	name: 'hr-form-print-interview',
	props: {
		info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			carAndHouse: [
				{ label: '有车有房', value: 0 },
				{ label: '有车没房', value: 1 },
				{ label: '没车有房', value: 2 },
				{ label: '没车没房', value: 3 }
			]
		};
	},
	computed: {
		has_car_house() {
			if (this.info && this.info.has_car_house) {
				return this.carAndHouse.filter(item => item.value === this.info.has_car_house)[0].label;
			}
		}
	}
};
</script>


<style lang="scss">
.v-hr-form-interview {
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

