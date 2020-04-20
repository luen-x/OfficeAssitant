<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:title="title"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30 g-f-s-14" >
			<div v-if="data.type==1">
				取消后系统将不会保存此次编辑的内容，确认取消？
			</div>
			<div v-else-if="data.type==2">
				确认删除此产品规格？
			</div>
			<div v-else-if="data.type==3">
				产品规格设置不规范，请填写完整或者
				保持规格数大于两个
			</div>
			<div v-else>
				产品信息更改后不会对已经下单的产品产生影响，
				后续新下单的产品将使用本次设置的内容，请知悉
			</div>
		</div>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">{{ data.type?'确定':'保存' }}</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "vc-notice-delete",
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
		title() {
			switch (this.data.type) {
				case 1:
					return '确认取消';
				case 2:
					return '确认删除';
				case 3:
					return '温馨提示';
				case 4:
					return '确认取消';
				default:
				  return '确定保存';
			}
		}
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
export const SaveConfirm = CreatePortal({}, module.exports.default);
</script>
