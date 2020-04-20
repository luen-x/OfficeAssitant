<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="选择报名人"
		width="720" 
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-b-10 g-tc">
			系统检测到该客户有以下{{ data.length }}位报名人信息，你可以通过勾选报名人来快捷填充报名人信息。
		</div>
		<i-table :columns="columns" :data="data" @on-selection-change="handleSelectChange" />
	</i-modal>
</template>
<script>
import { Modal, Table } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-main-notice-choose-attend",
	components: {
		'i-modal': Modal,
		'i-table': Table
	},
	props: {
		data: Array, // customer_id
		max: Number
	},
	data() {
		return {
			visible: false,
			columns: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					 title: '姓名',
					key: 'username'
				},
				{
					 title: '职位',
					key: 'position_name'
				},
				{
					 title: '身份证号码',
					key: 'id_card'
				}
			],
			selects: []
			
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.selects.length > this.max) {
				this.$Message.error('本次最多还可以报名' + this.max + '人，请重新选择后进行提交');
				this.$refs.modal.buttonLoading = false;
				return;
			}
			this.visible = false;
			this.$emit('sure', this.selects);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSelectChange(selects) {
			this.selects = selects;


		},
	}
};
export const ChooseAttend = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>