<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="删除提示"
		width="360px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc g-m-tb-30 g-fs-14 g-c-black2">
			<div v-if="canDelete" style="font-size: 14px">
				该通知在开启中，暂无法删除
			</div>
			<div v-else>
				删除后不可恢复，是否确认删除
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';
import ROOT_API from '@stores/apis/root';

export default {
	name: "vc-notice-inform-delete",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-upload': Upload
	},
	props: {
		data: Array
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {
		canDelete() {
			// 存在状态为开启  返回true, 返回true不可删除
			return this.data.some(v => v.status == '1');
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.canDelete) {
				this.visible = false;
				return;
			}
			this.$request({
				url: ROOT_API._CONTENT_NOTICE_INFORM_DELETE_POST,
				type: 'POST',
				param: {
					notice_ids: this.data.map(v => v.notice_id)
				},
				loading: false
			}).then(res => {
				this.$refs.modal.buttonLoading = false;
				this.$Message.success(res.msg);
				this.$emit('sure');
			}).catch((res) => {
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
		}
	}
};
export const PModalDelete = CreatePortal({}, module.exports.default);
</script>