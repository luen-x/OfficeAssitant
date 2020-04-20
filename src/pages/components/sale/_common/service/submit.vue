<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-service-submit"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>提交服务</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="服务项：" style="margin-bottom:10px!important;">
				<span>{{ serviceName }}</span>
			</i-form-item>
			<i-form-item 
				label="上传服务凭证：" 
				prop="image_url"
				class="_image_url"
			>
				<oa-upload
					v-model="formData.image_url"
					:show-title="false"
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</i-form-item>
			<div>
				<i-form-item 
					label="服务次数：" 
					prop="service_times"
				>
					<i-input-number
						v-model="formData.service_times"
						:min="1"
						:max="100"
						placeholder="请输入服务次数"
						style="width:220px;"
					/>
				</i-form-item>
				<i-form-item 
					label="服务素材月份：" 
					prop="material_month"
				>
					<i-date-picker
						v-model="formData.material_month"
						:options="{disabledDate: (time) => {return time.getTime() > Date.now()}}"
						format="yyyy-MM"
						type="month"
						clearable
						transfer
						placeholder="请选择服务素材月份"
						style="width:220px;"
						class="g-m-r-5"
					/>
				</i-form-item>
				<i-form-item label="服务备注：" prop="remarks">
					<oa-limit-words 
						v-model="formData.remarks"
						placeholder="请输入备注信息"
						clearable
						style="width:220px;"
					/>
				</i-form-item>
				<i-form-item v-if="allowIntegralAudit" label="温馨提示：">
					<div class="g-c-red-mid g-m-t-5" style="width: 220px;line-height: 20px!important;">
						你提交的该项服务素材对应的积分已达上限，此次提交不会增加积分~
					</div>
				</i-form-item>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, DatePicker, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from "moment";
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-service-submit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-date-picker': DatePicker,
		'i-input-number': InputNumber,
		'oa-limit-words': LimitWords,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		remarks: String,
		serviceName: String,
		setId: [String, Number],
		recordId: [String, Number],
		isSupply: [String, Number],
		serviceTimes: [String, Number],
		materialMonth: String,
		serviceItemId: [String, Number],
		contractCompanyId: [String, Number],
		fileImage: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			allowIntegralAudit: false,
			formData: {// 表单
				contract_company_id: this.contractCompanyId,
				set_id: this.setId,
				is_supply: this.isSupply,
				image_url: this.fileImage || [],
				service_times: this.serviceTimes || null,
				material_month: this.materialMonth || moment(Date.now()).format('YYYY-MM'),
				remarks: this.remarks || '',
			},
			rules: {// 表单验证
				image_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				],
				service_times: [
					{ required: true, type: 'number', message: '服务次数不能为空', trigger: 'blur' }
				],
				material_month: [
					{ required: true, type: 'date', message: '请选择服务素材月份', trigger: 'change' }
				],
				remarks: [
					{ required: true, message: '服务备注不能为空', trigger: 'blur' }
				]
			},
		};
	},
	watch: {
		'formData.image_url': function (val) {
			this.formData.service_times = val.length;
			val.length && this.$refs.form.validateField('service_times');
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.checkIntegral();
		},
		/**
		 * 检查积分是否到达上限
		 */
		checkIntegral() {
			this.$request({
				url: '_SALE_SERVICE_STAGE_CHECK_INTEGRAL_POST',
				type: 'POST',
				loading: false,
				param: {
					set_id: this.setId,
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.allowIntegralAudit = res.data.allow_integral_audit === 0;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close', {
				changed: false
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let param = {
						...this.formData,
						image_url: this.formData.image_url.map(it => it.url),
						material_month: moment(this.formData.material_month).format('YYYY-MM')
					};
					if (this.recordId) {
						param = {
							...param,
							record_id: this.recordId
						};
					} else {
						param = { 
							...param,
							service_item_id: this.serviceItemId
						};
					}
					this.$request({
						url: '_SALE_SERVICE_SUBMIT_RECORD_POST',
						type: 'POST',
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							changed: true
						});
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceSubmit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-service-submit {
	._num {
		position: relative;
		right: 8%;
	}
	._image_url {
		// .ivu-form-item-error-tip {
		// 	top: 70%;
		// }
	}
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-input-number {
		width: 80%;
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
	.vcp-imgs-picker .__normal {
		width: 60px;
		height: 60px;
		cursor: pointer;
	}
	.vcp-imgs-picker .__normal .__img {
		width: 60px;
		height: 60px;
	}
	.vcp-imgs-picker .__item {
		padding: 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

