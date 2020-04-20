<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-tech-project-plan-progress-update"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>修改进度</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="70"
			@submit.native.prevent
		>
			<i-form-item label="" prop="rate_id">
				<i-select
					v-model="formData.rate_id"
					clearable
					transfer
					placeholder="请选择需求进度"
					style="width: 220px;"
				>
					<i-option 
						v-for="(item, index) in rateList" 
						:key="index" 
						:value="item.rate_id"
					>{{ item.rate_name }}</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-project-plan-progress-update",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [orderModal],
	props: {
		projectId: [String, Number],
		needIds: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			visible: false,
			rateList: [],
			formData: {// 表单
				rate_id: ''
			},
			rules: {// 表单验证
				rate_id: [{ required: true, type: 'number', message: '请选择需求进度', trigger: 'change' }]
			},
		};
	},
	mounted() {
		this.visible = true;
		this.loadRateList();
	},
	methods: {
		loadRateList() {
			this.$request({
				url: '_TECH_PROJECT_NEED_RATE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					project_id: this.projectId,
					type: 2
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data) && res.data.length) {
					this.rateList = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
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
			this.$refs.form.validate((valid) => {
				if (valid) {
					let param = { need_ids: this.needIds, ...this.formData };
					this.$request({
						url: '_TECH_PROJECT_NEED_RATE_UPDATE_POST',
						type: 'POST',
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};

export const ProjectPlanProgressUpdate = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-tech-project-plan-progress-update {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

