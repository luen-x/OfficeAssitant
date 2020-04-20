<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div
				slot="header"
				class="g-tc"
			>添加黑名单</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="120"
				class="g-m-t-20"
			>
				<i-form-item
					label="手机号码:"
					prop="mobile"
				>
					<i-input
						v-model="formValidate.mobile"
						:maxlength="11"
						clearable
						style="width: 220px"
						placeholder="请输入手机号码"
					/>
				</i-form-item>
				<i-form-item
					label="身份证号:"
					prop="id_card"
				>
					<i-input
						v-model="formValidate.id_card"
						:maxlength="18"
						:disabled ="isDisable"
						style="width: 220px"
						placeholder="请输入身份证号"
					/>
				</i-form-item>
				<i-form-item
					label="姓名:"
					prop="name"
				>
					<i-input
						v-model="formValidate.name"
						:disabled ="isDisable"
						:maxlength="10"
						style="width: 220px"
						placeholder="请输入姓名"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal,
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	Button
} from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import API from "@stores/apis/root";
import { dataValidity } from "@utils/utils";

export default {
	name: "hr-add-customer-modal",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button,
	},
	data() {
		const validateData = (rule, value, callback) => {
			if (value != this.oldMobile) {
				if (value) {
					this.$request({
						url: API._HR_RECRUIT_SOCIAL_BLACKLIST_CHECK_MOBILE_GET,
						type: "GET",
						param: {
							mobile: this.formValidate.mobile,
						}
					}).then(res => {
						this.oldMobile = this.formValidate.mobile;
						if (res.data.exits == 1) {
							this.formValidate.id_card = res.data.id_card;
							this.formValidate.name = res.data.name;
							this.formValidate.applicant_id = res.data.applicant_id;
							this.isDisable = true;
							callback();
						} else if (res.data.exits == 0) {
							this.isDisable = false;
							this.formValidate.id_card = '';
							this.formValidate.name = '';
							this.formValidate.applicant_id = '';
							callback();
						} else {
							callback(new Error('请重新填写号码'));
						}
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			} else {
				callback();
			}
			
		};
		return {
			visible: false,
			isDisable: true,
			oldMobile: "",
			formValidate: {
				mobile: "",
				id_card: "",
				name: ""
			},
			ruleValidate: {
				mobile: [
					{
						required: true,
						message: "手机号码为必填",
						trigger: "blur"
					},
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					},
					{ validator: validateData, trigger: "change" }
				],
				name: [
					{ required: true, message: "姓名为必填", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity }
				]
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk: lodash.debounce(function (event) {
			// handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.visible = false;
					this.$request({
						url: API._HR_RECRUIT_SOCIAL_BLACKLIST_ADD_GET,
						type: "GET",
						param: {
							...this.formValidate,
						},
						loading: false
					}).then(res => {
						this.$emit("sure");
						this.$Message.success(res.msg);
					}).catch(error => {
						this.$Message.error(error.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}, 0),
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		}
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>


