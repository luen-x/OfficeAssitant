<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-worksheet-control-project-close"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ ['开启项目','关闭项目'][+status - 1] }}</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="80"
			@submit.native.prevent
		>
			<i-form-item 
				label="备注：" 
				prop="remark" 
			>
				<oa-limit-words 
					v-model="formData.remark"
					placeholder="请输入备注内容"
					clearable
					style="width: 80%;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-worksheet-project-close",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		status: [String, Number],
		systemId: [String, Number]
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				status: this.status,
				system_id: this.systemId,
				remark: ''
			},
			rules: {}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$request({
				url: '_WORKSHEET_CONTROL_PROJECT_CLOSE_POST',
				type: 'POST',
				loading: false,
				param: { ...this.formData },
				autoTip: true
			}).then(res => {
				this.visible = false;
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};

export const worksheetProjectClose = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-worksheet-control-project-close {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

