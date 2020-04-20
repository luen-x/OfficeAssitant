<template>
	<div class="g-flex g-jc-c v-hr-form-enter-register">
		<i-form
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="130"
			class="_form"
			position="left"
		>
			<div class="__title">个人资料</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item label="姓名:" prop="applicant_name">
					<i-input
						v-model="info.applicant_name"
						:maxlength="10"
						clearable
						style="width: 300px"
						placeholder="请输入姓名"
					/>
				</i-form-item>
				<i-form-item label="性别:" prop="sex">
					<i-radio-group v-model="info.sex" style="width: 300px;">
						<i-radio label="0">男</i-radio>
						<i-radio label="1" style="margin-left:50px">女</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="民族:" prop="nation_id">
					<i-select
						v-model="info.nation_id"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择民族"
					>
						<i-option
							v-for="(item, index) in nations"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="婚否:" prop="is_married">
					<i-radio-group v-model="info.is_married" style="width: 300px;">
						<i-radio label="1">已婚</i-radio>
						<i-radio label="0" style="margin-left:50px">未婚</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="手机号码:" prop="mobile">
					<i-input
						v-model="info.mobile"
						:maxlength="11"
						clearable
						style="width: 300px"
						placeholder="请输入手机号码"
					/>
				</i-form-item>
				<i-form-item label="招商银行卡号:" prop="bank">
					<i-input
						v-model="info.bank"
						:maxlength="16"
						clearable
						style="width: 300px"
						placeholder="请输入招商银行卡号"
					/>
				</i-form-item>
				<i-form-item label="开户行:">
					<i-input
						v-model="info.opening_bank"
						:maxlength="50"
						style="width:300px"
						placeholder="请输入开户行"
					/>
				</i-form-item>
				<i-form-item label="网银状态:">
					<i-radio-group v-model="info.e_bank_status" style="width: 300px;">
						<i-radio label="1">已开启</i-radio>
						<i-radio label="2" style="margin-left:50px">未开启</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="入职时间:" prop="predict_entry_time">
					<i-date-picker
						:value="info.predict_entry_time"
						:split-panels="true"
						style="width:300px"
						placeholder="请选择入职时间"
						type="date"
						transfer
						@on-change="handleChange($event, 'predict_entry_time')"
					/>
				</i-form-item>
				<i-form-item label="入职部门:" prop="depart_id">
					<i-cascader
						v-model="info.depart_id"
						:data="noTokenDepartAll"
						:change-on-select="true"
						style="width:300px"
						clearable
						transfer
						trigger="click"
						placeholder="请选择部门"
						@on-change="handleDepartChange"
					/>
				</i-form-item>
				<i-form-item label="职位:" prop="position_id">
					<i-select
						v-model="info.position_id"
						style="width:300px"
						clearable
						transfer
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
				<i-form-item label="师傅是谁:">
					<i-input
						v-model="info.master"
						:maxlength="10"
						style="width:300px"
						placeholder="请输入师傅"
					/>
				</i-form-item>
				<i-form-item label="重大病史:" prop="has_medical_history">
					<i-radio-group v-model="info.has_medical_history">
						<i-radio label="1">有</i-radio>
						<i-radio label="2" style="margin-left:50px">无</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="info.has_medical_history=='1'" label="病史说明:" prop="medical_history">
					<oa-limit-words
						v-model="info.medical_history"
						:max="200"
						style="width:300px"
						placeholder="请详细说明情况，便于工作岗位和强度安排"
					/>
				</i-form-item>
			</div>

			<!-- 身份信息 -->
			<div class="__title">身份信息</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="身份证号:" prop="id_card">
					<i-input
						v-model="info.id_card"
						:maxlength="18"
						clearable
						style="width: 300px"
						placeholder="请输入身份证号"
					/>
				</i-form-item>
				<i-form-item label="生日类型:" prop="birthday_type">
					<i-radio-group v-model="info.birthday_type" style="width: 300px;">
						<i-radio label="0">公历</i-radio>
						<i-radio label="1" style="margin-left:50px">农历</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="公历生日:" prop="birthday">
					<i-date-picker
						:value="info.birthday"
						type="date"
						style="width: 300px;"
						placeholder="请选择公历生日"
						@on-change="handleChange($event, 'birthday')"
					/>
				</i-form-item>
				<i-form-item label="职称/技能:" prop="school_job">
					<i-input
						v-model="info.school_job"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入职称/技能"
					/>
				</i-form-item>
				<i-form-item label="爱好/特长:">
					<i-input
						v-model="info.hobby"
						:maxlength="20"
						placeholder="请输入爱好/特长"
						style="width:300px"
					/>
				</i-form-item>
				<i-form-item label="政治面貌:" prop="politics_status">
					<i-select
						v-model="info.politics_status"
						clearable
						style="width:300px"
						placeholder="请选择政治面貌"
					>
						<i-option
							v-for="(item, index) in politics"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item
					v-if="info.politics_status===2"
					label="入党时间:"
					prop="party_standing_time"
				>
					<i-date-picker
						v-model="info.party_standing_time"
						style="width:300px"
						type="month"
						format="yyyy-MM"
						placeholder="请选择入党时间"
						@on-change="info.party_standing_time=$event"
					/>
				</i-form-item>
				<i-form-item label="身份证上传:" >
					<vc-imgs-picker
						v-model="info.id_card_url"
						:max="2"
						:upload="{multiple: true, max: 2}"
						style="width: 300px"
						@error="handleError"
					/>
				</i-form-item>
			</div>

			<!-- 学历证明 -->
			<div class="__title">学历证明</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="离职手续:" prop="leaving_procedure">
					<i-radio-group v-model="info.leaving_procedure" style="width: 300px">
						<i-radio label="1">已经办完</i-radio>
						<i-radio label="2" class="g-m-l-10">尚未办完</i-radio>
						<i-radio label="3" class="g-m-l-10">首次工作</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="劳动纠纷:" prop="labor_dispute">
					<i-radio-group v-model="info.labor_dispute" style="width: 300px">
						<i-radio label="2">无</i-radio>
						<i-radio label="1" class="g-m-l-10">有</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item 
					v-if="info.depart_id&&info.depart_id.length&&!info.depart_id.includes(info.sale_depart_id)" 
					label="竞业协议:" 
					prop="competition_agreement">
					<i-radio-group v-model="info.competition_agreement" style="width: 300px">
						<i-radio label="2">与原单位无有效协议</i-radio>
						<i-radio label="1" class="g-m-l-10">与原单位有有效协议</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="证明方式:" prop="has_degree_prove">
					<i-radio-group v-model="info.has_degree_prove">
						<i-radio label="1">学历证书</i-radio>
						<i-radio label="0" style="margin-left:50px">证明人</i-radio>
						<i-radio label="2" style="margin-left:50px">暂无</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item v-if="info.has_degree_prove === '1'" label="学历证书:" prop="degree_prove">
					<vc-imgs-picker
						v-model="info.degree_prove"
						:max="10"
						:upload="uploadset"
						style="width: 300px"
						@error="handleError"
					/>
				</i-form-item>
				<template v-if="info.has_degree_prove === '0'">
					<i-form-item label="证明人姓名:" prop="degree_witness">
						<i-input
							v-model="info.degree_witness"
							:maxlength="10"
							clearable
							style="width: 300px"
							placeholder="请输入证明人姓名"
						/>
					</i-form-item>
					<i-form-item label="证明人联系方式:" prop="degree_witness_phone">
						<i-input
							v-model="info.degree_witness_phone"
							:maxlength="20"
							clearable
							style="width: 300px"
							placeholder="请输入证明人联系方式"
						/>
					</i-form-item>
				</template>
			</div>
			<template v-if="info.has_degree_prove=='2'">
				<i-form-item label="暂无理由:" prop="no_degree_prove_reason">
					<oa-limit-words
						v-model="info.no_degree_prove_reason"
						:max="200"
						style="width:300px"
						placeholder="请输入暂无理由"
					/>
				</i-form-item>
			</template>
			<!-- 离职证明 -->
			<div class="__title">离职证明</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="证明方式:" prop="has_leaving_prove">
					<i-radio-group v-model="info.has_leaving_prove" style="width: 300px;">
						<i-radio label="1">离职证明</i-radio>
						<i-radio label="0">证明人</i-radio>
						<i-radio label="2">暂无</i-radio>
						<i-radio label="4">首次工作</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item
					v-if="info.has_leaving_prove == '1'"
					label="离职证明:"
					prop="leaving_prove"
				>
					<vc-imgs-picker
						v-model="info.leaving_prove"
						:max="10"
						:upload="uploadset"
						style="width: 300px"
						@error="handleError"
					/>
				</i-form-item>
				<template v-if="info.has_leaving_prove == '0'">
					<i-form-item label="原公司名称:" prop="leaving_witness_company">
						<i-input
							v-model="info.leaving_witness_company"
							:maxlength="20"
							clearable
							style="width: 300px"
							placeholder="请输入原公司名称"
						/>
					</i-form-item>
					<i-form-item label="原公司地址:" prop="leaving_witness_address">
						<i-input
							v-model="info.leaving_witness_address"
							:maxlength="50"
							style="width: 300px"
							placeholder="请输入原公司地址"
						/>
					</i-form-item>
					<i-form-item label="直接上司:" prop="leaving_superior">
						<i-input
							v-model="info.leaving_superior"
							:maxlength="10"
							clearable
							style="width: 300px"
							placeholder="请输入直接上司"
						/>
					</i-form-item>
					<i-form-item label="上司联系方式:" prop="leaving_superior_phone">
						<i-input
							v-model="info.leaving_superior_phone"
							:maxlength="20"
							clearable
							style="width: 300px"
							placeholder="请输入直接上司联系方式"
						/>
					</i-form-item>
				</template>
			</div>
			<i-form-item
				v-if="info.has_leaving_prove=='2'"
				label="暂无理由:"
				prop="no_leaving_prove_reason"
			>
				<oa-limit-words
					v-model="info.no_leaving_prove_reason"
					:max="200"
					style="width:300px"
					placeholder="请输入暂无理由"
				/>
			</i-form-item>
			<!-- 家庭成员 -->
			<div class="__title">
				家庭成员
				<span class="g-operation g-m-l-10" @click="handleAddFamily">添加</span>
			</div>
			<div
				v-for="(item, index) in info.family"
				:key="index"
				:class="index > 0 ? 'g-bt g-pd-t-20' : ''"
				class="g-flex g-jc-sb g-fw-w"
			>
				<p
					v-if="index > 0"
					style="width: 600px; margin-left: 60px; font-size: 13px"
					class="g-pd-b-10 g-c-black3"
				>
					新增家庭成员
					<span class="g-operation g-m-l-10" @click="handleDelFamily(index)">删除</span>
				</p>
				<i-form-item
					:prop="'family.' + index + '.family_name'"
					:rules="ruleValidate.family_name"
					label="姓名:"
				>
					<i-input
						v-model="item.family_name"
						:maxlength="10"
						clearable
						style="width: 300px"
						placeholder="请输入姓名"
					/>
				</i-form-item>
				<i-form-item
					:prop="'family.' + index + '.family_relation'"
					:rules="ruleValidate.family_relation"
					label="与本人关系:"
				>
					<i-input
						v-model="item.family_relation"
						:maxlength="10"
						clearable
						style="width: 300px"
						placeholder="请输入与本人关系"
					/>
				</i-form-item>
				<i-form-item
					:prop="'family.' + index + '.family_phone'"
					:rules="ruleValidate.family_phone"
					label="手机号:"
				>
					<i-input
						v-model="item.family_phone"
						:maxlength="11"
						clearable
						style="width: 300px"
						placeholder="请输入手机号"
					/>
				</i-form-item>
				<i-form-item
					:prop="'family.' + index + '.family_job_address'"
					:rules="ruleValidate.family_job_address"
					label="工作单位:"
				>
					<i-input
						v-model="item.family_job_address"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入工作单位"
					/>
				</i-form-item>
				<i-form-item
					:prop="'family.' + index + '.family_job_new_address'"
					:rules="ruleValidate.family_job_new_address"
					label="现居住地址:"
				>
					<i-input
						v-model="item.family_job_new_address"
						:maxlength="50"
						clearable
						style="width: 300px"
						placeholder="请输入现居住地址"
					/>
				</i-form-item>
			</div>

			<!-- 紧急联系人 -->
			<div class="__title">紧急联系人</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="姓名:" prop="important_name">
					<i-input
						v-model="info.important_name"
						:maxlength="10"
						clearable
						style="width: 300px"
						placeholder="请输入姓名"
					/>
				</i-form-item>
				<i-form-item label="与本人关系:" prop="important_relation">
					<i-input
						v-model="info.important_relation"
						:maxlength="10"
						style="width: 300px"
						placeholder="请输入与本人关系"
					/>
				</i-form-item>
				<i-form-item label="手机号:" prop="important_phone">
					<i-input
						v-model="info.important_phone"
						:maxlength="11"
						clearable
						style="width: 300px"
						placeholder="请输入手机号"
					/>
				</i-form-item>
				<i-form-item label="工作单位:" prop="important_company">
					<i-input
						v-model="info.important_company"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入工作单位"
					/>
				</i-form-item>
				<i-form-item label="现居住地址:" prop="important_address">
					<i-input
						v-model="info.important_address"
						:maxlength="50"
						clearable
						style="width: 300px"
						placeholder="请输入现居住地址"
					/>
				</i-form-item>
			</div>

			<!-- 我的看法 市场部有 -->
			<template v-if="info.depart_type == 1">
				<div class="__title">我的看法</div>
				<div class="g-flex">
					<!-- <div
						class="g-c-black2 g-m-b-10"
					>通过3天你和公司的互相交流，你觉得公司是一个什么样的环境的公司，与你之前了解的公司或者工作过的公司有何区别？（如果没有不一样的地方可略过）</div>
					<i-form-item prop="my_opinion">
						<oa-limit-words
							v-model="info.my_opinion"
							:max="200"
							style="width: 520px; margin-left: -120px"
							placeholder="请输入内容"
						/>
					</i-form-item>
					<div class="g-c-black2 g-m-b-10">接下来第一个月你给自己定的目标是什么？你是怎么计划完成你的目标的。</div>
					<i-form-item prop="my_target">
						<oa-limit-words
							v-model="info.my_target"
							:max="200"
							style="width: 520px; margin-left: -120px"
							placeholder="请输入内容"
						/>
					</i-form-item> -->
					<i-form-item prop="my_opinion" label="公司环境">
						<oa-limit-words
							v-model="info.my_opinion"
							:max="200"
							style="width:300px"
							placeholder="通过3天你和公司的互相交流，你觉得公司是一个什么样的环境的公司，与你之前了解的公司或者工作过的公司有何区别？（如果没有不一样的地方可略过）"
						/>
					</i-form-item>
					<i-form-item prop="my_target" label="首月目标" style="margin-left:120px">
						<oa-limit-words
							v-model="info.my_target"
							:max="200"
							style="width:300px"
							placeholder="接下来第一个月你给自己定的目标是什么？你是怎么计划完成你的目标的。"
						/>
					</i-form-item>
				</div>
			</template>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-enter-register :info="info" />
			</vc-print>
		</div>

		<footer class="g-flex-cc">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handlePrint">打印</vc-debounce-click>
			<vc-debounce-click v-if="!isSaved" class="g-red-btn-small" @click="handleSave">提交</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, CheckboxGroup, Checkbox, DatePicker, Cascader
} from 'iview';
import { Print, ImgsPicker } from 'wya-vc';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { dataValidity } from '@utils/utils';
import LimitWords from '@components/_common/limit-words/limit-words';
import PrintEnterRegister from './print/enter-register';

