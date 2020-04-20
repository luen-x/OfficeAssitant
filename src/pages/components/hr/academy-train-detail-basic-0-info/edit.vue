<template>
	<div class="v-academy-train-detail-basic-info-edit">
		<oa-title class="g-m-b-20">
			<template slot="title">
				详情信息
				<span
					class="g-pointer g-c-blue-mid g-m-l-5"
				>
					<span @click="handleSave()">保存</span>
					<span class="g-m-l-10" @click="handleToggle()">取消</span>
				</span>
			</template>
		</oa-title>
		<div class="_wrapper">
			<div class="__edit">
				<i-form
					ref="form"
					:model="formData"
					:rules="ruleValidate"
					:label-width="115"
					class="__form"
				>
					<i-form-item label="项目类型:" prop="project_type">
						<i-radio-group v-model="formData.project_type.type">
							<div class="__radio-item">
								<i-radio :label="1">岗前培训</i-radio>
							</div>
							
							<div class="__radio-item">
								<i-radio :label="2">
									人才计划
								</i-radio>
								<i-cascader
									v-model="formData.project_type.attends"
									:data="planCaTree"
									clearable
									class="g-m-r-5 g-m-l-5"
									placeholder="请选择人才梯队"
									style="width: 220px"
								/>
							</div>
							<div class="__radio-item">
								<i-radio :label="3">其他</i-radio>
								<i-input 
									v-model="formData.project_type.other"
									:maxlength="4"
									placeholder="输入四字以内的名称，如系列课程"
									style="width: 220px;margin-left: 7px;"
								/>
							</div>
						</i-radio-group>
					</i-form-item>
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
							format="yyyy-MM-dd HH:mm"
							separator=" 至 "
							split-panels
							type="datetimerange"
							style="width: 300px"
							placeholder="请选择项目时间"
							transfer
						/>
					</i-form-item>
				</i-form>
			</div>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, RadioGroup, Cascader, Radio, Select, Option, DatePicker, Message } from 'iview';
import { dataValidity, objRegex, getParseUrl, getHashUrl } from '@utils/utils';
import { cloneDeep } from 'lodash';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import { setData, findTreePath } from '../_common/academy-course/util';
import Title from '../academy-train-detail/_common/title';

export default {
	name: 'v-academy-train-detail-basic-info-edit',
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
		'oa-title': Title
	},
	mixins: [
		services.planCaTree()
	],
	props: {
		datas: Object
	},
	data() {
		const detailData = cloneDeep(this.datas);
		const validateAttends = (rule, value, callback) => {
			if (this.formData.project_type.type == 2 && this.formData.project_type.attends == []) {
				callback(new Error('请选择人才梯队'));
			} else {
				callback();
			}
		};
		// const validateOther = (rule, value, callback) => {
		// 	if (this.formData.project_type.type == 3 && this.formData.project_type.other == '') {
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
			isEdit: false,
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formData: {
				project_theme: this.datas.project_topic,
				project_type: {
					type: this.datas.type,
					attends: this.datas.type == 2 ? [this.datas.echelon_id] : [],
					other: this.datas.type == 3 ? this.datas.type_name : ''
				},
				project_time: [this.datas.start_time, this.datas.end_time]
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
						type: [{ required: true, type: 'number', message: '请选择项目类型', trigger: 'blur' }],
					}
				}]
			}
		};
	},
	created() {
		this.$nextTick(() => {
			this.formData.project_type.attends = findTreePath(this.datas.echelon_id, this.planCaTree);
		});
	},
	methods: {
		handleToggle() {
			this.$emit('handleEditChange', true);
		},
		handleSave() {
			let obj = {
				project_id: this.$route.query.project_id,
				project_topic: this.formData.project_theme,
				type: this.formData.project_type.type,
				echelon_id: this.formData.project_type.type == 2
					? this.formData.project_type.attends[this.formData.project_type.attends.length - 1] : '', // 人才梯队ID
				type_name: this.formData.project_type.type == 3
					? this.formData.project_type.other : '', // 其他时名称
				start_time: moment(this.formData.project_time[0]).format('YYYY-MM-DD HH:mm'),
				end_time: moment(this.formData.project_time[1]).format('YYYY-MM-DD HH:mm')
			};
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					try {
						let next = true;
						if (this.formData.project_type.type == 2 && !this.formData.project_type.attends.length) {
							this.$Message.warning('请选择人才梯队');
							next = false;
						}
						if (this.formData.project_type.type == 3 && this.formData.project_type.other == '') {
							this.$Message.warning('请填写其他主题名称');
							next = false;
						}
						if (moment(this.formData.project_time[0]).format('YYYY-MM-DD HH:mm')
						== moment(this.formData.project_time[1]).format('YYYY-MM-DD HH:mm')) {
							this.$Message.warning('项目开始时间不能等于项目结束时间');
							next = false;
						}
						if (next) {
							this.$request({
							url: API_ROOT['_HR_TRAIN_PROJECT_EDIT_SAVE_POST'], // eslint-disable-line
								type: "POST",
								param: obj,
								loading: false
							}).then((res) => {
								this.$emit('handleEditSuccess', true);
								this.$Message.success('保存成功');
							}).catch((error) => {
								this.$Message.error(error.msg);
							});
							this.isEdit = false;
						}
						
					} catch (error) {
						console.error(error);
					}
				}
			});
		}
	}
};

</script>

<style lang="scss">
.v-academy-train-detail-basic-info-edit {
	._wrapper {
		.__detail{
			.__item {
				margin-bottom: 15px;
			}
		}
		.__edit {
			.__radio-item {
				display: inline-block;
				margin-right: 35px;
				.ivu-radio-wrapper:first-child {
					margin: 0
				}
			}
		}
	}
}
</style>
