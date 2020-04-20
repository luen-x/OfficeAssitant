<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="v-hr-details-contract-add-company-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate" 
				:label-width="120" 
				class="g-m-t-20 v-summary-modal"
			>
				<i-form-item :label="title" prop="company_name">
					<i-input 
						v-model="formValidate.company_name" 
						:maxlength="50" 
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
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
import { CreatePortal } from "wya-vc";
import API from '@stores/apis/root';

export default {
	name: "hr-employee-details-contract-company",
	components: {
		"i-modal": Modal,
		"i-datepicker": DatePicker,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-row": Row,
		"i-col": Col,
		"i-button": Button
	},
	props: {
		title: String,
		type: Number
	},
	data() {
		return {
			visible: false,
			formValidate: {
				type: '',
				company_name: "",
			},
			ruleValidate: {
				company_name: [
					{ required: true, message: "公司名为必填", trigger: "blur" }
				],
			}
		};
	},
	computed: {},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$request({
						url: API._HR_EMPLOYEE_SUMMARY_DETAILS_ADD_COMPANY_POST,
						type: "POST",
						param: {
							...this.formValidate,
							type: this.type
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure', 'success');
						this.visible = false;
					}).catch(error => {
						this.$Message.error(error.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.visible = false;
		},
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
.v-hr-details-contract-add-company-modal{
	.ivu-modal-content{
		.ivu-modal-body{
			padding-top:6px;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
}
</style>


