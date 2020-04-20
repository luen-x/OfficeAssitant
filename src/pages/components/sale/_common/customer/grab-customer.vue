<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="标题"
		width="700"
		class="v-sale-customer-grab-customer"
		footer-hide
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div :style="`background: url(${OSS_PROP_BG_01});height: 100%;width: 100%;`" class="_wrapper">

			<div class="__title">抢资料优先令牌</div>
			<div class="__content g-dark-scroll"> 
				<div v-for="customer in list" :key="customer.customer_id" class="__customer">
					{{ customer.company_name }} <span class="g-m-l-10">已掉入公海</span>
				</div>
			</div>
			<div class="__footer">
				<img :src="OSS_PROP_ICON5" class="g-pointer" @click="handleGrab">


			</div>
			
		</div>
	</i-modal>
</template>
<script>
import { Modal } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { OSS_PROP_BG_01, OSS_PROP_ICON5 } from '@constants/constants';
import { GrabResult } from './grab-result';

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		
	},
	props: {
		customerList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			OSS_PROP_BG_01,
			OSS_PROP_ICON5,
			list: [...this.customerList],
			visible: false,
			
		};
	},
	created() {
		this.$vc.on('SALE_CUSTOMER_DROP_TO_SEA', this.handleDropToSea);
	},
	beforeDestroy() {
		this.$vc.off('SALE_CUSTOMER_DROP_TO_SEA');

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleGrab() {
			// 不用promise.all,因为一旦有一个请求报错了，接下来的promise都不会返回结果
			const list = [...this.list]; // 防止在请求时加入新的公司
			const result = [];

			list.forEach(it => {
				return this.$request({
					url: "_SALE_CUSTOMER_SEA_GETCUSTOMER_BY_PROP_POST",
					type: "GET",
					param: {
						customer_id: it.customer_id
					},
					loading: false,
				}).then(res => {
					const company_name = (list.find(company => company.customer_id == res.data.customer_id) || {}).company_name;
					result.push({ ...res.data, company_name });

					
				}).catch((res) => {
					console.error(res);
					result.push(undefined);
					// this.$Message.error(res.msg);
				}).finally(() => {
					if (result.length === list.length) {
						this.handleOk();
						GrabResult.popup({
							list: result
						});
					}
				});
			});
			// 发起抢后立刻标记已读
			this.handleMark(list.map(i => i.alert_id));
			
			
		},
		handleDropToSea(customer) {
			this.list.push(customer);
			
		},
		// 标记已读
		handleMark(alert_ids) {
			this.$request({
				url: "_NOTICE_READED_COUNT_POST",
				type: "POST",
				param: {
					alert_ids
				},
				loading: false,
			}).then(res => {
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
			
		}
	}
};
export const GrabCustomer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-grab-customer {
	.ivu-modal {
		background: rgba(0,0,0,0);
	}
	.ivu-modal-close .ivu-icon-ios-close {
		display: none;
        // font-size: 42px;
        // color: #fff;
    }
    .ivu-modal-close .ivu-icon-ios-close:hover {
		display: none;
        // color: #fff;
    }
    .ivu-modal-body {
        padding: 0;
        height: 400px;
        width: 700px;
    }
    .ivu-modal-content {
		border-radius: 22px;
		background: inherit;
    box-shadow: none;
    }
    .ivu-modal-header {
        display: none;
    }
	._wrapper {
		position: relative;
        margin: 0 auto;
        text-align: center;
        border-radius: 16px;
		.__title {
			font-size: 18px;
			font-weight: bold;
			padding-top: 13px;
			margin: 0px 45px 0px 57px;

		}
		.__content {
			margin: 40px 45px 40px 57px;
			padding-top: 30px;
			height: 155px;
			overflow-y: auto;
			font-weight: bold;
			display: flex;
			justify-content: center;
			flex-direction: column;
			.__customer {
				color: white;
				font-size: 14px;
				padding-bottom: 10px;

			}
		}

	}

}
</style>