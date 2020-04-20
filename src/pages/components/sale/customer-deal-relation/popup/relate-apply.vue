<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-relate-apply"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ data.title }}</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="合同公司名称：" >
				<span>{{ data.contract_company_name }}</span>
			</i-form-item>
			<i-form-item label="关联公司：" prop="customer_ids">
				<i-select
					ref="customer"
					v-model="formData.customer_ids"
					:remote-method="loadCustomerList"
					:loading="customerListLoading"
					filterable
					multiple
					remote
					transfer
					placeholder="请输入关键字查询"
					@on-change="handleRelationChange"
				>
					<i-option
						v-for="(item,index) in customerList"
						:key="index"
						:value="item.customer_id"
					>{{ item.company_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="凭证：" prop="images">
				<oa-upload
					v-model="formData.images"
					:max="5"
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';

export default {
	name: "oa-relate-apply",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		data: Object, // {action,title,relate_id,contract_company_name,contract_company_id}
	},
	data() {
		return {
			visible: false,
			customerListLoading: false,
			customerList: [],
			formData: {// 表单
				contract_company_id: this.data.contract_company_id || '',
				relate_id: this.data.action == 'update' ? this.data.relate_id : '',
				is_again: this.data.action == 'readd' ? 1 : '',
				old_relate_id: this.data.action == 'readd' ? this.data.relate_id : '',
				customer_ids: [],
				images: []
			},
			rules: {// 表单验证
				customer_ids: [
					{ required: true, type: "array", message: "请选择关联公司", trigger: "change" }
				],
				images: [
					{ required: true, type: "array", message: '请上传凭证', trigger: 'change' }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		if (this.data.relate_id) {
			this.loadData();
		}
	},
	methods: {
		loadData() {
			this.$request({
				url: '_SALE_RELATE_CUSTOMER_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					relate_id: this.data.relate_id
				},
				autoTip: false
			}).then(res => {
				this.customerList = res.data.customer_list;

				this.formData.images = res.data.image_url.map(url => ({
					title: url.substr(url.lastIndexOf('/') + 1),
					type: url.substr(url.lastIndexOf('.')),
					url
				}));

				this.$nextTick(() => {
					this.formData.customer_ids = this.customerList.map(it => it.customer_id);
				});
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		loadCustomerList(search) {
			this.customerListLoading = true;

			return this.$request({
				url: '_SALE_PAYMENT_RELATION_COMPANY_GET',
				type: 'GET',
				loading: false,
				param: {
					search: search || '',
					contract_company_id: this.data.contract_company_id
				},
				autoTip: false
			}).then(res => {
				this.customerListLoading = false;
				if (Array.isArray(res.data)) {
					this.customerList = res.data;
				}
			}).catch(error => {
				this.customerListLoading = false;
				this.$Message.error(error.msg); 
			});
		},
		/**
		 * 监听关联公司的change事件
		 */
		handleRelationChange(e) {
			this.$nextTick(() => {
				if (this.formData.customer_ids.length > 10) {
					const v = [...this.$refs.customer.values];
					this.$refs.customer.$children[0].removeTag(v[v.length - 1]);
				}
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: this.data.action == 'update' ? '_SALE_RELATE_CUSTOMER_UPDATE_POST' : '_SALE_RELATE_CUSTOMER_SAVE_POST',
						type: "POST",
						loading: false,
						param: { 
							...this.formData, 
							images: this.formData.images.map(it => it.url) 
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

export const RelateApply = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-relate-apply {
	.ivu-select {
		width: 220px;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

