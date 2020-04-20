<template>
	<div class="g-flex-ac g-fd-c v-hr-form-regular-apply">
		<i-form
			v-if="info.code !== 400"
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="150"
			class="_form"
			label-position="right"
		>
			<div class="__title">
				基本信息
				<i-poptip trigger="hover" placement="bottom-start">
					<i class="iconfont icon-complaint g-c-yellow g-pointer" />
					<div slot="content" class="g-c-black2">
						<div style="width: 300px; white-space: normal">
							<div>正常转正流程：</div>
							<div>由人力资源助理通知其转正→ 拿转正申请单（人力资源中心绩效组） → 填写好内容 → 由经理批准 →  总监批准 → 交至人力资源（申请人） → 上报财务；</div>
							<div>提前转正：</div>
							<div>本人向经理提出申请  → 拿转正申请单（人力资源中心绩效组） → 填写好内容 → 由经理批准 →  总监批准 → 交至人力资源（申请人） → 上报财务</div>
						</div>
					</div>
				</i-poptip>
			</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="姓名:">
					<p style="width: 300px">
						{{ info.staff_name }}
					</p>
				</i-form-item>
				<i-form-item label="性别:">
					<p style="width: 300px">
						{{ info.sex == '1' ? '女' : '男' }}
					</p>
				</i-form-item>
				<i-form-item label="所属部门:">
					<p style="width: 300px">
						{{ info.depart_name }}
					</p>
				</i-form-item>
				<i-form-item label="入职日期:">
					<p style="width: 300px">
						{{ info.entry_date }}
					</p>
				</i-form-item>
				<i-form-item label="试用期实际工作时间:" prop="work_day">
					<i-input-number
						v-model="info.work_day"
						:min="0"
						:max="999"
						:precision="0"
						style="width: 300px"
						placeholder="请输入实际工作月数"
					/>
				</i-form-item>
				<template v-if="info.depart_type != 3">
					<i-form-item label="转正后期待职位:" prop="forward_position">
						<i-cascader
							v-model="info.forward_position"
							:data="departPosition"
							style="width: 300px; display: inline-block"
							clearable
							transfer
							trigger="hover"
							placeholder="请选择期待职位"
							@on-change="handleChangePosition"
						/>
					</i-form-item>
				</template>


				<template v-if="info.depart_type == 2">
					<i-form-item label="试用期实发平均月薪:" prop="actual_salary" style="width: 600px">
						<i-input-number
							v-model="info.actual_salary"
							:min="0"
							:max="99999999"
							:precision="2"
							:active-change="false"
							style="width: 300px"
							placeholder="请输入实发平均月薪"
						/>
					</i-form-item>
				</template>
				<!-- 市场部 -->
				<template v-if="info.depart_type == 3">
					<i-form-item label="试用期月均约见客户数:" prop="interview_num">
						<i-input-number
							v-model="info.interview_num"
							:min="0"
							:max="9999"
							:precision="0"
							style="width: 300px"
							placeholder="请输入约见客户数"
						/>
					</i-form-item>
					<i-form-item label="试用期实际出单业绩:" prop="performance">
						<i-input-number
							v-model="info.performance"
							:min="0"
							:max="999999999"
							:precision="2"
							:active-change="false"
							style="width: 300px"
							placeholder="请输入出单业绩"
						/>
					</i-form-item>
				</template>
				<template v-if="info.depart_type != 1">
					<i-form-item label="社保补贴:" prop="social_security_type" style="width: 600px">
						<i-radio-group
							v-model="info.social_security_type"
							style="width: 300px;"
						>
							<i-radio label="1">选择社保</i-radio>
							<i-radio label="2">选择补贴</i-radio>
						</i-radio-group>
					</i-form-item>
				</template>
				<i-form-item label="户口性质:" prop="residence_type">
					<i-select
						v-model="info.residence_type"
						placeholder="请选择户口性质"
						style="width:220px"
						clearable
						transfer
					>
						<i-option
							v-for="(item,index) in residenceList"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="新增原因:" prop="social_security_reason">
					<i-select
						v-model="info.social_security_reason"
						placeholder="请选择新增原因"
						style="width:220px"
						clearable
						transfer
					>
						<i-option :value="1">新参加工作</i-option>
						<i-option :value="2">个体再就业</i-option>
					</i-select>
				</i-form-item>


				<i-form-item label="转正形式:" prop="regular_type">
					<i-radio-group
						v-model="info.regular_type"
						style="width: 300px;"
					>
						<i-radio label="0">提前转正</i-radio>
						<i-radio label="1">正常转正</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="申请次数:" prop="apply_num">
					<i-radio-group
						v-model="info.apply_num"
						style="width: 300px;"
					>
						<i-radio label="0">首次申请</i-radio>
						<i-radio label="1">第二次申请</i-radio>
					</i-radio-group>
				</i-form-item>

			</div>
		</i-form>

		<i-form
			v-if="info.code !== 400"
			ref="formContent"
			:model="info"
			:rules="ruleValidate"
			style="padding-top: 0px !important; max-width: 1000px !important; width: 100%"
			class="_form"
			label-position="top"
		>
			<div class="__title">申请正文</div>
			<div class="g-m-t-20">
				<i-form-item label="试用期间我所做的工作及取得的结果:" prop="work_result">
					<oa-limit-words
						v-model="info.work_result"
						:max="500"
						style="width: 520px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="工作中我对自己的精进:" prop="work_progress">
					<oa-limit-words
						v-model="info.work_progress"
						:max="500"
						style="width: 520px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="我对公司的价值:" prop="worth_money">
					<oa-limit-words
						v-model="info.worth_money"
						:max="500"
						style="width: 520px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="接下来半年我在本岗位的基本计划:" prop="plan">
					<oa-limit-words
						v-model="info.plan"
						:max="500"
						style="width: 520px"
						placeholder="请输入内容"
					/>
				</i-form-item>
			</div>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-regular-apply :info="info"/>
			</vc-print>
		</div>

		<footer v-if="info.code !== 400" class="g-flex-cc">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handlePrint">打印</vc-debounce-click>
			<vc-debounce-click v-if="!isSaved" class="g-red-btn-small" @click="handleSave">提交</vc-debounce-click>
		</footer>
		<oa-miss-match v-else />
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio, Cascader,
	Select, Option, CheckboxGroup, Checkbox, DatePicker, Poptip
} from 'iview';
import { Print, ImgsPicker } from 'wya-vc';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import MissMatch from './miss-match';
import PrintRegularApply from './print/regular-apply';

