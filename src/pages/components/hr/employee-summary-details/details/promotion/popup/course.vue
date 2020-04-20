<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		title="更改课程次数"
		width="400px"
		@submit.native.prevent="handleOk"
		@on-ok="handleOk"
		
		@on-cancel="handleCancel">

		<i-form 
			:model="addForm" 
			:rules="addRule" 
			:label-width="100" 
			class="g-flex g-flex-ac g-flex-cc g-m-t-20">
			<i-form-item label="课程次数：" prop="course_num">
				<i-input-number 
					v-model="addForm.course_num" 
					placeholder="请输入课程次数" 
					style="width: 220px;" 
					@on-enter.prevent="handleOk"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "vc-hr-summary-details-password-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},
	props: {
		staff_id: String,
		course_num: Number
	},
	data() {
		return {
			visible: false,
			title: '',
			addForm: {
				course_num: this.course_num || 0,
			},
			addRule: {
				course_num: [{ required: true, type: 'number', message: '开课次数不能为空', trigger: 'blur' }],
			},
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_EDIT_MY_RATE_GET,
				type: "GET",
				param: {
					staff_id: this.staff_id,
					course_num: this.addForm.course_num
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure");
				
			});
			// 
		},
		handleCancel() {
			this.visible = false;
			// this.$emit("close");
		}
	}
};

export const CourseModal = CreatePortal({}, module.exports.default);
</script>
