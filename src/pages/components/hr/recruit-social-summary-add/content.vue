<template>
	<div class="v-hr-recruit-summary-add g-flex g-jc-c">
		<i-form
			ref="form"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="100"
			class="_form g-flex-ac g-jc-sb g-fw-w"
			position="left"
		>
			<i-form-item :show-message="false" label="手机号码:" prop="mobile" class="_cus-error-tip" >
				<i-input
					v-model="formValidate.mobile"
					:maxlength="11"
					clearable
					style="width: 300px"
					placeholder="请输入手机号码"
				/>
				<transition name="fade">
					<div class="ivu-form-item-error-tip" style="margin-bottom:0">
						<span >{{ tip }}</span>
						<span v-if="type==2||type==3||type==5||type==8" class="g-operation" @click="handleRecover">
							点击恢复
						</span>
					</div>
				</transition>
			</i-form-item>
			<i-form-item label="姓名:" prop="applicant_name">
				<i-input
					v-model="formValidate.applicant_name"
					:maxlength="10"
					clearable
					style="width: 300px"
					placeholder="请输入姓名"
				/>
			</i-form-item>
			<i-form-item label="性别:" prop="sex">
				<i-radio-group v-model="formValidate.sex" style="width: 300px;">
					<i-radio :label="0">男</i-radio>
					<i-radio :label="1">女</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item label="应聘职位:" prop="position">
				<i-cascader
					v-model="formValidate.position"
					:data="recruitDePosition"
					style="width: 300px; display: inline-block"
					clearable
					filterable
					transfer
					trigger="hover"
					placeholder="请选择应聘职位"
				/>
			</i-form-item>
			<i-form-item label="年龄:" prop="age">
				<i-input-number
					v-model="formValidate.age"
					:min="0"
					:max="99"
					:precision="0"
					style="width: 300px"
					placeholder="请输入年龄"
				/>
			</i-form-item>
			<i-form-item label="期望薪资:" prop="salary">
				<i-input
					v-model="formValidate.salary"
					:maxlength="20"
					clearable
					style="width: 300px"
					placeholder="请输入期望薪资"
				/>
			</i-form-item>
			<i-form-item label="工作年限:" prop="work_time">
				<i-select
					v-model="formValidate.work_time"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择工作年限"
				>
					<i-option
						v-for="(item, index) in workTime"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="籍贯:" prop="region">
				<i-cascader
					v-model="formValidate.region"
					:data="region"
					style="width: 300px; display: inline-block"
					clearable
					transfer
					change-on-select
					trigger="hover"
					placeholder="请选择籍贯"
				/>
			</i-form-item>
			<i-form-item label="学历:" prop="education">
				<i-select
					v-model="formValidate.education"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择学历"
				>
					<i-option
						v-for="(item, index) in education"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="招聘渠道:" prop="ditch">
				<i-select
					v-model="formValidate.ditch"
					style="width: 300px"
					clearable
					transfer
					placeholder="请选择招聘渠道"
				>
					<i-option
						v-for="(item, index) in ditches"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>

			<oa-recruit-introducer v-if="formValidate.ditch == 22" :form-validate="formValidate" />
			<oa-recruit-remarks v-if="formValidate.ditch == 23" :form-validate="formValidate" />

			<i-form-item label="现居住地:" prop="now_address" style="width: 600px">
				<i-input
					v-model="formValidate.now_address"
					:maxlength="50"
					clearable
					style="width: 300px"
					placeholder="请输入现居住地"
				/>
			</i-form-item>

			<i-form-item label="简历附件:" prop="resume" >
				<oa-upload
					v-model="formValidate.resume"
					:max="10"
					style="width: 300px"
				/>
			</i-form-item>

		</i-form>
		<!-- footer -->
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="handleCancel">取消</div>
			<i-button type="primary" @click="handleSave">保存</i-button>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, DatePicker, Cascader, Message, Button
} from 'iview';
import Upload from '@components/_common/upload/upload';
import API_ROOT from '@stores/apis/root';
// utils
import { services, inviteType, workTime } from '@stores/services/hr';
import { services as commonServices } from '@stores/services/common';
import { dataValidity, objRegex } from '@utils/utils';
import { debounce } from 'lodash';
// components
import Remarks from './remarks';
import Introducer from './introducer';
import { PModal } from './popup/modal';


