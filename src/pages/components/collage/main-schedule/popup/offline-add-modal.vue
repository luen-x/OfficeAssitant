<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:title="edit ? '编辑课程' : '添加课程'"
			:width="400"
			:mask-closable="false"
			class="v-collage-main-schedule-modal"
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
				<i-form-item label="课程大类:" prop="course_type">
					<i-select
						v-model="formData.course_type"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择课程大类"
					>
						<i-option :value="2">线下课程</i-option>
						<i-option :value="3">大课培训</i-option>
					</i-select>
				</i-form-item>
				<!-- 大课培训 -->
				<div v-if="formData.course_type == 3">
					<i-form-item label="活动类型:" prop="activity_id">
						<i-select
							v-model="formData.activity_id"
							style="width: 220px"
							clearable
							transfer
							placeholder="请选择活动类型"
							@on-change="handleChangeActivity"
						><i-option
							v-for="(item, index) in activityList"
							:key="index"
							:value="item.category_id"
						>{{ item.category_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item 
						v-if="formData.course_type == 3 && formData.activity_type == 1"
						label="课程名称:" 
						prop="course_name"
					>
						<i-input 
							v-model="formData.course_name"
							:maxlength="20"
							style="width:220px"
							placeholder="请输入课程名称"
						/>
					</i-form-item>
					<i-form-item 
						v-if="formData.course_type == 3 && formData.activity_type !== 1"
						label="活动名称:" 
						prop="activity_name_id"
					>
						<i-select
							v-model="formData.activity_name_id"
							style="width: 220px"
							clearable
							transfer
							filterable
							placeholder="请选择活动名称"
						><i-option
							v-for="(item, index) in activityNameList"
							:key="index"
							:value="item.activity_id"
						>{{ item.activity_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item v-if="formData.activity_type !== 1" label="讲课日期:" prop="course_date">
						<i-datepicker
							v-model="formData.course_date"
							:options="options"
							:editable="false"
							type="daterange"
							split-panels
							separator=" 至 "
							format="yyyy-MM-dd"
							style="width: 220px"
							placeholder="请选择讲课日期"
							transfer
						/>
					</i-form-item>
					<i-form-item v-if="formData.activity_type == 1" label="讲课时间:" prop="lecture_date">
						<i-datepicker
							v-model="formData.lecture_date"
							:options="options"
							:editable="false"
							type="datetime"
							split-panels
							separator=" 至 "
							format="yyyy-MM-dd HH:mm"
							style="width: 220px"
							placeholder="请选择讲课时间"
							transfer
						/>
					</i-form-item>
					<i-form-item label="参与人员:" prop="join_staff_ids">
						<i-select
							ref="staff"
							v-model="formData.join_staff_ids"
							style="width: 220px"
							clearable
							multiple
							transfer
							filterable
							placeholder="请选择参与人员"
							@on-change="handleJoinStaffeChange"
						>
							<i-option
								v-for="(item, index) in businessList"
								:key="index"
								:value="item.staff_id"
							>
								{{ item.staff_name }}
							</i-option>
						</i-select>
					</i-form-item>
				</div>
				<!-- 线下课程 -->
				<div v-if="formData.course_type == 2">
					<i-form-item label="客户公司:" prop="contract_company_id">
						<i-select
							v-model="formData.contract_company_id"
							style="width: 220px"
							clearable
							filterable
							transfer
							placeholder="请输入公司名称"
							@on-change="handleChangeCompany"
						><i-option
							v-for="(item, index) in companyList"
							:key="index"
							:value="item.contract_company_id"
						>{{ item.contract_company_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="课程类型:" prop="lecture_set_id">
						<i-select
							v-model="formData.lecture_set_id"
							style="width: 220px"
							clearable
							transfer
							placeholder="请选择课程类型"
							@on-change="handleChangeSeries"
						>
							<i-option
								v-for="(item, index) in courseTypeList"
								:key="index"
								:value="item.lecture_set_id"
							>
								{{ item.name }}
							</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="出差人员:" prop="business_staff_ids">
						<i-select
							ref="business"
							v-model="formData.business_staff_ids"
							style="width: 220px"
							clearable
							multiple
							transfer
							filterable
							placeholder="请选择出差人员"
							@on-change="handleStaffeChange"
						>
							<i-option
								v-for="(item, index) in businessList"
								:key="index"
								:value="item.staff_id"
							>
								{{ item.staff_name }}
							</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="出差城市:" prop="region">
						<i-cascader
							v-model="formData.region"
							:data="region"
							clearable
							transfer
							trigger="hover"
							placeholder="请选择出差城市"
							style="width: 220px"
						/>
					</i-form-item>
					<i-form-item label="往返日期:" prop="offline_time">
						<i-datepicker
							v-model="formData.offline_time"
							:options="options"
							:editable="false"
							type="daterange"
							split-panels
							separator=" 至 "
							format="yyyy-MM-dd"
							style="width: 220px"
							placeholder="请选择往返日期"
							transfer
						/>
					<!-- type="daterange" -->
					</i-form-item>
				</div>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select, Option, Cascader, InputNumber, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';
import { setTimeout } from 'timers';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'i-input': Input,
		'i-cascader': Cascader
	},
	mixins: [
		commonServices.region()
	],
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
		calendar_id: Number
	},
	data() {
		const validateTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择起始时间');
			} else {
				callback();
			}
		};
		return {
			visible: false,
			formData: {
				course_type: null, // 课程大类
				contract_company_id: null, // 公司 ID
				lecture_set_id: null, // 课程类型
				business_staff_ids: [], // 出差人员
				region: [], // 地区
				offline_time: [], // 起始时间

				activity_id: null, // 活动 ID（大讲堂传0）
				activity_name: '',
				activity_name_id: null, // 活动 ID（非大讲堂）
				course_name: '', // 课程名称（大讲堂）
				lecture_date: '', // 大讲堂时间
				join_staff_ids: [], // 参与人员
				course_date: [], // 大课时间
				lesson_id: '',
				activity_type: ''
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formdataRule: {
				course_type: [{ type: 'number', required: true, message: '请选择课程大类', trigger: 'change' }],
				contract_company_id: [{ type: 'number', required: true, message: '请选择客户公司', trigger: 'change' }],
				lecture_set_id: [{ type: 'number', required: true, message: '请选择课程类型', trigger: 'change' }],
				business_staff_ids: [{ type: 'array', required: true, message: '请选择出差人员', trigger: 'change' }],
				region: [{ type: 'array', required: true, message: '请选择出差城市', trigger: 'change' }],
				offline_time: [{ validator: validateTime, trigger: 'change', required: true, }],

				activity_id: [{ type: 'number', required: true, message: '请选择活动类型', trigger: 'change' }],
				activity_name_id: [{ type: 'number', required: true, message: '请选择课程名称', trigger: 'change' }],
				course_name: [{ type: 'string', required: true, message: '请填写活动名称', trigger: 'blur' }],
				lecture_date: [{ type: 'date', required: true, message: '请选择讲课时间', trigger: 'change' }],
				join_staff_ids: [{ type: 'array', required: true, message: '请选择参与人员', trigger: 'change' }],
				course_date: [{ validator: validateTime, trigger: 'change', required: true, }],
			},
			companyList: [], // 公司列表
			businessList: [], // 讲师列表
			courseTypeList: [], // 课程类型列表
			activityList: [], // 活动类型列表
			activityNameList: [], // 活动名称列表
		};
	},
	watch: {
		'formData.contract_company_id': function (newval, oldval) {
			if (!newval) {
				this.formData.lecture_set_id = '';
				this.formData.courseTypeList = [];
				this.$refs.business ? this.$refs.business.reset() : '';
				this.$refs.staff ? this.$refs.staff.reset() : '';
				// this.formData.join_staff_ids = [];
				this.formData.businessList = [];
			}
		},
		'formData.lecture_set_id': function (newval, oldval) {
			if (!newval) {
				// this.formData.business_staff_ids = [];
				// this.formData.join_staff_ids = [];
				this.$refs.business ? this.$refs.business.reset() : '';
				this.$refs.staff ? this.$refs.staff.reset() : '';
				this.formData.businessList = [];
			}
		},
		'formData.course_type': function (newval, oldval) {
			if (newval == 3) {
				this.loadBusinessData();
			}
		},
		'formData.activity_id': function (newval, oldval) {
			let flag = true;
			this.activityList.map(v => {
				if (v.category_id == this.formData.activity_id) {
					if (v.type == 1) {
						this.formData.activity_type = 1;
						flag = false;
					} else {
						flag ? this.formData.activity_type = 0 : '';
					}
				}
				return;
			});
		},
	},
	mounted() {
		this.visible = true;
		if (this.edit) {
			this.initList();
		} else {
			this.loadCompanyData();
			this.loadActivtyData();
		}
	},
	methods: {
		// 编辑初始化
		async initList() {
			await this.loadInfo();
			await this.loadCompanyData();
			await this.loadSeriesData();
			await this.loadActivtyData();
			await this.loadActivtyNameData();
			await this.loadBusinessData();
			await this.loadInfo();
			this.activityList.map(v => {
				if (v.category_id == this.formData.activity_id) {
					v.type == 1 ? this.formData.activity_type = 1 : '';
				}
				return;
			});
		},
		// 线下课程详情
		async loadInfo() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_OFFLINE_INFO_GET',
				type: "GET",
				param: {
					calendar_id: this.calendar_id
				},
				loading: false
			}).then((res) => {
				this.formData.course_type = res.data.course_type;
				this.formData.contract_company_id = res.data.contract_company_id;
				this.formData.lecture_set_id = res.data.lecture_set_id;
				this.formData.business_staff_ids = res.data.business_staff_ids.split(',').map(Number);
				this.formData.region = [res.data.business_province_id, res.data.business_city_id];
				this.formData.offline_time = [res.data.start_date, res.data.end_date];
				this.formData.lesson_id = res.data.lesson_id;
				this.formData.activity_id = res.data.lecture_set_id;
				this.formData.activity_name = res.data.activity_name;
				this.formData.activity_name_id = res.data.activity_id;
				this.formData.course_name = res.data.course_name;
				this.formData.lecture_date = res.data.lecture_time;
				this.formData.join_staff_ids = res.data.join_staff_ids.split(',').map(Number);
				this.formData.course_date = [res.data.start_date, res.data.end_date];
			}).catch((error) => {
			});
		},

		// 根据活动类型请求活动名称
		handleChangeActivity() {
			this.formData.activity_name_id = null;
			this.loadActivtyNameData();
		},
		// 获取活动分类列表
		async loadActivtyData() {
			return this.$request({
				url: '_CONTENT_ACTIVITY_CATEGORY_GET',
				type: "GET",
				param: {
					type: 1
				},
				loading: false
			}).then((res) => {
				this.activityList = res.data;
			}).catch((error) => {
			});
		},
		handleJoinStaffeChange(e) {
			if (e.length > 10) {
				this.formData.join_staff_ids.pop();
				this.$Message.warning('最多选择10名参与人员');
			}
		},
		handleStaffeChange(e) {
			if (e.length > 10) {
				this.formData.business_staff_ids.pop();
				this.$Message.warning('最多选择10名出差人员');
			}
		},

		// 获取活动分类下名称
		async loadActivtyNameData() {
			return this.$request({
				url: '_CONTENT_ACTIVITY_CLASSIFY_CATEGORY_GET',
				type: "GET",
				param: {
					id: this.formData.activity_id,
					is_current: 1
				},
				loading: false
			}).then((res) => {
				this.activityNameList = res.data.list;
			}).catch((error) => {
			});
		},
		// 获取当前客户下公司列表
		async loadCompanyData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_COMPANY_GET',
				type: "GET",
				param: {
					type: 2
				},
				loading: false
			}).then((res) => {
				this.companyList = res.data;
			}).catch((error) => {
			});
		},
		// 寻找 lesson_id
		async handleChangeSeries() {
			// this.formData.business_staff_ids = [];
			// this.formData.join_staff_ids = [];
			this.$refs.business ? this.$refs.business.reset() : '';
			this.$refs.staff ? this.$refs.staff.reset() : '';
			this.formData.businessList = [];
			await this.handleLessonId();
			await this.loadBusinessData();
		},
		async handleLessonId() {
			return this.formData.lecture_set_id
				? this.formData.lesson_id = this.courseTypeList.filter(v => v.lecture_set_id 
			== this.formData.lecture_set_id)[0].lesson_id : '';
		},

		// 获取讲师列表
		async loadBusinessData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_LECTURER_GET',
				type: "GET",
				param: {
					type: this.formData.course_type == 2 ? 2 : 3,
					lesson_id: this.formData.course_type == 2 ? this.formData.lesson_id : 0
				},
				loading: false
			}).then((res) => {
				this.businessList = res.data;
			}).catch((error) => {
			});
		},

		// 获取公司下活动/课程列表
		async loadSeriesData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_SERIES_GET',
				type: "GET",
				param: {
					type: 2,
					contract_company_id: this.formData.contract_company_id || ''
				},
				loading: false
			}).then((res) => {
				this.courseTypeList = res.data;
			}).catch((error) => {
			});
		},

		// 请求公司下活动
		handleChangeCompany() {
			this.formData.lecture_set_id = '';
			this.formData.courseTypeList = [];
			// this.formData.business_staff_ids = [];
			// this.formData.join_staff_ids = [];
			this.$refs.business ? this.$refs.business.reset() : '';
			this.$refs.staff ? this.$refs.staff.reset() : '';
			this.formData.businessList = [];
			this.loadSeriesData();
		},

		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			if (!this.formData.activity_type && this.formData.course_type == 3) {
				this.formData.course_name = this.activityNameList.filter(v => v.activity_id == this.formData.activity_name_id)[0].activity_name;
			}
			let obj = this.formData.course_type == 2 ? {
				course_type: this.formData.course_type,
				contract_company_id: this.formData.contract_company_id,
			    lecture_set_id: this.formData.lecture_set_id,
			    business_staff_ids: this.formData.business_staff_ids.join(','),
				business_province_id: this.formData.region[0],
				business_city_id: this.formData.region[1],
				start_date: moment(this.formData.offline_time[0]).format("YYYY-MM-DD"),
				end_date: moment(this.formData.offline_time[1]).format("YYYY-MM-DD"),
				lesson_id: this.formData.lesson_id
			} : {
				course_type: this.formData.course_type,
				lecture_set_id: this.formData.activity_id || 0,
				activity_id: this.formData.activity_type == 1 ? 0 : this.formData.activity_name_id,
				course_name: this.formData.course_name,
				join_staff_ids: this.formData.join_staff_ids.join(','),
				lesson_id: this.formData.lesson_id
			};
			if (this.formData.course_type == 3 && this.formData.activity_type == 1) {
				obj.lecture_date = moment(this.formData.lecture_date).format("YYYY-MM-DD HH:mm");
			}
			if (this.formData.course_type == 3 && this.formData.activity_type !== 1) {
				obj.start_date = moment(this.formData.course_date[0]).format("YYYY-MM-DD");
				obj.end_date = moment(this.formData.course_date[1]).format("YYYY-MM-DD");
			}
			this.edit ? obj.calendar_id = this.calendar_id : '';
			this.$request({
				url: API_ROOT['_COLLAGE_MAIN_SCHEDULE_OFFLINE_SAVE_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				this.edit ? Message.success('修改课程成功') : Message.success('添加课程成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const OfflineAddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>