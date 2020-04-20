<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		:width="basicInfo.audit_schedule.length <= 4 ? '680px' : '800px'" 
		class="v-sale-service-examine"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ basicInfo.apply_type }}</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div class="g-m-b-15" style="padding-left: 58px;">
				<span class="g-fs-14 g-c-black1">
					{{ basicInfo.contract_company_name }}
				</span>
			</div>
			<i-form-item label="申请类型：" style="width: 92%;">
				<span v-if="basicInfo.type === 3" class="g-c-red-mid">
					{{ basicInfo.apply_type }}（{{ basicInfo.appeal_step }}、共计{{ basicInfo.service_amount }}元）
				</span>
				<span v-else-if="basicInfo.type === 2">
					{{ basicInfo.apply_type }}（{{ basicInfo.set.join('、') }}）
				</span>
				<span v-else>
					{{ basicInfo.apply_type }}
				</span>
			</i-form-item>
			<i-form-item label="审核流程：">
				<oa-across-table 
					:data="basicInfo.audit_schedule"
					style="justify-content:flex-start;height:60px;margin-left:-45px;"
				>
					<div 
						slot-scope="item" 
						class="g-flex g-flex-cc g-fd-c"
					>
						<div>{{ item.item.title }}</div>
						<div style="margin-top: -10px;">{{ item.item.staff_name }}</div>
						<div style="margin-top: -10px;">{{ item.item.audit_time }}</div>
					</div>
				</oa-across-table>
			</i-form-item>
			<i-form-item 
				label="申请理由：" 
				style="width: 92%;word-break: break-all;margin-top: -18px;padding-right: 20px;"
			>
				<span>{{ basicInfo.reason }}</span>
			</i-form-item>
			<i-form-item 
				v-if="basicInfo.fileImage.length" 
				label="凭证："
			>
				<oa-upload
					:max="6"
					:data-source="basicInfo.fileImage.map(it => ({
						type: it.img_url.substr(it.img_url.lastIndexOf('.')),
						url: it.img_url
					}))"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				>
					<span slot="trigger"/>
				</oa-upload>
			</i-form-item>
			<div :style="basicInfo.fileImage.length && 'margin-top: -20px'" class="_split-line"/>
			<div v-if="basicInfo.audit_remark.length">
				<i-form-item 
					v-for="(item, index) in basicInfo.audit_remark" 
					:key="index"
					:label="`${['提交审核','经理审核','总监审核','绩效组审核','财务审核'][+item.step - 1]}备注：`"
				>
					<span>{{ item.remark }}</span>
				</i-form-item>
			</div>
			<div class="_form-box">
				<div style="margin-left: -35px;">
					<i-form-item 
						label="审核结果：" 
						prop="status" 
					>
						<i-radio-group v-model="formData.status">
							<i-radio :label="1">审核通过</i-radio>
							<i-radio :label="2">审核驳回</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item 
						label="审核备注：" 
						prop="mark" 
					>
						<oa-limit-words 
							v-model="formData.mark"
							placeholder="请填写审核意见"
							clearable
							style="width:80%;"
						/>
					</i-form-item>
				</div>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, RadioGroup, Radio } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import AcrossTable from '@components/_common/across-table/across-table';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-service-examine",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-limit-words': LimitWords,
		'oa-across-table': AcrossTable,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		applyId: [String, Number],
		auditType: Number
	},
	data() {
		return {
			visible: false,
			basicInfo: {
				apply_type: '',
				appeal_step: '',
				service_amount: '',
				fileImage: [],
				audit_schedule: [],
				reason: '',
				audit_remark: []
			}, // 审核详情信息
			formData: {// 表单
				status: '',
				mark: ''
			},
			rules: {// 表单验证
				status: [
					{ required: true, type: "number", message: "请选择审核结果", trigger: "change" }
				],
				mark: [
					{ required: true, message: '审核备注不能为空', trigger: 'blur' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_APPLY_SERVICE_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: { 
					apply_id: this.applyId
				},
				autoTip: false
			}).then(res => {
				this.basicInfo = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: '_SALE_SERVICE_AUDIT_POST',
						type: "POST",
						loading: false,
						param: {
							apply_id: this.applyId,
							audit_step: this.basicInfo.audit_step,
							audit_type: this.auditType,
							...this.formData
						},
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
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceExamine = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-service-examine {
	._split-line {
		width: 80%; 
		height: 1px;
		background: #eee;
		margin: 0 auto;
		margin-bottom: 20px;
	}
	._form-box {
		width: 80%;
		margin: 0 auto;
		padding-bottom: 10px;
		background-color: #f6f6f6;
	}
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.c-across-table {
		margin-top: 0;
		margin-bottom: 45px;
	}
	.c-across-table ._item {
		height: 60px;
	}
}
</style>

