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
		<div class="g-tc g-m-tb-30 g-fs-14" style="color: #333">
			删除后不可撤回，确认删除该条记录? 
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
	created() {
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
			this.$request({
				url: ROOT_API._SALE_MAIN_PK_DELETE_POST,
				type: 'POST',
				param: {
					attack_id: this.data.attack_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit('sure', true);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
			
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const PModalDelete = CreatePortal({}, module.exports.default);
</script>
