<template>
	<div class="v-hr-summary-profile">
		<div class="g-flex g-flex-ac g-flex-cc g-m-t-30">
			<i-form
				ref="form"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="110"
				:style="'width: 900px'"
				position="center"
			>
				<oa-title title="个人资料" />
				<i-row>
					<i-col span="12">
						<i-form-item label="姓名:" prop="applicant_name">
							<i-input
								v-model="formValidate.applicant_name"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入姓名"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="性别:" prop="sex">
							<i-radio-group v-model="formValidate.sex">
								<i-radio label="0">男</i-radio>
								<i-radio label="1" style="margin-left:50px">女</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="民族:">
							<i-select
								v-model="formValidate.nation_id"
								clearable
								style="width:300px"
								placeholder="请选择民族"
							>
								<i-option
									v-for="item in nations"
									:key="item.value"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="婚否:" prop="is_married">
							<i-radio-group v-model="formValidate.is_married">
								<i-radio label="0">未婚</i-radio>
								<i-radio label="1" style="margin-left:50px">已婚</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="手机号码:" prop="mobile">
							<i-input
								v-model="formValidate.mobile"
								:maxlength="11"
								style="width:300px"
								placeholder="请输入手机号码"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="招商银行卡号:" prop="bank">
							<i-input
								v-model="formValidate.bank"
								:maxlength="16"
								style="width:300px"
								placeholder="请输入招商银行卡号"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="开户行:">
							<i-input
								v-model="formValidate.opening_bank"
								:maxlength="50"
								style="width:300px"
								placeholder="请输入开户行"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="网银状态:">
							<i-radio-group v-model="formValidate.e_bank_status">
								<i-radio label="1">已开启</i-radio>
								<i-radio label="2" style="margin-left:50px">未开启</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="入职时间:" prop="predict_entry_time">
							<i-date-picker
								v-model="formValidate.predict_entry_time"
								:split-panels="true"
								style="width:300px"
								placeholder="请选择入职时间"
								type="date"
								transfer
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="入职部门:" prop="depart_id">
							<i-cascader
								v-model="formValidate.depart_id"
								:data="departAll"
								:change-on-select="true"
								style="width:300px"
								clearable
								transfer
								trigger="click"
								placeholder="请选择部门"
								@on-change="handleChange"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="职位:" prop="position_id">
							<i-select
								v-model="formValidate.position_id"
								style="width:300px"
								clearable
								filterable
								placeholder="请选择职位"
							>
								<i-option
									v-for="(item, index) in positionArr"
									:key="index"
									:value="item.position_id"
								>{{ item.position_name }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="师傅是谁:">
							<i-input
								v-model="formValidate.master"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入师傅"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="重大病史:" prop="has_medical_history">
							<i-radio-group v-model="formValidate.has_medical_history">
								<i-radio label="1">有</i-radio>
								<i-radio label="2" style="margin-left:50px">无</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col v-if="formValidate.has_medical_history=='1'" span="12">
						<i-form-item label="病史说明:" prop="medical_history">
							<oa-limit-words
								v-model="formValidate.medical_history"
								:max="200"
								style="width:300px"
								placeholder="请详细说明情况，便于工作岗位和强度安排"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<oa-title title="身份信息" />
				<i-row>
					<i-col span="12">
						<i-form-item label="身份证号:" prop="id_card">
							<i-input
								v-model="formValidate.id_card"
								:maxlength="18"
								style="width:300px"
								placeholder="请输入身份证号"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="生日类型:" prop="birthday_type">
							<i-radio-group v-model="formValidate.birthday_type">
								<i-radio label="0">公历</i-radio>
								<i-radio label="1" style="margin-left:50px">农历</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="公历生日:" prop="birthday">
							<i-date-picker
								v-model="formValidate.birthday"
								style="width:300px"
								type="date"
								placeholder="请选择公历生日"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="职称/技能:">
							<i-input
								v-model="formValidate.school_job"
								:maxlength="20"
								placeholder="请输入职称技能"
								style="width:300px"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item label="爱好/特长:">
							<i-input
								v-model="formValidate.hobby"
								:maxlength="20"
								placeholder="请输入爱好/特长"
								style="width:300px"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="政治面貌:" prop="politics_status">
							<i-select
								v-model="formValidate.politics_status"
								clearable
								style="width:300px"
								placeholder="请选择政治面貌"
							>
								<i-option
									v-for="item in politics"
									:key="item.value"
									:value="item.value"
								>{{ item.label }}</i-option>
							</i-select>
						</i-form-item>
					</i-col>
					
				</i-row>
				<i-row>
					<i-col v-if="formValidate.politics_status===2" span="12">
						<i-form-item label="入党时间:" prop="party_standing_time">
							<i-date-picker
								v-model="formValidate.party_standing_time"
								style="width:300px"
								type="month"
								format="yyyy-MM"
								placeholder="请选择入党时间"
								@on-change="formValidate.party_standing_time=$event"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="身份证上传:">
							<vc-imgs-picker
								v-model="formValidate.id_card_url"
								:max="2"
								class="g-m-t-10"
								@error="handleError"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<oa-title title="学历证明" />
				<div>
					<i-form-item label="证明方式:" prop="has_degree_prove">
						<i-radio-group v-model="formValidate.has_degree_prove">
							<i-radio label="1">学历证书</i-radio>
							<i-radio label="0" class="g-m-l-10">证明人</i-radio>
							<i-radio label="2" class="g-m-l-10">暂无</i-radio>
						</i-radio-group>
					</i-form-item>
				</div>
				<i-row v-if="formValidate.has_degree_prove=='0'">
					<i-col span="12">
						<i-form-item label="学历证明人:" prop="degree_witness">
							<i-input
								v-model="formValidate.degree_witness"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入学历证明人"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="证明人联系方式:" prop="degree_witness_phone">
							<i-input
								v-model="formValidate.degree_witness_phone"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入学历证明人联系方式"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row v-if="formValidate.has_degree_prove=='1'">
					<i-form-item label="学历:" prop="degree_prove">
						<vc-imgs-picker
							v-model="formValidate.degree_prove"
							:max="10"
							class="g-m-t-10"
							@error="handleError"
						/>
					</i-form-item>
				</i-row>
				<i-row v-if="formValidate.has_degree_prove=='2'">
					<i-form-item label="暂无理由:" prop="no_degree_prove_reason">
						<oa-limit-words
							v-model="formValidate.no_degree_prove_reason"
							:max="200"
							style="width:300px"
							placeholder="请输入暂无理由"
						/>
					</i-form-item>
				</i-row>
				<oa-title title="离职证明" />
				<i-row>
					<i-col span="12">
						<i-form-item label="离职手续:" prop="leaving_procedure">
							<i-radio-group v-model="formValidate.leaving_procedure">
								<i-radio label="1">已经办完</i-radio>
								<i-radio label="2" class="g-m-l-10">尚未办完</i-radio>
								<i-radio label="3" class="g-m-l-10">首次工作</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="劳动纠纷:" prop="labor_dispute">
							<i-radio-group v-model="formValidate.labor_dispute">
								<i-radio label="2">无</i-radio>
								<i-radio label="1" class="g-m-l-10">有</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col v-if="!formValidate.depart_id.includes(formValidate.sale_depart_id)" span="12">
						<i-form-item label="竞业协议:" prop="competition_agreement">
							<i-radio-group v-model="formValidate.competition_agreement">
								<i-radio label="2">与原单位无有效协议</i-radio>
								<i-radio label="1" class="g-m-l-10">与原单位有有效协议</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="证明方式:" prop="has_leaving_prove">
							<i-radio-group v-model="formValidate.has_leaving_prove">
								<i-radio label="1">离职证明</i-radio>
								<i-radio label="0" class="g-m-l-10">证明人</i-radio>
								<i-radio label="2" class="g-m-l-10">暂无</i-radio>
								<i-radio label="4" class="g-m-l-10">首次工作</i-radio>
							</i-radio-group>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row v-if="formValidate.has_leaving_prove=='0'">
					<i-col span="12">
						<i-form-item label="原公司名称:" prop="leaving_witness_company">
							<i-input
								v-model="formValidate.leaving_witness_company"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入原公司名称"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="原公司地址:" prop="leaving_witness_address">
							<oa-limit-words
								v-model="formValidate.leaving_witness_address"
								:max="50"
								style="width:300px"
								placeholder="请输入原公司地址"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="直接上司:" prop="leaving_superior">
							<i-input
								v-model="formValidate.leaving_superior"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入直接上司"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item label="上司联系方式:" prop="leaving_superior_phone">
							<i-input
								v-model="formValidate.leaving_superior_phone"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入上司联系方式"
							/>
						</i-form-item>
					</i-col>
				</i-row>

				<i-form-item
					v-if="formValidate.has_leaving_prove=='1'"
					label="离职证明:"
					prop="leaving_prove"
				>
					<vc-imgs-picker
						v-model="formValidate.leaving_prove"
						:max="10"
						class="g-m-t-10"
						@error="handleError"
					/>
				</i-form-item>
				<i-form-item
					v-if="formValidate.has_leaving_prove=='2'"
					label="暂无理由:"
					prop="no_leaving_prove_reason"
				>
					<oa-limit-words
						v-model="formValidate.no_leaving_prove_reason"
						:max="200"
						style="width:300px"
						placeholder="请输入暂无理由"
					/>
				</i-form-item>
				<div class="g-flex g-flex-ac _do">
					<oa-title title="家庭成员" />
					<div
						v-if="formValidate.family&&formValidate.family.length<3"
						class="g-operation __add"
						@click="handleAddFamily"
					>添加</div>
				</div>
				<div v-for="(item, index) in formValidate.family" :key="index" class="_family">
					<span
						v-if="formValidate.family.length>1"
						class="g-operation _del"
						@click="handleDel(index)"
					>删除</span>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_name'"
								:rules="ruleValidate.family_name"
								label="姓名:"
							>
								<i-input
									v-model="item.family_name"
									:maxlength="10"
									style="width:300px"
									placeholder="请输入姓名"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_relation'"
								:rules="ruleValidate.family_relation"
								label="与本人关系:"
							>
								<i-input
									v-model="item.family_relation"
									:maxlength="10"
									style="width:300px"
									placeholder="请输入与本人关系"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_phone'"
								:rules="ruleValidate.family_phone"
								label="手机号:"
							>
								<i-input
									v-model="item.family_phone"
									:maxlength="11"
									style="width:300px"
									placeholder="请输入手机号"
								/>
							</i-form-item>
						</i-col>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_job_address'"
								:rules="ruleValidate.family_job_address"
								label="工作单位:"
							>
								<i-input
									v-model="item.family_job_address"
									:maxlength="20"
									style="width:300px"
									placeholder="请输入工作单位"
								/>
							</i-form-item>
						</i-col>
					</i-row>
					<i-row>
						<i-col span="12">
							<i-form-item
								:prop="'family.' + index + '.family_job_new_address'"
								:rules="ruleValidate.family_job_new_address"
								label="现住地址:"
							>
								<oa-limit-words
									v-model="item.family_job_new_address"
									:max="50"
									style="width:300px"
									placeholder="请输入现住地址"
								/>
							</i-form-item>
						</i-col>
					</i-row>
				</div>
				<oa-title title="紧急联系人" />
				<i-row>
					<i-col span="12">
						<i-form-item prop="important_name" label="姓名:">
							<i-input
								v-model="formValidate.important_name"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入姓名"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item prop="important_relation" label="与本人关系:">
							<i-input
								v-model="formValidate.important_relation"
								:maxlength="10"
								style="width:300px"
								placeholder="请输入与本人关系"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item prop="important_phone" label="手机号:">
							<i-input
								v-model="formValidate.important_phone"
								:maxlength="11"
								style="width:300px"
								placeholder="请输入手机号"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item prop="important_company" label="工作单位:">
							<i-input
								v-model="formValidate.important_company"
								:maxlength="20"
								style="width:300px"
								placeholder="请输入工作单位"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<i-row>
					<i-col span="12">
						<i-form-item prop="important_address" label="现住地址:">
							<oa-limit-words
								v-model="formValidate.important_address"
								:max="50"
								style="width:300px"
								placeholder="请输入现住地址"
							/>
						</i-form-item>
					</i-col>
				</i-row>
				<div v-if="formValidate.is_show_my_opinion">
					<oa-title title="我的看法" />
					<i-col span="12">
						<i-form-item prop="my_opinion" label="公司环境">
							<oa-limit-words
								v-model="formValidate.my_opinion"
								:max="200"
								style="width:300px"
								placeholder="通过3天你和公司的互相交流，你觉得公司是一个什么样的环境的公司，与你之前了解的公司或者工作过的公司有何区别？（如果没有不一样的地方可略过）"
							/>
						</i-form-item>
					</i-col>
					<i-col span="12">
						<i-form-item prop="my_target" label="首月目标">
							<oa-limit-words
								v-model="formValidate.my_target"
								:max="200"
								style="width:300px"
								placeholder="接下来第一个月你给自己定的目标是什么？你是怎么计划完成你的目标的。"
							/>
						</i-form-item>
					</i-col>
				</div>
			</i-form>
		</div>
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print :info="info"/>
			</vc-print>
		</div>
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="$router.back()">返回</div>
			<div class="g-m-r-10 g-red-btn-small" @click="handleSubmit(true,null)">提交</div>
			<div
				style="display: inline-block;"
				class="g-red-btn-small"
				@click="handlePrint"
			>
				打印
			</div>
		</footer>
	</div>
</template>

<script>
import lodash from "lodash";
import API_ROOT from "@stores/apis/root";
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Message,
	Cascader,
	Row,
	Col,
	RadioGroup,
	Radio,
	Button
} from "iview";
// utils
import { dataValidity } from "@utils/utils";
import { ImgsPicker, Print } from "wya-vc";
import moment from "moment";
import { services } from "@stores/services/hr";
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../_common/title";
import ResumePrint from "../form/print/enter-register";

