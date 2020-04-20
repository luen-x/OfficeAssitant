<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-customer-detail-side v-sale-customer-account-record"
		@on-close="handleCancel"
	>
		<oa-loading v-if="loading"/>
		<div
			class="_head-title"
		>
			{{ data.contract_company_name || contract_company_name }}
		</div>
		<i-tabs
			:style="showFooter?'':'margin-bottom:0'"
			v-model="curTab"
			@on-click="handleTabChange"
		>
			<i-tab-pane :label="'到账详情'" name="paymentDetail">
				<oa-payment-info
					v-if="tabs.paymentDetail"
					ref="paymentDetail"
					:payment-id="data.payment_id"
					:is-own="isOwn"
					@rest-amount-change="restAmount=$event"
					@company-name-change="contract_company_name=$event"
				/>
			</i-tab-pane>
			<i-tab-pane :label="'客户公司'" name="customerCompany">
				<oa-customer-info
					v-if="tabs.customerCompany"
					:show-contacts="showContacts"
					:customer-id="data.customer_id"
					:show-call="showCall"
					:read-only="readOnly"/>
			</i-tab-pane>
		</i-tabs>


		<div v-if="showFooter" class="_footer">
			<template v-if="data.type=='1'">
				<i-button
					v-if="getAuth(isOwn,415,419)"
					@click="handleEdit"
				>
					重新编辑
				</i-button>
				<i-button
					v-if="getAuth(isOwn,87,107)"
					@click="handleRemind"
				>
					催一下
				</i-button>

			</template>

			<template v-else-if="data.type=='2' && data.rest_amount !='0.00' ">
				<i-button
					v-if="getAuth(isOwn,416,420)"
					@click="handleOrder"
				>
					<i-tooltip 
						v-if="coinConfig.tip_7_1" 
						:content="coinConfig.tip_7_1"
						transfer 
						placement="top" 
						max-width="220"
					>
						<img :src="OSS_PROP_ICON4">
					</i-tooltip>
					<span :style="coinConfig.tip_7_1?'position:relative;top:-4px':''">下单</span>
				</i-button>
				<i-button
					v-if="getAuth(isOwn,106,412) && condition=='payment'"
					@click="handleLeftRefund"
				>
					余额退款
				</i-button>
			</template>

			<template v-if="data.type=='3'">
				<i-button
					v-if="!data.is_again && getAuth(isOwn,417,421)"
					@click="handleReadd"
				>
					重新录入
				</i-button>
				<i-button
					v-if="getAuth(isOwn,720,721)"
					@click="handleDelete"
				>
					删除
				</i-button>

			</template>

		</div>
	</i-drawer>
</template>

<script>
import { Modal, Icon, Drawer, TabPane, Tabs, Steps, Step, Poptip, Tooltip } from "iview";
import { CreatePortal, Fragment } from "wya-vc";
import { debounce } from 'lodash';
import LimitWords from '@common/limit-words/limit-words';
import API from '@stores/apis/root';
import { services } from '@stores/services/sale';
import Loading from '@components/_common/loading/loading';
import Item from '@components/sale/customer-deal-arrive/item';
import { ApplyLeftRefund } from '@components/sale/_common/customer/apply-left-refund';
import orderModal from '@extends/mixins/orderModal';
import { getHashUrl, getParseUrl } from '@utils/utils';
import { OSS_PROP_ICON4 } from '@constants/constants';
import { getAuth, setData, saleDataStore } from '../../../util';
import iview from "../../../iview";
import PaymentInfo from './parts/payment-info';
import PaymentCustomerInfo from './parts/payment-customer-info';

import '../../cus-form/style.scss';

