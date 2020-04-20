<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="录单审核"
		width="500px"
		class="v-collage-online-audot-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="130"
				@submit.native.prevent>
				<div class="g-tc">
					{{ detailData.staff_name }}（{{ ROLE_ENUM[detailData.role_type] }}）
				</div>

				<i-form-item
					label="套系名称："
					class="g-m-t-10"
				>
					<span>{{ detailData.lecture_set_name }}</span>
				</i-form-item>

				<i-form-item
					label="累计学习数："
					style="margin-top: -20px"
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
					label="对接时间：" 
					prop="docking_time"
					style="margin-top: -8px">
					<i-data-picker 
						v-model="formValidate.docking_time"
						format="yyyy-MM-dd"
						type="datetimerange"
						split-panels
						transfer
						separator=" 至 "
						style="width: 300px"
						placeholder="请选择对接时间"/>
				</i-form-item>

				<i-form-item 
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
import { Modal, Button, Form, FormItem, Input, DatePicker,
	Select, Option, RadioGroup, Radio } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { ROLE_ENUM } from "../../components/constants";

export default {
	name: "oa-hr-train-elite-related-subject",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-data-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
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
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
	
		return {
			ROLE_ENUM,
			visible: false,
			formValidate: {
				is_count: +this.detailData.is_count,
				docking_time: JSON.parse(this.detailData.docking_time),
				remark: this.detailData.remark,
				audit_status: '',
				audit_remark: '',
			},
			ruleValidate: {
				docking_time: [{ validator: validateCreatedTime, trigger: 'change', required: true, message: '请选择对接时间' }],
				is_count: [{ required: true, type: 'number', message: '请填写', trigger: 'change' }],
				audit_remark: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }],
				audit_status: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }]	
			}
		};
	},
	computed: {
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
							docking_time: JSON.stringify([moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD")])
						}
					}).then(() => {
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
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
	}
};
export const OnlineHelpLeaderMOdal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-online-audot-modal {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
}
</style>

