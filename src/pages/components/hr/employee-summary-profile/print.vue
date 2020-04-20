<template>
	<div class="v-hr-form-enter-talk g-c-black2">
		<div class="g-flex g-jc-sb">
			<div class="g-tc g-fs-30 g-m-tb-10" style="font-weight:800 ">应聘人员登记表</div>
			<div class="_tittle">
				<div class="__slogan">
					<span class="g-fs-18 _font" style="margin-left: 10px">利员工</span>
					<span class="g-fs-18" style="margin-left: 10px">利客户</span>
					<span class="g-fs-18" style="margin-left: 10px">利公司</span>
					<span class="g-fs-18" style="margin-left: 10px">立员工</span>
					<span class="g-fs-18" style="margin-left: 10px">立客户</span>
					<span class="g-fs-18" style="margin-left: 10px">立公司</span>
				</div>
				<img :src="nodataUrl" class="__img">
			</div>
		</div>
		<div class="g-flex g-jc-sb g-fs-15 g-m-tb-8">
			<div style="font-weight:800">应聘岗位：{{ info.position_name }}</div>
			<p style="margin-right: 0px;">
				{{ today }}
			</p>
		</div>
		<table 
			:border="1" 
			style="width: 100%;" 
			bordercolor="black" 
			cellspacing="0" 
			cellpadding="0">
			<tr>
				<td :colspan="3" class="g-tc" style="width:68px">应聘者声明</td>
				<td :colspan="13">
					<p class="g-m-b-10">
						<span>本人保证此表所填报的内容绝对真实，本人同意公司对我进行背景调查，如有虚假，公司有权予以辞退。</span>
					</p>
					<p class="g-tr" style="margin-right: 80px">
						<span>应聘人签名</span>
					</p>
				</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc" style="min-width: 69px">姓名</td>
				<td :colspan="3" class="g-tc" style="width: 76px">{{ info.applicant_name }}</td>
				<td :colspan="1" class="g-tc" style="width: 70px">性别</td>
				<td :colspan="2" class="g-tc" style="width: 70px">{{ info.sex==0?'男':'女' }}</td>
				<td :colspan="1" class="g-tc" style="width: 76px">出生日期</td>
				<td :colspan="4" class="g-tc" style="max-width: 60px">{{ handleTime(info.birthday) }}</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc" style="width: 69px">民族</td>
				<td :colspan="3" class="g-tc" style="width: 76px">{{ info.nation_name }}</td>
				<td :colspan="1" class="g-tc" style="width: 76px">婚否</td>
				<td :colspan="2" class="g-tc" style="width: 76px">{{ info.is_married==1?'已婚':'未婚' }}</td>
				<td :colspan="1" class="g-tc" style="width: 76px">爱好/特长</td>
				<td :colspan="4" class="g-tc" style="max-width: 60px">{{ info.hobby }}</td>
			</tr>
			<tr>
				<td :colspan="2" class="g-tc" style="width: 69px">健康状况</td>
				<td :colspan="3" class="g-tc" style="width: 76px">{{ info.has_medical_history_name }}</td>
				<td :colspan="1" class="g-tc" style="width: 76px">身高</td>
				<td :colspan="4" class="g-tc" style="max-width: 60px">{{ info.height }}</td>
				<td :colspan="2" class="g-tc" style="width: 69px">血型</td>
				<td :colspan="3" class="g-tc" style="width: 76px">{{ getBlood(info.blood) }}</td>
			</tr>
			<!-- <tr>
				
				<td :colspan="1" class="g-tc" style="width: 76px">星座</td>
				<td :colspan="2" class="g-tc" style="width: 76px">{{ info.constellation }}</td>
				<td :colspan="1" class="g-tc" style="width: 76px">爱好</td>
				<td :colspan="4" class="g-tc" style="max-width: 60px">{{ info.hobby }}</td>
			</tr> -->
			<tr>
				<td :rowspan="2" :colspan="2" class="g-tc" style="width: 33px">文化程度</td>
				<td :colspan="1" class="g-tc" style="width: 67px">毕业院校</td>
				<td :colspan="5" class="g-tc" style="width:70px">{{ info.college }}</td>
				<td :colspan="2" class="g-tc">学历</td>
				<td :colspan="4" class="g-tc">{{ getEducation(info.education) }}</td>
			</tr>
			<tr>
				
				<td :colspan="1" class="g-tc">专业</td>
				<td :colspan="5" class="g-tc" style="max-width: 60px">{{ info.profession }}</td>
				<td :colspan="1" class="g-tc">微信号</td>
				<td :colspan="4" class="g-tc" style="max-width: 60px">{{ info.wechat }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">身份证号码</td>
				<td :colspan="5" class="g-tc">{{ info.id_card }}</td>
				<td :colspan="2" class="g-tc">电子邮件</td>
				<td :colspan="5" class="g-tc">{{ info.email }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">户口地址</td>
				<td :colspan="10" class="g-tl">{{ info.address }}</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" style="max-width: 10%">本人联系方式</td>
				<td :colspan="3" class="g-tc" style="max-width: 10%">{{ info.mobile }}</td>
				<td :colspan="5" class="g-tc" style="max-width: 35%">紧急联系人及联系方式</td>
				<td :colspan="7" class="g-tc" style="max-width: 35%">{{ info.important_name }}{{ info.important_phone }}</td>
			</tr>
			<tr>
				<td :colspan="1" class="g-tc">期望薪资</td>
				<td :colspan="2" class="g-tc">{{ info.salary }}</td>
				<td :colspan="2" class="g-tc">目前杭州地址</td>
				<td :colspan="10" class="g-tl">{{ info.now_address }}</td>
			</tr>
			<tr>
				<td :colspan="16" class="g-tc">
					<div style="height: 40px; line-height: 40px">
						<span>教育与培训经历(请从最近的年份开始写)</span>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">时间</td>
				<td :colspan="5" class="g-tc">毕业院校、培训单位名称</td>
				<td :colspan="4" class="g-tc">学习、培训课程名称</td>
				<td :colspan="4" class="g-tc">获取何种证书</td>
			</tr>
			<template v-if="info.edu_experience&&info.edu_experience.length">
				<tr v-for="(item,index) in info.edu_experience" :key="index+'edu'">
					<td :colspan="3" class="g-tc" >
						<div>
							{{ item.edu_start_time }}
						</div>
						<div>
							{{ item.edu_end_time }}
						</div>
					</td>
					<td :colspan="5" class="g-tc" >{{ item.edu_school }}</td>
					<td :colspan="4" class="g-tc" >{{ item.edu_course }}</td>
					<td :colspan="4" class="g-tc" >{{ item.edu_certificate }}</td>
				</tr>
			</template>

			<template v-else>
				<tr v-for="(item,index) in [1,2,3]" :key="index+'edu'">
					<td :colspan="3" class="g-tc" />
					<td :colspan="5" class="g-tc" />
					<td :colspan="4" class="g-tc" />
					<td :colspan="4" class="g-tc" />
				</tr>
			</template>
			<tr>
				<td :colspan="16" class="g-tc">
					<div style="height: 40px; line-height: 40px">
						<span>主要工作经历(请从最近的年份开始写)</span>
					</div>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc" >入职、离职时间</td>
				<td :colspan="5" class="g-tc" >公司全称、工作职位</td>
				<td :colspan="2" class="g-tc" >月收入</td>
				<td :colspan="5" class="g-tc" >直接上司职位、姓名、电话</td>
			</tr>
			<template v-if="info.job_experience&&info.job_experience.length">
				<tr v-for="(item,index) in info.job_experience" :key="index+'job'">
					<td :colspan="3" class="g-tc">
						<div>
							{{ item.job_start_time }}
						</div>
						<div>
							{{ item.job_end_time }}
						</div>
					</td>
					<td :colspan="5" class="g-tc">
						<div>{{ item.job_company_name }}</div>
						<div>{{ item.job_position }}</div>
					</td>
					<td :colspan="2" class="g-tc">{{ item.job_salary }}</td>
					<td :colspan="5" class="g-tc">
						<div>
							{{ item.job_superior_position }}
						</div>
						<div>
							{{ item.job_superior }}/{{ item.job_superior_phone }}
						</div>
					</td>
				</tr>
			</template>

			<template v-else>
				<tr v-for="(item,index) in [1,2,3]" :key="index+'job'">
					<td :colspan="3" class="g-tc" />
					<td :colspan="5" class="g-tc" />
					<td :colspan="2" class="g-tc" />
					<td :colspan="5" class="g-tc" />
				</tr>
			</template>
			<tr>
				<td :colspan="3" class="g-tc">上家社保缴纳单位名称</td>
				<td :colspan="5">
					{{ info.last_social_company }}
				</td>
				<td :colspan="3" class="g-tc">社保停缴时间111</td>
				<td :colspan="5">
					{{ formatMonth(info.social_suspension_date) }}
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">支付宝芝麻信用分</td>
				<td :colspan="5">
					{{ info.ali_sesame_credit }}
				</td>
				<td :colspan="3" class="g-tc">外语能力</td>
				<td :colspan="5">
					<p>{{ getLevel(info.english_skills) }}</p>
				</td>
			</tr>
			<tr>
				<td :colspan="3" class="g-tc">你对前台的印象</td>
				<td :colspan="5">
					<p>{{ getImpression(info.front_impression) }}</p>
				</td>
				<td :colspan="3" class="g-tc">计算机操作能力</td>
				<td :colspan="5">
					<p>{{ getLevel(info.computer_skills) }}</p>
				</td>
			</tr>
			<tr style="height:100px">
				<td :colspan="3" class="g-tc">重大病史</td>
				<td :colspan="11" class="g-tl">
					<p>{{ info.medical_history }}</p>
				</td>
			</tr>
			<!-- <tr>
				<td :colspan="2" class="g-tc">个人特长</td>
				<td :colspan="12" class="g-tl">{{ info.specially }}</td>
				
			</tr> -->
		</table>
		<div class="g-fr g-m-t-5 g-m-b-15">
			<span style="margin-right: 80px">邀约人：{{ info.invite_name }}</span>
			<span style="margin-right: 80px">面试官：</span>
			<span style="margin-right: 80px">面试场地：</span>
		</div>
	</div>
</template>

<script>
import { OSS_RED_BG_PK } from "@constants/constants";
import moment from "moment";

export default {
	name: "hr-form-print-enter-talk",
	props: {
		info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		let today = moment().format('YYYY年MM月DD日');
		return {
			today,
			nodataUrl: OSS_RED_BG_PK
		};
	},
	mounted() {
		
		
	},
	methods: {
		handleTime(time) {
			return moment(time).format("YYYY-MM-DD");
		},
		formatMonth(time) {
			return moment(time).format("YYYY-MM");
		},
		getLevel(value) {
			switch (value) {
				case 1:
					return '精通';
				case 2:
					return '良好';
				case 3:
					return '略懂';
				case 4:
					return '一窍不通';
				default:
					'';
					break;
			}
		},
		getImpression(value) {
			switch (value) {
				case 1:
					return '好';
				case 2:
					return '很好';
				case 3:
					return '非常好';
				case 4:
					return "非常差";
				default:
					'';
					break;
			}
		},
		getBlood(value) {
			switch (value) {
				case 0:
					return '不明';
				case 1:
					return 'A型血';
				case 2:
					return 'B型血';
				case 3:
					return 'AB型血';
				case 4:
					return "O型血";
				default:
					'';
					break;
			}
		},
		getEducation(value) {
			switch (value) {
				case 0:
					return '初中及以下';
				case 1:
					return '高中';
				case 2:
					return '中专';
				case 3:
					return '大专';
				case 4:
					return "本科";
				case 5:
					return "硕士";
				case 6:
					return "博士";
				default:
					'';
					break;
			}
		},

	}
};
</script>

<style lang="scss">
.v-hr-form-enter-talk {
	width: 100%;
	._tittle {
		position: relative;
		.__img {
			margin-top: 10px;
			width: 430px;
			height: 40px;
		}
		.__slogan {
			position: absolute;
			top: 20px;
			left: 10px;
			z-index: 1000;
			font-weight: 800;
			color: #fff;
		}
	}
	table {
		width: 100%; // text-align: center;
		td {
			height: 30px;
			max-height: 30px;
			min-height: 30px;
			border: 1px solid #1b1f28;
			padding: 5px;
		}
	}
}
</style>