export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'oa-upload': Upload,
		'oa-recruit-remarks': Remarks,
		'oa-recruit-introducer': Introducer,
	},
	mixins: [
		services.recruitDePosition(),
		services.education(),
		services.ditches(),
		commonServices.region(),
		workTime
	],
	data() {
		return {
			tip: '',
			type: 0,
			spin: true, 
			applicant_id: '',
			add_type: '',
			formValidate: {
				age: null,
				ditch: null,
				region: [],
				position: []
			},
			ruleValidate: {
				applicant_name: [
					{ required: true, message: '请输入姓名' },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity }
				],
				sex: [
					{ required: true, message: '请选择性别' }
				],
				mobile: [
					{ required: true, validator: this.mobileValidator, trigger: 'change' }
				],
				position: [
					{ required: true, type: 'array', message: '请输入应聘职位' }
				],
				education: [
					{ required: true, type: 'number', message: '请选择学历' }
				],
				ditch: [
					{ required: true, type: 'number', message: '请选择招聘渠道' }
				],
				introducer_id: [
					{ required: true, type: 'number', message: '请选择转介绍人' }
				],
			}
		};
	},
	mounted() {
	},
	updated() {
	},
	methods: {
		mobileValidator: debounce(function (rule, val, callback) {
			if (!objRegex.validMobile.regex.test(val)) {
				this.applicant_id = ''; 
				this.add_type = '';
				this.type = 0;
				this.tip = '请输入正确的手机号码';
				return callback(new Error('请输入正确的手机号码'));
			}
			this.$request({
				url: API_ROOT['_HR_RECRUIT_SUMMARY_ADD_CHECK_MOBILE_GET'], 
				type: "GET",
				loading: false,
				param: {
					mobile: this.formValidate.mobile,
				}
			}).then((res) => {
				this.type = res.data.type;
				this.applicant_id = res.data.applicant_id;
				this.add_type = res.data.add_type;
				if (res.data.type == 0) {
					this.tip = '';
					callback();
				} else {
					this.tip = res.data.reminder;
					callback(new Error(res.data.reminder));
				}
			}).catch((res) => {
				this.$Message.error(error.msg);
			});
		}, 100),
		handleRecover() {
			if (this.spin) {
				this.spin = false;
				this.$request({
					url: API_ROOT['HR_RECRUIT_APPLICANT_RECOVER_POST'],
					type: "POST",
					param: {
						applicant_id: this.applicant_id,
					}
				}).then((res) => {
					this.spin = true;
					this.$Message.success('恢复成功');
					this.$router.push(`/hr/recruit/social/summary/${this.applicant_id}?type=0&list_type=social-index`);
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}
		},
		handleSave() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					try {
						let values = {
							...this.formValidate,
							depart_id: this.formValidate.position[0],
							position_id: this.formValidate.position[1],
							province: this.formValidate.region[0],
							city: this.formValidate.region[1],
						};
						delete values.position;
						delete values.region;
						this.$request({
							url: API_ROOT['_HR_RECRUIT_SUMMARY_ADD_POST'], // eslint-disable-line
							type: "POST",
							param: {
								applicant_id: this.$route.query.applicant_id,
								...values
							}
						}).then((res) => {
							// this.$router.back();
							this.$router.push('/hr/recruit/social/summary');
						}).catch((error) => {
							this.$Message.error(error.msg);
						});
					} catch (error) {
						// console.error(error);
					}
				}
			});
		},
		handleCancel() {
			if (this.formValidate.mobile) {
				PModal.popup({}).then(res => {
					this.$router.back();
				}).catch(err => {});
			} else {
				this.$router.back();
			}
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-recruit-summary-add {
	padding: 20px 0 60px 0;
	._form {
		min-width: 400px;
		max-width: 900px;
		.ivu-radio-wrapper:first-child {
			margin-right: 50px;
		}
	}
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	._cus-error-tip {
		.ivu-form-item-error-tip {
			position: relative;
			margin-bottom: -20px;
			line-height: 18px;
			top: -2px;
		}
	}
}
</style>
