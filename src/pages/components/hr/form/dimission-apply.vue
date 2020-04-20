<template>
	<div class="g-flex-ac g-fd-c v-hr-form-dimission-apply">
		<i-form
			v-if="info.code !== 400"
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="140"
			class="_form"
			label-position="right"
		>
			<div class="__title">
				基本信息
				<i-poptip trigger="hover" placement="bottom-start">
					<i class="iconfont icon-complaint g-c-yellow g-pointer" />
					<div slot="content" class="g-c-black2">
						<div style="width: 300px; white-space: normal">
							<div>离职流程：</div>
							<div>1、本表依人事部管理审批权限逐级核准，基层：各部门经理→事业部总监；中层：本部门经理→综合部经理→总监→总经理；高层：公司高管→总经理</div>
							<div>2、离职申请递交周期：员工按照主管要求履行（商务代表：7个工作日内的工作交接，已交社保者：30个工作日内的工作交接，公司基层管理职位以上选择社保补贴者，15个工作日内工作交接， 其他事业部工作人员 30个工作日工作交接）</div>
							<div>3、离职申请一经提交任何休假公司将不予批准并请于核准离职日期之前办理相应的工作交接</div>
						</div>
					</div>
				</i-poptip>
			</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="姓名:" prop="staff_name">
					<p style="width: 300px">
						{{ info.staff_name }}
					</p>
				</i-form-item>
				<i-form-item label="工号:" prop="staff_number">
					<p style="width: 300px">
						{{ info.staff_number }}
					</p>
				</i-form-item>
				<i-form-item label="部门:" prop="depart_name">
					<p style="width: 300px">
						{{ info.depart_name }}
					</p>
				</i-form-item>
				<i-form-item label="入职日期:" prop="entry_date">
					<p style="width: 300px">
						{{ info.entry_date }}
					</p>
				</i-form-item>
				<i-form-item label="职位:" prop="position_name">
					<p style="width: 300px">
						{{ info.position_name }}
					</p>
				</i-form-item>
				<i-form-item label="离职类别:" prop="leave_type">
					<i-select
						v-model="info.leave_type"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择离职类别"
					>
						<i-option
							v-for="(item, index) in leaveType"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="学历:" prop="education">
					<p style="width: 300px">
						{{ info.education }}
					</p>
				</i-form-item>
				<i-form-item label="申请离职日期:" prop="apply_date">
					<i-date-picker
						:value="info.apply_date"
						type="date"
						style="width: 300px;"
						placeholder="请选申请离职日期"
						@on-change="handleChange($event, 'apply_date')"
					/>
				</i-form-item>
				<i-form-item label="截止上班日期:" prop="stop_date">
					<i-date-picker
						:value="info.stop_date"
						type="date"
						style="width: 300px;"
						placeholder="请选截止上班日期"
						@on-change="handleChange($event, 'stop_date')"
					/>
				</i-form-item>
			</div>

			<!-- 离职原因 -->
			<div class="__title">离职原因</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="离职原因:" prop="leave_reason" style="width: 600px">
					<i-select
						v-model="info.leave_reason"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择离职原因"
					>
						<i-option
							v-for="(item, index) in leaveReason"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<!-- 个人原因 -->
				<i-form-item label="个人原因:" prop="applicant_name">
					<i-checkbox-group
						v-model="info.person_reason"
						style="max-width: 820px; min-width: 300px;"
						class="g-flex g-fw-w g-jc-sb"
					>
						<i-checkbox label="1" style="width: 300px">
							家庭因素
							<i-input
								v-if="(info.person_reason || []).indexOf('1') > -1"
								v-model="info.other_family_reason"
								:maxlength="50"
								clearable
								style="width: 300px"
								placeholder="请输入家庭因素"
							/>
						</i-checkbox>
						<i-checkbox label="2" style="width: 300px">
							身体因素
							<i-input
								v-if="(info.person_reason || []).indexOf('2') > -1"
								v-model="info.other_body_reason"
								:maxlength="50"
								clearable
								style="width: 300px"
								placeholder="请输入身体因素"
							/>
						</i-checkbox>
						<i-checkbox label="3" style="width: 300px">
							赚不到钱
							<i-input
								v-if="(info.person_reason || []).indexOf('3') > -1"
								v-model="info.other_money_reason"
								:maxlength="50"
								clearable
								style="width: 300px"
								placeholder="请输入个人看法"
							/>
						</i-checkbox>
						<i-checkbox label="4" style="width: 300px">
							其他
							<i-input
								v-if="(info.person_reason || []).indexOf('4') > -1"
								v-model="info.other_other_reason"
								:maxlength="50"
								clearable
								style="width: 300px"
								placeholder="请输入其他因素"
							/>
						</i-checkbox>
					</i-checkbox-group>
				</i-form-item>

				<!-- 公司原因 -->
				<i-form-item label="公司原因:" prop="applicant_name">
					<i-checkbox-group
						v-model="info.company_reason"
						style="max-width: 820px; min-width: 300px;"
						class="g-flex g-fw-w g-jc-sb"
					>
						<i-checkbox label="1" style="width: 300px">对公司人文环境不满意</i-checkbox>
						<i-checkbox label="2" style="width: 300px">与上司或同事不和</i-checkbox>
						<i-checkbox label="3" style="width: 300px">对薪资待遇不满意</i-checkbox>
						<i-checkbox label="4" style="width: 300px">想从事其他行业</i-checkbox>
						<i-checkbox label="5" style="width: 300px">加班太多，休息太少</i-checkbox>
						<i-checkbox label="6" style="width: 300px">学不到东西，没有平台</i-checkbox>
						<i-checkbox label="7" style="width: 300px">
							其他
							<i-input
								v-if="(info.company_reason || []).indexOf('7') > -1"
								v-model="info.other_company_reason"
								:maxlength="200"
								clearable
								style="width: 300px"
								placeholder="请输入其他原因"
							/>
						</i-checkbox>
					</i-checkbox-group>
				</i-form-item>
			</div>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-dimission-apply :info="info" />
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
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, CheckboxGroup, Checkbox, DatePicker, Poptip
} from 'iview';
import { Print, ImgsPicker } from 'wya-vc';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import MissMatch from './miss-match';
import PrintDimissionApply from './print/dimission-apply';

export default {
	name: 'hr-form-dimission-apply',
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
		'vc-print': Print,
		'vc-imgs-picker': ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-print-dimission-apply': PrintDimissionApply,
		'oa-miss-match': MissMatch
	},
	mixins: [
		services.nations(),
		services.leaveReason(),
		services.leaveType()
	],
	data() {
		return {
			isSaved: false,
			info: {
				depart_type: this.$route.query.depart_type,
				apply_date: '',
				stop_date: ''
			},
			ruleValidate: {
				leave_type: [{ required: true, message: '请选择离职类别', pattern: /.+/, trigger: 'change' }],
				apply_date: [{ required: true, message: '请选择申请离职日期' }],
				stop_date: [{ required: true, message: '请选截止上班日期' }],
				leave_reason: [{ required: true, message: '请选择离职原因', pattern: /.+/, trigger: 'change' }],
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_DIMISSION_APPLY_GET'],
				type: "GET",
				param: {
					...this.$route.query,
					scenario: 5,
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
		handleChange(value, type) {
			this.info[type] = value;
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
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						resolve();
					}
				});
			}).then((res) => {
				return this.$request({
					url: API_ROOT['_HR_FORM_DIMISSION_APPLY_POST'],
					type: "POST",
					param: {
						scenario: 5,
						type: 2,
						...this.info,
						...this.$route.query
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
.v-hr-form-dimission-apply {
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
