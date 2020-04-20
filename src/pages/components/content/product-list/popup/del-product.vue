<template>

	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="确认删除"
		class="v-del-product"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div class="g-fs-14">
			<div>确认删除？删除后产品将进入回收站</div>
		</div>
	</i-modal>

</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "del-product",
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
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},

	}
};
export const DelProduct = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
</style>
