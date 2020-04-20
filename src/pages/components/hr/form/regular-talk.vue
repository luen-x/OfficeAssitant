<template>
	<div class="g-flex-ac g-fd-c v-hr-form-regular-talk">
		<i-form
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="100"
			class="_form"
			label-position="right"
		>
			<div class="__title">
				基本信息
				<i-poptip trigger="hover" placement="bottom-start">
					<i class="iconfont icon-complaint g-c-yellow g-pointer" />
					<div slot="content" class="g-c-black2">
						<div style="width: 300px; white-space: normal">
							<div>1.由转正人员或上级主管到人力资源绩效组领取转正面谈单。</div>
							<div>2.在面谈前，由被面谈者先填写表格基本信息后，开始面谈，面谈结束后，面谈者签字。</div>
							<div>3.面谈结束后，由面谈者（总监、经理或部门负责人）将入职面谈单交至人力资源部绩效组。</div>
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
				<i-form-item label="用人部门:">
					<p style="width: 300px">
						{{ info.depart_name }}
					</p>
				</i-form-item>
				<i-form-item label="上级主管:" prop="supervisor">
					<i-input
						v-model="info.supervisor"
						:maxlength="50"
						clearable
						style="width: 300px"
						placeholder="请输入员工姓名"
					/>
				</i-form-item>
				<i-form-item label="转正日期:" prop="regular_date">
					<i-date-picker
						v-model="info.regular_date"
						type="date"
						style="width: 300px;"
						placeholder="请选择转正日期"
						@on-change="handleChange($event, 'regular_date')"
					/>
				</i-form-item>
				<i-form-item label="面谈地点:" prop="interview_place">
					<i-input
						v-model="info.interview_place"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入面谈地点"
					/>
				</i-form-item>
			</div>

			<!-- 面谈信息 -->
			<div class="__title">面谈信息</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item prop="sex">
					<i-checkbox-group
						v-model="info.interview_msg"
						style="max-width: 900px; min-width: 370px; margin-left: -30px"
						class="g-flex g-fw-w g-jc-sb"
					>
						<i-checkbox label="1" style="width: 370px">你是否感觉你对公司和工作的期望得到了满足？</i-checkbox>
						<i-checkbox label="2" style="width: 370px">试用期间对工作适应与否？</i-checkbox>
						<i-checkbox label="3" style="width: 370px">试用期间自己主要的工作任务达成情况？</i-checkbox>
						<i-checkbox label="4" style="width: 370px">您觉得目前自己的工作量是否饱和？工作中你是怎么分配时间的？</i-checkbox>
						<i-checkbox label="5" style="width: 370px">你喜欢公司的地方是什么？最不喜欢的是什么？</i-checkbox>
						<i-checkbox label="6" style="width: 370px">同事间的工作氛围、工作环境的感受，有何建议？</i-checkbox>
						<i-checkbox label="7" style="width: 370px">自我感觉不足的地方是什么？</i-checkbox>
						<i-checkbox label="8" style="width: 370px">以后准备从哪些方面完善自己，把工作做好？</i-checkbox>
						<i-checkbox label="9" style="width: 370px">目前工作存在哪些方面的困难？需要什么样的帮助？</i-checkbox>
						<i-checkbox label="10" style="width: 370px">其他</i-checkbox>
					</i-checkbox-group>
				</i-form-item>
			</div>
			<!-- 对接结果 -->
			<div class="__title">对接结果</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item label="备注:" prop="interview_result" style="width: 500px">
					<oa-limit-words
						v-model="info.interview_result"
						:max="500"
						style="width: 300px"
						placeholder="请输入面谈备注"
					/>
				</i-form-item>
			</div>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-regular-talk :info="info"/>
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
	Select, Option, CheckboxGroup, Checkbox, DatePicker, Poptip
} from 'iview';
import { Print, ImgsPicker } from 'wya-vc';
import moment from 'moment';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import PrintRegularTalk from './print/regular-talk';

export default {
	name: 'hr-form-regular-talk',
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
		'oa-print-regular-talk': PrintRegularTalk,
	},
	mixins: [
		services.nations()
	],
	data() {
		return {
			isSaved: false,
			info: {

			},
			ruleValidate: {
				regular_date: [{ required: true, message: '请选择转正日期' }],
				interview_place: [{ required: true, message: '请输入面谈地点' }]
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_REGULAR_TALK_GET'],
				type: "POST",
				param: {
					...this.$route.query,
					scenario: 3,
					entrance_type: 1
				}
			}).then((res) => {
				this.info = {
					...this.info,
					...res.data
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
			this.info.regular_date = this.info.regular_date ? moment(this.info.regular_date).format('YYYY-MM-DD') : '';
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
				this.info.regular_date = this.info.regular_date ? moment(this.info.regular_date).format('YYYY-MM-DD') : '';
				return this.$request({
					url: API_ROOT['_HR_FORM_REGULAR_TALK_POST'],
					type: "POST",
					param: {
						scenario: 3,
						type: 1,
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
.v-hr-form-regular-talk {
	padding: 20px;
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
