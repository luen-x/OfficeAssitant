<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="true"
		title="绕前台电话 "
		footer-hide
		width="750"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-table 
			ref="table"
			:columns="columns"
			:data="tableData"
			:loading="loading"
			height="250"
			@copy.native="handleCopyRao"
		/>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Table } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import { handleCopyPhone } from '@components/sale/call-manage/call/util';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-table': Table
	},
	mixins: [orderModal],
	props: {
		customerId: [Number, String], // customer_id
	},
	data() {
		return {
			visible: false,
			loading: false,
			columns: [
				{
					title: ' ',
					key: '',
					width: 60

				},
				{
					title: '电话',
					key: 'tel'
				},
				{
					title: '添加人',
					key: 'staff_name'
				},
				{
					title: '添加时间',
					key: 'create_time'
				}
			],
			tableData: []
			
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
				url: "_SALE_SEA_CUSTOMER_LINK_TEL_LIST",
				type: "GET",
				param: {
					customer_id: this.customerId
				},
				loading: false,
			}).then(res => {
				this.tableData = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleCopyRao(event) {
			handleCopyPhone(event, { customer_id: this.customerId, relation_type: 2 });
		}
		
	}
};
export const ViewRao = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
</style>

