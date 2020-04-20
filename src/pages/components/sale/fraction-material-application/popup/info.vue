<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="680px" 
		class="v-sale-material-application-info"
	>
		<div slot="header" class="g-tc">
			<span>查看</span>
		</div>

		<i-form 
			:label-width="120" 
			@submit.native.prevent
		>
			<i-form-item 
				label="申请素材：" 
				prop="material" 
			>
				<span>{{ material_name }}</span>
			</i-form-item>
			<i-form-item label="审核流程：">
				<oa-across-table 
					:data="audit_schedule"
					style="justify-content:flex-start;height:60px;margin-left:-45px;"
				/>
			</i-form-item>
			<i-form-item 
				label="申请理由：" 
				style="width: 98%;word-break: break-all;"
			>
				<span>{{ apply_reason }}</span>
			</i-form-item>
			<i-form-item 
				v-if="refuse_reason.length" 
				label="驳回理由：" 
				style="width: 98%;word-break: break-all;"
			>
				<span>{{ refuse_reason[0] }}</span>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import AcrossTable from '@components/_common/across-table/across-table';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-material-application-info",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-across-table': AcrossTable,
	},
	props: {
		applyId: [String, Number],
	},
	data() {
		return {
			visible: false,
			material_name: '', // 素材名称
			audit_schedule: [], // 审核角色列表
			apply_reason: '', // 申请理由
			refuse_reason: [], // 驳回理由
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
				url: '_SALE_LIBRARY_APPLY_AUDIT_DETAIL_GET',
				type: "GET",
				loading: false,
				param: {
					apply_id: this.applyId
				},
				autoTip: false
			}).then(res => {
				this.material_name = res.data.material_name;
				this.audit_schedule = res.data.audit_info.map(it => ({ title: it.step_name, step: it.step, status: it.status }));
				this.apply_reason = res.data.apply_reason;
				this.refuse_reason = res.data.refuse_reason;
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
		}
	}
};

export const FractionMaterialApplicationInfo = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-sale-material-application-info {
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
	}
	.c-across-table ._item {
		height: 60px;
	}
}
</style>