export default {
	name: 'hr-form-enter-register',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-date-picker': DatePicker,
		'vc-print': Print,
		'vc-imgs-picker': ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-print-enter-register': PrintEnterRegister,
		"i-cascader": Cascader,
	},
	mixins: [
		services.nations(), services.politics(), services.noTokenDepartAll()
	],
	data() {
		const validateMobile = (rule, value, callback) => {
			this.$request({
				url: API_ROOT['_HR_FORM_ENTER_VALID_MOBILE_POST'],
				type: "POST",
				param: {
					mobile: value
				},
				loading: false
			}).then(res => {
				if (!res.data.is_entry) {
					callback();
				} else {
					callback(new Error('该手机号码绑定的人员已入职'));
				}

			}).catch(error => {
				callback(new Error(error.msg));
			});
		};
		return {
			positionArr: [],
			isSaved: false,
			uploadset: {
				multiple: true,
				max: 10
			},
			info: {
				family: [{}],
				depart_type: +this.$route.query.depart_type,
				
				politics_status: null,
			},
			ruleValidate: {
				applicant_name: [
					{ required: true, message: '请输入姓名' },
					{ type: 'validCompellation', message: '姓名格式不正确', validator: dataValidity, trigger: 'blur' }
				],
				sex: [{ required: true, message: '请选择性别' }],
				is_married: [{ required: true, message: '请选择是否已婚' }],
				mobile: [
					{ required: true, message: '请输入手机号码' },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity },
					{ validator: validateMobile, trigger: 'blur' }
				],
				bank: [{ type: 'validLetterAndNumber', message: '请输入正确的银行卡号', validator: dataValidity, trigger: 'blur' }],
				id_card: [
					{ required: true, message: '请输入身份证号' },
					{ type: 'validIDCards', validator: dataValidity, trigger: 'blur' }
				],
				birthday: [{ required: true, message: '请选择公历生日' }],
				birthday_type: [{ required: true, message: '请选择生日类型' }],
				id_card_url: [{ required: true, type: 'array', message: '请上传身份证' }],
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
						message: "联系格式不正确",
						validator: dataValidity
					}
				],
				leaving_superior_phone: [
					{ required: true, message: "上司联系方式为必填" },
					{
						type: "validContact",
						message: "联系格式不正确",
						validator: dataValidity
					}
				],
				family_name: [
					{ required: true, message: '请输入姓名' },
					{ type: 'validCompellation', message: '姓名格式不正确', validator: dataValidity, trigger: 'blur' }
				],
				family_relation: [{ required: true, message: '请输入与本人的关系' }],
				family_phone: [
					{ required: true, message: '请输入手机号' },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity }
				],
				family_job_address: [{ required: true, message: '请输入工作单位' }],
				family_job_new_address: [{ required: true, message: '请输入现居住地址' }],
				important_name: [
					{ required: true, message: '请输入姓名' },
					{ type: 'validCompellation', message: '姓名格式不正确', validator: dataValidity, trigger: 'blur' }
				],
				important_relation: [{ required: true, message: '请输入与本人的关系' }],
				important_phone: [
					{ required: true, message: '请输入手机号' },
					{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity }
				],
				important_company: [{ required: true, message: '请输入工作单位' }],
				important_address: [{ required: true, message: '请输入现居住地址' }],
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
				predict_entry_time: [
					{
						required: true,
						pattern: /.+/,
						message: "入职时间为必选",
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
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_ENTER_REGISTER_GET'],
				type: "GET",
				param: {
					...this.$route.query
				}
			}).then((res) => {
				this.info = {
					...this.info,
					...res.data
				};
				res.data.depart_id[0] && this.handleEntryPosition(res.data.depart_id[0]);
				res.data.family.length === 0 && this.info.family.push({}, {});
				this.isSaved = res.data.is_submit == 0;
				this.info.mobile = '';
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(value, type) {
			this.info[type] = value;
		},
		handleDelFamily(index) {
			this.info.family.splice(index, 1);
		},
		handleAddFamily() {
			this.info.family.push({

			});
		},
		handleDepartChange(value, selectedData) {
			this.info.position_id = "";
			this.positionArr = [];
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API_ROOT._HR_FORM_ENTER_POSITION_GET,
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
		async handlePrint() {
			if (this.isSaved) {
				this.$refs.pageTarget.print();
			} else {
				let success = await this.handleSave();
				if (success) {
					this.$refs.pageTarget.print();
				}
			}
		},
		handleSave() {
			return new Promise((resolve, reject) => {
				this.$refs.formValidate.validateAndScroll((valid) => {
					if (valid) {
						resolve();
					}
				});
			}).then((res) => {
				return this.$request({
					url: API_ROOT['_HR_FORM_ENTER_REGISTER_POST'],
					type: "POST",
					param: {
						...this.info,
						...this.$route.query,
						ei_entrance_type: 1,
					}
				}).then(res => { // eslint-disable-line
					this.$Message.success('保存成功!');
					return true;
				}).catch(error => {
					this.$Message.error(error.msg);
					return null;
				});
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		}
	},
};
</script>

<style lang="scss">
.v-hr-form-enter-register {
	._form {
		.__title {
			margin-left: 0 !important;
		}
	}
	.ivu-form .ivu-form-item-label {
		color: #838695 !important;
	}
	.ivu-radio-wrapper:first-child {
		margin-right: 0 !important;
    }
	.vcp-imgs-picker .__normal {
		width: 74px !important;
		height: 74px !important;
		padding: 4px;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.vcp-imgs-picker .__normal .__img {
		width: 66px !important;
		height: 66px !important;
	}
}
</style>
