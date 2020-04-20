<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="结果公布"
		width="400" 
		class="v-sale-customer-modal-grab-result"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc">
			<div v-for="(customer,index) in list" :key="index" class="g-m-b-20" >
				<span class="g-c-black3">{{ customer.company_name }} </span>
				<span :class="statusConfig[customer.status].labelClass" class="_tag g-m-l-10">
					<i :class="'icon iconfont g-fs-12 '+statusConfig[customer.status].icon"/>
					{{ statusConfig[customer.status].label }}
				</span>
			</div>

		</div>
		<div slot="footer" class="g-tc">
			<i-button type="primary" size="large" style="width:340px" @click="handleOk">知道了</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Button } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

const statusConfig = {
	1: {
		label: '已抢到',
		labelClass: '_success',
		icon: 'icon-yiqiangdao'
	},
	2: {
		label: '手慢了',
		labelClass: '_fail',
		icon: 'icon-shoumanle'
	},
	3: {
		label: '名额不足，不能抢了',
		labelClass: '_fail',
		icon: 'icon-shoumanle'
	}
};

export default {
	name: "oa-sale-customer-modal-grab-result",
	components: {
		'i-modal': Modal,
		'i-button': Button
		
	},
	props: {
		list: Array // customers
	},
	data() {
		return {
			visible: false,
			statusConfig
			
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.$vc.on('SALE_CUSTOMER_DROP_TO_SEA', this.handleOk);
	},
	beforeDestroy() {
		this.$vc.off('SALE_CUSTOMER_DROP_TO_SEA');

	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$store.commit('SALE_CUSTOMER_INTENTION_CONCERN_LIST_RESET', { type: 1 });
			this.$store.commit('SALE_CUSTOMER_INTENTION_LIST_RESET', { type: 1 });
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		
	}
};
export const GrabResult = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-modal-grab-result {
	._tag {
		padding:2px 10px 2px 7px;
		border-radius: 10px;
		color:white;
		&._success {
			background: #FA7526;

		}
		&._fail {
			background: #CFD5E2
		}

	}
	.ivu-modal-body {
		padding-right: 0;
		padding-left: 0;
		max-height: 260px;
		min-height: 100px;
	}

}
</style>