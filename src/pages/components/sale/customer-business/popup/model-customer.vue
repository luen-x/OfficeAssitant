<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="data.title"
		class-name="sale-customer-business-model-customer"
		width="680"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-checkbox-group v-model="pick" style="padding: 0 60px;" class="g-flex g-fw-w">
			<i-checkbox
				v-for="item in callRecord"
				:key="item.call_id"
				:label="item.call_id"
				style="min-width:50%;margin-right:0;"
				class="g-m-t-20 ">
				{{ item.company_name }}
			</i-checkbox>
		</i-checkbox-group>
		<div class="g-m-t-20" style="padding: 0 60px;">
			手动添加信息
			<i class="iconfont icon-triangle-down"/>
			<span v-if="type_list.length<10" class="g-operation" @click="()=>{type_list.push(type_list.length)}">添加</span>
		</div>
		<div v-for="(item,i) in type_list" :key="item" class="g-relative g-m-t-20" >
			<span
				class="g-operation"
				style="position: absolute;right: 25px;top: 10px;"
				@click="()=>{type_list.splice(i,1)}">
				删除
			</span>
			<oa-model-form ref="modalForm" :is-manager="data.isManager" style="background:rgba(250,250,250,1);"/>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, CheckboxGroup, Checkbox } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import modelForm from './model-form';


export default {
	name: "oa-sale-",
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
		'oa-model-form': modelForm,
		'i-select': Select,
		'i-option': Option,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
	},
	props: {
		data: Object, // customer_id

	},
	data() {
		return {
			visible: false,
			pick: [],
			type_list: [],
			type_in: [],
			callRecord: [
				{
					"call_id": 81957, // 主键
					"relation_id": 1919,
					"relation_type": 1,
					"company_name": "九州小药房" // 公司名称
				},
				{
					"call_id": 81956,
					"relation_id": 399208,
					"relation_type": 2,
					"company_name": "电饭锅电饭锅"
				},
				{
					"call_id": 81959, // 主键
					"relation_id": 1919,
					"relation_type": 1,
					"company_name": "九州小药房" // 公司名称
				},
				{
					"call_id": 81953,
					"relation_id": 399208,
					"relation_type": 2,
					"company_name": "电饭锅电饭锅"
				},
				{
					"call_id": 81952, // 主键
					"relation_id": 1919,
					"relation_type": 1,
					"company_name": "九州小药房" // 公司名称
				},
				{
					"call_id": 81950,
					"relation_id": 399208,
					"relation_type": 2,
					"company_name": "电饭锅电饭锅"
				}
			]
		};
	},
	created() {
		this.$request({
			url: '_SALE_CUSTOMER_BUSINESS_CALL_RECORD_GET',
			type: "get",
			param: {
				type: this.data.type
			},
			loading: false
		}).then(res => {
			this.callRecord = res.data;
		}).catch((res) => {

		});
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			let save = true;
			this.type_in = [];
			this.type_list.length && this.$refs.modalForm.forEach(ele => {
				ele.$refs.form.validateAndScroll(valid => {
					if (valid) {
						this.type_in.push(ele.formData);
					} else {
						save = false;
						this.$refs.modal.buttonLoading = false;
						return false;
					}
				});
			});
			save && this.handleSubmit();
		},
		handleSubmit() {
			this.$request({
				url: '_SALE_CUSTOMER_BUSINESS_SAVE_MORE_POST',
				type: "POST",
				param: {
					type: this.data.type,
					pick: this.pick,
					type_in: this.type_in,
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
		}
	}
};
export const modelCustomer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.sale-customer-business-model-customer{
	.ivu-modal-body{
		max-height: 600px;
		overflow-y:auto;
	}
}
</style>