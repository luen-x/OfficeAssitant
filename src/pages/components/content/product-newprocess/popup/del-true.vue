<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="确认删除？"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-14 g-c-black2">
			<div>请问确定要删除吗？</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "vc-save-true",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-upload': Upload
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
		/**
         * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
         */
		 this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const delTrue = CreatePortal({}, module.exports.default);
</script>
