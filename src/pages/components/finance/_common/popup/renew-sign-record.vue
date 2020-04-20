<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false" 
		title="续费标记记录"
		width="400" 
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div v-if="list.length==0" class="g-tc">
			<img :src="OSS_SEARCH_EMPTY"><br>
			<span class="g-c-black7">暂无续费标记记录～</span>
		</div>
		<oa-record v-else :records="list">
			<div slot-scope="{data}">
				<div class="g-c-black7">
					<span>{{ data.create_time }}</span> <span class="g-m-l-20">{{ data.staff_name }}（{{ data.depart_name }}）</span>
				</div>
				
				<template v-if="data.type===1">
					<div v-for="(it,index) in data.product" :key="index" class="g-m-t-5 g-c-black2">
						{{ it.product_name }}：{{ it.amount }}
					</div>
				</template>
				<div v-else>
					取消续费
				</div>
			</div>
		</oa-record>
	</i-modal>

</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Record from '@components/_common/record/record';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: "oa-sale-rebuy-sign-record",
	components: {
		'i-modal': Modal,
		'oa-record': Record,
	},
	props: {
		contractId: [Number, String]
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			visible: false,
			list: []
		};
	},
	created() {
		this.loadData();
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
		loadData() {
			this.$request({
				url: "_FINANCE_CUSTOMER_RENEW_SIGN_RECORD_GET",
				type: "GET",
				param: {
					contract_id: this.contractId
				},
				loading: false,
			}).then(res => {
				this.list = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		
	}
};
export const RenewSignRecord = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>