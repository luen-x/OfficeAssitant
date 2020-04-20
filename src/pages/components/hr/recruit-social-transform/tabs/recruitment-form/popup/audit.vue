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
				<i-form-item v-if="type===1" label="需求组织:" prop="depart_id">
					<i-cascader
						v-model="formValidate.depart_id"
						:data="departPart"
						:style="{ width: '80%' }"
						:change-on-select="true"
						clearable
						transfer
						trigger="click"
						placeholder="请选择需求组织"
						@on-change="handleChange"
					/>
				</i-form-item>
				<i-form-item v-if="type===1" label="职位名称:" prop="position_id">
					<i-select
						v-model="formValidate.position_id"
						:style="{ width: '80%' }"
						clearable
						placeholder="请选择职位名称"
					>
						<i-option
							v-for="(item, index) in positionArr"
							:key="index"
							:value="item.position_id"
						>{{ item.position_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="需求人数:" prop="need_number">
					<i-input-number
						v-model="formValidate.need_number"
						:max="99"
						:min="1"
						:style="{ width: '80%' }"
						placeholder="请输入需求人数"
					/>
				</i-form-item>
				<i-form-item label="薪资范围:" prop="salary_range">
					<i-input
						v-model="formValidate.salary_range"
						:maxlength="15"
						:style="{ width: '80%' }"
						clearable
						placeholder="请输入薪资范围"
					/>
				</i-form-item>
				<i-form-item label="负责人：" prop="staff_id">
					<i-select
						ref="staff"
						v-model="formValidate.staff_id"
						:remote-method="loadStaff"
						:loading="staffLoading"
						:style="{ width: '80%' }"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请选择负责人"
						@on-change="handleStaffChange"
						@on-query-change="handleQueryChange($event, 'staff')"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="人员要求:">
					<oa-limit-words
						v-model="formValidate.staff_standard"
						:max="500"
						:style="{ width: '80%' }"
						placeholder="请输入人员要求"
					/>
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
import { services, createSearch } from "@stores/services/hr";
import { dataValidity } from "@utils/utils";
import API from "@stores/apis/root";
import Explain from '@components/_common/explain/explain';
import LimitWords from "@components/_common/limit-words/limit-words";

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
		"oa-limit-words": LimitWords
	},
	mixins: [
		services.departPart(),
		createSearch({ key: 'staff' })
	],
	props: {
		title: String,
		type: Number,
		info: Object,
	},
	data() {
		return {
			visible: false,
			positionArr: [],
			oldMobile: '',
			staff: '',
			formValidate: {
				need_number: null,
				staff_standard: '',
				responsible_id: (this.info && this.info.responsible_id) || '',
				salary_range: '',
				depart_id: [],
				position_id: [],
			},
			ruleValidate: {
				need_number: [
					{ required: true, message: "需求人数为必填", pattern: /.+/, trigger: "blur" }
				],
				staff_standard: [
					{ required: true, message: "人员要求为必填", trigger: "blur" }
				],
				depart_id: [
					{
						required: true,
						type: "array",
						message: "请选择试岗部门",
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
			}
		};
	},
	computed: {},
	created() {
		// this.need_id && this.fetchData();
		if (this.info && this.info.need_id) {
			this.staff = this.info.responsible_name;
			this.formValidate.need_number = this.info.need_number;
			this.formValidate.staff_standard = this.info.staff_standard;
			this.formValidate.staff_id = this.info.responsible_id;
			this.formValidate.salary_range = this.info.salary_range;
		}
		if (this.info && this.info.responsible_name) {
			this.loadStaff(this.info.responsible_name);
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleChange(value, selectedData) {
			this.formValidate.position_id = "";
			this.positionArr = [];
			value[0] && this.handleEntryPosition(value[0]);
		},
		handleStaffChange(value, type) {
			this.formValidate.staff_id = value && value.value ? value.value : '';
			this.formValidate.staff_name = value && value.label ? value.label : '';
		},
		handleQueryChange(query = '', type) {
			let targetQuery = this.formValidate[`${type}_name`] || '';
			if (targetQuery.length > query.length) {
				this.$refs[`${type}`].clearSingleSelect();
			}
		},
		handleEntryPosition(id) {
			this.$request({
				url: API.HR_POSITION_LIST_GET,
				type: "GET",
				param: {
					depart_id: id,
					is_applicant_use: 1,
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
					let param = { ...this.formValidate, responsible_id: this.formValidate.staff_id };
					delete param.staff_id;
					delete param.staff_name;
					this.info && this.info.need_id ? param.need_id = this.info.need_id : '';

					this.$request({
						url: API._HR_RECRUIT_SCHOOL_NEED_POSITION_ADD_POST,
						type: "POST",
						param,
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$store.commit("HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_INIT");
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
.v-hr-add-customer-modal {
	.ivu-modal-content {
		.ivu-modal-body {
			padding: 6px 0 !important;
		}
		.ivu-modal-footer {
			padding: 0 20px 20px 18px !important;
		}
	}
}
</style>


