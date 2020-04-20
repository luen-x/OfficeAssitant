<template>
	<div class="v-sale-customer-form v-sale-customer-intention-add-personal g-flex g-jc-c">

		<div style="max-width:925px">
			<h2 style="margin-left: 20px;" class="g-m-t-20" >个人客户信息录入</h2>
			<div class="g-c-red-mid _customer-form-title" style="margin-left: 20px;">基本信息</div>
			<i-form
				ref="form"
				:model="formData"
				:rules="rules"
				:label-width="110"
				inline
			>
				<i-form-item label="客户姓名：" prop="customer_name">
					<i-input
						v-model="formData.customer_name"
						:maxlength="10"
						style="width:300px"
						placeholder="请输入客户姓名"
						clearable
					/>
				</i-form-item>
				<i-form-item label="客户电话：" prop="tel">
					<i-input
						v-model="formData.tel"
						:maxlength="13"
						style="width:300px"
						placeholder="请输入客户电话"
						clearable
					/>
				</i-form-item>
				<i-form-item label="客户角色：" prop="customer_role">
					<i-select
						v-model="formData.customer_role"
						style="width:300px"
						placeholder="请选择客户角色"
						clearable
					>
						<i-option
							v-for="item in roleList"
							:value="item.customer_role_id"
							:key="item.customer_role_id"
						>
							{{ item.customer_role_str }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="客户类型：" prop="customer_type">
					<i-select
						v-model="formData.customer_type"
						style="width:300px"
						placeholder="请选择客户类型"
						clearable
					>
						<i-option
							v-for="item in customerTypeList"
							:value="item.customer_type_id"
							:key="item.customer_type_id"
						>
							{{ item.customer_type_str }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="联系地址：" prop="location">
					<i-cascader
						:data="region3"
						v-model="formData.location"
						style="width:300px"
						placeholder="请选择地址"
						clearable
						transfer
					/>
				</i-form-item>
				<i-form-item label="具体行业：" prop="industry_id">
					<!-- <i-cascader
						:data="industryTree"
						v-model="formData.industry"
						style="width:300px"
						placeholder="请选择具体行业"
						clearable
						transfer
					/> -->
					<i-select
						v-model="formData.industry_id"
						clearable
						transfer
						placeholder="请选择行业"
						class="g-m-r-5"
						style="width:300px"
					>
						<i-option
							v-for="item in industryList"
							:value="item.industry_id"
							:key="item.industry_id"
						>
							{{ item.industry_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="客户微信：" prop="wechat">
					<i-input
						v-model="formData.wechat"
						:maxlength="20"
						style="width:300px"
						placeholder="请输入客户微信"
						clearable
					/>
				</i-form-item>
				<i-form-item label="详细地址：">
					<oa-limit-words
						v-model="formData.address"
						:row="10"
						:max="50"
						style="width:300px"
						placeholder="请输入详细地址"
					/>
				</i-form-item>
			</i-form>
		</div>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button :loading="saveLoading" type="primary" @click="handleSave">保存</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, InputNumber, Select, Option, Cascader, Button } from 'iview';
import LimitWords from '@components/_common/limit-words/limit-words';
import { services } from '@stores/services/sale';
import { dataValidity } from "@utils/utils";
import _s from '../_common/customer/cus-form/style.scss';
import { Confirm } from '../../_common/confirm/confirm.vue';

export default {
	name: 'oa-sale-customer-intention-add-personal',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'i-button': Button,
		'oa-limit-words': LimitWords,
	},
	mixins: [
		services.region3(),
		services.customerTypeList(),
		// services.industryTree(),
		services.industryList(),
		services.roleList()
	],
	data() {
		return {
			saveLoading: false,
			formData: {
				customer_name: '',
				tel: '',
				customer_role: '',
				customer_type: '',
				address: '',
				location: [],
				industry: [1, 2, 3],
				industry_id: '',
				wechat: ''
			},
			rules: {
				customer_name: [{ required: true, message: '请输入客户姓名', type: 'string', trigger: 'blur' }],
				tel: [
					{ required: true, message: '请输入客户电话', type: 'string', trigger: 'blur' },
					{ type: 'validTel', message: '请输入正确的电话号码', validator: dataValidity, trigger: 'blur' }
				],
				customer_role: [{ required: true, message: '请选择客户角色', type: 'number', trigger: 'change' }],
				customer_type: [{ required: true, message: '请选择客户类型', type: 'number', trigger: 'change' }],
				address: [{ required: false, message: '请输入详细地址', type: 'string', trigger: 'blur' }],
				location: [{ required: true, message: '请输入联系地址', type: 'array', trigger: 'change' }],
				industry: [{ required: true, message: '请选择具体行业', type: 'array', trigger: 'change' }],
				industry_id: [{ required: true, message: '请选择具体行业', type: 'number', trigger: 'change' }],
				wechat: [{ type: 'validWeChat', message: '请输入正确的微信号', validator: dataValidity, trigger: 'blur' }]

			},
		};
	},
	methods: {
		handleCancel() {
			this.$router.go(-1);
		},
		handleSave() {
			this.saveLoading = true;
			this.$refs.form.validate().then((valid) => {
				if (!valid) {
					this.saveLoading = false;
					return;
				}
				const param = { ...this.formData };
				// param.industry_id = param.industry[0];
				// param.industry_id_second = param.industry[1];
				// param.industry_id_third = param.industry[2];
				// delete param.industry;

				param.province = param.location[0];
				param.city = param.location[1];
				param.area = param.location[2];
				delete param.location;

				this.$request({
					url: "_SALE_CUSTOMER_SAVE_PERSONAL_POST",
					type: "POST",
					param,
					loading: false,
				}).then(res => {
					if (res.data.can_get === 1) {
						if (res.data.tips) {
							Confirm.popup({ msg: res.data.tips, okText: '领取' }).then(() => {
								this.$request({
									url: "_SALE_SEA_GET_CUSTOMER_POST",
									type: "GET",
									param: {
										customer_id: res.data.customer_id
									},
									loading: false,
								}).then(res_ => {
									if (res_.data.error_code) {
										this.$Message.error(res_.data.error_msg);
									} else {
										this.$Message.success(res_.msg);
										this.$router.push('/sale/customer/intention');
									}
								}).catch((res_) => {
									this.$Message.error(res_.msg);
								});
							}).catch(err => err && console.error(err));
						} else {
							this.$router.push('/sale/customer/intention');
						}
					} else if (res.data.can_get === 0) {
						Confirm.popup({ msg: res.data.tips, okText: '知道了' }).catch(err => err && console.error(err));

					} else {
						this.$Message.success(res.msg);
						this.$router.push('/sale/customer/intention');
					}
				}).catch((res) => {
					console.error(res);
					this.$Message.error(res.msg);
				}).finally(() => {
					this.saveLoading = false;
				});
			});

		}
	},
};
</script>
