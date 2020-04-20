<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		:title="action == 'pass' ? '审核通过' : '审核驳回'"
		width="400" 
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="110"
		>
			<i-form-item v-if="action == 'pass'" label="设定延长日期：" prop="audit_prolong_time">
				<i-date-picker 
					v-model="formData.audit_prolong_time"
					:options="dateOption"
					type="datetime"
					style="width:220px"
					format="yyyy-MM-dd HH:mm:ss"
					placeholder="请选择时间"
					clearable
					transfer
				/>
				<div>
					<span v-if="applyDays" class="g-m-l-10">
						累计{{ applyDays }}天
					</span>
					<span v-if="applyHour">
						{{ applyHour }} 小时
					</span>
				</div>
			</i-form-item>
			<i-form-item :label="action=='pass'?'通过说明：':'驳回说明：'" prop="audit_remarks">
				<oa-limit-words
					v-model="formData.audit_remarks"
					:max="200"
					:placeholder="'请输入'+(action=='pass'?'通过说明':'驳回说明')"
					style="width: 220px"
				/>
			
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, DatePicker } from 'iview';
import Explain from '@components/_common/explain/explain';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import moment from 'moment';

export default {
	name: "oa-sale-customer-delay-audit",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker
	},
	mixins: [orderModal],
	props: {
		protectId: Number,
		action: String, //  pass / reject,
		applyTime: String, // '2019-10-10 10:10:10',
		originTime: String, // '019-11-10 10:10:10'
	},
	data() {
		return {
			visible: false,
			formData: {
				audit_prolong_time: this.applyTime,
				audit_remarks: ''
			},
			rules: {
				audit_prolong_time: [{ required: true, type: 'date', message: "请设定延长时间", trigger: "change" }],
				audit_remarks: [{ required: this.action == 'reject', type: 'string', message: "请填写备注", trigger: "blur" }]
			},
			dateOption: {
				disabledDate: (date) => {
					return moment(this.originTime).isSameOrAfter(moment(date), 'date');
				}
			},
		};
	},
	computed: {
		applyDays() {
			if (this.formData.audit_prolong_time instanceof Date) {
				const length = this.formData.audit_prolong_time.getTime() - new Date(this.originTime).getTime();
				return Math.floor(length / 1000 / 60 / 60 / 24);
			}
		},
		applyHour() {
			if (this.formData.audit_prolong_time instanceof Date) {
				const length = this.formData.audit_prolong_time.getTime() - new Date(this.originTime).getTime();
				return Math.floor((length / 1000 / 60 / 60) % 24);
			}
		},
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_SALE_CUSTOMER_AUDIT_DELAY_AUDIT_POST',
						type: "POST",
						param: {
							...this.formData,
							protect_id: this.protectId,
							status: this.action == 'pass' ? 2 : 3,
							audit_prolong_time: moment(this.formData.audit_prolong_time).format("YYYY-MM-DD HH:mm:ss"),
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const AuditDelay = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>