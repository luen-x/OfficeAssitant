<template>
	<div class="v-nego-detail-head g-m-t-20">
		<div v-if="spin" class="g-pd-20">
			<div style="font-size: 16px">
				<span>{{ data.contract_company_name }}</span>
				<i-dropdown
					v-if="record.length > 1"
					trigger="click"
					class="g-m-l-20"
					placement="bottom-start"
					style="font-size: 12px"
				>
					<span class="g-red-btn-line">变更记录</span>
					<div slot="list" class="g-pd-20">
						<oa-steps 
							:type="1"
							:data-source="record"
							:render-title="renderTitle"
							:render-content="renderContent"
						/>
					</div>
				</i-dropdown>
			</div>
			<div class="g-m-t-20">
				<span>
					<span style="color: #818794">
						可用余额
						<oa-explain
							:width="200"
							content="客户账户内剩余的金额，可用于购买产品，假如客户账户一共有15万，当下单减去10万后，则可用金额为5万"
						/>
						:
					</span> 
					<span style="color: #333">￥{{ data.total_balance_amount }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">总打款金额:</span>
					<span style="color: #333">￥{{ data.total_payment }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">总到账金额:</span>
					<span style="color: #333">￥{{ data.total_received_amount }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">总退款金额:</span>
					<span style="color: #333">￥{{ data.total_refund }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">实际打款金额:</span>
					<span style="color: #333">￥{{ data.total_real_payment }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">已开票金额:</span>
					<span style="color: #333">￥{{ data.invoice_amount }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">剩余开票金额:</span>
					<span style="color: #333">￥{{ data.last_invoice_amount }}</span>
				</span>
			</div>
			<div class="g-m-t-20">
				<span>
					<span style="color: #818794">客户姓名:</span>
					<span style="color: #333">{{ data.customer_name }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">客户手机号:</span>
					<span style="color: #333">{{ data.phone }}</span> 
				</span>
				<span class="_item">
					<span style="color: #818794">邀约人:</span> 
					<span style="color: #333">{{ data.invite_staff_name }}</span>
				</span>
				<span class="_item">
					<span style="color: #818794">我方合同公司:</span>
					<span 
						v-for="(item, index) of data.our_company_name"
						:key="index" 
						style="color: #333" >
						{{ item }}
						<span v-if="index < data.our_company_name.length - 1">/</span>
					</span>
				</span>
			</div>
			<span class="_button g-red-btn-line" @click="openChangeModal">变更用户</span>
		</div>
		<i-spin v-else fix/>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import { Button, Spin, Dropdown } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Explain from '@components/_common/explain/explain';
import Steps from '@components/_common/steps/steps';
import { ChangeModal } from './popup/change';

export default {
	name: 'oa-info',
	components: {
		'i-button': Button,
		'i-spin': Spin,
		"oa-explain": Explain,
		'oa-steps': Steps,
		'i-dropdown': Dropdown
	},
	data() {
		const { query = {} } = this.$route;
		return {
			contract_company_id: query.contract_company_id,
			data: {
				link_tel_id: ''
			},
			spin: true,
			record: []
		};
	},
	created() {
		this.loadData();
		this.loadRecord();
	},
	methods: {
		openChangeModal() {
			const { contract_company_name, customer_name, link_tel_id, customer_id, contract_company_id } = this.data;
			ChangeModal.popup({
				requestFn: this.handleChange,
				param: {
					contract_company_name,
					customer_name,
					link_tel_id,
					customer_id,
					contract_company_id

				}
			}).then(res => {
			}).catch(err => {
				this.$Message.error(err);
			});
		},
		loadData() {
			this.spin = false;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_NEGO_DETAIL_GET,
				type: 'GET',
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		},
		handleChange(res) {
			let { query = {} } = getParseUrl();
			delete query.page;
			this.$request({
				url: '_SALE_CUSTOMER_DEAL_CHANGE_COMPANY_NAME_POST',
				type: 'GET',
				param: {
					...query,
					...res.data
				},
			}).then((suc) => {
				this.$Message.success(suc.msg);
				res.cb();
				this.loadData();
				this.loadRecord();
				this.$store.commit('FINANCE_CUSTOMER_NEGO_DETAIL_LIST_INIT');
			}).catch((err) => {
				console.error(err);
				this.$Message.error(err.msg);
			});
		},
		loadRecord() {
			this.$request({
				url: '_FINANCE_CUSTOMER_NEGO_DETAIL_RECORD_GET',
				type: 'GET',
				param: {
					contract_company_id: this.contract_company_id
				},
			}).then((res) => {
				this.record = res.data;
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		renderTitle(h, param = {}) {
			const { after_contract_company_name, after_customer_name, after_phone } = param.rows;
			return (
				<p class="g-fs-14 g-c-black2 g-m-l-10 g-nobreak">
					<span>公司名称：{ after_contract_company_name }</span>
					<span class="g-m-l-20">客户名称：{ after_customer_name }</span>
					<span class="g-m-l-20">客户手机号：{ after_phone }</span>
				</p>
			);
		},
		renderContent(h, param = {}) {
			const { create_time, staff_name, index } = param.rows;
			return (
				(index < this.record.length - 1) ? <p 
					class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak"
				>
					<span>{ staff_name }</span>
					<span class="g-m-l-20">{ create_time }</span>
				</p> : ""
			);
		},
	}
};

</script>

<style lang="scss">
.v-nego-detail-head {
	box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);;
	position: relative;
	min-height: 150px;

	._item {
		margin-left: 70px;
	}

	._button {
		position: absolute;
		bottom: 20px;
		right: 20px;
	}
	.ivu-select-dropdown {
		overflow: auto !important;
	}
}
</style>
