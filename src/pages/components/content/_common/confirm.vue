<template>
	<i-modal
		:title="title"
		:ok-text="btnName2"
		:cancel-text="btnName1"
		v-model="visible"
		width="400"
		class="le g-modal-small"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-c-black2 g-pd-lr-30 g-pd-t-30">
			<oa-content v-if="renderContent" :render="renderContent"/>
			<span v-else class="_model-text">{{ msg }}</span>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button } from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';

const Content = CreateCustomer({
});

export default {
	name: "vc-tpl-basic",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-button': Button,
		'oa-content': Content
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false
		};
	},
	computed: {
		msg() {
			return this.$options.propsData.msg || '确认？';
		},
		title() {
			return this.$options.propsData.title || '提示';
		},
		btnName1() {
			return this.$options.propsData.btnName1 || '取消';
		},
		btnName2() {
			return this.$options.propsData.btnName2 || '确定';
		},
		renderContent() {
			return this.$options.propsData.renderContent;
		},
		showBtn() {
			return this.$options.propsData.showBtn;
		}

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
			this.$emit('sure', 1);

		},
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);

		}
	}
};


export const Confirm = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
._model-text{
	font-size: 14px;
}
</style>
