<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		:width="action=='view'?720:400"
		:ok-text="okText"
		title="申请延长保护期"
		class="v-sale-customer-apply-protect"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			v-if="action=='add'"
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
		>
			<div class="_info _view">
				<span class="__label">公司名称：</span>
				<span class="__content">{{ data.company_name }}</span>
			</div>
			<div class="_info _view">
				<span class="__label">保护截止时间：</span>
				<span class="__content">{{ data.end_time }}</span>
			</div>
			<i-form-item label="申请原因：" prop="prolong_reason">
				<i-select 
					v-model="formData.prolong_reason" 
					placeholder="请选择申请原因" 
					style="width:220px" 
					clearable
					transfer
				>
					<i-option v-for="(reason,index) in reasonList" :key="index" :value="reason.reason">
						{{ reason.reason }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="申请延长至：" prop="prolong_to_time">
				<i-date-picker 
					v-model="formData.prolong_to_time"
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
			<i-form-item label="申请说明：" prop="apply_remarks">
				<oa-limit-words
					v-model="formData.apply_remarks"
					:max="200"
					placeholder="请填写申请说明"
					width="220px"
				/>
			</i-form-item>
			<i-form-item label="凭证：" prop="file_url">
				<oa-upload
					v-model="formData.file_url"
					:max="10"
					:upload="{multiple: true, max: 10}"
					style="width: 220px"
					placeholder="请上传客户有意向成交的凭证信息，提交后将由超管（张勇）进行审核"
					@error="handleUploadError"
				/>
			</i-form-item>
		</i-form>
		<div v-else-if="action=='view'">
			<div :class="status.color" style="text-align: center;" class="g-m-b-20 g-fs-14 g-m-t-15">{{ status.title }}</div>
			<div class="g-m-l-30">
				<template v-if="applyResult.status==2 || applyResult.status==3">
					<div class="_info">
						<span class="__label">最终延长时间至：</span>
						<span v-if="applyResult.status==2" class="__content">{{ applyResult.audit_prolong_time }}</span>
						<span v-if="applyResult.status==3" class="__content">未延长</span>
					</div>
					<div class="_info">
						<span class="__label">{{ status.label }}：</span>
						<span class="__content">{{ applyResult.audit_remarks }}</span>
					</div>
				</template>
				<div class="_info">
					<span class="__label">公司名称：</span>
					<span class="__content">{{ applyResult.company_name }}</span>
				</div>
				<div class="_info">
					<span class="__label">申请原因：</span>
					<span class="__content">{{ applyResult.prolong_reason }}</span>
				</div>
				<div class="_info">
					<span class="__label">申请延长至：</span>
					<span class="__content">{{ applyResult.prolong_to_time }}</span>
				</div>
				<div class="_info">
					<span class="__label">申请说明：</span>
					<span class="__content">{{ applyResult.apply_remarks }}</span>
				</div>
				<div class="_info">
					<span class="__label">凭证：</span>
					<span class="__content">
						<oa-upload
							v-model="applyResult.image_url"
							:max="10"
							:upload="{multiple: true, max: 10}"
							style="width: 260px;"
							disabled
						/>
					</span>
				</div>
			</div>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, DatePicker } from 'iview';
import { CreatePortal } from 'wya-vc';
import Upload from '@common/upload/upload';
import Explain from '@components/_common/explain/explain';
import { dataValidity, objRegex } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import orderModal from '@extends/mixins/orderModal';
import moment from 'moment';

