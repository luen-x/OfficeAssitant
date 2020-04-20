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
						v-for="(item, index) in companyArray"
						:key="index"
						:value="item.contract_company_id"
					>{{ item.contract_company_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="套系名称:" prop="lesson_id">
					<i-select
						v-model="formData.lesson_id"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择套系"
						@on-change="handleChangeSeries"
					>
						<i-option
							v-for="(item, index) in seriesArray"
							:key="index"
							:value="item.lesson_id"
						>
							{{ item.name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="上课讲师:" prop="lecturer_id">
					<i-select
						v-model="formData.lecturer_id"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择上课讲师"
					>
						<i-option
							v-for="(item, index) in lecturerArray"
							:key="index"
							:value="item.staff_id"
						>
							{{ item.staff_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="开课时间:" prop="lesson_start_time">
					<i-datepicker
						v-model="formData.lesson_start_time"
						:options="options"
						:editable="false"
						type="datetime"
						split-panels
						separator=" 至 "
						format="yyyy-MM-dd HH:mm"
						style="width: 220px"
						placeholder="请选择开课时间"
						transfer
					/>
					<!-- type="daterange" -->
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Message, Select, Option, InputNumber, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

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
		calendar_id: Number
	},
	data() {
		return {
			visible: false,
			formData: {
				lesson_start_time: null,
				contract_company_id: null,
				lecturer_id: null,
				lecture_set_id: null,
				lesson_id: null,
				date: '',
				calendar_id: null
			},
			apply_id: '',
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			formdataRule: {
				lesson_start_time: [{ type: 'date', required: true, message: '请输入开课时间' }],
				contract_company_id: [{ type: 'number', required: true, message: '请选择客户公司', trigger: 'change' }],
				lecturer_id: [{ type: 'number', required: true, message: '请选择上课讲师', trigger: 'change' }],
				lesson_id: [{ type: 'number', required: true, message: '请选择套系', trigger: 'change' }],
			},
			companyArray: [], // 公司列表
			lecturerArray: [], // 讲师列表
			seriesArray: [], // 套系列表
		};
	},
	watch: {
		'formData.contract_company_id': function (newval, oldval) {
			if (!newval) {
				this.formData.lecturer_id = '';
				this.formData.lecturerArray = [];
				this.formData.lesson_id = '';
				this.formData.seriesArray = [];
			}
		},
		'formData.lesson_id': function (newval, oldval) {
			if (!newval) {
				this.formData.lecturer_id = '';
				this.formData.lecturerArray = [];
			}
		},
	},
	mounted() {
		this.visible = true;
		if (this.edit) {
			this.initList();
		} else {
			this.loadCompanyData();
		}
	},
	methods: {
		// 编辑初始化
		async initList() {
			await this.loadInfo();
			await this.loadCompanyData();
			await this.loadSeriesData();
			await this.loadLecturerData();
		},

		// 线上课程详情
		async loadInfo() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_ONLINE_INFO_GET',
				type: "GET",
				param: {
					calendar_id: this.calendar_id
				},
				loading: false
			}).then((res) => {
				this.formData.lesson_id = res.data.lesson_id;
				this.formData.lesson_start_time = res.data.lesson_start_time;
				this.formData.calendar_id = res.data.calendar_id;
				this.formData.contract_company_id = res.data.contract_company_id;
				this.formData.lecturer_id = res.data.lecturer_id;
				this.formData.lecture_set_id = res.data.lecture_set_id;
			}).catch((error) => {
			});
		},

		// 请求公司下套系
		handleChangeCompany() {
			this.formData.lecturer_id = '';
			this.formData.lecturerArray = [];
			this.formData.lesson_id = '';
			this.formData.seriesArray = [];
			this.loadSeriesData();
		},

		// 寻找 lesson_id
		async handleChangeSeries() {
			this.formData.lecturer_id = '';
			this.formData.lecturerArray = [];
			await this.handleLessonId();
			await this.loadLecturerData();
		},
		async handleLessonId() {
			return this.formData.lesson_id
				? this.formData.lecture_set_id = this.seriesArray.filter(v => v.lesson_id 
			== this.formData.lesson_id)[0].lecture_set_id : '';
		},

		// 获取套系下讲师列表
		async loadLecturerData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_LECTURER_GET',
				type: "GET",
				param: {
					type: 1,
					lesson_id: this.formData.lesson_id
				},
				loading: false
			}).then((res) => {
				this.lecturerArray = res.data;
			}).catch((error) => {
			});
		},

		// 获取当前客户下公司列表
		async loadCompanyData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_COMPANY_GET',
				type: "GET",
				param: {
					type: 1
				},
				loading: false
			}).then((res) => {
				this.companyArray = res.data;
			}).catch((error) => {
			});
		},

		// 获取公司下套系列表
		async loadSeriesData() {
			return this.$request({
				url: '_COLLAGE_MAIN_SCHEDULE_SERIES_GET',
				type: "GET",
				param: {
					type: 1,
					contract_company_id: this.formData.contract_company_id
				},
				loading: false
			}).then((res) => {
				this.seriesArray = res.data;
			}).catch((error) => {
			});
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
			let obj = {
				date: this.datas.day.data.date,
			    lecture_set_id: this.formData.lecture_set_id,
				lecturer_id: this.formData.lecturer_id,
				lesson_id: this.formData.lesson_id,
			    contract_company_id: this.formData.contract_company_id,
			    lesson_start_time: moment(this.formData.lesson_start_time).format("YYYY-MM-DD HH:mm"),
			};
			if (this.edit) {
				obj.calendar_id = this.calendar_id;
			}
			this.$request({
				url: API_ROOT['_COLLAGE_MAIN_SCHEDULE_ONLINE_SAVE_POST'], // eslint-disable-line
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
export const OnlineAddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


