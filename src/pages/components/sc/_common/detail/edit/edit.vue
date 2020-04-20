<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				添加对接信息
			</div>

			<i-form
				ref="form"
				:model="formData"
				:rules="ruleData"
				:label-width="115"
				class="g-m-t-20"
			>
				<i-form-item
					label="对接人姓名:"
					prop="new_person"
				>
					<i-input
						v-model="formData.new_person"
						:maxlength="10"
						placeholder="请输入对接人"
						style="width:220px"
					/>
				</i-form-item>

				<i-form-item
					label="对接人电话:"
					prop="new_phone"
				>
					<i-input
						v-model="formData.new_phone"
						:maxlength="11"
						placeholder="请输入对接人电话"
						style="width:220px"
					/>
				</i-form-item>
				<i-form-item label="备注:">
					<oa-limit-words
						v-model="formData.remark"
						:max="200"
						placeholder="请输入备注信息"
						style="width: 220px"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber } from "iview";
import { CreatePortal } from "wya-vc";
import { objRegex } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-customer-edit-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},

	props: {
		name: String,
		project_id: Number,
		contract_id: Number,
		datas: {
			type: Array,
			default: () => [{}, {}]
		}
	},

	data() {
		// 验证手机号码
		let validatePhone = (rule, value, callback) => {
			const isPhone = objRegex.validPhone.regex;
			const isMob = objRegex.validMobile.regex;
			const hotLine = objRegex.validHotLine.regex;
			if (isPhone.test(value) || isMob.test(value) || hotLine.test(value)) {
				callback();
			} else {
				callback(new Error('请输入正确的电话号码'));
			}
		};

		return {
			visible: false,
			formData: {
				new_person: "",
				new_phone: null,
				remark: ""
			},
			ruleData: {
				new_person: [
					{
						required: true,
						message: "请输入对接人！",
						trigger: "blur"
					}
				],
				new_phone: [
					{
						required: true,
						message: "请输入对接人电话！",
						trigger: "blur"
					}, {
						validator: validatePhone, trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_BUTT_POST,
				type: "POST",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id,
					new_person: this.formData.new_person,
					new_phone: this.formData.new_phone,
					remark: this.formData.remark
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const EditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>