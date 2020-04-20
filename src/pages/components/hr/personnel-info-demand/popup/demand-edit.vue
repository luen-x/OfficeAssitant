<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		class="v-employee-demand-edit" 
		width="400"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			
			<span>编辑需求职位</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div style="height:15px;"/>
			<i-form-item label="用人部门：">
				<span>{{ formData.depart_name }}</span>
			</i-form-item>
			<i-form-item label="职位名称：">
				<span>{{ formData.position_name }}</span>
			</i-form-item>
			<i-form-item label="急需人数：" prop="need_number">
				<i-input-number
					v-model="formData.need_number"
					:min="1"
					placeholder="请输入急需人数"
					style="width:220px;"
				/>
			</i-form-item>
			<i-form-item label="人员标准：" prop="staff_standard">
				<oa-limit-words 
					v-model="formData.staff_standard"
					:max="500"
					placeholder="请输入人员标准"
					clearable
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-employee-demand-edit",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-limit-words': LimitWords,
		'i-input-number': InputNumber,
	},
	mixins: [orderModal],
	props: {
		needId: [String, Number]
	},
	data() {
		return {
			visible: false,
			positionList: [],
			formData: {},
			rules: {
				need_number: [
					{ required: true, type: 'number', message: "请输入急需人数", trigger: "blur" }
				]
			}
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
				url: '_HR_EMPLOYEE_SUMMARY_NEED_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					need_id: this.needId
				},
			}).then((res) => {
				this.formData = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_HR_EMPLOYEE_SUMMARY_NEED_ADD_POST',
						type: "POST",
						loading: false,
						param: { 
							...this.formData,
							need_id: this.needId
						},
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							status: 1
						});
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const EmployeeDemandEdit = CreatePortal({}, module.exports.default);

</script>
<style lang="scss">

</style>

