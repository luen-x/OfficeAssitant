<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="录单审核"
		width="500px"
		class="v-collage-outline-common-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100"
				@submit.native.prevent>
				<div class="g-tc g-m-b-10">
					{{ detailData.staff_name }}（{{ ROLE_ENUM[detailData.role_type] }}）
				</div>

				<oa-common-form-item 
					ref="form"
					:form-validate = "formValidate"
					:detail-data="detailData"/>

				<!-- <i-form-item
					label="课程类型："
					class="g-m-t-10"
				>
					<span>{{ formValidate.name }}</span>
				</i-form-item>

				<i-form-item 
					label="对接时间：" 
					prop="time"
					style="margin-top: -15px">
					<i-data-picker 
						v-model="formValidate.time"
						format="yyyy-MM-dd"
						type="datetimerange"
						split-panels
						transfer
						separator=" 至 "
						style="width: 300px"
						placeholder="请选择对接时间"/>
				</i-form-item>

				<i-form-item
					label="主持天数："
					style="margin: -15px 0"
				>
					<span>{{ chargeDay }}</span>
				</i-form-item>

				<i-form-item 
					label="是否出差："
					style="margin: -10px 0"
					prop="is_valid">
					<i-radio-group v-model="formValidate.is_out">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item 
					v-if="formValidate.is_out"
					prop="out_day" 
					label="出差天数：" 
					style="margin: -10px 0"
				>
					<i-input-number
						v-model="formValidate.out_day" 
						:min="1"
						:precision="0"
						:max="9"
						clearable
						style="width: 300px"
						placeholder="请输入可参与抽奖的人数"
					/>
					<span 
						class="g-c-black2 g-absolute __tip">天</span>
				</i-form-item>


				<i-form-item 
					:style="{ marginTop: formValidate.is_out ? '0' : '-10px'}"
					label="备注："
					prop="remark">
					<oa-limit-words
						v-model="formValidate.remark" 
						:max="200" 
						width="300px"
						placeholder="请输入备注"
					/>
				</i-form-item> -->

				<i-form-item
					label="审核结果："
					prop="audit_status"
					style="margin-top: -30px"
				>
					<i-select
						v-model="formValidate.audit_status"
						clearable
						transfer
						style="width: 300px"
						placeholder="请选择审核结果"
					>
						<i-option :value="1">通过</i-option>
						<i-option :value="2">驳回</i-option>
					</i-select>
				</i-form-item>

				<i-form-item 
					v-if="formValidate.audit_status === 2"
					label="驳回理由："
					class="g-pd-b-20"
					prop="audit_remark">
					<oa-limit-words
						v-model="formValidate.audit_remark" 
						:max="200" 
						width="300px"
						placeholder="请输入驳回理由"
					/>
				</i-form-item>

			</i-form>
		</div>
	</i-modal>
</template>

<script>

/** 
 * 流程对接人，主持人、唱单，音控共用审核弹窗
*/

import { Modal, Button, Form, FormItem, Input, DatePicker,
	Select, Option, RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { ROLE_ENUM } from "../../components/constants";
import commonFormItem from '../../components/common-formitem';

const LABEL = {
	'3': 'hosting_time',
	'5': 'singing_time',
	'6': 'voice_time'
};

export default {
	name: "oa-hr-collage-online-teacher-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-data-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-common-form-item': commonFormItem,
	},
	props: {
		detailData: {
			type: Object,
			required: true
		},
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择时间');
			} else {
				callback();
			}
		};
		return {
			ROLE_ENUM,
			visible: false,
			formValidate: {
				remark: '',
				audit_status: '',
				is_business: +this.detailData.is_business,
				business_day: +this.detailData.business_day,
				audit_remark: '',
				time: JSON.parse(this.detailData[LABEL[this.detailData.role_type]])
			},
			ruleValidate: {
				// time: [{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择时间' }],
				audit_status: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }],
				audit_remark: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
				is_business: [{ required: true, type: 'number', message: '请输入', trigger: 'blur' }],
			}
		};
	},
	computed: {
		timeText() {
			return '我是时间';
		},
		chargeDay() {
			const [startTime, endTime] = this.formValidate.time;
			return (moment(endTime).diff(moment(startTime), 'day') + 1) || 0;
		}
	},
	created() {
		
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_AUDIT_POST,
						type: "POST",
						param: {
							record_id: this.detailData.record_id,
							lesson_type: this.detailData.lesson_type,
							...this.formValidate,
							[LABEL[this.detailData.role_type]]: JSON.stringify(this.handleFormatDateToStr(this.formValidate.time)),
							hosting_day: this.$refs.form.chargeDay || 0
						}
					}).then((res) => {
						this.$emit("sure");
					}).catch(err => {
					});
				} else {
					this.visible = true;
				}
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleFormatDateToStr(time) {
			return time.map(
				timeArr => timeArr.map(
					date => date && moment(date).format("YYYY-MM-DD")
				)
			);
		},
	}
};
export const OutlineCommonModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-outline-common-modal {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
    .__tip {
        top: 3px;
		left: 276px;
		width: 22px;
		height: 20px;
		background: #fff;
	}
    .ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>