export default {
	name: 'hr-form-regular-apply',
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
		'i-poptip': Poptip,
		'i-cascader': Cascader,
		'vc-print': Print,
		'vc-imgs-picker': ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-print-regular-apply': PrintRegularApply,
		'oa-miss-match': MissMatch
	},
	mixins: [
		services.departPosition()
	],
	data() {
		const validateLength = (rule, value, callback) => {
			if (value.length < 200) {
				callback(new Error('字数不能少于200个字'));
			} else {
				callback();
			}
		};
		return {
			isSaved: false,
			residenceList: [],
			info: {
				depart_type: +this.$route.query.depart_type,
				work_day: null,
				actual_salary: null,
				interview_num: null,
				performance: null,
				forward_position_name: ''
			},
			ruleValidate: {
				forward_position: [{ required: true, message: '请选择期待职位' }],
				regular_type: [{ required: true, message: '请选择转正形式' }],
				apply_num: [{ required: true, message: '请选择申请次数' }],
				social_security_type: [{ required: true, message: '请选择社保补贴' }],
				interview_num: [{ required: true, message: '请输入约见客户数', type: 'number' }],
				social_security_reason: [{ required: true, message: '选择新增原因', type: 'number' }],
				residence_type: [{ required: true, message: '选择户口性质', type: 'number' }],
				performance: [{ required: true, message: '请输入出单业绩', type: 'number' }],
				work_result: [{ required: true, message: '请输入内容' }, { validator: validateLength, trigger: "blur" }],
				work_progress: [{ required: true, message: '请输入内容' }, { validator: validateLength, trigger: "blur" }],
				worth_money: [{ required: true, message: '请输入内容' }, { validator: validateLength, trigger: "blur" }],
				plan: [{ required: true, message: '请输入内容' }, { validator: validateLength, trigger: "blur" }],
			}
		};
	},
	created() {
		this.loadData();
		this.loadResidenceList();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_REGULAR_APPLY_GET'],
				type: "POST",
				param: {
					...this.$route.query,
					scenario: 3,
					staff_id: this.$route.query.staff_id,
					entrance_type: 1
				}
			}).then((res) => {
				this.info = {
					...this.info,
					...res.data,
				};
				this.isSaved = res.data.is_submit == 0;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		loadResidenceList() {
			this.$request({
				url: API_ROOT['_HR_STAFF_RESIDENCE_GET'],
				type: "POST",
				param: {}
			}).then((res) => {
				this.residenceList = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(value, type) {
			this.info[type] = value;
		},
		handleDelFamily(id) {

		},
		handleAddFamily() {
			this.info.familys.push({

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
		handleChangePosition(value, selectedData) {
			this.info.forward_position_name = selectedData.map(o => o.label).join('/');
		},
		handleSave() {
			return new Promise((resolve, reject) => {
				this.$refs.formValidate.validate((valid) => {
					this.$refs.formContent.validate((valid1) => {
						if (valid && valid1) {
							resolve();
						}
					});
				});

			}).then((res) => {
				return this.$request({
					url: API_ROOT['_HR_FORM_REGULAR_APPLY_POST'],
					type: "POST",
					param: {
						scenario: 3,
						type: 2,
						...this.info,
						...this.$route.query,
					}
				}).then(res => { // eslint-disable-line
					this.$Message.success('保存成功!');
					return true;
				}).catch(error => {
					this.$Message.error(error.msg);
					return null;
				});
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-form-regular-apply {
	padding: 20px 20px 60px 20px;
	._form {
		padding: 20px !important;
		max-width: 1000px !important;
		width: 100% !important;
		box-shadow: content-box;
		.__title {
			margin-left: 0 !important;
		}
	}
}
</style>
