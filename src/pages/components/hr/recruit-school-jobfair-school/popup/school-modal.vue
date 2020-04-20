<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		:title="edit ? '编辑合作学校' : '新增学校'"
		width="400" 
		class="v-recruit-school-jobfair-school-modal"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
		>
			<i-form-item label="学校名称:" prop="school_name">
				<i-input 
					v-model="formData.school_name" 
					:maxlength="30" 
					placeholder="请输入学校名称" 
					style="width:220px"
					clearable
					@on-change="handleChangeName"
				/>
			</i-form-item>
			<i-form-item label="学校性质:" prop="school_type">
				<i-select
					v-model="formData.school_type"
					transfer
					clearable
					style="width: 220px;"
				>
					<i-option :value="0">公办专科学校</i-option>
					<i-option :value="1">公办本科学校</i-option>
					<i-option :value="2">民办专科学校</i-option>
					<i-option :value="3">民办本科学校</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="学校官网:" prop="school_url">
				<i-input 
					v-model="formData.school_url" 
					:maxlength="30" 
					placeholder="请输入学校官网" 
					style="width:220px"
					clearable
				/>
			</i-form-item>
			<i-form-item label="官网账号:">
				<i-input 
					v-model="formData.school_amount_number" 
					:maxlength="30" 
					placeholder="请输入官网账号" 
					style="width:220px"
					clearable
				/>
			</i-form-item>
			<i-form-item label="官网密码:">
				<i-input 
					v-model="formData.school_password" 
					:maxlength="30" 
					placeholder="请输入官网密码" 
					style="width:220px"
					clearable
				/>
			</i-form-item>
			<i-form-item label="学校地址:">
				<i-cascader
					v-model="formData.position"
					:data="region"
					style="width: 220px"
					class="g-m-b-20"
					clearable
					transfer
					filterable
					trigger="hover"
					placeholder="请选择地址"
					@on-change="handleChangeDetail"
				/>
				<i-input
					v-model="formData.detail_address"
					:maxlength="100"
					style="width: 220px"
					placeholder="请输入详细地址"
					clearable
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, Cascader } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { services as commonServices } from '@stores/services/common';
import { dataValidity, objRegex } from '@utils/utils';
import { cloneDeep } from 'lodash';

export default {
	name: "v-recruit-school-jobfair-school-modal",
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
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader
	},
	mixins: [
		commonServices.region()
	],
	props: {
		data: Object, // customer_id
		edit: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				school_name: '',
				school_type: null,
				school_url: '',
				school_amount_number: '',
				school_password: '',
				position: [],
				detail_address: ''
			},
			rules: {
				school_name: [
					{ required: true, message: '请输入学校名称', trigger: 'blur' }
				],
				school_type: [
					{ required: true, type: 'number', message: '请选择学校性质', trigger: 'change' }
				],
				school_url: [
					{ required: true, message: '请输入学校官网', trigger: 'blur' }
				],
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.edit && this.loadData();
	},
	methods: {
		handleChangeDetail(e) {
			if (!e.length) {
				this.formData.position = [];
				this.formData.province = null;
				this.formData.city = null;
			}
		},
		loadData() {
			let cloneData = cloneDeep(this.data);
			this.formData = {
				...cloneData,
				school_amount_number: cloneData.school_amount_number == '--' ? '' : cloneData.school_amount_number,
				school_password: cloneData.school_password == '--' ? '' : cloneData.school_password,
				position: cloneData.province ? [cloneData.province, cloneData.city] : [],
				detail_address: cloneData.detail_address == '--' ? '' : cloneData.detail_address,
			};
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleChangeName(e) {
			e.target.value 
				? this.$request({
					url: '_HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_NAME_GET',
					type: 'GET',
					param: {
						school_name: this.formData.school_name
					},
					loading: false
				}).then((res) => {
				
				}).catch((err) => {
					this.$Message.warning(err.msg);
				}) : '';
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					let param = {
						...this.formData
					};
					if (this.formData.position.length) {
						param.province = this.formData.position[0];
						param.city = this.formData.position[1];
					}
					this.edit ? param.school_id = this.data.school_id : '';
					this.$request({
						url: '_HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_ADD_POST',
						type: "POST",
						param,
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure', res.data.school_id);
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const SchoolModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-recruit-school-jobfair-school-modal {
    
}
</style>