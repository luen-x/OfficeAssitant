<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="600"
		:mask-closable="false"
		:loading="true"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">修改业绩</div>
		
	</i-modal>
</template>

<script>
import { Divider, Modal, Checkbox, CheckboxGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'finance-remain-modal',
	components: {
		'i-modal': Modal,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup
	},
	props: {
		contract_id: Number,
		contract_company_id: Number,
		supply_id: Number
	},
	data() {
		return {
			visible: false,
			checked: [],
			data: [],
			chosen_payments: []
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		// loadData() {
		// 	this.$request({
		// 		url: API_ROOT._FINANCE_CUSTOMER_CHANGE_PAYMENTS_LIST_GET,
		// 		type: 'GET',
		// 		param: {
		// 			supply_id: this.supply_id,
		// 			contract_company_id: this.contract_company_id,
		// 			contract_id: this.contract_id
		// 		},
		// 		loading: false
		// 	}).then(res => {
		// 		this.data = res.data;
		// 		res.data.forEach(item => {
		// 			if (item.is_chosen) {
		// 				this.checked.push(item.payment_id);
		// 				this.chosen_payments.push(item.payment_id);
		// 			}
		// 		});
		// 	}).catch(err => {
		// 		this.$Message.error(err.msg);
		// 	});
		// },
	
	}
};
export const RemainModal = CreatePortal({ store: app.$store }, module.exports.default);

</script>

<style lang="scss" scoped>

</style>


