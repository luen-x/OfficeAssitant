<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="道具介绍"
		width="400"
		class="v-sale-property-center-detail-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="70"
			class="g-pd-l-10"
		>
			<div style="white-space: pre-wrap;word-break: break-all;">{{ remark }}</div>
		</i-form>
		<div slot="footer" >
			<i-button type="primary" @click="handleOk">知道了</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Button } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "v-sale-property-center-detail-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button
	},
	props: {
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			prop_name: '',
			remark: '',
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_PROPERTY_CENTER_PROPERTY_DETAIL_GET",
				type: 'GET',
				param: {
					type_id: this.datas.type_id || this.datas.prop_type
				},
				loading: false
			}).then((res) => {
				this.prop_name = res.data.prop_name;
				this.remark = res.data.remark.replace(/↵/g, "<br />");
			});
		},
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const DetailModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-property-center-detail-modal {
    .ivu-form-item {
        margin-bottom: 5px !important;
	}
	.ivu-modal-body {
		max-height: 300px;
	}
}
</style>

