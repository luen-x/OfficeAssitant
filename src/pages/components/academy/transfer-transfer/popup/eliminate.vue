<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="培训淘汰"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formDataRule" 
				class="g-m-t-20"
			>
				<i-form-item label="淘汰原因：" prop="pass_remarks_type">
					<i-select
						v-model="formData.pass_remarks_type"
						clearable
						transfer
						style="width:220px;"
						placeholder="请选择试岗淘汰原因"
					>
						<i-option
							v-for="item in passList"
							:value="item.value + ''"
							:key="item.value + ''"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="淘汰到：" prop="pass_type">
					<i-select
						v-model="formData.pass_type"
						clearable
						transfer
						style="width:220px;"
						placeholder="请选择淘汰类型"
					>
						<i-option
							v-for="item in passType"
							:value="item.value"
							:key="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="备注：">
					<oa-limit-words
						v-model="formData.train_pass_remarks"
						:max="200"
						placeholder="请输入备注信息"
						style="width: 220px;"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: 'v-academy-transfer-eliminate-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		"i-select": Select,
		"i-option": Option
	},
	props: {
		applicantId: {
			required: true,
			type: Number
		},
		courseStep: {
			required: true,
			type: Number
		}
	},
	data() {
		return {
			passList: [], // 培训课程
			passType: [
				{
					label: '主动淘汰',
					value: '1'
				},
				{
					label: '被动淘汰',
					value: '2'
				}
			],
			formData: {
				pass_remarks_type: "",
				pass_type: "",
				train_pass_remarks: ""
			},
			formDataRule: {
				pass_remarks_type: [
					{
						required: true,
						message: "请选择试岗淘汰原因！",
						trigger: "change"
					}
				],
				pass_type: [
					{
						required: true,
						message: "请选择淘汰类型！",
						trigger: "change"
					}
				]
			},
			visible: false
		};
	},
	mounted() {
		this.loadPassDate();
		this.visible = true;
	},
	methods: {
		// 淘汰原因
		loadPassDate() {
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_PASS_REMARKS_GET",
				type: "GET",
				param: {}
			}).then(res => {
				this.passList = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
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
			this.$request({
				url: "_ACADEMY_TRANSFER_TRANSFER_WEED_OUT_POST",
				type: "POST",
				param: {
					applicant_id: this.applicantId,
					course_step: this.courseStep,
					...this.formData
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
export const Eliminate = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>