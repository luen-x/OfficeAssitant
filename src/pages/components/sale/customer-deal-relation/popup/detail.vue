<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-sale-relation-detail"
	>
		<div slot="header" class="g-tc">
			<span>查看详情</span>
		</div>

		<i-form 
			ref="formData" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="合同公司名称：" >
				<span>{{ contractCompanyName }}</span>
			</i-form-item>
			<i-form-item label="关联公司：" >
				<div 
					v-for="(item, index) in customerList" 
					:key="index"
				>
					{{ item.company_name }}
				</div>
			</i-form-item>
			<i-form-item label="凭证：" >
				<oa-upload
					:max="5"
					:data-source="imageUrl"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				>
					<span slot="trigger"/>
				</oa-upload>
			</i-form-item>
			<i-form-item 
				v-if="status === 1"
				label="通过说明：" 
				style="width: 92%;word-break:break-all;"
			>
				<div>{{ auditRemark }}</div>
			</i-form-item>
			<i-form-item 
				v-if="status === 2"
				label="驳回原因：" 
				style="width: 92%;word-break:break-all;"
			>
				<div>{{ auditRemark }}</div>
			</i-form-item>
		</i-form>
		<i-button slot="footer" @click="handleClose">关闭</i-button>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';

export default {
	name: "oa-relation-detail",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		relateId: [String, Number]
	},
	data() {
		return {
			visible: false,
			contractCompanyName: '',
			customerList: [],
			imageUrl: [],
			status: null,
			auditRemark: ''
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_SALE_RELATE_CUSTOMER_ALL_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					relate_id: this.relateId
				},
				autoTip: false
			}).then(res => {
				this.status = res.data.status;
				this.auditRemark = res.data.audit_remark;
				this.customerList = res.data.customer_list;
				this.contractCompanyName = res.data.contract_company_name;

				this.imageUrl = res.data.image_url.map(url => ({
					title: url.substr(url.lastIndexOf('/') + 1),
					type: url.substr(url.lastIndexOf('.')),
					url
				}));
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		/**
		 * 点击关闭
		 */
		handleClose() {
			this.visible = false;
			this.$emit('close');
		},
		handlePreviewStart() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: false });
		},
		handlePreviewEnd() {
			this.$vc.emit('ORDER_MODAL_ENABLE', { enable: true });
		}
	}
};

export const RelationDetail = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-relation-detail {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

