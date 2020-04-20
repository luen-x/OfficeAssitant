<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="录单审核"
		width="510px"
		class="v-collage-outline-help-leader-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="110"
				@submit.native.prevent>
				<div class="g-tc g-m-b-10">
					{{ detailData.staff_name }}（{{ ROLE_ENUM[detailData.role_type] }}）
				</div>

				<i-form-item
					label="课程类型："
					class="g-m-t-10"
				>
					<span>{{ detailData.lecture_set_name }}</span>
				</i-form-item>

				<i-form-item
					label="累计学习数："
					style="margin: -15px 0"
				>
					<span>{{ detailData.learning_times }}次</span>
				</i-form-item>

				<i-form-item 
					label="本次是否计数："
					prop="is_count"
					style="margin-top: -20px">
					<i-radio-group v-model="formValidate.is_count">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item
					label="师傅："
					style="margin: -15px 0"
				>
					<span>{{ detailData.master_name }}</span>
				</i-form-item>

				<i-form-item 
					:rules="{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }" 
					prop="docking_time"
					style="margin-top: -15px"
					label="对接时间：">
					<i-data-picker 
						v-model="formValidate.docking_time"
						format="yyyy-MM-dd"
						type="datetimerange"
						split-panels
						transfer
						separator=" 至 "
						style="width: 300px;"
						placeholder="请选择对接时间"/>
                            
						<!-- <oa-operate-item 
						:can-add="formValidate.time.length < 10"
						:can-remove="formValidate.time.length > 1"
						:handle-add="() => formValidate.time.push([null, null])"
						:handle-remove="() => formValidate.time.splice(i, 1)"
						top="2px"
						left="310px"/> -->
				</i-form-item>
				
				<i-form-item
					label="对接时长："
					style="margin: -10px 0"
				>
					<span>{{ chargeDay }}天</span>
				</i-form-item>

				<i-form-item 
					label="是否出差："
					style="margin: -20px 0"
					prop="is_business">
					<i-radio-group v-model="formValidate.is_business">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item 
					v-if="formValidate.is_business"
					prop="business_day" 
					label="出差天数：" 
					style="margin: -10px 0"
				>
					<i-input-number
						v-model="formValidate.business_day" 
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
					:style="{ marginTop: formValidate.is_business ? '0' : '-10px'}"
					label="备注："
					prop="remark">
					<oa-limit-words
						v-model="formValidate.remark" 
						:max="200" 
						width="300px"
						placeholder="请输入备注"
					/>
				</i-form-item>

				<i-form-item
					label="审核结果："
					prop="audit_status"
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
 * 主持人、唱单，音控共用审核弹窗
*/

import { Modal, Button, Form, FormItem, Input, DatePicker,
	Select, Option, RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import OperateItem from '../../components/operate-item';
import { ROLE_ENUM } from "../../components/constants";

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
		'oa-operate-item': OperateItem
	},
	props: {
		detailData: {
			type: Object,
			required: true
		},
	},
	data() {
		this.validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择时间');
			} else {
				callback();
			}
		};
		return {
			visible: false,
			ROLE_ENUM,
			formValidate: {
				is_count: +this.detailData.is_count,
				docking_time: JSON.parse(this.detailData.docking_time),
				remark: '',
				is_business: +this.detailData.is_business,
				business_day: +this.detailData.business_day,
				audit_status: '',
				audit_remark: '',

			},
			ruleValidate: {
				audit_remark: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }],
				is_business: [{ required: true, type: 'number', message: '请输入', trigger: 'blur' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
				result: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }],
				audit_status: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }]	
			}
		};
	},
	computed: {
		timeText() {
			return '我是时间';
		},
		chargeDay() {
			const [startTime, endTime] = this.formValidate.docking_time;
			return (moment(endTime).diff(moment(startTime), 'day') + 1) || 0;
		}
		// chargeDay() {
		// 	return this.formValidate.time.reduce(
		// 		(init, cur) => {
		// 			const [startTime, endTime] = cur;
		// 			const diffDay = (moment(endTime).diff(moment(startTime), 'day') + 1) || 0;
		// 			return init + diffDay;
		// 		},
		// 		0
		// 	);
		// }
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					const { docking_time: [start, end] } = this.formValidate;
					this.$request({
						url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_AUDIT_POST,
						type: "POST",
						param: {
							record_id: this.detailData.record_id,
							lesson_type: this.detailData.lesson_type,
							...this.formValidate,
							docking_time: JSON.stringify([
								moment(start).format("YYYY-MM-DD"), 
								moment(end).format("YYYY-MM-DD")
							])
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
		}
	}
};
export const OutlineHelpLeaderModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-outline-help-leader-modal {
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

