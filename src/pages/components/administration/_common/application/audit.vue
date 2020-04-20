<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="400" 
			class="v-application-min-audit-modal"
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
				<i-form-item v-if="formValidate.refuse_reason" label="驳回理由:">
					<div :style="{ width: '80%' }" class="_item">{{ formValidate.refuse_reason }}</div>
				</i-form-item>
				<i-form-item label="申请性质:" prop="apply_nature">
					<i-radio-group v-model="formValidate.apply_nature">
						<i-radio label="1">部门</i-radio>
						<i-radio label="0">个人</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="formValidate.apply_nature==1" label="申请部门:" prop="apply_depart_id">
					<i-cascader
						v-model="formValidate.apply_depart_id"
						:data="departAll"
						:style="{ width: '80%' }"
						:change-on-select="true"
						clearable
						transfer
						trigger="click"
						placeholder="请选择申请部门"
					/>
				</i-form-item>
				<i-form-item label="事项类型:" prop="event_type_id">
					<i-select
						v-model="formValidate.event_type_id"
						:style="{ width: '80%' }"
						placeholder="请选择事项类型"
						clearable
						transfer
						class="g-m-r-5"
					>
						<i-option
							v-for="item in eventTypeList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="期待完成日期:" prop="expected_completion_time">
					<i-datepicker
						v-model="formValidate.expected_completion_time"
						:style="{ width: '80%' }"
						format="yyyy-MM-dd HH:mm"
						placeholder="请选择期待完成日期" 
						type="datetime"
						transfer
					/>
				</i-form-item>
				<i-form-item label="事项主题:" prop="event_theme">
					<oa-limit-words
						v-model="formValidate.event_theme"
						:max="30"
						:style="{ width: '80%' }"
						placeholder="请填写事项主题(30字内)"
					/>
				</i-form-item>
				<i-form-item label="详细说明:" prop="detail">
					<oa-limit-words
						v-model="formValidate.detail"
						:max="200"
						:style="{ width: '80%' }"
						placeholder="请填写详细说明"
					/>
				</i-form-item>
				<i-form-item label="上传图片:" prop="url">
					<vc-imgs-picker 
						v-model="formValidate.url" 
						:max="5" 
						class="g-m-t-10"
						@error="handleError"
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
import { CreatePortal, ImgsPicker } from "wya-vc";
import moment from "moment";
import { dataValidity } from "@utils/utils";
import { services, staffByMutiTermNew } from "@stores/services/hr";
import { services as contentService } from '@stores/services/administration';
import API from "@stores/apis/root";
import LimitWords from '@components/_common/limit-words/limit-words';
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
		"vc-imgs-picker": ImgsPicker,
		'oa-limit-words': LimitWords,
	},
	mixins: [
		staffByMutiTermNew,
		services.departAll(),
		contentService.eventTypeList()
	],
	props: {
		title: String,
		statusInfo: Boolean,
		eventId: Number
	},
	data() {
		return {
			visible: false,
			typeList: [],
			formValidate: {
				event_type_id: [],
				apply_nature: '',
				apply_depart_id: [],
				expected_completion_time: '',
				event_theme: '',
				detail: '',
				url: [],
				refuse_reason: '',
			},
			ruleValidate: {
				apply_nature: [
					{ required: true, message: "申请性质为必选", trigger: "change" }
				],
				expected_completion_time: [
					{
						required: true,
						type: "date",
						message: "请选择期待完成日期",
						trigger: "change",
					}
				],
				apply_depart_id: [
					{
						required: true,
						type: "array",
						message: "请选择申请部门",
						trigger: "change"
					}
				],
				event_type_id: [
					{
						required: true,
						type: "number",
						message: "请选择事项类型",
						trigger: "change"
					}
				],
				event_theme: [
					{
						required: true,
						message: "请填写事项主题(30字内)"
					}
				],
			}
		};
	},
	computed: {},
	created() {
		this.eventId && this.fetchData(this.eventId);
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		
		fetchData(id) {
			this.$request({
				url: API._ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_DETAIL_GET,
				type: "GET",
				param: {
					event_id: id
				}
			}).then(res => {
				this.formValidate = res.data;
			}).catch(err => {});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleOk: lodash.debounce(function (event) {
		// handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.$request({
						url: API._ADMINISTRATION_APPLICATION_MINE_ADD_POST,
						type: "POST",
						param: {
							...this.formValidate,
							expected_completion_time: moment(this.formValidate.expected_completion_time).format("YYYY-MM-DD HH:mm")
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit("sure", true);
					}).catch(error => {
						this.visible = true;
						this.$refs.modal.buttonLoading = false;
						this.$Message.error(error.msg);
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
.v-application-min-audit-modal{
	._item {
		word-wrap: break-word;
		word-break: break-all;
	}
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


