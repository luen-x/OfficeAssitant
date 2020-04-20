<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			:title="name === 'arrange' ? '安排培训' : '批量培训'"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div v-if="name === 'batch'" class="g-flex">
				<div class="g-flex g-flex-cc" style="width: 102px;height: 20px;">
					<span 
						class="g-fs-18 g-m-t-5" 
						style="color: #ed4014;margin-right: 4px;"
					>
						*
					</span>
					<span>参与人员：</span>
				</div>
				<div v-if="applicantName.length < 8" style="width: 220px;">
					{{ applicantName.join('、') }}
				</div>
				<div v-else style="width: 220px;">
					{{ applicantName.join('、').slice(0,30) }}...等{{ applicantName.length }}名员工
				</div>
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20"
			>
				<i-form-item v-if="name === 'batch'" label="培训课程：" prop="course_id">
					<i-select
						v-model="formData.course_id"
						clearable
						transfer
						style="width:240px;"
						placeholder="请选择培训课程"
					>
						<i-option
							v-for="item in courseList"
							:value="item.course_id + ''"
							:key="item.course_id + ''"
						>
							{{ item.course_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="授课时间：" prop="teaching_time">
					<i-date-picker
						v-model="formData.teaching_time"
						:options="options"
						transfer
						placeholder="请选择授课时间"
						style="width: 240px;"
					/>
				</i-form-item>
				<i-form-item label="授课讲师：" prop="staff_ids">
					<i-select
						v-model="formData.staff_ids"
						:transfer-class-name="show ? 'v-academy-transfer-arrange-training' : ''"
						clearable
						multiple
						transfer
						filterable
						style="width:240px;"
						placeholder="请输入授课讲师搜索"
						@input="handleLimitCount"
					>
						<i-option
							v-for="item in teachers"
							:value="item.staff_id"
							:key="item.staff_id"
						>
							{{ item.staff_name }}
						</i-option>
					</i-select>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, DatePicker, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from "moment";

export default {
	name: 'v-academy-transfer-arrange-training-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-date-picker': DatePicker,
		"i-select": Select,
		"i-option": Option
	},
	props: {
		courseId: Number,
		applicantIds: Array,
		applicants: Array,
		name: {
			required: true,
			type: String
		}
	},
	data() {
		return {
			applicantName: [], // 参与人员	
			teachers: [], // 授课讲师
			applicantsIds: [], // 	培训人员
			courseList: [], // 培训课程
			isFirst: true, // 是第一次进来
			show: false,
			formData: {
				teaching_time: "",
				staff_ids: [],
				course_id: ""
			},
			formDataRule: {
				teaching_time: [
					{
						required: true,
						message: "请选择授课时间！",
						trigger: "change",
						type: "date"
					}
				],
				staff_ids: [
					{
						required: true,
						message: "请选择授课讲师！",
						trigger: "change",
						type: "array"
					}
				],
				course_id: [
					{
						required: true,
						message: "请选择培训课程！",
						trigger: "change"
					}
				]
			},
			options: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now() - 86400000 + 24 * 60 * 60 * 1000;
				}
			},
			visible: false
		};
	},
	watch: {
		'formData.course_id': {
			handler(value) {
				this.loadTeachData(value, moment(this.formData.teaching_time).format("YYYY-MM-DD"));
			}
		},

		'formData.teaching_time': {
			handler(value) {
				if (this.isFirst) {
					this.isFirst = false;
					return;
				}

				if (this.courseId) {
					this.loadTeachData(this.courseId, moment(value).format("YYYY-MM-DD"));
				} else {
					this.formData.course_id && this.loadTeachData(this.formData.course_id, moment(value).format("YYYY-MM-DD"));
				}
			}
		}
	},
	mounted() {
		if (this.name === 'batch') {
			this.applicants.forEach(item => {
				this.applicantName.push(item.applicant_name);
				this.applicantsIds.push(item.applicant_id);
			});

			this.loadCourseDate();
		}

		this.formData.teaching_time = moment().format("YYYY-MM-DD");

		this.loadStaffDate();
		this.visible = true;
	},
	methods: {
		loadTeachData(course_id, teaching_time) {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_TEACH_TIME_GET",
				type: "GET",
				param: {
					course_id,
					teaching_time
				},
				loading: false
			}).then(res => {
				this.formData.staff_ids = [];

				res.data.length && res.data.forEach(item => {
					this.formData.staff_ids.push(item.staff_id);
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 新人输送 - 获取所有岗前培训课程
		loadCourseDate() {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_COURSE_GET",
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.courseList = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 获取授课讲师接口
		loadStaffDate() {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_STAFF_GET",
				type: "GET",
				param: {
					type: 1
				},
				loading: false
			}).then(res => {
				this.teachers = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 限制选择框最多选择4人
		handleLimitCount(e) {
			if (e.length <= 3) {
				this.show = false;
			} else if (e.length > 4) {
				this.$Message.warning('最多选择4名授课讲师! ');
				e.pop();
				this.show = true;
			} 
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
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_ARRANGE_TRAIN_POST",
				type: "POST",
				param: {
					applicant_ids: this.applicantIds || this.applicantsIds,
					course_id: this.courseId || this.formData.course_id,
					staff_ids: this.formData.staff_ids,
					teaching_time: moment(this.formData.teaching_time).format("YYYY-MM-DD")
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const ArrangeTraining = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-transfer-arrange-training{
	top: 348px !important;
}
</style>