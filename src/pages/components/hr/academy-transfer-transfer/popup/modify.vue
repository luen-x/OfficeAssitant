<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="修改培训课程"
		class="v-hr-academy-transfer-modify-modal"
		@on-ok="handleOk">

		<div class="g-fs-14 g-m-t-20 _content">
			<i-form
				ref="form"
				:rules="rule"
				:model="formData"
				:label-width="100">
				<i-form-item label="项目时段：" prop="project_id">
					<i-select
						v-model="formData.project_id"
						clearable
						transfer
						placeholder="请选择项目时段"
						style="width: 220px;"
						@on-change="handleProjectChange">
						<i-option
							v-for="item in projectList"
							:key="item.project_id"
							:value="item.project_id">
							{{ item.project_time }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="formData.project_id" label="项目主题：" prop="project_topic">
					<i-input v-model="formData.project_topic" disabled style="width: 220px;"/>
				</i-form-item>
				<i-form-item
					v-if="formData.project_id && formData.courseList.length"
					label="培训课程："
					prop="isAll"
					class="_form-item">
					<div
						v-for="(item, index) in formData.courseList"
						:key="index"
						class="_form-item">
						<i-checkbox
							v-model="item.isSelected"
							:disabled="item.is_disable === 1"
							@on-change="(e) => handleChange(e, item)">
							{{ item.course_name.length > 10 ? item.course_name.slice(0, 10) + '...' : item.course_name }}
						</i-checkbox>
						<div class="_desc">{{ `${item.lecturer_name + '   ' + item.course_time}` }}</div>
					</div>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import orderModal from '@extends/mixins/orderModal';
import { Modal, DatePicker, Form, FormItem, Select, Option, Input,
		 Checkbox } from "iview";

export default {
	name: "hr-academy-transfer-modify-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-checkbox": Checkbox,
		'i-date-picker': DatePicker,
	},
	mixins: [orderModal],
	props: {
		info: Object
	},
	data() {
		return {
			visible: false,
			course_id: '',
			formData: {
				courseList: [],
				isAll: false,
				project_id: ''
			},
			projectList: [],
			rule: {
				project_id: [{ required: true, message: "请选择项目时段", pattern: /.+/, trigger: "change" }],
				isAll: [{ required: true, message: "请选择项目时段", type: 'boolean', trigger: "change" }]
			}
		};
	},
	computed: {
		isDisabled() {
			if (this.formData.courseList.length) {
				return this.formData.courseList.every(item => item.is_disable === 1);
			}
		}
	},
	mounted() {
		this.visible = true;
		this.course_id = this.info.course_id;
		this.formData.project_id = this.info.project_id;

		// 获取项目时间段
		this.$request({
			url: '_HR_ACADEMY_TRANSFER_PROJECT_TIME_GET',
			type: 'GET',
			param: {},
		}).then((res) => {
			this.projectList = res.data;
			this.handleProjectChange(this.formData.project_id);
		}).catch((error) => {
		});
	},
	methods: {
		// 选中项目变化
		handleProjectChange(val) {
			this.formData.isAll = false;
			this.formData.project_topic = this.projectList.filter(item => item.project_id === val)[0].project_topic;
			this.$request({
				url: '_HR_ACADEMY_TRANSFER_COURSE_BY_PROJECT_GET',
				type: 'GET',
				param: {
					project_id: val
				},
			}).then((res) => {
				this.formData.courseList = Array.isArray(res.data) ? res.data : [];

				this.formData.courseList.forEach((item, index) => {
					if (item.course_id === this.course_id) {
						this.formData.courseList[index].isSelected = true;
					} else {
						this.formData.courseList[index].isSelected = false;
					}
				});
			}).catch((error) => {
			});
		},
		handleChange(value, sed) {
			if (value) {
				this.formData.courseList.forEach((item, index) => {
					if (item.course_id === sed.course_id) {
						this.formData.courseList[index].isSelected = true;
					} else {
						this.formData.courseList[index].isSelected = false;
					}
				});
			}

			this.$forceUpdate();
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs.modal.buttonLoading = false;
			let course_id = [];
			if (this.formData.courseList.length) {
				if (this.isDisabled) {
					this.$Message.warning('当前项目时段没有可选课程，请重新选择时段！');
					return;
				} else if (this.formData.courseList.every(item => item.isSelected === false)) {
					this.$Message.error('必须选择一个课程！');
					return;
				} else {
					course_id = this.formData.courseList.filter(item => item.isSelected === true)[0].course_id;
				}
			} else {
				this.$Message.warning('当前项目时段没有课程，请重新选择时段！');
				return;
			}

			this.$request({
				url: '_HR_ACADEMY_TRANSFER_COURSE_UPDATE_POST',
				type: 'GET',
				param: {
					participator_id: this.info.participator_id,
					applicant_id: this.info.applicant_id,
					mobile: this.info.mobile,
					applicant_name: this.info.applicant_name,
					project_id: this.formData.project_id,
					course_id
				},
			}).then((res) => {
				this.$emit("sure");
				this.$Message.success("操作成功");
				this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});

		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const modifyPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-academy-transfer-modify-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		max-height: 450px;
		overflow-y: auto;
		color: #333333;
		font-size: 14px;
	}
	._form-item {
		margin-bottom: 10px !important;
		.ivu-form-item-content {
			line-height: 18px !important;
		}
		._desc {
			color: #818794;
			margin-left: 17px;
		}
	}
	.ivu-form-item-required {
		.ivu-form-item-content {
			line-height: 31px !important;
		}
	}
}
</style>

