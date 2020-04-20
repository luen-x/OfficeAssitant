<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-tech-project-plan-progress-edit"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>编辑进度</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="70"
			@submit.native.prevent
		>
			<i-form-item 
				v-for="(item, index) in formData.rate_arr"
				:key="item.uid" 
				:rules="rules.rate_name" 
				:prop="'rate_arr.' + index + '.rate_name'"
				label=""
				class="_icon-btn"
			>
				<i-input 
					v-model="item.rate_name"
					:maxlength="10"
					clearabled
					placeholder="请输入进度名称"
					style="width: 220px"
				/>
				<i 
					v-if="formData.rate_arr.length !== 1"
					class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-m-l-5"
					@click="handleDel(item, index)"
				/>
				<i 
					v-if="index === formData.rate_arr.length - 1"
					class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-5" 
					@click="handleAdd"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import { uid } from '@utils/utils';

export default {
	name: "oa-project-plan-progress-edit",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem
	},
	mixins: [orderModal],
	props: {
		rateId: [String, Number],
		projectId: [String, Number],
		rateList: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		const rateObj = { rate_name: '' };
		return {
			visible: false,
			rateObj,
			formData: {// 表单
				rate_arr: this.rateList.length ? this.rateList.map(it => ({ 
					uid: uid(), 
					rate_id: it.rate_id, 
					rate_name: it.rate_name 
				})) : [{ uid: uid(), ...rateObj }]
			},
			rules: {// 表单验证
				rate_name: [{ required: true, message: '请输入进度名称', trigger: 'blur' }]
			},
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
			this.$refs.form.validate((valid) => {
				if (valid) {
					const param = { project_id: this.projectId, ...this.formData };

					this.$request({
						url: '_TECH_PROJECT_NEED_RATE_ADD_POST',
						type: 'POST',
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', this.rateId);
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleAdd() {
			this.formData.rate_arr.push({ uid: uid(), ...this.rateObj });
		},
		handleDel(item, index) {
			if (item.rate_id) {
				this.$request({
					url: '_TECH_PROJECT_NEED_RATE_DEL_POST',
					type: 'POST',
					loading: false,
					param: {
						rate_id: item.rate_id
					},
					autoTip: true
				}).then(res => {
					this.formData.rate_arr.splice(index, 1);
				}).catch(error => {});
			} else {
				this.formData.rate_arr.splice(index, 1);
			}
		}
	}
};

export const ProjectPlanProgressEdit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-tech-project-plan-progress-edit {
	._icon-btn {
		.ivu-form-item-content {
			display: flex;
			align-items: center;
		}
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

