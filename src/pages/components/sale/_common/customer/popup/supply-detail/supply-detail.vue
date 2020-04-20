<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-customer-detail-side v-sale-customer-contract-detail"
		@on-close="handleCancel"
	>
		<!-- <span slot="close"/>
		<span :style="closeBtnStyle" class="g-pointer iconfont icon-clear" style="font-size: 14px;z-index:1010" @click="handleClose"/> -->
		<div
			class="_head-title"
		>
			{{ contractDetail.contract_company_name || '--' }} (合同编号 : {{ contractDetail.contract_num || '--' }})
		</div>
		<div class="_title-wrapper">
			<span class="_span1">
				<span class="_left-text">客户姓名：</span>
				<span class="_right-text">{{ contractDetail.customer_name || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">客户手机号：</span>
				<span class="_right-text">{{ contractDetail.phone || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">谈判人：</span>
				<span class="_right-text">	{{ contractDetail.negotiator || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">邀约人：</span>
				<span class="_right-text">	{{ contractDetail.invite_staff_name || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">下单人：</span>
				<span class="_right-text">{{ contractDetail.staff_name || '--' }}</span>
			</span>
			<span class="_span1" style="width:460px;">
				<span class="_left-text">下单时间：</span>
				<span class="_right-text">{{ contractDetail.create_time || '--' }}</span>
			</span>


			<!-- <span class="_span1">
				<span class="_left-text">合同金额：</span>
				<span class="_right-text">{{ contractDetail.contract_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">应付金额：</span>
				<span class="_right-text">	{{ contractDetail.need_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">实付金额：</span>
				<span class="_right-text">{{ contractDetail.payment_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">剩余尾款：</span>
				<span class="_right-text">	{{ contractDetail.last_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">产品成本：</span>
				<span class="_right-text">	{{ contractDetail.total_need_cost_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">实扣成本：</span>
				<span class="_right-text">	{{ contractDetail.total_cost_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">提成业绩：</span>
				<span class="_right-text">{{ contractDetail.commission_performance || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">服务提成：</span>
				<span class="_right-text">{{ contractDetail.total_service_amount || '--' }}</span>
			</span> -->
		
			
			
			
		</div>
		<i-tabs
			:style="(data.type!='2'&& data.show_footer)?'':'margin-bottom:0'"
			v-model="curTab"
			@on-click="handleTabChange"
		>
			<i-tab-pane :label="'补款信息'" name="supplyInfo">
				<oa-sale-supply-info ref="supplyInfo" :supply-id="data.supply_id"/>
			</i-tab-pane>
			<i-tab-pane :label="'项目需求'" name="projectRequest">
				<oa-sale-project-request 
					v-if="tabs.projectRequest" 
					ref="projectRequest" 
					:contract-id="data.contract_id" 
					:data="data"
				/>
			</i-tab-pane>
			<i-tab-pane :label="'补款记录'" name="supplementRecords" class="g-pd-20">
				<oa-sale-supplement-record v-if="tabs.supplementRecords" ref="supplementRecords" :contract-id="data.contract_id"/>
			</i-tab-pane>
		</i-tabs>
		<div v-if="showFooter" class="_footer">
			<template v-if="data.type ==1">
				<i-button
					v-if="getAuth(isOwn,805,810)"
					@click="handleEdit(data)"
				>
					重新编辑
				</i-button>
				<i-button
					v-if="getAuth(isOwn,806,811)"
					@click="handleDrawBack(data)"
				>
					撤回补款
				</i-button>
			</template>
			<template v-if="data.type ==3">
				<i-button
					v-if="!data.is_again && getAuth(isOwn,822,823)"
					@click="handleReSupply(data)"
				>
					重新申请
				</i-button>
				<i-button
					v-if="getAuth(isOwn,807,812)"
					@click="handleDelete(data)"
				>
					删除
				</i-button>
			</template>

		</div>
	</i-drawer>
</template>

<script>
import { Modal, Icon, Drawer, TabPane, Tabs, Steps, Step, Button } from "iview";
import { CreatePortal } from "wya-vc";
import { getHashUrl } from '@utils/utils';
import Item from '@components/sale/customer-deal-supply/item';
import orderModal from '@extends/mixins/orderModal';
import { getAuth } from '../../../util';
import { PayLeft } from "../../pay-left";
import ProjectRequest from '../contract-detail/parts/project-request';
import SupplementRecords from './parts/supplement-records';
import SupplyInfo from './parts/supply-info';
import '../../cus-form/style.scss';

export default {
	name: "c-sale-customer-detail", 
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'i-button': Button,
		'oa-sale-project-request': ProjectRequest,
		'oa-sale-supplement-record': SupplementRecords,
		'oa-sale-supply-info': SupplyInfo
	},
	mixins: [orderModal],
	props: {
		data: {
			type: Object,
			default: () => {
				return { contract_id: undefined, contract_num: undefined, show_footer: 1 };
			}
		}
	},
	data() {
		return {
			visible: false,
			closeBtnStyle: 'position: absolute;right: 20px;',
			activeKey: 0,
			modified: false,
			tabs: {
				supplyInfo: true,
				projectRequest: false,
				supplementRecords: false,
			},
			curTab: 'supplyInfo',
			contractDetail: {
				customer_name: "", // 客户姓名
				phone: "", // 客户手机号
				contract_company_name: "", // 合同公司名称
				our_company_id: null,
				contract_amount: "", // 合同金额
				last_amount: "",
				need_amount: "", // 应付金额
				payment_amount: "", // 实付金额
				our_company_name: "", // 剩余尾款
				invite_staff_id: null, // 邀约人
				invite_staff_name: "", // 邀约人
				staff_id: 1, // 下单人
				staff_name: "", // 下单人
				negotiator: "", // 谈判人
				total_cost_amount: "", // 扣除成本
				total_service_amount: "", // 服务提成
				commission_performance: "", // 提成业绩
				create_time: "", // 下单时间
				contract_can_renew: 0,
			},
			optionTransition: false // // 解决按钮样式闪烁
		};
	},
	computed: {
		isOwn() {
			return this.data.is_own;
		},
		showFooter() {
			if (!this.data.show_option) return false;
			switch (this.data.type) {
				case '1': 
					return this.getAuth(this.isOwn, 805, 810) || this.getAuth(this.isOwn, 806, 811);
				case '2':
					return false;
				case '3':
					return this.getAuth(this.isOwn, 822, 823);
				default: 
					return false;
			}
		}
	},
	watch: {
		'data.supply_id': function () {
			Object.keys(this.tabs).forEach(key => {
				this.tabs[key] = (key == this.curTab);
			});
			this.tabs.customerInfo = true;
			this.loadContractDetail();
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;	
	},
	created() {
		this.loadContractDetail();

	},
	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		handleTabChange(val) {
			this.tabs[val] = true;
		},

		loadContractDetail() {
			this.optionTransition = false;
			this.$request({
				url: "_SALE_CONTRACT_DETAIL_GET",
				type: "GET",
				param: { contract_id: this.data.contract_id },
				loading: false,
			}).then(res => {
				this.contractDetail = res.data;
				// 解决按钮样式闪烁
				setTimeout(() => {
					this.optionTransition = true;
				}, 100);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		handleEdit(row) {
			Item.methods.handleEdit.call(this, this.data).then((res) => {
				if (res.has_audit) {
					this.handleCancel();
				} else if (res.has_update) {
					this.$refs.supplyInfo && this.$refs.supplyInfo.loadData();
				}
			
			});
		},
		handleReSupply(row) {
			Item.methods.handleReSupply.call(this, this.data);
		},
		handleDelete(row) {
			Item.methods.handleDelete.call(this, this.data).then(res => res && this.handleOk());
		},
		handleDrawBack(row) {
			Item.methods.handleDrawBack.call(this, this.data).then(res => res && this.handleOk());
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_SUPPLY_LIST_RESET", {
				type: this.data.type
			});
		},
	}
};
export const SupplyDetail = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
</style>