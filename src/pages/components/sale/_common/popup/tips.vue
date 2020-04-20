<template>
	<i-modal
		v-model="visible"
		:title="title"
		:mask-closable="false"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-lr-30 g-pd-t-20 ">
			<span class="g-c-black3 g-fs-14">{{ data.msg }}</span>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button } from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';
import { debounce } from 'lodash';

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
		data: Object,
		title: {
			type: String,
			default: '提示'
		},
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk: debounce(function () {
			this.visible = false;
			this.$emit('sure', 1);
		}, 200),
		handleCancel() {
			this.visible = false;
			this.$emit('close', 0);
		}
	}
};
export const Tips = CreatePortal({}, module.exports.default);
</script>
