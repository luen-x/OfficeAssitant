<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		:width="basicInfo.audit_schedule.length <= 4 ? '680px' : '800px'" 
		class="v-sale-service-info"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ basicInfo.apply_type }}</span>
		</div>

		<i-form 
			:label-width="120" 
			@submit.native.prevent
		>
			<div class="g-m-b-15" style="padding-left: 58px;">
				<span class="g-fs-14 g-c-black1">
					{{ basicInfo.contract_company_name }}
				</span>
			</div>
			<i-form-item label="申请类型：">
				<span v-if="basicInfo.type === 3" class="g-c-red-mid">
					{{ basicInfo.apply_type }}（{{ basicInfo.appeal_step }}、共计{{ basicInfo.service_amount }}元）
				</span>
				<span v-else-if="basicInfo.type === 2">
					{{ basicInfo.apply_type }}（{{ basicInfo.set.join('、') }}）
				</span>
				<span v-else>
					{{ basicInfo.apply_type }}
				</span>
			</i-form-item>
			<i-form-item label="审核流程：">
				<oa-across-table 
					:data="basicInfo.audit_schedule"
					style="justify-content:flex-start;height:60px;margin-left:-45px;"
				>
					<div 
						slot-scope="item" 
						class="g-flex g-flex-cc g-fd-c"
					>
						<div>{{ item.item.title }}</div>
						<div style="margin-top: -10px;">{{ item.item.staff_name }}</div>
						<div style="margin-top: -10px;">{{ item.item.audit_time }}</div>
					</div>
				</oa-across-table>
			</i-form-item>
			<i-form-item 
				label="申请理由：" 
				style="margin-top: 42px;padding-right: 20px;"
			>
				<span>{{ basicInfo.reason }}</span>
			</i-form-item>
			<i-form-item 
				v-if="basicInfo.fileImage.length" 
				label="凭证："
				style="margin-top: -10px;"
			>
				<oa-upload
					:max="6"
					:data-source="basicInfo.fileImage.map(it => ({
						title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
						type: it.img_url.substr(it.img_url.lastIndexOf('.')),
						url: it.img_url
					}))"
					disabled
					@preview-start="handlePreviewStart"
					@preview-end="handlePreviewEnd"
				>
					<span slot="trigger"/>
				</oa-upload>
			</i-form-item>
			<div 
				v-if="basicInfo.audit_remark.length"
				style="margin-top: -10px;"
			>
				<i-form-item 
					v-for="(item, index) in basicInfo.audit_remark" 
					:key="index"
					:label="`${['提交审核','经理审核','总监审核','绩效组审核','财务审核'][+item.step - 1]}备注：`"
					style="margin-top: -20px;margin-right: 20px;"
				>
					<span>{{ item.remark }}</span>
				</i-form-item>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import Upload from '@components/_common/upload/upload';
import AcrossTable from '@components/_common/across-table/across-table';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-service-info",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		'oa-across-table': AcrossTable,
		"oa-upload": Upload,
	},
	mixins: [orderModal],
	props: {
		applyId: [String, Number]
	},
	data() {
		return {
			visible: false,
			basicInfo: {
				apply_type: '',
				appeal_step: '',
				service_amount: '',
				fileImage: [],
				audit_schedule: [],
				reason: '',
				audit_remark: []
			}, // 审核详情信息
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_APPLY_SERVICE_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: { 
					apply_id: this.applyId
				},
				autoTip: false
			}).then(res => {
				this.basicInfo = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
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

export const ServiceInfo = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-service-info {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.c-across-table {
		margin-top: 0;
		margin-bottom: 15px;
	}
	.c-across-table ._item {
		height: 60px;
	}
}
</style>

