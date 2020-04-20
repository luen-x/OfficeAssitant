<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		title="确定删除？"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-lr-30 g-pd-t-20 ">
			请问确定要删除吗
		</div>
		<div slot="footer">
			<i-button type="text" @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Button } from 'iview';
import { CreatePortal, CreateCustomer } from 'wya-vc';
import { debounce } from 'lodash';
import orderModal from '@extends/mixins/orderModal';

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
	mixins: [orderModal],
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
export const Confirm = CreatePortal({}, module.exports.default);
</script>
