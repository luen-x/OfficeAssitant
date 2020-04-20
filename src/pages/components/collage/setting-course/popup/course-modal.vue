<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="title"
			:width="680"
			:mask-closable="false"
			class="v-collage-setting-course-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item 
					v-if="type !== 3"
					:label="type == 1 ? '套系名称:' : '课程名称'" 
					prop="name"
				>
					<i-input
						v-model="formData.name"
						:maxlength="10"
						:placeholder="type == 1 ? '请输入套系名称' : '请输入课程名称'"
						style="width:220px"
					/>
				</i-form-item>
				<i-form-item 
					v-if="type == 3"
					label="活动名称：" 
					prop="name"
				>
					<span>{{ formData.name }}</span>
				</i-form-item>
				<div v-if="type == 3">
					<div 
						v-for="(item, index) in formData.role_record_info"
						:key="index"
						class="_check g-flex"
					>
						<i-form-item
							:rules="formdataRule.role_record_info"
							:prop="'role_record_info.' + index"
							class="__check-wrapper"
							label="角色:"
						>
							<div>
								<div class="g-inline-block">
									<i-select
										ref="select"
										v-model="item.role"
										style="width: 220px"
										clearable
										transfer
										placeholder="请选择角色"
									>
										<i-option :value="4">讲师</i-option>
										<i-option :value="3">主持人</i-option>
										<i-option :value="7">会议总统筹人</i-option>
									</i-select>
									<i-checkbox-group v-model="item.record_field">
										<i-checkbox 
											v-for="(item,index) in recordList" 
											:key="index"
											:label="item.id"
											:disabled="item.disabled"
										>
											<span v-if="item.id == 3 && formData.name == '大讲堂'">课程名称</span>
											<span v-else>{{ item.value }}</span>
										</i-checkbox>
									</i-checkbox-group>
								</div>
							</div>
						</i-form-item>
						<div class="g-inline-block">
							<div style="margin: 50px auto;">
								<i
									v-if="index !== 0"
									class="iconfont icon-remove-circle g-fs-20 g-c-red-mid g-m-lr-5"
									@click="handleRoleDelete(index)" />
								<i
									v-if="index === formData.role_record_info.length - 1"
									:class="index === 0 ? 'g-m-l-10' : ''"
									class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
									@click="handleRoleAdd(index)" />
							</div>
						</div>
					</div>
				</div>
				<i-form-item v-if="type == 2 && roleArray.includes(4)" label="核算方式:" prop="account_type">
					<i-radio-group v-model="formData.account_type">
						<i-radio :label="1">固定金额</i-radio>
						<i-radio :label="2">固定提点</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="type !== 1 && roleArray.includes(4)" label="是否按时长:" prop="is_on_time">
					<i-radio-group v-model="formData.is_on_time">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="roleArray.includes(4) && !formData.is_on_time" label="课时费:" prop="class_fee_time">
					<span v-if="formData.account_type == 2">提成点</span>
					<i-input-number 
						v-if="formData.account_type == 2"
						v-model="formData.class_fee_time"
						:max="100"
						:min="0"
						:precision="0"
						placeholder="提成点"
						style="width:75px;"
					/>
					<i-input-number 
						v-else
						v-model="formData.class_fee_time"
						:max="9999"
						:min="0"
						:precision="0"
						placeholder="课时费" 
						style="width:75px;"
					/><span v-if="formData.account_type == 1 && type == 1" class="g-m-l-5">/课时</span>
					<span v-if="formData.account_type == 1 && type !== 1" class="g-m-lr-10">/场次</span>
					<span v-if="formData.account_type == 2" class="g-m-l-5">%</span>
				</i-form-item>
				<div v-if="roleArray.includes(4) && formData.is_on_time">
					<i-form-item
						v-for="(item, index) in formData.class_fee"
						:key="index"
						:rules="formdataRule.class_fee"
						:prop="'class_fee.' + index"
						label="课时费:"
					>
						<div class="g-flex g-ai-c">
							<span class="g-m-r-5">时长大于等于</span>
							<i-input-number
								v-model="item.begin_hour"
								:disabled="!!index"
								:max="99"
								:min="0"
								:precision="1"
								:active-change="false"
								placeholder="请输入小时"
								style="width: 75px;"/>
							<span>
								<span class="g-m-lr-5">且小于</span>
								<i-input-number
									v-model="item.end_hour"
									:max="99"
									:min="0"
									:precision="1"
									:active-change="false"
									placeholder="请输入小时"
									style="width: 75px;"/>
								<span>小时；</span>
							</span>
							<span v-if="formData.account_type == 2">
								<span class="g-m-lr-5">提成点</span>
								<i-input-number
									v-model="item.deduct_point"
									:max="100"
									:min="0"
									:precision="0"
									placeholder="请输入数值"
									style="width: 75px;"/>
								<span class="g-m-lr-5">%</span>
							</span>
							<span v-if="formData.account_type == 1">
								<span class="g-m-lr-5">课程费</span>
								<i-input-number
									v-model="item.price"
									:max="9999"
									:min="0"
									:precision="0"
									placeholder="请输入数值"
									style="width: 75px;"/>
								<span class="g-m-lr-5">元</span>
							</span>

							<i
								v-if="!(index == 0 && formData.class_fee.length == 1)"
								class="iconfont icon-remove-circle g-fs-20 g-c-red-mid g-m-lr-5"
								@click="handleListDelete(index)" />
							<i
								v-if="index === formData.class_fee.length - 1 && index !== 9"
								:class="index === 0 ? 'g-m-l-5' : ''"
								class="iconfont icon-add1 g-fs-20 g-c-blue-mid"
								@click="handleListAdd(index)" />
						</div>
					</i-form-item>
				</div>
				<i-form-item v-if="type == 2" label="关联产品:" prop="product_ids">
					<i-select
						v-model="formData.product_ids"
						style="width: 220px"
						clearable
						multiple
						transfer
						placeholder="请选择关联产品"
					>
						<i-option
							v-for="(item, index) in productList"
							:key="index"
							:value="item.product_id"
						>
							{{ item.product_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="type == 2" label="关联唱单:" prop="is_relate_sing">
					<i-radio-group v-model="formData.is_relate_sing">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, DatePicker, Form, FormItem, Message, 
	InputNumber, Input, Radio, RadioGroup, Select, Option, Checkbox, CheckboxGroup } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'v-collage-setting-course-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input-number': InputNumber,
		'i-input': Input,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-select': Select,
		'i-option': Option,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
	},
	props: {
		name: Number,
		datas: {
			type: Object,
			default: () => {}
		},
		edit: {
			type: Number,
			default: 0
		},
		type: {
			type: Number,
			default: 1
		}
	},
	data() {
		const validateName = (rule, value, callback) => {
			if (this.courseList.includes(this.formData.name)) {
				this.type == 1 ? callback(new Error('套系名称已存')) : callback(new Error('课程名称已存在'));
			} else if (value == '') {
				this.type == 1 ? callback(new Error('套系名称不能为空')) : callback(new Error('课程名称不能为空'));
			} else {
				callback();
			}
		};
		const validatePoint = (rule, value, callback) => {
			if (this.formData.account_type == 2 && !!value == false) {
				callback(new Error('请填写提成点'));
			} else {
				callback();
			}
		};
		const validatePrice = (rule, value, callback) => {
			if (this.formData.account_type == 1 && !!value == false) {
				callback(new Error('请填写金额'));
			} else {
				callback();
			}
		};
		return {
			visible: false,
			formData: {
				relation_id: null,
				lecture_set_id: null,
				class_fee_time: null,
				role_record_info: [{
					role: 4,
					record_field: [1, 2, 3]
				}],
				class_fee: [
					{
						begin_hour: null,
						end_hour: null,
						deduct_point: null,
						price: null
					}
				],
				name: '',
				account_type: this.type == 1 ? 1 : 2,
				is_on_time: this.type == 1 ? 0 : 1,
				product_ids: [],
				is_relate_sing: 0
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formdataRule: {
				role_record_info: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						role: [{ required: true, type: 'number', message: "请选择角色", pattern: /.+/, trigger: "change" }],
						record_field: [{ required: true, type: 'array', message: "请选择录单字段", pattern: /.+/, trigger: "change" }],
					}
				},
				class_fee_time: [{ type: 'number', required: true, message: '请输入课时费' }],
				name: [{ validator: validateName, required: true, trigger: 'blur' }],
				account_type: [{ type: 'number', required: true, message: '请选择核算方式', trigger: 'change' }],
				is_on_time: [{ type: 'number', required: true, message: '请选择是否按时长', trigger: 'change' }],
				class_fee: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						begin_hour: [{ required: true, message: "时长开始设置不能为空", pattern: /.+/, trigger: "blur" }],
						// end_hour: [{ required: true, message: "时长设置不能为空", pattern: /.+/, trigger: "blur" }],
						deduct_point: [{ validator: validatePoint, pattern: /.+/, trigger: "blur" }],
						price: [{ validator: validatePrice, pattern: /.+/, trigger: "blur" }],
					}
				},
				product_ids: [{ type: 'array', required: true, message: '请选择关联产品', trigger: 'change' }],
			},
			productList: [], // 关联产品 List
			recordList: [],
			courseList: [], // 当前类型所有套系||课程
		};
	},
	computed: {
		title() {
			let label = '';
			let arr = ['套系', '课程', '活动'];
			this.edit ? label = '编辑' : label = '新增';
			label += arr[this.type - 1];
			return label;
		},
		roleArray() {
			let arr = [];
			arr = this.formData.role_record_info.map(v => v.role);
			return arr;
		}
	},
	mounted() {
		this.visible = true;
		if (this.edit) {
			this.initList();
		} else {
			this.loadProductList();
			this.loadCourseList();
		}
	},
	methods: {

		async initList() {
			await this.loadRecordList();
			await this.loadInfo();
			await this.loadProductList();
			await this.loadCourseList();
		},

		// 关联课程列表
		async loadCourseList() {
			return this.$request({
				url: '_COLLAGE_SETTING_SUBSIDY_COURSE_LIST_GET',
				type: "GET",
				param: {
					type: this.type
				},
				loading: false
			}).then((res) => {
				if (this.edit) {
					this.courseList = res.data.map(v => v.name);
					this.courseList.map((v, index) => {
						if (v == this.formData.name) {
							this.courseList.splice(index, 1);
						}
						return;
					});
				} else {
					this.courseList = res.data.map(v => v.name);
				}
			}).catch((error) => {
			});
		},
		
		// 详情
		async loadInfo() {
			return this.$request({
				url: '_COLLAGE_SETTING_COURSE_INFO_GET',
				type: "GET",
				param: {
					lecture_set_id: this.datas.lecture_set_id,
					relation_id: this.datas.relation_id
				},
				loading: false
			}).then((res) => {
				this.formData.name = res.data.name;
				this.formData.account_type = this.type == 3 ? 1 : res.data.account_type;
				this.formData.is_on_time = res.data.is_on_time;
				this.formData.product_ids = this.type !== 3 ? res.data.product_ids.split(',').map(Number) : [];
				this.formData.lecture_set_id = res.data.lecture_set_id;
				this.formData.is_relate_sing = res.data.is_relate_sing;
				if (res.data.role_record_info) {
					this.formData.role_record_info = res.data.role_record_info;
				}
				if (res.data.is_on_time) {
					res.data.class_fee ? this.formData.class_fee = res.data.class_fee : '';
				} else {
					this.formData.class_fee_time = res.data.class_fee;
				}
			}).catch((error) => {
			});
		},

		// 角色添加
		handleRoleAdd: lodash.debounce(function (index) {
			if (this.formData.role_record_info[index].role === null || this.formData.role_record_info[index].record_field.length == 0) {
				this.$Message.warning('请填写完整信息');
			} else {
				index < 2 ? this.formData.role_record_info.push({
					role: null,
					record_field: [1, 2, 3]
				}) : this.$Message.warning('最多对三种角色添加规则');
			}
			this.$forceUpdate();
		}, 300),
		handleRoleDelete(index) {
			this.formData.role_record_info.splice(index, 1);
			this.$forceUpdate();
		},

		// 课时费添加
		handleListAdd: lodash.debounce(function (index) {
			if (this.formData.class_fee[index].begin_hour === null || this.formData.class_fee[index].end_hour === null) {
				this.$Message.warning('请填写完整信息');
			} else if (this.formData.class_fee[index].end_hour <= this.formData.class_fee[index].begin_hour) {
				this.$Message.warning('课时费最大值应大于最小值');
			} else {
				this.formData.class_fee.push({
					begin_hour: this.formData.class_fee[index].end_hour,
					end_hour: null,
					deduct_point: null,
					price: null
				});
			}
			this.$forceUpdate();
		}, 300),
		handleListDelete(index) {
			this.formData.class_fee.splice(index, 1);
			// this.$forceUpdate();
		},
        
		// 关联产品列表
		async loadProductList() {
			return this.$request({
				url: '_COLLAGE_SETTING_COURSE_PRODUCT_LIST_GET',
				type: "GET",
				param: {
					lecture_set_id: this.formData.lecture_set_id || 0
				},
				loading: false
			}).then((res) => {
				this.productList = res.data;
			}).catch((error) => {
			});
		},

		// 大课培训录单字段
		async loadRecordList() {
			return this.$request({
				url: '_COLLAGE_SETTING_COURSE_RECORD_FIELD_LIST_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				let arr = [1, 2, 3];
				res.data.forEach(v => {
					if (arr.includes(v.id)) {
						v.disabled = true;
					} else {
						v.disabled = false;
					}
				});
				this.recordList = res.data;
			}).catch((error) => {
			});
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let role = this.formData.role_record_info.map(v => v.role);
			let flag = false;
			let length = this.formData.class_fee.length == 1 ? this.formData.class_fee.length : this.formData.class_fee.length - 1;
			for (let i = 1; i < length; i++) {
				if (this.formData.class_fee[i].end_hour <= this.formData.class_fee[i].begin_hour) {
					flag = true;
				}
			}
			// this.formData.class_fee.forEach(v => {
			// 	if (v.end_hour <= v.begin_hour) {
			// 		flag = true;
			// 	}
			// });
			if (this.formData.is_on_time) {
				if (flag) {
					this.visible = true;
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('课时费最大值应大于最小值');
					return;
				}
			}
			if ((new Set(role)).size != role.length) {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				this.$Message.warning('配置角色不能重复');
				return;
			}
			let obj = {
				relation_id: this.type == 3 ? this.datas.relation_id : null,
				lecture_set_id: this.formData.lecture_set_id,
				name: this.formData.name,
				type: this.type,
				account_type: this.formData.account_type,
				is_on_time: this.formData.is_on_time,
				class_fee: this.formData.is_on_time ? this.formData.class_fee : this.formData.class_fee_time,
				product_ids: this.formData.product_ids.join(','),
				role_record_info: this.type == 3 ? this.formData.role_record_info : {},
				is_relate_sing: this.formData.is_relate_sing
			};
			let api = this.edit ? '_COLLAGE_SETTING_COURSE_EDIT_POST' : '_COLLAGE_SETTING_COURSE_SAVE_POST';
			this.$request({
				url: API_ROOT[api], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				this.edit ? Message.success('修改成功') : Message.success('添加成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const CourseModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-setting-course-modal {
	._check {
		.__check-wrapper {
			display: inline-block;
			background-color: #fafafa;
			padding-top: 20px;
			padding-bottom: 20px;
			margin-bottom: 15px;
			.ivu-checkbox-group {
				width: 446px;
			}
		}
	}
	.ivu-modal-body {
		max-height: 400px;
		overflow-y: auto;
	}
}
</style>


