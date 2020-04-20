<template>
	<div class="v-sale-customer-intention-add-search-customer" style="width:600px">
		<i-input
			v-model="keyword"
			:maxlength="50"
			search
			enter-button
			style="width:600px"
			class="g-m-b-5"
			placeholder="请输入公司名称或电话进行搜索"
			@on-change="handleCompanyNameChange"
			@on-search="handleSearch"
		/>
		<div v-for="customer in customerList" :key="customer.customer_id" class="g-pd-t-5">
			<span class="g-c-red-mid g-m-r-10">{{ customer.tips }} </span>
			<span 
				v-if="customer.can_get" 
				style="white-space: nowrap;" 
				class="g-operation g-m-r-10" 
				@click="handleSignCustomer(customer)" 
			>
				点击领取
			</span>
			<span 
				v-else-if="customer.add_attention" 
				style="white-space: nowrap;" 
				class="g-operation g-m-r-10" 
				@click="handleConcernCustomer(customer)" 
			>
				点击关注
			</span>
		</div>
		<div 
			v-if="isSimilar"
			class="g-c-red-mid g-pd-t-5"
		>
			公司名称相似无法录入系统，如需录入请直接找超级管理员（张勇）处理
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { Confirm } from '@common/confirm/confirm';
import { debounce } from 'lodash';
import { objRegex } from '@utils/utils';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		return {
			keyword: '',
			customerList: [],
			nameRegex: /[\u4e00-\u9fa5a-zA-Z]/,
			isSimilar: false, // 是否存在相似的公司名
		};
	},
	methods: {
		handleSearch: debounce(function () {
			if (this.keyword.length <= 2) {
				this.customerList = [];
				this.isSimilar = false;
				return;
			}
			const match = this.keyword.match(this.nameRegex);
			let url = "_SALE_INTENTION_CHECK_NAME_GET";
			let param = { company_name: this.keyword };
			if (!match) {
				if (!objRegex.validTel.regex.test(this.keyword)) {
					this.customerList = [{ tips: '电话号码格式不正确', customer_id: 0 }];
					this.isSimilar = false;
					return;
				}
				url = "_SALE_INTENTION_CHECK_TEL_GET";
				param = { tel: this.keyword };

			}
			this.$request({
				url,
				type: "GET",
				loading: false,
				param
			}).then((res) => {
				this.customerList = res.data.res_array || [{ tips: 'OA系统中没有搜索到相关的客户信息，去添加客户吧~', customer_id: 0 }];
				this.isSimilar = !!res.data.another_tips;
			}).catch((res) => { console.error(res); });
		}, 200),
		handleCompanyNameChange(val) {
			val = val.target.value;
			if (val.includes(' ')) {
				setTimeout(() => {
					this.keyword = val.replace(/ /g, '');	
				}, 10);
			}
			this.handleSearch();
		},
		handleSignCustomer({ company_name, customer_id }, field) {
			Confirm.popup({ msg: '确认领取 "' + company_name + '"?', title: "确认领取" }).then(() => {
				this.$request({
					url: "_SALE_SEA_GET_CUSTOMER_POST",
					type: "POST",
					param: {
						customer_id,
					},
					loading: false,
				}).then(res => {
					if (res.data.error_code) {
						this.$Message.error(res.data.error_msg);
					} else {
						this.$Message.success(res.msg);
						// this.$refs.form.validateField(field);
						this.$router.go(-1);
					}
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(console.error);
		},
		handleConcernCustomer({ company_name, customer_id }) {
			Confirm.popup({ msg: '确认关注 "' + company_name + '" 吗?', title: "确认关注" }).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_ATTENTION_ADD_POST",
					type: "POST",
					param: {
						customer_id,
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.$router.push('/sale/customer/intention/concern');
						
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});
		},
	}
};
</script>
<style lang="scss">
.v-sale-customer-intention-add-search-customer {

}
</style>