export default {
	name: "v-hr-summary-profile",
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-cascader": Cascader,
		"vc-imgs-picker": ImgsPicker,
		"oa-title": Title,
		"i-radio-group": RadioGroup,
		"i-button": Button,
		"i-radio": Radio,
		'oa-limit-words': LimitWords,
		"oa-print": ResumePrint,
		"vc-print": Print
	},
	mixins: [services.nations(), services.politics(), services.departAll()],
	data() {
		return {
			info: {},
			positionArr: [],
			formValidate: {
				applicant_name: "", // 姓名
				mobile: "", // 手机号
				sex: "", // 性别 0：男；1：女
				is_married: "", // 婚否 0：未婚；1：已婚
				bank: "", // 招商银行卡号
				nation_id: "", // 民族id
				id_card: "", // 身份证号
				birthday_type: "", // 生日类型 0：公历 1：农历
				birthday: "", // 公历生日
				id_card_url: [],
				school_job: "", // 职称或技能
				has_degree_prove: "1", // 1：学历证书，0：证明人
				degree_witness: "", // 学历证明人
				degree_witness_phone: "", // 证明人手机号
				degree_prove: [], // 证书文件 有的话是数组
				has_leaving_prove: "1", // 1：离职证书，0：证明人
				leaving_witness_company: "", // 原公司名称
				leaving_witness_address: "", // 原公司地址
				leaving_superior: "", // 直接上司
				leaving_superior_phone: "", // 直接上司手机号
				leaving_prove: [], // 离职证明文件，有的话是数组
				family: [], // 家庭成员
				important_name: "", // 紧急联系人
				important_relation: "", // 与本人的关系
				important_phone: "", // 紧急联系人电话
				important_company: "", // 紧急联系人工作单位
				important_address: "", // 姓紧急联系人现住址名
				party_standing_time: "",
				politics_status: null,
				depart_id: [],
				position_id: '',
				hobby: '',
				opening_bank: '',
				e_bank_status: '',
				has_medical_history: '',
				medical_history: '',
				master: '',
				predict_entry_time: '',
				leaving_procedure: '',
				labor_dispute: '',
				competition_agreement: '',
			},
			ruleValidate: {
				applicant_name: [
					{ required: true, message: "姓名为必填" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				sex: [
					{ required: true, message: "性别为必选", trigger: "change" }
				],
				is_married: [
					{ required: true, message: "婚姻为必选", trigger: "change" }
				],
				mobile: [
					{ required: true, message: "手机号码为必填" },
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				bank: [
					{
						type: "validNum",
						message: "请输入数字",
						validator: dataValidity,
					}
				],
				depart_id: [
					{
						required: true,
						type: "array",
						message: "入职部门为必选",
						trigger: "change"
					}
				],
				position_id: [
					{
						required: true,
						type: "number",
						message: "职位为必选",
						trigger: "change"
					}
				],
				id_card: [
					{ required: true, message: "身份证号为必填" },
					{
						type: "validId",
						message: "身份证格式不正确",
						validator: dataValidity
					},
					{
						type: "validId",
						message: "身份证格式不正确",
						validator: dataValidity
					},
					{
						message: "身份证长度有误",
						min: 18
					}
				],
				id_card_url: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				],
				position_name: [
					{
						required: true,
						message: "证明方式为必选",
						trigger: "change"
					}
				],
				birthday: [
					{
						required: true,
						pattern: /.+/,
						message: "公历生日为必选",
						trigger: "change"
					}
				],
				predict_entry_time: [
					{
						required: true,
						pattern: /.+/,
						message: "入职时间为必选",
						trigger: "change"
					}
				],
				party_standing_time: [
					{
						required: true,
						pattern: /.+/,
						message: "入党时间为必选",
						trigger: "change"
					}
				],
				politics_status: [
					{
						required: true,
						message: "政治面貌为必选",
						type: "number",
						trigger: "change"
					}
				],
				has_medical_history: [
					{
						required: true,
						message: "重大病史为必选",
						trigger: "change"
					}
				],
				medical_history: [
					{
						required: true,
						message: "病史说明为必填",
						trigger: "blur"
					}
				],
				birthday_type: [
					{
						required: true,
						message: "生日类型为必选",
						trigger: "change"
					}
				],
				has_degree_prove: [
					{
						required: true,
						message: "学历证明方式为必选",
						trigger: "change"
					}
				],
				degree_witness: [
					{
						required: true,
						message: "学历证明人为必选",
						trigger: "change"
					},
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				degree_prove: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				],
				has_leaving_prove: [
					{
						required: true,
						message: "离职证明方式为必选",
						trigger: "change"
					}
				],
				leaving_prove: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				],
				leaving_witness_company: [
					{ required: true, message: "原公司名称为必填" }
				],
				leaving_witness_address: [
					{ required: true, message: "原公司地址为必填" }
				],
				leaving_superior: [
					{ required: true, message: "上司姓名为必填" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				degree_witness_phone: [
					{ required: true, message: "证明人联系方式为必填" },
					{
						type: "validContact",
						message: "联系方式格式不正确",
						validator: dataValidity
					}
				],
				leaving_superior_phone: [
					{ required: true, message: "上司联系方式为必填" },
					{
						type: "validContact",
						message: "联系方式格式不正确",
						validator: dataValidity
					}
				],
				family_name: [
					{ required: true, message: "姓名为必填", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
				],
				family_relation: [
					{ required: true, message: "与本人关系为必填", trigger: "blur" }
				],
				family_phone: [
					{ required: true, message: "手机号为必填", trigger: "blur" },
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				family_job_address: [
					{ required: true, message: "工作单位为必填", trigger: "blur" }
				],
				family_job_new_address: [
					{ required: true, message: "地址为必填", trigger: "blur" }
				],
				important_name: [
					{ required: true, message: "姓名为必填" },
					{ type: 'validCompellation', 
						message: '请输入正确的姓名',
						validator: dataValidity,
						trigger: "blur"
					}
				],
				important_relation: [
					{ required: true, message: "与本人关系为必填" }
				],
				important_phone: [
					{ required: true, message: "手机号为必填" },
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}
				],
				important_company: [
					{ required: true, message: "工作单位名称为必填" }
				],
				important_address: [
					{ required: true, message: "现住地址为必填" }
				],
				no_leaving_prove_reason: [
					{ required: true, message: "离职证明暂无的理由为必填" }
				],
				no_degree_prove_reason: [
					{ required: true, message: "学历证明暂无的理由为必填" }
				],
				my_opinion: [
					{ required: true, message: "公司环境为必填" }
				],
				my_target: [
					{ required: true, message: "首月目标为必填" }
				],
				leaving_procedure: [
					{ required: true, message: "离职手续为必选", trigger: "change" }
				],
				labor_dispute: [
					{ required: true, message: "劳动纠纷为必选", trigger: "change" }
				],
				competition_agreement: [
					{ required: true, message: "竞业协议为必选", trigger: "change" }
				],
			}
		};
	},
	mounted() {
		this.loadProfileData();
	},
	methods: {
		loadProfileData() {
			let applicantId = this.$route.query;
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_PROFILE_DETAILS_GET,
				type: "GET",
				param: {
					applicant_id: this.$route.query.applicant_id
				}
			}).then(res => {
				if (res.data.id_card_url.length == 0) {
					const { id_card_url, ...rest } = res.data;
					this.formValidate = {
						...rest,
						id_card_url: this.formValidate.id_card_url

					};
				} else {
					this.formValidate = { ...this.formValidate, ...res.data };
				}
				res.data.depart_id[0] && this.handleEntryPosition(res.data.depart_id[0]);
				if (res.data.family && res.data.family.length === 0) {
					this.formValidate.family.push({
						family_name: "", // 家庭成员名称
						family_relation: "", // 家庭成员与本人的关系
						family_phone: "", // 手机号
						family_job_address: "", // 工作单位
						family_job_new_address: "" // 现住住址
					}, {
						family_name: "", // 家庭成员名称
						family_relation: "", // 家庭成员与本人的关系
						family_phone: "", // 手机号
						family_job_address: "", // 工作单位
						family_job_new_address: "" // 现住住址
					});
				}
				this.info = res.data;
			}).catch(err => { });
		},
		handleAddFamily() {
			this.formValidate.family.push({
				family_name: "", // 家庭成员名称
				family_relation: "", // 家庭成员与本人的关系
				family_phone: "", // 手机号
				family_job_address: "", // 工作单位
				family_job_new_address: "" // 现住住址
			});
		},
		handleDel(index) {
			this.formValidate.family.splice(index, 1);
		},
		handleEdit() {
			this.status = !this.status;
		},
		handleChange(value, selectedData) {
			this.formValidate.position_id = "";
			this.positionArr = [];
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API_ROOT.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSubmit: lodash.debounce(function (isSave, doPrint) {
			this.$refs.form.validateAndScroll(isValid => {
				if (isValid) {
					this.formValidate.birthday = this.formValidate.birthday ? moment(this.formValidate.birthday).format(
						"YYYY-MM-DD"
					) : '';
					this.formValidate.predict_entry_time = this.formValidate.predict_entry_time ? moment(this.formValidate.predict_entry_time).format(
						"YYYY-MM-DD"
					) : '';
					this.$request({
						url:
							API_ROOT._HR_EMPLOYEE_SUMMARY_PROFILE_EIND_INFO_POST,
						type: "POST",
						param: {
							applicant_id: this.$route.query.applicant_id,
							...this.formValidate,
							birthday: this.formValidate.birthday,
							predict_entry_time: this.formValidate.predict_entry_time,
						}
					}).then(res => {
						this.$Message.success(res.msg);
						if (isSave) {
							this.$router.go(-1);
						} else {
							this.info = { ...this.formValidate };
							this.$forceUpdate();
							this.$nextTick(doPrint);
						}
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		}, 300),
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handlePrint() {
			this.handleSubmit(false, this.$refs.pageTarget.print);
		},
	}
};
</script>

<style lang="scss" >
.v-hr-summary-profile {
	height: inherit;
	overflow: auto;
	padding-bottom: 68px;
	.ivu-form .ivu-form-item-label {
		color: #838695 !important;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 0;
	}
	._do {
		.__add {
			display: inline-block;
			font-size: 14px;
			margin-left: 24px;
		}
	}
	._family {
		margin-left: -20px;
		padding: 30px 0 0 20px;
		background-color: #fafafa;
		position: relative;
		margin-bottom: 10px;
	}
	._del {
		position: absolute;
		top: 6px;
		right: 44px;
		font-size: 14px;
		display: inline-block;
	}
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 999;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>