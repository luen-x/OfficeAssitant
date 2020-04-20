<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			class="v-sc-service-manage-contract-model"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ name == 'add' ? '添加联系方式' : '编辑联系方式' }}
			</div>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
			>
				<i-form-item label="对接人姓名:" prop="name">
					<i-input
						v-model="formData.name"
						:maxlength="15"
						style="width: 220px"
						placeholder="请填写对接人姓名"
					/>
				</i-form-item>
				<i-form-item label="对接人电话:" prop="phone">
					<i-input
						v-model="formData.phone"
						:maxlength="11"
						style="width: 220px"
						placeholder="请填写对接人电话"
					/>
				</i-form-item>
				<i-form-item label="备注:">
					<oa-limit-words
						v-model="formData.memo"
						:max="500"
						style="width: 220px"
						placeholder="请输入备注"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, Input } from 'iview';
import API_ROOT from '@stores/apis/root';
import { dataValidity, getHashUrl } from "@utils/utils";
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
	},
	props: {
		name: String,
		contract_company_id: Number,
		contact_id: Number,
		datas: {
			type: Array,
			default: () => [{}, {}]
		},
	},
	data() {
		return {
			visible: false,
			formData: {
				name: '',
				phone: '',
				memo: ''
			},
			formdataRule: {
				name: [{ required: true, message: '对接人姓名不能为空', trigger: 'blur' }],
				phone: [{ required: true, message: '对接人电话不能为空', trigger: 'blur' },
					{
						type: "validMobile",
						message: "手机号格式不正确",
						validator: dataValidity
					}],
			},
		};
	},
	mounted() {
		this.name == 'edit' && this.loadData();
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		loadData() {
			this.$request({
				url: API_ROOT['_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_GET'], // eslint-disable-line
				type: "GET",
				param: {
					contact_id: this.contact_id
				}
			}).then((res) => {
				this.formData.name = res.data.name;
				this.formData.phone = res.data.phone;
				this.formData.memo = res.data.memo;
			}).catch((error) => {
				Message.error(error.msg);
			});
		},
		handleSave() {
			let obj = {
				contract_company_id: this.name == 'add' ? this.contract_company_id : '',
				contact_id: this.name == 'edit' ? this.contact_id : '',
				name: this.formData.name,
				phone: this.formData.phone,
				memo: this.formData.memo,
			};
			let url = this.name == 'add' ? '_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_ADD_POST'
				: '_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_EDIT_POST';
			this.$request({
				url: API_ROOT[url], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				this.name == 'add' ? Message.success('添加成功') : Message.success('编辑成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const ContractModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>

</style>