const statusConfig = {
	1: { // 待审核
		title: '待审核',
		color: 'g-c-orange-mid',
		label: '',
		okText: '撤回申请'

	},
	2: { // 已通过
		title: '审核通过',
		color: 'g-c-green-mid',
		label: '通过说明',
		okText: '重新申请'

	},
	3: { // 已驳回
		title: '审核驳回',
		color: 'g-c-red-mid',
		label: '驳回原因',
		okText: '重新申请'


	}

};
export default {
	name: "oa-sale-customer-apply-protect",
	components: {
		'i-modal': Modal,
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
		'oa-upload': Upload,
		'i-date-picker': DatePicker
	},
	mixins: [orderModal],
	props: {
		data: {
			type: Object,
			default: () => ({})
		},
		action: {
			type: String,
			default: 'view', // view
		}
	},
	data() {
		return {
			visible: false,
			statusConfig,
			formData: {
				prolong_reason: '',
				prolong_to_time: '',
				apply_remarks: '',
				file_url: []	
			},
			rules: {
				prolong_reason: [{ required: true, message: '请选择申请原因', type: 'string', trigger: 'change' }],
				prolong_to_time: [{ required: true, message: '请选择时间', type: 'date', trigger: 'change' }],
				apply_remarks: [{ required: true, message: '请填写申请说明', type: 'string', trigger: 'blur' }],
				file_url: [{ required: true, message: '请上传凭证', type: 'array', trigger: 'change' }]
			},
			reasonList: [],
			dateOption: {
				disabledDate: (date) => {
					return moment(this.data.end_time).isSameOrAfter(moment(date), 'date');
				}
			},
			applyResult: {
				status: "",
				company_name: 'xxxx',
				time: '',
				auidt_remark: '',
				orign_end_time: "",
				apply_remark: '',
				apply_time: '',
				apply_reason: '',
				file_url: [],
				protect_id: ''
			},
		};
	},
	computed: {
		applyDays() {
			if (this.formData.prolong_to_time instanceof Date) {
				const length = this.formData.prolong_to_time.getTime() - new Date(this.data.end_time).getTime();
				return Math.floor(length / 1000 / 60 / 60 / 24);
			}
		},
		applyHour() {
			if (this.formData.prolong_to_time instanceof Date) {
				const length = this.formData.prolong_to_time.getTime() - new Date(this.data.end_time).getTime();
				return Math.floor((length / 1000 / 60 / 60) % 24);
			}
		},
		status() {
			return this.statusConfig[this.applyResult.status] || {};
		},
		okText() {
			return this.status.okText || '确定';
		}
		

	},
	created() {
		if (this.action === 'view') {
			this.loadData();
		}
		this.loadReasonData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res); // applyReadd
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadReasonData() {
			this.$request({
				url: "_SALE_CUSTOMER_SYSTEM_OTHER_CONFIG_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.reasonList = res.data.protect;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadData() {
			this.$request({
				url: "_SALE_CUSTOMER_AUDIT_DELAY_SELF_DETAIL_GET",
				type: "GET",
				param: {
					customer_id: this.data.customer_id
				},
				loading: false,
			}).then(res => {
				this.applyResult = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleSave() {
			if (this.applyResult.status == 1) { // 待审核 撤回
				this.handleDrawBack();
			} else if (this.applyResult.status == 2 || this.applyResult.status == 3) {
				this.handleOk({ applyReadd: 1 });

			} else if (this.applyResult.status == '') {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$request({
							url: '_SALE_CUSTOMER_APPLY_PROTECT_POST',
							type: "POST",
							param: {
								...this.formData,
								prolong_to_time: moment(this.formData.prolong_to_time).format("YYYY-MM-DD HH:mm:ss"),
								customer_id: this.data.customer_id,
								image_url: this.formData.file_url.map(v => v.url)
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
		},
		handleUploadError(e) {
			console.error(e);
		},
		handleDrawBack() {
			this.$refs.modal.buttonLoading = false;
			Confirm.popup({
				title: '温馨提示',
				msg: '确认撤回本次申请？'
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_PROTECT_CANCEL_POST",
					type: "POST",
					param: {
						protect_id: this.applyResult.protect_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleOk({ drawBack: 1 });
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});
		}

	}
};
export const ApplyProtect = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-apply-protect {
	.c-upload {
		width: 260px !important;
		.__normal {
			width: 72px !important;
		}
	}
	.ivu-modal-body {
		padding: 16px 0 16px 16px;
	}
	._info {
		display: flex;
		padding-bottom: 10px;
		.__label{
			text-align: right;
			vertical-align: middle;
			color: #333;
			width: 110px;
			padding-right: 12px;

		}
		.__content {
			color: #333;
			width: 480px;
			.c-upload {
				width: 430px !important;
			}
		}
		&._view {
			.__label {
				width: 160px
			}
			.__content {
				width: 480px;

			}

		}
	}
}

</style>