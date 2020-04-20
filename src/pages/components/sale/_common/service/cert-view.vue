<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-cert-view"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<i-form 
			:label-width="120" 
			@submit.native.prevent
		>
			<i-form-item :label="title.split('查看')[0] + '：'">
				<oa-upload
					:max="6"
					:data-source="fileImage"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				>
					<span slot="trigger"/>
				</oa-upload>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import Upload from '@components/_common/upload/upload';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-cert-view",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		"oa-upload": Upload
	},
	mixins: [orderModal],
	props: {
		title: String,
		fileImage: {
			type: Array,
			default() {
				return [];
			}
		}
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
			this.visible = false;
			this.$emit('close');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('sure');
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const ServiceCertView = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">

</style>

