<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		:title="formData.product_alias"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="100"
			:model="formData"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item
				label="产品名称"
				prop="product_alias"
			>
				<i-input
					v-model="formData.product_alias"
					:maxlength="18"
					placeholder="请输入产品名称"
					clearable
					style="width:220px;"
				/>
			</i-form-item>

			<i-form-item
				label="产品类型"
				prop="category_id"
			>
				<i-select
					v-model="formData.category_id"
					clearable
					transfer
					style="width:220px"
					placeholder="请选择产品类型"
				>
					<i-option
						v-for="(item,index) in list"
						:key="index"
						:value="String(item.category_id)"
					> 
						{{ item.category_name }} 
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item
				label="成本归属"
				prop="cost_depart_id"
			>
				<i-cascader
					v-model="formData.cost_depart_id"
					:data="departAll"
					:change-on-select="true"
					clearable
					transfer
					trigger="click"
					placeholder="请选择成本归属"
					style="width: 220px;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Cascader } from "iview";
import { CreatePortal } from "wya-vc";
import { services } from '@stores/services/sale';

export default {
	name: 'v-statistic-config-cost-edit-modal',
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader
	},
	mixins: [services.departAll()],
	props: {
		productAlias: {
			type: String
		},
		departId: {
			type: Array
		},
		categoryId: {
			type: Number
		},
		productId: {
			type: Number
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				product_alias: "",
				category_id: "",
				cost_depart_id: []
			},
			rule: {
				product_alias: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
				category_id: [{ required: true, message: "请选成本归属", trigger: "change" }],
				cost_depart_id: [{ required: true, type: 'array', message: "请选成本归属", trigger: "change" }]
			},
			list: []
		};
	},
	created() {
		this.loadClass();
	},
	mounted() {
		this.formData.product_alias = this.productAlias; 
		this.formData.cost_depart_id = this.departId;
		this.formData.category_id = String(this.categoryId);
		this.visible = true;
	},
	methods: {
		loadClass() {
			this.$request({
				url: "_CONTENT_PRODUCT_CATEGORY_GET",
				type: "GET",
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
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
		handleCancel() {
			this.$emit("close");
		},
		handleSave() {
			this.$request({
				url: '_STATISTIC_CONFIG_COST_EDIT_POST',
				type: "POST",
				param: {
					...this.formData,
					product_id: this.productId,
					cost_depart_id: this.formData.cost_depart_id[this.formData.cost_depart_id.length - 1]
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};

export const EditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>