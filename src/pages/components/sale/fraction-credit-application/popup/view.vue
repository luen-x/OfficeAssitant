<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-credit-application-view"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<i-form 
			:label-width="120" 
			@submit.native.prevent
		>
			<i-form-item :label="title.split('查看')[0] + '：'">
				<vc-imgs-picker 
					:data-source="fileImage" 
					:max="5"
					disabled
					class="g-m-t-10"
					@open="handleOpen"
					@close="handleClose"
				/>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-credit-application-view",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		"vc-imgs-picker": ImgsPicker
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
			this.$emit('sure');
		},
		handleOpen() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handleClose() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const FractionCreditApplicationView = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">

</style>

