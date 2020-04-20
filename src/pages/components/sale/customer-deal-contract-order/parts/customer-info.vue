<template>
	<div class="v-sale-customer-order-customer-info">
		<!-- <div class="g-c-red-mid _customer-info-title">客户信息</div> -->
		<oa-title mode="red" class="_customer-info-title">客户信息</oa-title>
		<oa-cus-form v-if="step==2" ref="form" :configs="formConfig"/>
		<oa-title mode="red" class="_customer-info-title">电子合同</oa-title>
		<!-- <div class="g-c-red-mid _customer-info-title">电子合同</div> -->
		<oa-imgs-picker   
			v-model="form.contract_image"
			:max="10"
			reactive
			style="margin-left:73px"
			@error="handleError"
		/>
		<oa-title mode="red" class="_customer-info-title">打折申请凭证</oa-title>
		<!-- <div class="g-c-red-mid _customer-info-title">打折申请凭证</div> -->
		<oa-imgs-picker   
			v-model="form.discount_image"
			:max="10"
			reactive
			style="margin-left:73px"
			@error="handleError"
		/>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import ImgsPicker from "@common/imgs-picker/imgs-picker";
import Title from '@common/title/title';
import CusForm, { formatProductDetail, formatCheckValue } from '../../_common/customer/cus-form/cus-form';

export default {
	name: 'oa-sale-order-customer-info',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-imgs-picker': ImgsPicker,
		'oa-cus-form': CusForm,
		'oa-title': Title
	},
	props: { 
		formConfig: Object,
		form: Object,
		step: Number
		
	},
	data() {
		return {
			imgs_: this.imgs,
			showImg: true
		};
	},
	methods: {
		handleError(err) {
			this.$Message.error(err.msg);
		},
		getFormData() {
			return this.$refs.form.getFormData();
		},
		getForm() {
			return this.$refs.form.getForm();
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-order-customer-info {
	._customer-info-title {
		// border-left: 2px red solid;
		// padding-left: 10px;
		margin-left:40px;
		margin-top: 20px;
		margin-bottom: 20px;
	}
}
</style>