<template>
	<div class="v-hr-academy-train-arrangement-add-first">
		<div class="_wrapper g-flex g-jc-c">
			<i-form
				ref="form"
				:model="formData"
				:rules="ruleValidate"
				:label-width="115"
				class="__form g-flex g-jc-sb g-fw-w"
				position="left"
			>
				<div>
					<i-form-item label="项目类型:" prop="project_type">
						<i-radio-group v-model="formData.project_type.type">
							<div class="__radio-item">
								<i-radio label="1">岗前培训</i-radio>
							</div>
							
							<div class="__radio-item">
								<i-radio label="2">
									人才计划
								</i-radio>
								<i-cascader
									v-model="formData.project_type.attends"
									:data="planCaTree"
									clearable
									class="g-m-r-5"
									placeholder="请选择人才梯队"
									style="width: 220px"
								/>
							</div>
							<div class="__radio-item">
								<i-radio label="3">其他</i-radio>
								<i-input 
									v-model="formData.project_type.other"
									:maxlength="4"
									placeholder="输入四字以内的名称，如系列课程"
									style="width: 220px; margin-left: 28px;"
								/>
							</div>
						</i-radio-group>
					</i-form-item>
				</div>
				<div>
					<i-form-item label="项目主题:" prop="project_theme">
						<i-input
							v-model="formData.project_theme"
							:maxlength="30"
							style="width: 300px"
							placeholder="请输入项目主题，如：第一期岗前培训"
						/>
					</i-form-item>
					<i-form-item label="项目时段:" prop="project_time">
						<i-datepicker
							v-model="formData.project_time"
							:editable="false"
							separator=" 至 "
							format="yyyy-MM-dd HH:mm"
							type="datetimerange"
							style="width: 300px"
							placeholder="请选择项目时间"
							transfer
						/>
					</i-form-item>
				</div>
			</i-form>
			<!-- footer -->
			<div class="__footer g-flex-cc">
				<div
					class="g-gray-btn-small g-m-r-10"
					@click="handleCancel"
				>
					取消
				</div>
				<vc-debounce-click
					class="g-red-btn-small"
					@click="handleNext"
				>
					下一步
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>
import { dataValidity, objRegex } from '@utils/utils';
import { services } from '@stores/services/hr';
import moment from 'moment';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import {
	Form, FormItem, Input, RadioGroup, Radio,
	Select, Option, DatePicker, Cascader, Message
} from 'iview';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-cascader': Cascader,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	mixins: [
		services.planCaTree()
	],
	data() {
		// const validateAttends = (rule, value, callback) => {
		// 	if (this.formData.project_type.type == '2' && !this.formData.project_type.attends.length) {
		// 		callback(new Error('请选择人才梯队'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		// const validateOther = (rule, value, callback) => {
		// 	if (this.formData.project_type.type == '3' && this.formData.project_type.other == '') {
		// 		callback(new Error('请填写其他主题名称'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		const validateTheme = (rule, value, callback) => {
			let right = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
			if (right.test(value)) {
				callback();
			} else {
				callback(new Error('请输入正确主题名称，仅限汉字、英文、数字'));
			}
		};
		return {
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formData: {
				project_theme: '',
				project_type: {
					type: '',
					attends: [],
					other: ''
				},
				project_time: []
			},
			ruleValidate: {
				project_theme: [{ required: true, message: '请填写项目主题', trigger: 'blur' },
					{ validator: validateTheme, trigger: 'blur' }],
				project_time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请选择项目时间' },
						1: [{ type: 'date', required: true, message: '请选择项目时间' }
						],
					}
				}],
				project_type: [{
					type: 'object',
					required: true,
					fields: {
						type: [{ required: true, message: '请选择项目类型', trigger: 'blur' }],
					}
				}]
			}
		};
	},
	computed: {
	},
	methods: {
		handleCancel() {
			if (this.formData.project_theme || this.formData.project_time[0] || this.formData.project_type.type) {
				ModalTip.popup({
					title: '提示',
					content: '取消后内容将无法回复，确认取消吗？'
				}).then(res => {
					this.$router.go(-1);
				});
			} else {
				this.$router.go(-1);
			}
		},
		handleNext() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					try {
						let next = true;
						if (this.formData.project_type.type == '2' && !this.formData.project_type.attends.length) {
							this.$Message.warning('请选择人才梯队');
							next = false;
						}
						if (this.formData.project_type.type == '3' && this.formData.project_type.other == '') {
							this.$Message.warning('请填写其他主题名称');
							next = false;
						}
						if (moment(this.formData.project_time[0]).format('YYYY-MM-DD HH:mm')
						== moment(this.formData.project_time[1]).format('YYYY-MM-DD HH:mm')) {
							this.$Message.warning('项目开始时间不能等于项目结束时间');
							next = false;
						}
						next ? this.$emit('toNext', this.formData) : '';
					} catch (error) {
						console.error(error);
					}
				}
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-academy-train-arrangement-add-first {
    ._wrapper {
        width: 90%;
		.__radio-item {
			margin-bottom: 22px;
		}
		.ivu-radio-wrapper:first-child {
			margin-right: 10px;
		}
        span.ivu-radio + * {
            margin-left: 10px;
        }
        .__footer {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 60px;
            background-color: #fff;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
    }
}
</style>