export default {
	name: "c-sale-customer-detail",
	components: {
		"i-icon": Icon,
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'i-poptip': Poptip,
		'i-tooltip': Tooltip,
		'oa-payment-info': PaymentInfo,
		'oa-customer-info': PaymentCustomerInfo,

	},
	mixins: [iview, orderModal, services.coinConfig()],
	props: {
		data: {
			type: Object,
			default: () => {
				return { payment_id: undefined, type: undefined };
			}
		},
		condition: {
			type: String,
			default: 'payment',
			validator: (val) => {
				return ['payment', 'deal-detail'].includes(val);
			}
		},
		showContacts: {
			type: Boolean,
			default: false,
		},
		readOnly: {
			type: Boolean,
			default: true,
		},
		showCall: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			OSS_PROP_ICON4,
			visible: false,
			loading: false,
			closeBtnStyle: 'position: absolute;right: 20px;',
			activeKey: 0,
			modified: false,
			tabs: {
				paymentDetail: true,
				customerCompany: false,
			},
			curTab: 'paymentDetail',
			dealStatus: '1',
			contract_company_name: '--',
			restAmount: '0.00'
		};
	},
	computed: {
		isOwn() {
			return this.data.is_own;
		},
		type() {
			return this.data.type;
		},
		showFooter() {
			if (this.data.type == 2 && this.data.rest_amount == '0.00') {
				return false;
			} else return this.data.show_option && this.data.show_footer;
		}

	},
	watch: {
		'data.payment_id': function (newVal, oldVal) {
			Object.keys(this.tabs).forEach(key => {
				this.tabs[key] = (key == this.curTab);
			});
			this.tabs.paymentDetail = true;
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			this.closeBtnStyle = 'position:fixed;top:68px;right:34px';

		}, 200);
		let { query = {} } = getParseUrl();

	},
	beforeDestroy() {
		this.closeBtnStyle = 'position: absolute;right: 20px;';
	},
	methods: {
		initTabs() {
			this.tabs = {
				paymentDetail: true,
				customerCompany: false,
			};
		},
		handleTabChange(val) {
			this.tabs[val] = true;
		},
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		handleEdit() {
			const row = this.data;
			window.event && window.event.stopPropagation();
			if (!row.show_option) return;
			this.$request({
				url: "_SALE_PAYMENT_HAS_AUDIT_GET",
				type: "GET",
				param: {
					payment_id: row.payment_id
				},
				loading: false,
			}).then(res => {
				this.handleCancel();
				setTimeout(() => {
					this.$router.push(
						getHashUrl('/sale/customer/deal/arrive/record', {
							payment_id: row.payment_id,
							staff_id: row.invite_staff_id,
							deal_status: row.deal_status,
							contract_company_id: row.contract_company_id,
							action: "update",
						})
					);

				}, 200);

			}).catch((res) => {
				this.$Message.error(res.msg);
				this.handleCancel();
				Item.methods.handleResetCur();
			});

		},
		// handleEdit() {

		// 	this.handleCancel();
		// 	setTimeout(() => {
		// 		Item.methods.handleEdit.call(this, this.data).then;
		// 	}, 200);
		// },
		handleOrder() {
			// deal_status客户信息没加载好的话
			if (!(this.data.deal_status || this.dealStatus)) return;
			this.handleCancel();
			setTimeout(() => {
				Item.methods.handleOrder.call(this, this.data);
			}, 200);
		},
		// 重新录入到账
		handleReadd() {
			this.handleCancel();
			setTimeout(() => {
				Item.methods.handleReadd.call(this, this.data);
			}, 200);
		},
		handleDelete() {
			setTimeout(() => {
				Item.methods.handleDelete.call(this, this.data).then(res => res && this.handleOk());
			}, 200);
		},
		handleRemind() {
			Item.methods.handleRemind.call(this, this.data);
		},
		handleLeftRefund() {
			if (this.data.rest_amount == '0.00') return;
			ApplyLeftRefund.popup({
				data: {
					payment_id: this.data.payment_id,
					title: '余额退款',
					contract_company_id: this.data.contract_company_id,
					action: 'add',
					rest_amount: this.data.rest_amount
				}
			}).then((res) => {
				this.handleOk();
				setTimeout(() => {
					saleDataStore.refund_id = res.refund_id;
					this.$router.push({
						path: '/sale/customer/deal/refund',
					});

				}, 200);

			}).catch(err => {
				err && console.error(err);
			});
		},
		handleResetCur() {
			const path = this.$route.path;
			if (path == "/sale/customer/deal/arrive") {
				this.$store.commit("SALE_CUSTOMER_DEAL_ARRIVE_LIST_RESET", {
					type: this.$route.query.type
				});
			} else if (path == "/sale/customer/deal/deal/detail") {
				this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST1_RESET", {
					type: this.$route.query.type
				});
			}
		}
	}
};
export const AccountRecord = CreatePortal({ alive: true }, module.exports.default);
</script>
