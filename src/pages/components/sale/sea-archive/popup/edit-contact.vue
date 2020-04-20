<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true"
		:mask-closable="false"
		width="400"
		class="v-sale-sea-edit-contact"
		@on-ok="handleOk" 
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>编辑联系人</span>
		</div>
		<i-form
			ref="form"
			:rules="rules"
			:model="formData"
			:label-width="80"
			class="g-pd-l-30"
			@submit.native.prevent
		>
			<i-form-item label="姓名：" prop="customer_name">
				<i-input 
					v-model="formData.customer_name" 
					placeholder="请输入姓名" 
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="性别：" prop="sex">
				<i-radio-group v-model="formData.sex">
					<i-radio :label="0" class="g-m-r-30">男</i-radio>
					<i-radio :label="1" class="g-m-l-30">女</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item label="职位：" prop="position">
				<i-input 
					:maxlength="40" 
					v-model="formData.position" 
					placeholder="请输入职位" 
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item 
				label="电话：" 
				style="margin-bottom:0 !important" 
				required
			>
				<div class="g-m-b-25">
					<i-form-item :rules="rules.tel" prop="tel.0">
						<div>
							<i-input 
								v-model="formData.tel[0]" 
								placeholder="请输入电话" 
								style="width: 220px"
							/>
							<i
								v-if="formData.tel.length < 5"
								class="icon iconfont g-c-blue-mid g-pointer icon-add1"
								style="position:relative;top:2px"
								@click="handleAddTel"
							/>
						</div>
					</i-form-item>
				</div>
				<div 
					v-for="(tel,index) in formData.tel.filter((item,index)=>index >0)" 
					:key="index" 
					class="g-m-b-25"
				>
					<i-form-item 
						:prop="'tel.'+(index+1)" 
						:rules="rules.tel"
					>
						<i-input 
							v-model="formData.tel[index + 1]" 
							placeholder="请输入电话" 
							style="width: 220px"
						/>
						<i
							class="icon iconfont g-c-red-mid g-pointer icon-remove-circle"
							style="position:relative;top:2px"
							@click="handleRemoveTel(index + 1)"
						/>
					</i-form-item>
				</div>
			</i-form-item>
			<i-form-item label="邮箱：" prop="email">
				<i-input 
					v-model="formData.email" 
					placeholder="请输入邮箱" 
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="决策人：" prop="is_decision">
				<i-radio-group v-model="formData.is_decision">
					<i-radio :label="1" class="g-m-r-30">是</i-radio>
					<i-radio :label="0" class="g-m-l-30">否</i-radio>
				</i-radio-group>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Button, Form, FormItem, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-sea-edit-contact",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	mixins: [orderModal],
	props: {
		contact: Object
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				contact_id: this.contact.contact_id,
				customer_id: this.contact.customer_id,
				customer_name: this.contact.customer_name,
				sex: this.contact.sex,
				position: this.contact.position,
				tel: this.contact.tel.split(','),
				email: this.contact.email,
				is_decision: this.contact.is_decision,
			},
			rules: {// 表单验证
				customer_name: [
					{ required: true, message: "请输入联系人姓名", trigger: "blur" }
				],
				sex: [
					{
						required: true, type: "number", message: "请选择性别", trigger: "change"
					}
				],
				tel: [
					{ required: true, message: '请输入联系人电话', trigger: 'blur' },
					{ type: 'validPhone', message: '请填写正确的电话号码', validator: this.telValidator }
				],
				email: [
					{ type: 'validEmail', message: '邮箱格式不正确', validator: dataValidity, trigger: "blur" }
				],
				is_decision: [
					{
						required: true, type: "number", message: "请选择是否为决策人", trigger: "change"
					}
				]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		telValidator(rule, value, callback) {
			const isPhone = objRegex.validPhone.regex;
			const isMob = objRegex.validMobile.regex;
			const hotLine = objRegex.validHotLine.regex;
			if (isPhone.test(value) || isMob.test(value) || hotLine.test(value)) {
				callback();
			} else {
				callback(new Error('电话号码格式不正确'));
			}
		},
		/**
		 * 点击确定
		 */
		handleOk(name) {
			this.$refs.form.validate((valid) => {
				if (valid) {
					let temp = { ...this.formData };
					
					temp.tel = this.formData.tel.join();

					this.$request({
						url: '_SALE_INTENTION_SAVE_CONTACT_POST',
						type: "POST",
						loading: false,
						param: {
							...temp
						},
						autoTip: true,
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							status: res.status
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
			this.$emit('close');
		},
		/**
		 * 删除联系人电话
		 */
		handleRemoveTel(index) {
			this.formData.tel.splice(index, 1);
		},
		/**
		 * 添加联系人电话
		 */
		handleAddTel() {
			if (this.formData.tel.length >= 5) return;
			this.formData.tel.push('');
		}
	}
};


export const SeaEditContact = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-sea-edit-contact {
	.ivu-modal-body {
		max-height: 500px;
		overflow-y: auto;
		padding: 16px 0;
	}
}
</style>

