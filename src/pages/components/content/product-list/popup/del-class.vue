<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="确定删除？"
		class="v-del-class"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-14 g-c-black2">
			<div>请问确定要删除吗？</div>
		</div>
	</i-modal>
</template>

<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import API from "@stores/apis/root";
import { DelClassFail } from './del-class-fail';

export default {
	name: "del-class",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			formItem: {},
			id: ''

		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.id = this.data.category_id;
	},
	methods: {
		DelClass() {
			this.$request({
				url: API._CONTENT_PRODUCT_DEL_CATEGORY_POST,
				type: "post",
				param: {
					category_id: this.id,
				}
			}).then(res => {
				this.$emit('sure');
				this.visible = false;
			}).catch(error => {
				DelClassFail.popup({})
					.then(data => {
						this.visible = false;
						this.GetClass();
					})
					.catch(data => { });
				console.error(error);
			});
		},
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

			this.DelClass();
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},

	}
};
export const DelClass = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
</style>
