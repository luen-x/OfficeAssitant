<template>
	<div>
		<i-modal
			v-model="visible"
			:width="400"
			:mask-closable="false"
			class="hr-service-quality-complaint-delete"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				删除
			</div>
			<div class="_content">是否确认删除此投诉？</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Message } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'sc-service-quality-follow-confirm-modal',
	components: {
		'i-modal': Modal,
	},
	props: {
		complain_record_id: String,
	},
	data() {
		return {
			visible: false,
			formdata: {}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT['_HR_POINTS_COMPLAINT_DELETE_POST'], // eslint-disable-line
				type: "POST",
				param: {
					complain_record_id: this.complain_record_id,
				}
			}).then((res) => {
				Message.success('确认删除成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const DeleteComplaintModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-service-quality-complaint-delete {
	._content {
		width: 440px;
		margin: 0px;
		color: #333;
		font-size: 14px;
		margin: 40px 0 0 30px
	}
}
</style>


