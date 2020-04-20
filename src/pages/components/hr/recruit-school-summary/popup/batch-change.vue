<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="批量变更"
		class="v-hr-recruit-school-batch-change"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<i-form 
			ref="formValidate"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="100"
			@submit.native.prevent>

			<i-form-item 
				label="变更到：" 
				prop="status">
				<i-select
					v-model="formValidate.status"
					transfer
					style="width: 220px;">
					<i-option
						v-for="item in list"
						:key="item.value"
						:value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item
				v-if="!!formValidate.status&&formValidate.status!=12"
				label="面试结果："
				prop="interview_result">
				<i-select
					v-model="formValidate.interview_result"
					clearable
					transfer
					placeholder="请选择面试结果"
					style="width: 220px;">
					<i-option
						v-for="(status, i) in STATUS"
						:key="i"
						:value="i + 1">
						{{ STATUS[i] }}
					</i-option>
				</i-select>
			</i-form-item>	
		</i-form>

	</i-modal>
</template>

<script>
import moment from "moment";
import API_ROOT from "@stores/apis/root";
import { CreatePortal } from "wya-vc";
import { Modal, Form, FormItem, Select, Option } from "iview";

const STATUS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-'];

export default {
	name: "hr-recruit-school-summary-delete",
	components: {
		"i-modal": Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-option': Option,
		'i-select': Select,
	},
	props: {
		selected: Array,
	},
	data() {
		// 待沟通状态下变更选项
		this.list1 = [
			{ label: "初步沟通", value: 12 },
			{ label: "待定中", value: 8 },
			{ label: "发offer", value: 2 }
		];

		// 初步沟通状态下变更选项
		this.list2 = [
			{ label: "待沟通", value: 1 },
			{ label: "待定中", value: 8 },
			{ label: "发offer", value: 2 }
		];
		return {
			visible: false,
			STATUS,
			formValidate: {
				status: '',
				interview_result: ''
			},
			ruleValidate: {
				status: [{ required: true, type: 'number', message: "请选择变更状态", trigger: "change" }],
				interview_result: [{ required: true, type: 'number', message: "请选择面试结果", trigger: "change" }],
			}
		};
	},
	computed: {
		list() {
			return this['list' + this.type];
		},
		type() {
			return this.$route.query.type || '1';
		}
	},
	created() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$refs.modal.buttonLoading = false;
					this.$request({
						url: '_HR_RECRUIT_SCHOOL_BATCH_CHANGE_POST',
						type: "POST",
						param: {
							info: this.handlePostInfo()
						}
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure', true);
						this.visible = false;
					}).catch(err => {
						
						this.$Message.error(err.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
			
		},
		handlePostInfo() {
			return this.selected.map(v => ({
				applicant_id: v.applicant_id,
				interview_result: this.formValidate.interview_result,
				status: this.formValidate.status
			}));
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const BatchChangeModal = CreatePortal({}, module.exports.default);
</script>
