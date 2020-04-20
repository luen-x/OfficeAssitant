<template>
	<oa-base-modal 
		:index="index"
		:alert-id="data.alert_id"
		title="客户跟进提醒" 
		ok-text="去跟进" 
		@on-ok="handleToUse" 
		@on-cancel="handleCancel" >
		<div>
			<div>{{ customers.map(cus=>cus.company_name).join(',') }}的跟进时间已到，赶快行动吧！</div>
		</div> 
	</oa-base-modal>
</template>
<script >
import { CreatePortal } from 'wya-vc';
import { Confirm } from '@common/confirm/confirm';
import BaseModal from './base-modal';

export default {
	name: "oa-sale-main-archieve-expire-tip",
	components: {
		'oa-base-modal': BaseModal
	},
	props: {
		data: Object,
		index: Number
	},
	data() {
		return {
		};
	},
	computed: {
		customers() {
			return this.data.content;
		}
	},
	methods: {
		// 点跟进之前检查一遍，再进行跳转
		handleToUse() {
			this.$request({
				url: "_SALE_INTENTION_CHECK_OWN_REMIND_GET",
				type: "POST",
				param: {
					customer_ids: this.customers.map(cus => cus.customer_id)
				},
				loading: false,
			}).then(res => {
				if (res.data.customer_ids.length == 0) {
					return;
				}
				const customer_ids = res.data.customer_ids.join(',');
				this.$router.push({ path: '/sale/customer/intention', query: { customer_ids } });
				if (this.$route.path == '/sale/customer/intention') {
					this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_INIT");
				}
			}).catch((res) => {
				this.tipNoCustomer(res);
			});
		},
		// 关闭时清除提醒
		handleCancel() {
			this.$request({
				url: "_SALE_INTENTION_CLEAR_OWN_REMIND_POST",
				type: "POST",
				param: {
					customer_ids: this.customers.map(cus => cus.customer_id)
				},
				loading: false,
			}).then(res => {
			}).catch((res) => {
				this.tipNoCustomer(res);
			});	

		},
		tipNoCustomer(res) {
			Confirm.popup({ msg: res.msg, okText: '知道了', cancelText: '' }).then(() => {
				this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_RESET", {
					type: undefined
				});
			}).catch(() => {});

		}
	}
};
export const FollowTime = CreatePortal({ autoDestory: false }, module.exports.default);
</script>