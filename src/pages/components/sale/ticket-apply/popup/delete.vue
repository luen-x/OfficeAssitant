<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		title="删除提示"
		width="360px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc g-m-tb-30 g-fs-14">
			取消后你所填写的内容将无法恢复,确认取消？
		</div>
	</i-modal>
</template>

<script>
import { Modal } from 'iview';
import { CreatePortal } from 'wya-vc';
import ROOT_API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';


export default {
	name: "oa-pk-delete",
	components: {
		'i-modal': Modal,
	},
	mixins: [orderModal],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure', true);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const PModalDelete = CreatePortal({}, module.exports.default);
</script>
