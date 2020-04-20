<template>
	<div class="v-hr-form-enter-register g-c-black2">
		<div class="g-flex g-ai-fe ">
			<img 
				:src="OSS_WYA_LOGO01" 
				alt=""
				style="width: 100px;">
		</div>
		<div class="g-tc g-fs-24 g-m-tb-10">
			入职登记表{{ departType[info.depart_type] }}
		</div>
		<!-- eslint-disable -->
		<table :border="1" bordercolor="black" cellSpacing="0" cellPadding="0">
			<tr>
				<td :colspan="3" class="g-tc" style="width: 15%">姓名</td>
				<td :colspan="3" class="g-tc" style="width: 15%">{{ info.applicant_name }}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">性别</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{ info.sex == 1 ? '女' : '男' }}</td>
				<td :colspan="3" class="g-tc" style="width: 15%">婚姻状况</td>
				<td :colspan="3" style="width: 15%">
					<span style="margin-right: 10px">已婚<i :class="`iconfont icon-print-${(info.is_married || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
					<span>未婚<i :class="`iconfont icon-print-${(info.is_married || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
				</td>
				<td :rowspan="5" :colspan="3" style="width: 20%">照片</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="width: 15%">出生年月日</td>
				<td :colspan="3" class="g-tc" style="width: 15%">{{info.birthday}}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">公历生日</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{(info.birthday || '').substring(5, 10)}}</td>
				<td :colspan="3" class="g-tc" style="width: 15%">生日类型</td>
				<td :colspan="3" style="width: 15%">
					<span style="margin-right: 10px">农历<i :class="`iconfont icon-print-${(info.birthday_type || []).indexOf('1') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
					<span>公历<i :class="`iconfont icon-print-${(info.birthday_type || []).indexOf('0') > -1 ? 'checked' : 'uncheck'} g-fs-14`" /></span>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="width: 15%">年龄</td>
				<td :colspan="3" class="g-tc" style="width: 15%">{{info.age}}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">民族</td>
				<td :colspan="2" class="g-tc" style="width: 10%">{{info.nation_name}}</td>
				<td :colspan="3" class="g-tc" style="width: 15%">所学专业</td>
				<td :colspan="3" style="width: 15%">
					{{info.profession}}
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="width: 15%">最高学历</td>
				<td :colspan="3" class="g-tc" style="width: 15%">{{info.education}}</td>
				<td :colspan="2" class="g-tc" style="width: 10%">职称或特殊技能</td>
				<td :colspan="8" class="g-tc">{{info.school_job}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="width: 15%">何时-何校毕业</td>
				<td :colspan="13" class="g-tc">{{info.graduate_time}}-{{info.college}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">籍贯</td>
				<td :colspan="7">{{info.native}}</td>
				<td :colspan="3" class="g-tc">政治面貌</td>
				<td :colspan="7">{{getPolitics(info.politics_status)}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">身份证号</td>
				<td :colspan="7">{{info.id_card}}</td>
				<td :colspan="3" class="g-tc">手机号码</td>
				<td :colspan="7">{{info.mobile}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">户口地址</td>
				<td :colspan="17">{{info.address}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">现住地址</td>
				<td :colspan="17">{{info.now_address}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">入职时间</td>
				<td :colspan="7">{{info.predict_entry_time}}</td>
				<td :colspan="3" class="g-tc">入职组别/岗位</td>
				<td :colspan="7">{{info.depart_name}}{{info.position_name}}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">兴趣爱好/特长</td>
				<td :colspan="7">{{info.hobby}}</td>
				<td :colspan="3" class="g-tc">招商银行卡</td>
				<td :colspan="7">{{info.bank}}</td>
			</tr>
			<tr v-if="departType[info.depart_type] ==1 || info.depart_id&&info.depart_id.length&&info.depart_id.includes(info.sale_depart_id)">
				<td :colspan="7" class="g-tc">师傅是谁</td>
				<td :colspan="13">{{info.master}}</td>
			</tr>
			<tr>
				<td :colspan="6" class="g-tc">是否已与原单位办理完离职手续</td>
				<td :colspan="6">{{getLeavingProcedure(info.leaving_procedure)}}</td>
				<td :colspan="5" class="g-tc">是否存在劳动纠纷</td>
				<td :colspan="7">{{info.labor_dispute==='2'?'无':'有'}}</td>
			</tr>
			<tr v-if="info.depart_id&&info.depart_id.length&&!info.depart_id.includes(info.sale_depart_id)">
				<td :colspan="10" class="g-tc">是否与原单位签订《竞业行业禁止协议》</td>
				<td :colspan="15">{{info.competition_agreement==2?'/':'有'}}</td>
			</tr>
			<tr>
			<td :colspan="3" class="g-tc">重大病史</td>
			<td :colspan="22">{{info.has_medical_history==1?info.medical_history:'无'}}</td>
				<!-- <td :colspan="7">{{info.has_medical_history_name}}</td> -->
				<!-- <td :colspan="3" class="g-tc">若有，请详细说明，便于工作岗位和强度安排</td>
				<td :colspan="7">{{info.medical_history}}</td> -->
			</tr>
			<tr>
				<td :colspan="7">是否提供学历证明（是，图片/复印件形式；否，证明人，证明人号码）</td>
				<td :colspan="13">
					<div class="g-flex-ac" v-if="info.has_degree_prove == 1">
						是
						<!-- <img 
							v-for="(item, index) in info.degree_prove || []" 
							:key="index"
							:src="item"
							class="g-m-r-10"
						/> -->
					</div>
					<div v-if="info.has_degree_prove == 0">
						证明人：{{info.degree_witness}}, 证明人号码：{{info.degree_witness_phone}}
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="7">是否提供离职证明（是，图片/复印件形式；否，原公司名称，地址，人力资源电话）</td>
				<td :colspan="13">
					<div v-if="info.has_leaving_prove == 1">
						是
						<!-- <img 
							v-for="(item, index) in info.leaving_prove || []" 
							:key="index"
							:src="item"
						/> -->
					</div>
					<div v-if="info.has_leaving_prove == 0">
						原公司名称：{{info.leaving_witness_company}}, 原公司地址：{{info.leaving_witness_address}}, 直接上司：{{info.leaving_superior}}, 直接上司联系方式：{{info.leaving_superior_phone}}
					</div>
					<div v-if="info.has_leaving_prove == 2">暂无，{{ info.no_leaving_prove_reason }}</div>
					<div v-if="info.has_leaving_prove == 4">首次工作</div>
				</td>
			</tr>
			<tr>
				<td :colspan="20" class="g-tc">家庭成员</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc">姓名</td>
				<td :colspan="4" class="g-tc">与本人关系</td>
				<td :colspan="3" class="g-tc">工作单位</td>
				<td :colspan="8" class="g-tc">现居住地址</td>
				<td :colspan="3" class="g-tc">电话</td>
			</tr>
			<tr
				v-for="(item, index) in info.family"
				:key="index"
			>
				<td :colspan="2" class="g-tc">{{item && item.family_name}}</td>
				<td :colspan="4" class="g-tc">{{item && item.family_relation}}</td>
				<td :colspan="3" class="g-tc">{{item && item.family_job_address}}</td>
				<td :colspan="8" class="g-tc">{{item && item.family_job_new_address}}</td>
				<td :colspan="3" class="g-tc">{{item && item.family_phone}}</td>
			</tr>
			<tr>
				<td :colspan="20" class="g-tc">紧急联系人</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc">姓名</td>
				<td :colspan="4" class="g-tc">与本人关系</td>
				<td :colspan="3" class="g-tc">工作单位</td>
				<td :colspan="8" class="g-tc">现居住地址</td>
				<td :colspan="3" class="g-tc">电话</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc">{{info.important_name}}</td>
				<td :colspan="4" class="g-tc">{{info.important_relation}}</td>
				<td :colspan="3" class="g-tc">{{info.important_company}}</td>
				<td :colspan="8" class="g-tc">{{info.important_address}}</td>
				<td :colspan="3" class="g-tc">{{info.important_phone}}</td>
			</tr>
			<template>
				<tr>
					<td :colspan="3" class="g-tc">入职培训</td>
					<td :colspan="17">
						<p class="g-m-t-20">本人已接受公司岗前及员工规章制度的培训</p>
						<br>
						<br>
						<p class="g-tr">
							<span style="margin-right: 200px">员工签字:</span>
							<span>年&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<span>月&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<span>日</span>
						</p>
					</td>
				</tr>
				<!-- <tr>
					<td :colspan="20">
						<p>
							入职登记表用户名称后台管理中心人力资源中心提交打印通过3天你和公司的互相交流，你觉得公司是一个什么样的环境的公司，与你之前了解的公司或者工作过的公司有何区别？（如果没有不一样的地方可略过）
						</p>
						<p style="height: 350px" class="g-nobreak">
							{{info.my_opinion}}
						</p>
					</td>
				</tr>
				<tr>
					<td :colspan="20">
						<p>
							接下来第一个月你给自己定的目标是什么？你是怎么计划完成你的目标的。
						</p>
						<p style="height: 350px" class="g-nobreak">
							{{info.my_target}}
						</p>
					</td>
				</tr> -->
			</template>
			<!-- 其他部门 -->
			<template>
				<tr>
					<td :colspan="20">
						<p style="margin-top: 20px">
							以下为保密信息，有相关领导填写
						</p>
					</td>
				</tr>
				<!-- 技术部门有该项 -->
				<!-- <tr v-if="true">
					<td :colspan="5" class="g-tc">试用期时间</td>
					<td :colspan="5" class="g-tr">个月</td>
					<td :colspan="5" class="g-tc">转正时间</td>
					<td :colspan="5">&nbsp;</td>
				</tr> -->
				<tr>
					<td :colspan="5" class="g-tc">试用期工资</td>
					<td :colspan="5" class="g-tr">元/月</td>
					<td :colspan="5" class="g-tc">转正工资</td>
					<td :colspan="5">&nbsp;</td>
				</tr>
				<tr>
					<td :colspan="25" class="g-tl">
						<p>声明：以上所填写全部信息均真实无误，贵公司可进行背景调查。如填写内容及相关证件存在虚假，贵公司可按不符合录用条件或存在合同欺诈，解除与本人的劳动合同关系，并可进一步追究本人的经济和法律责任。 </p>
						<div class="g-tr">
							<p class="g-m-b-20" style='marginRight:100px'>员工签字:</p>
							<p class=''>
								<span class='g-m-r-20'>年</span>
								<span class='g-m-r-20'>月</span>
								<span>日</span>
							</p>
						</div>
					</td> 
				</tr>
					
			</template>
		</table>

		<!-- eslint-enable -->
		<p class="g-fs-14 g-flex-ac" style="margin-left: 30px; margin-top: 5px">
			<span class="g-fs-16" style="font-weight: 500">注：</span>
			填表人必须对表格中所有栏目根据自身情况逐项如实尽可能详细填
		</p>
	</div>
</template>

<script>
import { OSS_WYA_LOGO01 } from "@constants/constants";

export default {
	name: 'hr-form-print-enter-register',
	props: {
		info: {
			type: Object,
			default: () => ({}) 
		}
	},
	data() {
		return {
			OSS_WYA_LOGO01,
			departType: {
				'1': '（市场部）',
				'2': '（产品技术部）',
				'3': '（商学院）',
				'4': '（职能）',
			},
		};
	},
	methods: {
		getLeavingProcedure(value) {
			switch (value) {
				case "1":
					return '已经办完';
				case "2":
					return '尚未办完';
				case "3":
					return '首次工作';
				default:
					'';
					break;
			}
		},
		getPolitics(value) {
			switch (value) {
				case 1:
					return '普通群众';
				case 2:
					return '共产党员';
				case 3:
					return '预备党员';
				case 4:
					return '共青团员';
				case 5:
					return '其他党员';
				default:
					'';
					break;
			}
		},
	}
};
</script>

<style lang="scss">
.v-hr-form-enter-register {
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

