<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:title=" data.title || '添加联系人' "
		:mask-closable="false"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="90"
			class="g-pd-l-20"
		>
			<i-form-item label="姓名：" prop="customer_name">
				<i-input v-model="formData.customer_name" :maxlength="10" placeholder="请输入姓名" style="width: 220px"/>
			</i-form-item>
			<i-form-item label="性别：" prop="sex">
				<i-radio-group v-model="formData.sex">
					<i-radio :label="0" class="g-m-r-30">男</i-radio>
					<i-radio :label="1" class="g-m-l-30">女</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item label="职位：" prop="position">
				<i-input :maxlength="40" v-model="formData.position" placeholder="请输入职位" style="width: 220px"/>
			</i-form-item>
			<i-form-item label="电话：" style="margin-bottom:0 !important" required>
				<div v-for="(tel,index) in formData.tel" :key="index" class="g-m-b-25">
					<i-form-item :prop="'tel.'+index" :rules="rules.tel " style="width:270px">
						<i-input v-model="formData.tel[index]" placeholder="请输入电话" style="width: 220px"/>
						<i
							v-if="index>0"
							class="icon iconfont g-c-red-mid g-pointer icon-remove-circle"
							style="position:relative;top:2px"
							@click="handleRemoveTel(index)"
						/>
						<i
							v-if="formData.tel.length<5 && index== formData.tel.length-1 "
							class="icon iconfont g-c-blue-mid g-pointer icon-add1"
							style="position:relative;top:2px"
							@click="handleAddTel"
						/>
					</i-form-item>
				</div>
			</i-form-item>
			<i-form-item label="邮箱：" prop="email">
				<i-input v-model="formData.email" placeholder="请输入邮箱" style="width: 220px"/>
			</i-form-item>
			<i-form-item prop="is_decision">
				<span slot="label">
					决策人
					<oa-explain
						style="transform: translateY(1px); margin-right: 1px"
						placement="bottom-start"
						content="若该联系人在客户公司中具备决策权，则勾选“是”"
					/>:
				</span>
				<i-radio-group v-model="formData.is_decision">
					<i-radio :label="1" class="g-m-r-30">是</i-radio>
					<i-radio :label="0" class="g-m-l-30">否</i-radio>
				</i-radio-group>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip } from 'iview';
import Explain from '@components/_common/explain/explain';
import orderModal from '@extends/mixins/orderModal';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import API from '@stores/apis/root';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain
	},
	mixins: [orderModal],
	props: {
		data: Object // customer_id
	},
	data() {
		return {
			visible: false,
			formData: {
				contact_id: this.data.contact_id,
				customer_id: this.data.customer_id,
				customer_name: null,
				sex: 0,
				position: null,
				tel: [""],
				email: null,
				is_decision: 1
			},
			rules: {
				contact_id: [],
				customer_name: [
					{ required: true, message: "请输入联系人姓名", trigger: "blur" }
				],
				sex: [
					{
						required: true,
						type: "number",
						message: "请选择性别",
						trigger: "change"
					}
				],
				position: [],
				tel: [
					{ required: true, message: "请输入联系人电话", trigger: "blur" },
					{ validator: this.telValidator, trigger: "blur" }
				],
				email: [
					{
						type: 'email',
						message: "邮箱格式不正确",
						trigger: "blur"
					}
				],
				is_decision: [
					{
						required: true,
						type: "number",
						message: "请选择是否为决策人",
						trigger: "change"
					}
				]
			}
		};
	},
	created() {
		if (this.data.contactInfo) {
			this.formData = this.data.contactInfo;
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.handleSave();
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleRemoveTel(index) {
			this.formData.tel.splice(index, 1);
		},
		handleAddTel() {
			if (this.formData.tel.length >= 5) return;
			this.formData.tel.push('');
		},
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
		handleSave: debounce(function () {
			this.$refs.form.validate(valid => {
				if (valid) {
					const temp = { ...this.formData };
					temp.tel = this.formData.tel.join(',');
					this.$request({
						url: API._SALE_INTENTION_SAVE_CONTACT_POST,
						type: "POST",
						param: {
							...temp
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}, 200)
	}
};
export const AddContact = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
</style>

