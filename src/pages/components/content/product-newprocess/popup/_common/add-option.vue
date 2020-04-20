<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class="v-add-option"
		width="400"
		title="添加条件"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div>
			<i-form :model="formItem" :label-width="80">
				<i-form-item label="选择名称:">
					<i-input v-model="formItem.input" :maxlength="12" placeholder="请输入选择名称"/>
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
			formItem: {},
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
			this.$emit('sure', this.formItem.input);
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
