<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="单量设置"
		width="680px"
		class="v-notice-detail"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-tc g-m-tb-10 g-fs-14">
			<i-table 
				ref="tableTarget" 
				:columns="columns"
				:data="list" 
				:loading="tableLoading"
				height="400"
				stripe
			/>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Col, Row, Table, RadioGroup, Radio, Message } from 'iview';
import { CreatePortal } from 'wya-vc';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from "@stores/apis/root";

export default {
	name: "vc-notice-add",
	components: {
		'i-modal': Modal,
		'i-col': Col,
		'i-row': Row,
		'i-table': Table,
	},
	props: {
		// 传递过来的列表详情（没有时间）
		data: Object
	},
	data() {
		return {
			visible: false,
			detailData: '', // 后台读取详情
			tableLoading: true,
			columns: [
				{
					title: '产品名称',
					key: 'product_name',
					minWidth: 150,
					render: (h, params) => {
						let product_name = params.row.product_name;
						return (
							<AutoToolTip 
								content={product_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '产品分类',
					key: 'category_name',
					minWidth: 150
				},
				{
					title: '是否记单量',
					key: 'options',
					minWidth: 150,
					render: (h, params) => {
						return h(RadioGroup, {
							props: {
								value: params.row.is_not_count
							},
							on: {
								"on-change": (val) => {
									this.$set(this.list[params.row._index], 'is_not_count', val);
								},
							}
						}, [
							h(Radio, {
								props: {
									label: 0
								},
							}, '是'),
							h(Radio, {
								props: {
									label: 1
								},
							}, '否')
						]);
					}
				}
			],
			list: []
		};
	},
	computed: {
		
	},
	created() {
		
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.handleSave();
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		loadData() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_ORDER_SETTING_LIST_GET,
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.list = res.data;
				this.tableLoading = false;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSave() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_ORDER_SETTING_POST,
				type: "POST",
				param: this.list,
				loading: false
			}).then(res => {
				this.$Message.success('设置成功');
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
export const OrderModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>