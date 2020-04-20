<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="确认保存"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30">
			<div style="font-size: 14px;">
				<!-- 更改后已经下单的中的产品按照更改前的{{ data.title }}去走更改
				后再进行下单的就按照最新的{{ data.title }}走去 -->
				{{ data.title }}更改后不会对已经下单的产品产生影响，后续新下单的产品将使用本次设置的内容，请知悉
			</div>
		</div>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">保存</i-button>
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
export const saveTrue = CreatePortal({}, module.exports.default);
</script>
