<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="500"
			class="v-application-min-apply-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="_oaitem">
				<oa-detail-item label="申请性质:" >
					<div>{{ formValidate.apply_nature_name }}</div>
				</oa-detail-item>
				<oa-detail-item v-if="formValidate.apply_nature==1" label="申请部门:">
					<div>{{ formValidate.apply_depart_name }}</div>
				</oa-detail-item>
				<oa-detail-item label="申请类型:">
					<div>{{ formValidate.event_type_name }}</div>
				</oa-detail-item>
				<oa-detail-item label="期待完成日期:">
					<div>{{ formValidate.expected_completion_time }}</div>
				</oa-detail-item>
				<oa-detail-item label="事项主题:">
					<div class="_item" style="lineHeight:20px">{{ formValidate.event_theme }}</div>
				</oa-detail-item>
				<oa-detail-item label="详细说明:">
					<div class="_item" style="lineHeight:20px">{{ formValidate.detail }}</div>
				</oa-detail-item>
				<oa-detail-item v-if="formValidate.refuse_reason" label="驳回理由:">
					<div class="_item" style="lineHeight:20px">{{ formValidate.refuse_reason }}</div>
				</oa-detail-item>
				<oa-detail-item label="上传图片:">
					<vc-imgs-picker 
						v-model="formValidate.url" 
						:max="5"
						:disabled="true" 
						class="g-m-t-10"
						@error="handleError"
					/>
				</oa-detail-item>
				<oa-detail-item v-if="formValidate.service_score" label="服务评价:">
					<i-rate v-model="formValidate.service_score" allow-half disabled />
				</oa-detail-item>
				<oa-detail-item v-if="formValidate.evaluate" label="评价:">
					<div class="_item" style="lineHeight:20px">{{ formValidate.evaluate }}</div>
				</oa-detail-item>
			</div>
			<i-form
				v-if="statusInfo"
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-form-item label="审核结果:" prop="audit_status">
					<i-radio-group v-model="formValidate.audit_status" :style="{ width: '80%' }">
						<i-radio label="1">通过</i-radio>
						<i-radio label="0">驳回</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item v-if="formValidate.audit_status=='0'" label="驳回理由:" prop="new_refuse_reason">
					<oa-limit-words
						v-model="formValidate.new_refuse_reason"
						:max="200"
						:style="{ width: '80%' }"
						placeholder="请填写驳回理由"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal, Form, FormItem, RadioGroup, Radio, Rate
} from "iview";
import lodash from "lodash";
import { CreatePortal, ImgsPicker } from "wya-vc";
import { dataValidity } from "@utils/utils";
import API from "@stores/apis/root";
import LimitWords from '@components/_common/limit-words/limit-words';
import DetailItem from './detail-item';

export default {
	name: "hr-add-customer-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-imgs-picker": ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-detail-item': DetailItem,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-rate": Rate,
	},

	props: {
		title: String,
		eventId: Number,
		statusInfo: Boolean
	},
	data() {
		return {
			visible: false,
			positionArr: [],
			formValidate: {
				audit_status: '',
				refuse_reason: '',
				apply_nature_name: '',
				apply_depart_name: '',
				event_type_name: '',
				expected_completion_time: '',
				event_theme: '',
				detail: '',
				url: [],
			},
			ruleValidate: {
				audit_status: [
					{ required: true, message: "申请性质为必选", trigger: "change" }
				],
				new_refuse_reason: [
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
		this.eventId && this.fetchData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		fetchData() {
			this.$request({
				url: API._ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_DETAIL_GET,
				type: "GET",
				param: {
					event_id: this.eventId
				}
			}).then(res => {
				this.formValidate = { ...res.data };
				this.formValidate.service_score = res.data.service_score / 2;
			}).catch(err => {});
		},
		handleOk: lodash.debounce(function (event) {
		// handleOk() {
			if (this.statusInfo) {
				this.$refs.formValidate.validateAndScroll(valid => {
					if (valid) {
						this.$request({
							url: API._ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_RATE_AUDIT_EVENT_POST,
							type: "POST",
							param: {
								...this.formValidate,
							},
							loading: false
						}).then(res => {
							this.$Message.success(res.msg);
							this.$emit("sure", true);
						}).catch(error => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(error.msg);
						});
					} else {
						this.$refs.modal.buttonLoading = false;
					}
				});
			} else {
				this.visible = false;
			}
			
		}, 0),
		handleCancel() {
			this.visible = false;
			// this.$emit("close");
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
	}
};

export const ApplyModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-application-min-apply-modal{
	._item {
		word-wrap: break-word;
		word-break: break-all;
	}
	  ._oaitem {
        margin-left: 20px;
		
    }
	.ivu-modal-content{
		.ivu-modal-body{
			padding:6px 0px !important;
		}
		.ivu-modal-footer{
			padding:20px 20px 20px 18px !important;
		}
	}
}
</style>


