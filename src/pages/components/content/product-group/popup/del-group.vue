<template>

	<i-modal
		:mask-closable="false"
		v-model="visible"
		class="v-del-group"
		width="400"
		title="确认删除"
		@on-ok="handleOk"
		@on-cancel="handleCancel">
		<div class="g-fs-14 g-c-black2" >
			<div>删除后不可恢复,确认删除？</div>
			<div>删除后已经下单的组合按照删除前的组合信息去走<br>
				删除后该组件组合消失,无法再进行下单</div>
				<!-- <div>删除后已经下单的产品按照删除前的产品信息去走</div>
			<div>删除后该产品消失，无法进行下单购买</div> -->
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
	mounted() {
		this.visible = true;
	},
	beforeCreate() {
		this.Button = Button;
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
export const DelGroup = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
</style>
