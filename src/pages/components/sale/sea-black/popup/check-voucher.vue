<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="查看凭证"
		width="400"
		class-name="v-sale-sea-black-check-voucher-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div style="margin-left:40px">
			<div>
				<label >标记原因：</label><oa-auto-tooltip
					:content="recycleData.type_name"
					style="display: contents;"
					label-class="g-c-black3"
					width="200px"/>
			</div>
			<div class="g-m-t-20 g-m-b-20 g-flex">
				<label >备注：</label>
				<oa-auto-tooltip :content="recycleData.remark" style="display: contents;" label-class="g-c-black3" width="200px"/>
			</div>
			<div class="g-flex">
				<label >凭证：</label>
				<oa-upload :data-source="recycleData.image_url" disabled/>
			</div>
		</div>
	</i-modal>
</template>
<script>
import Explain from '@components/_common/explain/explain';
import { Modal } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import Upload from '@common/upload/upload';


export default {
	name: "oa-sale-",
	components: {
		"oa-upload": Upload,
		"oa-auto-tooltip": AutoTooltip,
		'i-modal': Modal,
	},
	props: {
		data: Object, // customer_id
		recycle_staff_id: [Number, String]
	},
	data() {
		return {
			visible: false,
			recycleData: {},
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_SALE_SEA_RECYCLE_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					recycle_staff_id: this.recycle_staff_id
				},
			}).then(res => {
				this.recycleData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const CheckVoucher = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
	.v-sale-sea-black-check-voucher-modal{
		.ivu-modal-body{
			label{
				display: inline-block;
				min-width:80px;
				text-align: right;
			}
		}
	}
</style>

