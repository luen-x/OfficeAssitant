<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="提示"
		width="400" 
		class="v-sale-customer-intention-add-attention"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-pd-lr-20 g-pd-t-20 g-fs-14" >
			{{ msg }}
		</div>
		<div slot="footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button @click="handleAddAttention()">加入关注</i-button>
			<i-button :class="{'_light-red':!myProp.remain_num}" type="primary" @click.native="handleUseProp(true)">关注并使用抢资料优先令牌</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Button } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { PropertyCard } from "../_common/property/property-card";

export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-button': Button
	},
	props: {
		msg: String,
		customerId: Number
	},
	data() {
		return {
			visible: false,
			myProp: {
				remain_num: 0
			}
		};
	},
	created() {
		this.loadMyProp();
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
		loadMyProp() {
			this.$request({
				url: "SALE_PROPERTY_MINE_LIST_GET",
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				this.myProp = res.data.list.find(item => item.type_id == 7) || {};
			}).catch(console.error);
		},
		handleAddAttention(useProp) {
			this.$request({
				url: "_SALE_CUSTOMER_ATTENTION_ADD_POST",
				type: "POST",
				param: {
					customer_id: this.customerId,
					prop_type: useProp ? 7 : ''
				},
				loading: false,
			}).then(res => {
				this.$Message.success(useProp ? "关注成功，掉出当天早上9点和30分钟前将会提醒你" : '关注成功，掉出当天早上9点将会提醒你');
				this.handleOk();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleUseProp() {
			if (!this.myProp.remain_num) {
				this.$Message.warning('当前没有此道具，请到道具中心购买');
			} else {
				PropertyCard.popup({
					typeId: 7
				}).then(() => {
					this.handleAddAttention(true);
				}).catch(e => e && console.error(e));	
			}
		}
	}
};
export const AddAttention = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-intention-add-attention {
	._light-red {    
		background-color: rgba(232, 76, 87,0.5) !important;
		border-color: rgba(232, 76, 87,0.5) !important;
	}
}
</style>