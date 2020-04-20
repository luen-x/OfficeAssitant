<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		:title="name === '1' ? '通过申请' : '驳回申请'"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="110"
			:model="formData"
			:rules="ruleData"
			class="g-m-t-20"
		>
			<i-form-item
				v-if="name === '1'"
				label="退款金额："
				prop="refund_amount"
			>
				<i-input-number
					v-model="formData.refund_amount"
					:min="0"
					:active-change="false"
					:precision="2"
					:disabled="true"
					placeholder="请输入退款金额"
					style="width: 220px"
				/>
			</i-form-item>

			<i-form-item
				v-if="name === '1' && refund_type === 1"
				label="退款产品：" 
				prop="product"
			>
				<i-select
					v-model="formData.product"
					:disabled="true"
					multiple
					transfer
					style="width:220px;"
					placeholder="请选择退款产品"
				>
					<i-option
						v-for="item in productList"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item
				v-if="name === '1' && refund_type === 3"
				label="退款种类：" 
				prop="refund_mode"
			>
				<i-radio-group v-model="formData.refund_mode">
					<i-radio :disabled="true" label="1">错录</i-radio>
					<i-radio :disabled="true" label="2">走账</i-radio>
					<i-radio :disabled="true" label="3">实际退款</i-radio>
					<i-radio :disabled="true" label="4">冲业绩</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item 
				v-if="name === '1'"
				label="退款原因：" 
				prop="refund_reason_ids"
			>
				<oa-tree-select-check
					ref="treeSelectCheck"
					v-model="formData.refund_reason_ids"
					:data="refundReasonTree"
					:width="220"
					:max-width="220"
					placeholder="请选择退款原因"
				/>
			</i-form-item>

			<i-form-item 
				v-if="name=='1'"
				label="备注说明：" 
				prop="remark"
			>
				<oa-limit-words
					v-model="formData.remark"
					:max="200"
					:disabled="true"
					placeholder="请输入备注说明"
					style="width: 220px"
				/>
			</i-form-item>
				
			<i-form-item 
				v-if="name=='1'"
				label="通过说明："
			>
				<oa-limit-words
					v-model="formData.pass"
					:max="200"
					placeholder="请填写通过说明"
					style="width: 220px"
				/>
			</i-form-item>
		
			<i-form-item
				v-else
				label="驳回原因"
				prop="cause"
			>
				<oa-limit-words
					v-model="formData.cause"
					:max="200"
					placeholder="请输入驳回原因"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, InputNumber, Input, RadioGroup, Radio, Select, Option } from "iview";
import { CreatePortal } from "wya-vc";
import { services } from '@stores/services/sale';
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';

export default {
	name: "sc-refund-audit-modal",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-select": Select,
		"i-option": Option,
		'oa-tree-select-check': TreeSelectCheck
	},
	mixins: [services.refundReasonTree()],
	props: {
		name: String,
		refund_id: Number,
		refund_type: {
			type: Number
		},
		contract_id: {
			type: Number
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				pass: "",
				cause: "",
				refund_amount: null,
				refund_mode: "",
				refund_reason_ids: [],
				remark: "",
				product: []
			},
			ruleData: {
				refund_amount: [
					{
						required: true,
						type: "number",
						message: "退款金额是必填的！",
						trigger: "blur"
					}
				],
				refund_mode: [
					{
						required: true,
						message: "请选择退款种类！",
						trigger: 'change'
					}
				],
				refund_reason_ids: [
					{ 
						required: true, 
						type: "array", 
						message: '请选择退款原因', 
						trigger: 'change' 
					}
				],
				product: [
					{ 
						required: true, 
						type: "array", 
						message: '请选择退款产品', 
						trigger: 'change' 
					}
				],
				remark: [
					{
						required: true,
						message: "备注说明是必填的！",
						trigger: "blur"
					}
				],
				pass: [
					{
						required: true,
						message: "通过原因是必填的！",
						trigger: "blur"
					}
				],
				cause: [
					{
						required: true,
						message: "驳回原因是必填的！",
						trigger: "blur"
					}
				]
			},
			productList: []
		};
	},
	created() {
		this.refund_type === 1 && this.loadProductData();
	},
	mounted() {
		this.loadData();
		this.visible = true;
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SAEL_REFUND_DETAIL_GET",
				type: "GET",
				param: {
					refund_id: this.refund_id
				},
				loading: false
			}).then(res => {
				this.formData.refund_amount = +res.data.base_info.real_refund_amount;
				this.formData.refund_mode = String(res.data.base_info.refund_mode);
				this.formData.refund_reason_ids = res.data.base_info.refund_reason_ids;
				this.formData.remark = res.data.base_info.remark;
				let list = res.data.base_info.project.map(item => {
					return {
						label: item.product_name,
						value: item.project_id
					};
				});

				this.productList = Array.from(new Set([...list, ...this.productList]));
				this.formData.product = res.data.base_info.project_id.map(item => Number(item));
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		loadProductData() {
			this.$request({
				url: "_SALE_SUPPLEMENT_PROJECT_INFO_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				this.productList = res.data.project.map(item => {
					return {
						label: item.product_name,
						value: item.project_id
					};
				});
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;

					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const refund_reason_ids = checkedTags.filter(ele => typeof ele.value == 'number').map(i => i.value);
					
			this.$request({
				url: "_SC_CUSTOMER_REFUND_AUDIT_POST",
				type: "POST",
				param: {
					refund_id: this.refund_id,
					status: this.name === "1" ? 1 : 2,
					refund_remark: this.name === "1" ? this.formData.pass : this.formData.cause,
					refund_reason_ids: this.name === "1" ? refund_reason_ids : ''
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>