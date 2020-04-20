<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		title="原因大类"
		class="v-statistic-config-reason-reason-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="40"
			:model="formData"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item
				v-for="(item, index) in formData.items"
				:key="index"
				:label="' '"
				:prop="'items.' + index + '.category_name'"
				:rules="{
					required: true, 
					message: '请输入大类名称', 
					trigger: 'blur'
				}"
			>
				<div>
					<i-input
						v-model="item.category_name"
						:maxlength="6"
						placeholder="请输入原因大类"
						style="width: 220px;"
					/>

					<i
						v-if="formData.items.length > 1"
						class="icon iconfont icon-remove-circle g-m-l-10 g-c-red-mid g-pointer"
						style="position: relative;top: 3px;"
						@click="handleRemove(index)"
					/>
					<i
						v-if="index === formData.items.length - 1 && formData.items.length < 5"
						class="icon iconfont icon-add1 g-c-blue-mid g-m-l-10 g-pointer"
						style="position: relative;top: 3px;"
						@click="handleAdd"
					/>
				</div>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import moment from "moment";
import { uid } from '@utils/utils';

export default {
	name: 'v-statistic-config-reason-reason-modal',
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input
	},
	props: {
		category: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			index: this.category.length > 0 ? this.category.length : 1,
			formData: {
				items: []
			},
			rule: {},
			deleteList: []
		};
	},
	mounted() {
		if (this.category.length > 0) {
			this.formData.items = [];

			this.category.forEach(item => {
				this.formData.items.push({
					category_name: item.label,
					category_id: +item.value,
					key: uid(),
					is_delete: 0
				});
			});
		} else {
			this.formData.items = [
				{
					category_name: '',
					category_id: '',
					key: uid(),
					is_delete: 0
				}
			];
		}

		this.visible = true;
	},
	methods: {
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
				url: '_STATISTIC_CONFIG_REASON_CATEGORY_SAVE_POST',
				type: "POST",
				param: this.deleteList.concat(this.formData.items)
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleAdd() {
			this.index++;

			this.formData.items.push({
				category_name: '',
				category_id: '',
				key: uid(),
				is_delete: 0
			});
		},
		handleRemove(index) {
			if (this.formData.items[index].category_id) {
				this.formData.items[index].is_delete = 1;
				this.deleteList.push(this.formData.items[index]);
			}

			this.formData.items.splice(index, 1);
		}
	}
};

export const ReasonModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-statistic-config-reason-reason-modal {
	.ivu-form-item-required {
		.ivu-form-item-label:before {
			content: '';
		}
	}
}
</style>