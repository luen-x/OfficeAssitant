<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-submit-integral"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>提交积分指标</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div style="margin-left: -8px;">
				<i-form-item 
					label="选择提交内容：" 
					prop="index_type"
				>
					<i-radio-group 
						v-model="formData.index_type"
						@on-change="handleChange"
					>
						<div>
							<i-radio :label="1">客户回款信息</i-radio>
							<i-radio :label="2">客户满意度指标</i-radio>
						</div>
					</i-radio-group>
				</i-form-item>
				<i-form-item 
					v-if="formData.index_type === 2"
					key="satis_type" 
					label="选择具体情况：" 
					prop="satis_type"
				>
					<i-radio-group v-model="formData.satis_type">
						<div>
							<i-radio :label="1">合作客户追加签单</i-radio>
							<i-radio :label="2">转介绍客户签单成交</i-radio>
						</div>
						<div>
							<i-radio :label="3">客户好评</i-radio>
							<i-radio :label="4">锦旗/授牌</i-radio>
						</div>
					</i-radio-group>
				</i-form-item>
			</div>
			<i-form-item 
				v-if="formData.index_type === 1"
				key="return_amount" 
				label="客户回款金额："
				prop="return_amount"
			>
				<i-input-number
					v-model="formData.return_amount"
					:min="0"
					:max="999999"
					clearable
					placeholder="请输入客户回款金额"
					style="width: 220px;"
				/>
				<span class="_num">万</span>
			</i-form-item>
			<i-form-item 
				v-if="formData.index_type === 1"
				key="agent_num"
				label="代理人数："
				prop="agent_num"
			>
				<i-input-number
					v-model="formData.agent_num"
					:min="0"
					:max="999999"
					:precision="0"
					clearable
					placeholder="请输入代理人数"
					style="width: 220px;"
				/>
			</i-form-item>
			<i-form-item 
				v-if="formData.index_type === 1"
				key="return_image_url"
				label="凭证：" 
				prop="return_image_url"
				style="margin-bottom: 0;"
			>
				<oa-upload
					v-model="formData.return_image_url"
					:max="6"
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</i-form-item>
			<i-form-item 
				v-if="formData.index_type === 2"
				key="index_image_url"
				label="凭证：" 
				prop="index_image_url"
				style="margin-bottom: 0;"
			>
				<oa-upload
					v-model="formData.index_image_url"
					:max="6"
					:upload="{accept: '.jpg, .png, .gif, .mp3, .m4a, .mp4, .avi'}"
				/>
			</i-form-item>
			<i-form-item 
				key="remarks" 
				label="备注："
				style="margin-top: -3px;"
			>
				<oa-limit-words 
					v-model="formData.remarks"
					placeholder="请输入备注"
					clearable
					style="width:220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, RadioGroup, Radio, InputNumber, Form, FormItem } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-submit-integral",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
		'i-form': Form,
		'i-form-item': FormItem,
		"oa-upload": Upload,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			visible: false,
			return_common: {
				image_url: [],
				remarks: ''
			}, // 客户回款信息中的凭证和备注
			index_common: {
				image_url: [],
				remarks: ''
			}, // 客户满意度中的凭证和备注
			formData: {// 表单
				index_type: 1,
				satis_type: 1, 
				return_amount: null, 
				agent_num: null, 
				return_image_url: [],
				index_image_url: [],
				remarks: ''
			},
			rules: {// 表单验证
				index_type: [
					{ required: true, type: 'number', message: '请选择提交内容', trigger: "change" }
				],
				satis_type: [
					{ required: true, type: 'number', message: '请选择具体情况', trigger: "change" }
				],
				return_image_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				],
				index_image_url: [
					{ required: true, type: 'array', message: '请上传凭证', trigger: 'change' }
				],
				return_amount: [
					{ required: true, type: 'number', message: '请输入回款金额', trigger: 'blur' }
				],
				agent_num: [
					{ required: true, type: 'number', message: '请输入代理人数', trigger: "blur" }
				]
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let param = {};

					let temp = {
						contract_company_id: this.contractCompanyId,
						index_type: this.formData.index_type,
						remarks: this.formData.remarks
					};

					if (this.formData.index_type === 1) {
						param = {
							...temp,
							image_url: this.formData.return_image_url.map(it => it.url),
							return_amount: this.formData.return_amount,
							agent_num: this.formData.agent_num,
						};
					} else {
						param = {
							...temp,
							image_url: this.formData.index_image_url.map(it => it.url),
							satis_type: this.formData.satis_type
						};
					}
					this.$request({
						url: '_SALE_SERVICE_SUBMIT_INTEGRAL_POST',
						type: 'POST',
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 提交内容切换
		 */
		handleChange(index_type) {
			if (index_type === 1) {
				this.index_common = {
					image_url: this.formData.index_image_url,
					remarks: this.formData.remarks
				};

				this.formData.return_image_url = this.return_common.image_url;
				this.formData.remarks = this.return_common.remarks;
			} else {
				this.return_common = {
					image_url: this.formData.return_image_url,
					remarks: this.formData.remarks
				};

				this.formData.index_image_url = this.index_common.image_url;
				this.formData.remarks = this.index_common.remarks;
			}
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceSubmitIntegral = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-submit-integral {
	._num {
		position: relative;
		right: 0;
	}
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-radio-group {
		margin-left: 10px;
	}
	.ivu-radio-wrapper:first-child {
		width: 100px;
		margin-right: 15px;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.c-upload .__btn {
		margin-bottom: 0;
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>

