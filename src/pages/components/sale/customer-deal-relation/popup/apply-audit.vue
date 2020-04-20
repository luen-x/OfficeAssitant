<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-relation-apply-audit"
		@on-ok="handleOk('formData')"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>审核关联公司申请</span>
		</div>

		<i-form 
			ref="formData" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="合同公司名称：" >
				<span>{{ contractCompanyName }}</span>
			</i-form-item>
			<i-form-item label="关联公司：" >
				<div 
					v-for="(item, index) in customerList" 
					:key="index"
				>
					{{ item.company_name }}
				</div>
			</i-form-item>
			<i-form-item label="凭证：" >
				<oa-upload
					:max="5"
					:data-source="imageUrl"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				>
					<span slot="trigger"/>
				</oa-upload>
			</i-form-item>
			<i-form-item 
				label="审核状态：" 
				prop="status" 
			>
				<i-radio-group v-model="formData.status">
					<i-radio :label="1">通过</i-radio>
					<i-radio :label="2">驳回</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item :label="formData.status == 1 ? '通过说明：' : '驳回说明：'">
				<oa-limit-words 
					v-model="formData.remark"
					:placeholder="formData.status == 1 ? '请输入通过说明' : '请输入驳回说明'"
					clearable
					style="width:80%;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-relation-apply-audit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-limit-words': LimitWords,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		relateId: [String, Number]
	},
	data() {
		return {
			visible: false,
			contractCompanyName: '',
			customerList: [],
			imageUrl: [],
			formData: {// 表单
				status: 1,
				remark: ''
			},
			rules: {// 表单验证
				status: [
					{ required: true, type: "number", message: "请选择审核状态", trigger: "change" }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_SALE_RELATE_CUSTOMER_ALL_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					relate_id: this.relateId
				},
				autoTip: false
			}).then(res => {
				this.customerList = res.data.customer_list;
				this.contractCompanyName = res.data.contract_company_name;

				this.imageUrl = res.data.image_url.map(url => ({
					title: url.substr(url.lastIndexOf('/') + 1),
					type: url.substr(url.lastIndexOf('.')),
					url
				}));
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		/**
		 * 点击确定
		 */
		handleOk(name) {
			this.$refs[name].validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT._SALE_RELATE_CUSTOMER_AUDIT_POST,
						type: "POST",
						loading: false,
						param: {
							relate_id: this.relateId,
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

export const RelationApplyAudit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-relation-apply-audit {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

