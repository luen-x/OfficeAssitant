<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="400"
			class="v-hr-add-customer-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="120"
				class="g-m-t-20"
			>
				<i-form-item label="姓名:" prop="applicant_name">
					<i-input
						v-model="formValidate.applicant_name"
						:maxlength="10"
						style="width: 220px"
						placeholder="请输入姓名"
					/>
				</i-form-item>
				<i-form-item label="性别:" prop="sex">
					<i-radio-group v-model="formValidate.sex">
						<i-radio label="0">男</i-radio>
						<i-radio label="1">女</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="手机号码:" prop="mobile">
					<i-input
						v-model="formValidate.mobile"
						:maxlength="11"
						style="width: 220px"
						placeholder="请输入手机号码"
					/>
				</i-form-item>
				<i-form-item label="预计入职时间:" prop="predict_entry_time">
					<i-datepicker
						v-model="formValidate.predict_entry_time"
						:split-panels="true"
						style="width: 220px"
						placeholder="请选择预计入职时间"
						type="date"
						transfer
					/>
				</i-form-item>
				<i-form-item label="部门:" prop="depart_id">
					<i-cascader
						v-model="formValidate.depart_id"
						:data="departAll"
						:change-on-select="true"
						:filterable="false"
						style="width: 220px"
						clearable
						transfer
						trigger="click"
						placeholder="请选择部门"
						@on-change="handleChange"
					/>
				</i-form-item>
				<i-form-item label="职位:" prop="position_id">
					<i-select
						v-model="formValidate.position_id"
						style="width: 220px"
						clearable
						filterable
						transfer
						placeholder="请选择职位"
					>
						<i-option
							v-for="(item, index) in positionArr"
							:key="index"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item >
					<div slot="label">
						<span>转介绍人</span>
						<oa-explain 
							class="g-m-l-5"
							style="transform: translateY(2px);"
							title="该新入职的员工是由他人介绍入职"
							content="例如，新入职的员工A是由我司的员工B介绍的，那么A成功入职后，B就是转介绍人。没有转介绍人或者转介绍人是公司外部人员则不用填写"
						/>
						:
					</div>
					<i-select
						v-model="formValidate.introducer"
						:remote-method="loadStaffNew"
						:loading="staffLoading"
						:placeholder="'请输入姓名'"
						style="width: 220px"
						filterable
						remote
						clearable
						transfer
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.label"
						>{{ item.label }}</i-option>
					</i-select>
					
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal, DatePicker, Form, FormItem, Row, Cascader,
	Col, Input, InputNumber, Select, Option, Button, RadioGroup,
	Radio
} from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import moment from "moment";
import { dataValidity } from "@utils/utils";
import { services, staffByMutiTermNew } from "@stores/services/hr";
import API from "@stores/apis/root";
import Explain from '@components/_common/explain/explain';

export default {
	name: "hr-add-customer-modal",
	components: {
		"i-modal": Modal,
		"i-cascader": Cascader,
		"i-datepicker": DatePicker,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-row": Row,
		"i-col": Col,
		"i-button": Button,
		'oa-explain': Explain,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
	},
	mixins: [
		staffByMutiTermNew,
		services.departAll()
	],
	props: {
		title: String,
		staffId: Number,
		applicant_id: Number
	},
	data() {
		const validateMobile = (rule, value, callback) => {
			if (this.oldMobile != value) {
				this.$request({
					url: API.HR_EMPLOYEE_SUMMARY_CHECK_MOBILE_GET,
					type: "GET",
					param: {
						mobile: value,
						applicant_id: this.applicant_id
					}
				}).then(res => {
					if (res.data.status) {
						callback(new Error(res.msg));
					} else {
						callback();
					}
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			} else {
				callback();
			}
		};
		return {
			visible: false,
			positionArr: [],
			oldMobile: '',
			formValidate: {
				applicant_name: "",
				sex: "0",
				mobile: null,
				predict_entry_time: "",
				depart_id: [],
				position_id: [],
				introducer: ""
			},
			ruleValidate: {
				applicant_name: [
					{ required: true, message: "姓名为必填", trigger: "blur" },
					{ type: 'validCompellation', message: '请输入正确的姓名', validator: dataValidity, trigger: "blur" }
					
				],
				sex: [
					{ required: true, message: "性别为必选", trigger: "change" }
				],
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
					{ validator: validateMobile, trigger: "blur" }
				],
				predict_entry_time: [
					{
						required: true,
						type: "date",
						message: "时间为必选",
						trigger: "change"
					}
				],
				depart_id: [
					{
						required: true,
						type: "array",
						message: "请选择部门",
						trigger: "change"
					}
				],
				position_id: [
					{
						required: true,
						type: "number",
						message: "请选择职位",
						trigger: "change"
					}
				],
				introducer: [
					{ required: true, message: "转介绍人为必选", trigger: "change" }
				]
			}
		};
	},
	computed: {},
	created() {
		this.applicant_id && this.fetchData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		fetchData() {
			this.$request({
				url: API._HR_EMPLOYEE_SUMMARY_ENTRY_EDIT_DETAIL_GET,
				type: "GET",
				param: {
					applicant_id: this.applicant_id
				}
			}).then(res => {
				this.formValidate = { ...res.data };
				this.oldMobile = res.data.mobile;
				res.data.depart_id[0] && this.handleEntryPosition(res.data.depart_id[0]);
			}).catch(err => {});
		},
		handleChange(value, selectedData) {
			this.formValidate.position_id = "";
			this.positionArr = [];
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleEntryPosition(id) {
			this.$request({
				url: API.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id,
					type: 1
				},
				loading: false
			}).then(res => {
				this.positionArr = res.data.list;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk: lodash.debounce(function (event) {
		// handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.visible = false;
					this.$request({
						url: API.HR_SUMMARY_STAFF_ADD_POST,
						type: "POST",
						param: {
							...this.formValidate,
							predict_entry_time: moment(
								this.formValidate.predict_entry_time
							).format("YYYY-MM-DD")
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit("sure", true);
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
			// this.$emit("close");
		}
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-add-customer-modal{
	.ivu-modal-content{
		.ivu-modal-body{
			padding:6px 0px !important;
		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
}
</style>


