<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="540"
			class="v-hr-summary-details-add-contract"
		
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ '添加新合同' }}</div>
			<div >
				<div class="g-flex g-pd-lr-30 _form">
					<i-form
						ref="form"
						:model="formValidate"
						:rules="ruleValidate"
						:label-width="100"
						
					>
						<div>
							<i-form-item label="员工姓名:">{{ staff_name }}</i-form-item>
						</div>
						<div>
							<i-form-item style="margin:-10px 0px" label="签订时间:" prop="sign_time">
								<i-date-picker
									v-model="formValidate.sign_time"
									:options="{disabledDate:startTimeDisable}"
									style="width: 300px"
									type="date"
									transfer
									placeholder="请选择合同签订时间"
								/>
							</i-form-item>
						</div>
						<div>
							<i-form-item label="合同到期日:" prop="contract_indate">
								<i-date-picker
									v-model="formValidate.contract_indate"
									:options="{disabledDate:endTimeDisable}"
									style="width: 300px"
									type="date"
									transfer
									placeholder="请选择合同到期日"
								/>
							</i-form-item>
						</div>
						<div class="_add">
							<i-form-item label="合同公司:" prop="contract_company_id">
								<i-select
									v-model="formValidate.contract_company_id"
									
									clearable
									transfer
									style="width: 300px"
									placeholder="请选择合同公司"
								>
									<i-option
										v-for="(item, index) in contractArr"
										:key="index"
										:value="item.contract_company_id"
									>{{ item.company_name }}</i-option>
								</i-select>
							</i-form-item>
							<i
								class="iconfont icon-add1 __plus g-operation"
								@click="handleAddModal(0)"
							/>
						</div>
						<div class="_add">
							<i-form-item label="社保缴纳公司:" prop="security_company_id">
								<i-select
									v-model="formValidate.security_company_id"
									clearable
									transfer
									style="width: 300px"
									placeholder="请选择社保缴纳公司"
								>
									<i-option
										v-for="(item, index) in socialContractArr"
										:key="index"
										:value="item.contract_company_id"
									>{{ item.company_name }}</i-option>
								</i-select>
							</i-form-item>
							<i
								class="iconfont icon-add1 __plus g-operation"
								@click="handleAddModal(1)"
							/>
						</div>
						<div>
							<i-form-item label="图片:" prop="img_url">
								<vc-imgs-picker 
									v-model="formValidate.img_url" 
									:max="10"
									@error="handleError"
								/>
							</i-form-item>
						</div>
					</i-form>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { ImgsPicker, CreatePortal } from "wya-vc";
import {
	Modal,
	DatePicker,
	Form,
	FormItem,
	Row,
	Col,
	Input,
	InputNumber,
	Select,
	Option,
	Button
} from "iview";
import { services } from "@stores/services/hr";
import API_ROOT from "@stores/apis/root";
import moment from "moment";
import { AuditModal } from "./audit";

export default {
	name: "v-hr-summary-details-add-contract",
	components: {
		"i-modal": Modal,
		"i-datepicker": DatePicker,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button,
		"vc-imgs-picker": ImgsPicker,
		"i-date-picker": DatePicker
	},
	mixins: [services.contractCompany(), services.socialContractCompany()],
	props: {
		title: String,
		type: Number,
		staff_id: String,
		staff_name: String,
	},
	data() {
		return {
			visible: false,
			contractArr: [],
			socialContractArr: [],
			formValidate: {
				sign_time: moment().format("YYYY-MM-DD"), // 合同签订时间
				security_company_id: "", // 社保缴纳公司id
				contract_indate: "", // 合同有效期
				staff_name: "", // 员工姓名
				img_url: []
			},
			ruleValidate: {
				company_name: [
					{
						required: true,
						message: "公司名为必填",
						trigger: "blur"
					}
				],
				sign_time: [
					{
						required: true,
						type: "date",
						message: "合同签订时间为必选",
						trigger: "change"
					}
				],
				contract_indate: [
					{
						required: true,
						type: "date",
						message: "合同到期日为必选",
						trigger: "change"
					}
				],
				contract_company_id: [
					{
						required: true,
						type: "number",
						message: "合同公司为必选",
						trigger: "change"
					}
				],
				security_company_id: [
					{
						required: true,
						type: "number",
						message: "社保缴纳公司为必选",
						trigger: "change"
					}
				],
				img_url: [
					{
						required: true,
						type: "array",
						message: "请选择图片",
						trigger: "change"
					}
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.handleContractCompany();
		this.handleSocialContractCompany();
	},
	methods: {
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url:
                            API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_CONTRACT_COMPANY_POST,
						type: "POST",
						param: {
							...this.formValidate,
							staff_id: this.staff_id,
							contract_indate: moment(
								this.formValidate.contract_indate
							).format("YYYY-MM-DD"),
							sign_time: moment(
								this.formValidate.sign_time
							).format("YYYY-MM-DD"),
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit("sure", "success");
					}).catch(err => {
						this.$Message.error(err.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleContractCompany() {
			this.$request({
				url: API_ROOT._HR_STAFF_CONTRACT_COMPANY_GET,
				type: "GET"
			}).then(res => {
				this.contractArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSocialContractCompany() {
			this.$request({
				url: API_ROOT._HR_STAFF_SOCIAL_CONTRACT_COMPANY_GET,
				type: "GET"
			}).then(res => {
				this.socialContractArr = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCancel() {
			this.visible = false;
		},
		handleAddModal(type) {
			AuditModal.popup({
				title: type == 0 ? "合同公司" : "社保缴纳公司",
				type,
				staff_id: this.staff_id
			}).then(res => {
				this.handleContractCompany();
				this.handleSocialContractCompany();
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		startTimeDisable(date) {
			if (!this.formValidate.contract_indate) {
				return false;
			}
			return !(moment(date).isAfter(moment(this.formValidate.contract_indate).subtract(1, 'year'))
			&& moment(date).isBefore(moment(this.formValidate.contract_indate).subtract(0, 'day')));
		},
		endTimeDisable(date) {
			if (!this.formValidate.sign_time) {
				return false;
			}
			return !moment(date).isAfter(moment(this.formValidate.sign_time).subtract(0, 'day'));
		},
	}
};

export const AddContract = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-summary-details-add-contract {
	._form{
		max-height: 500px;
		overflow-y: auto;
		margin-left:-10px;
	}
	.ivu-modal-content{
		.ivu-modal-body{
			padding-top:26px;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
    ._add {
        position: relative;
        .__plus {
            position: absolute;
            font-size: 16px;
            left: 410px;
            top: 7px;
            z-index: 10000;
        }
    }
}
</style>


