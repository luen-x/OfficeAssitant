<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400"
		class="v-sale-customer-popup-mark" 
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>标记资料</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="标记原因：" prop="type">
				<i-select
					v-model="formData.type"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择标记原因"
				>
					<i-option
						v-for="item in typeList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				label="备注：" 
				prop="remark"
			>
				<oa-limit-words 
					v-model="formData.remark"
					placeholder="请输入备注"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
		<div class="g-c-red-mid g-m-l-20">资料被标记后，将对你和你部门的同事不可见，请谨慎标记</div>
		
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import Explain from '@components/_common/explain/explain';
import LimitWords from '@components/_common/limit-words/limit-words';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-sea-mark",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-explain': Explain,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		customerId: [String, Number]
	},
	data() {
		return {
			visible: false,
			typeList: [], // 标记原因列表
			formData: {// 表单
				customer_id: this.customerId,
				type: '',
				remark: '',

			},
			rules: {// 表单验证
				type: [
					{ required: true, type: "number", message: "请选择标记原因", trigger: "change" }
				],
				remark: [
					{ required: true, message: "备注不能为空", trigger: "blur" }
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
				url: '_SALE_SEA_BLACK_TYPE_GET',
				type: 'GET',
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				this.typeList = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_SALE_SEA_BLACK_MARK_POST',
						type: "POST",
						loading: false,
						param: this.formData,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							status: res.status
						});
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
		}
	}
};

export const MarkCustomer = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">

</style>

