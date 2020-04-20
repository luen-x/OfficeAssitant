<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-add-option"
		width="400"
		title="添加条件"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form ref="from" :rules="ruleValidate" :model="formItem" :label-width="80">
				<i-form-item prop="option" label="选择名称:">
					<i-input v-model="formItem.option" :maxlength="12" placeholder="请输入选择名称"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "add-process",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},
	data() {
		return {
			visible: false,
			formItem: {
				option: '',
			},
			ruleValidate: {
				option: [
					{ required: true, message: '请添加条件', trigger: 'blur' }
				],
			}
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleSave() {
			this.visible = false;

		},
		handleNull() {
			this.visible = false;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$refs.from.validate((valid) => {
				if (valid) {
					this.$emit('sure', this.formItem.option);
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
			// this.process.productProcessStep.push({ step_name: this.formItem.input });
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
	}
};
export const AddOption = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
	.v-add-class {
	    ._number-append {
	        display: inline-block;
	        position: absolute;
	        right: 7px;
	        vertical-align: bottom;
	        z-index: 1;
	        color: gray;
	    }
	    .ivu-input-number {
	        width: 100% !important;

	        .ivu-input-number-handler-wrap {
	            display: none !important;
	        }
	    }
	}
</style>
