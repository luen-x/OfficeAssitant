<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="删除失败"
		class="v-del-class-fail"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-14 g-c-black2">
			<div>删除失败!当有产品正在使用该产品分类</div>
			<div>删除后会导致产品无法正常下单</div>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "del-class-fail",
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
export const DelClassFail = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
</style>
