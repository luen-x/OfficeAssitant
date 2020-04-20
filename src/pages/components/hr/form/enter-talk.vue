<template>
	<div class="v-hr-form-enter-talk g-flex g-jc-c">
		<i-form
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="180"
			class="_form"
			position="left"
		>
			<div class="__title">
				基本信息
				<i-poptip trigger="hover" placement="bottom-start">
					<i class="iconfont icon-complaint g-c-yellow g-pointer" />
					<div slot="content" class="g-c-black2">
						<div style="width: 200px; white-space: pre-wrap">
							<p>入职面谈流程：</p>
							<p>1.由人力资源部带新人入部门的负责人将入职面谈单交与面谈者。</p>
							<p>2.在面谈前，由被面谈者先填写表格基本信息后，开始面谈，面谈结束后，面谈者提交。</p>
						</div>
					</div>
				</i-poptip>
			</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item label="试岗员工姓名:" prop="applicant_name">
					<p style="width: 300px">
						{{ info.applicant_name }}
					</p>
				</i-form-item>
				<i-form-item label="用人部门:" prop="applicant_job">
					<p style="width: 300px">
						{{ info.depart_name }}
					</p>
				</i-form-item>
				<!-- 销售、职能 -->
				<i-form-item v-if="info.depart_type == 2" label="师傅:" prop="master">
					<i-input
						v-model="info.master"
						clearable
						style="width: 300px"
						placeholder="请输入师傅"
					/>
				</i-form-item>
				<i-form-item label="试岗日期:" prop="arrival_time">
					<i-date-picker
						:value="info.arrival_time"
						type="daterange"
						style="width: 300px;"
						clearable
						transfer
						split-panels
						placeholder="请选择试岗日期"
						@on-change="handleChange($event, 'arrival_time')"
					/>
				</i-form-item>
				<i-form-item label="面谈地点:" prop="interview_place">
					<i-input
						v-model="info.interview_place"
						clearable
						style="width: 300px"
						placeholder="请输入面谈地点"
					/>
				</i-form-item>
				<!-- 技术部 -->
				<i-form-item v-if="info.depart_type == 1" label="是否已了解薪资:" prop="is_know_compensation">
					<i-radio-group
						v-model="info.is_know_compensation"
						style="width: 300px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<!-- 面谈信息 -->
			<div class="__title">面谈信息</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item prop="sex">
					<i-checkbox-group
						v-model="info.interview_info"
						style="max-width: 900px; min-width: 350px; margin-left: -60px"
						class="g-flex g-fw-w g-jc-sb"
					>
						<i-checkbox label="1" style="width: 350px">了解其对公司基本情况的认识</i-checkbox>
						<i-checkbox label="2" style="width: 350px">了解其试岗期间对公司的感受</i-checkbox>
						<i-checkbox label="3" style="width: 350px">了解其选择我们公司的原因</i-checkbox>
						<i-checkbox label="4" style="width: 350px">了解其价值观是否与我们公司相符</i-checkbox>
						<i-checkbox label="5" style="width: 350px">了解其工作经历</i-checkbox>
						<i-checkbox label="6" style="width: 350px">了解其家庭状况</i-checkbox>
						<i-checkbox label="7" style="width: 350px">了解其对工作职位的认知，是否明确工作内容</i-checkbox>
						<i-checkbox label="8" style="width: 350px">了解其选择本职职位的原因和对待公司管理的态度</i-checkbox>
						<i-checkbox label="9" style="width: 350px">对员工的加入表示欢迎</i-checkbox>
						<i-checkbox label="10" style="width: 350px">其他</i-checkbox>
					</i-checkbox-group>
				</i-form-item>
			</div>

			<!-- 对接结果 -->
			<div class="__title">对接结果</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="与面试官/邀约手对接:" prop="is_butt_joint">
					<i-radio-group
						v-model="info.is_butt_joint"
						style="width: 300px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="与其他部门管理对接经理/师傅:" prop="is_manager_butt_joint">
					<i-radio-group
						v-model="info.is_manager_butt_joint"
						style="width: 300px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="试岗通过:" prop="is_pass_arrival">
					<i-radio-group
						v-model="info.is_pass_arrival"
						style="width: 300px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<!-- <i-form-item label="备注:" prop="remark" style="width: 500px">
					<oa-limit-words
						v-model="info.remark"
						:max="200"
						style="width: 300px"
						placeholder="请输入备注"
					/>
				</i-form-item> -->
			</div>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-enter-talk :info="info" />
			</vc-print>
		</div>

		<footer v-if="!is_person" class="g-flex-cc">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handlePrint">打印</vc-debounce-click>
			<vc-debounce-click v-if="!isSaved" class="g-red-btn-small" @click="handleSave">提交</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, CheckboxGroup, Checkbox, DatePicker, Poptip
} from 'iview';
import { Print } from 'wya-vc';
import moment from 'moment';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import PrintEnterTalk from './print/enter-talk';

export default {
	name: 'hr-form-enter-talk',
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
		'oa-limit-words': LimitWords,
		'oa-print-enter-talk': PrintEnterTalk,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			isSaved: false,
			is_person: !!query.from,
			info: {
				depart_type: +this.$route.query.depart_type,
				arrival_time: []
			},
			ruleValidate: {
				arrival_time: [{ required: true, type: 'array', message: '请选择试岗日期' }],
				interview_place: [{ required: true, message: '请输入面谈地点' }],
				is_know_compensation: [{ required: true, message: '请选择是否已了解薪资情况' }],
				is_butt_joint: [{ required: true, message: '请选择是否与面试官/邀约手对接' }],
				is_manager_butt_joint: [{ required: true, message: '请选择是否与其他部门管理对接经理/师傅' }],
				is_pass_arrival: [{ required: true, message: '请选择是否试岗通过' }],
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_ENTER_TALK_GET'],
				type: "GET",
				param: {
					...this.$route.query
				}
			}).then((res) => {
				this.info = {
					...this.info,
					...res.data,
					arrival_time: res.data.arrival_time ? res.data.arrival_time : [],
					interview_time: res.data.interview_time ? res.data.interview_time : moment().format('YYYY-MM-DD'),
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
					url: API_ROOT['_HR_FORM_ENTER_TALK_POST'],
					type: "POST",
					param: {
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
.v-hr-form-enter-talk {
	.__title {
		margin-left: 100px !important;
	}
}
</style>
