<template>
	<div class="v-customer-deal-deal-detail-head g-m-t-20">
		<h3 class="g-c-blue-mid g-pointer" @click="handleOpenDetail" >{{ headData.contract_company_name }}</h3>
		<div>
			<span class="_label">
				可用余额：
				<span class="g-c-black1">￥{{ headData.total_balance_amount }}</span>
			</span>
			<span class="_label">
				客户姓名：
				<span class="g-c-black1">{{ headData.customer_name }}</span>
			</span>
			<span class="_label">
				客户手机号：
				<span class="g-c-black1">{{ headData.phone }}</span>
			</span>
			<span class="_label">
				邀约人：
				<span class="g-c-black1">{{ headData.invite_staff_name }}</span>
			</span>
			<span style="max-width:800px;display: inline-block;margin-top: 10px;">
				我方合同公司：
				<span class="g-c-black1" >
					{{ headData.our_company_name.join(' / ') }}
				</span>
			</span>
		</div>
		<div style="text-align:right" class="g-m-t-10">
			<span v-if="getAuth(isOwn,440,448)" class="g-red-btn-line g-m-r-5" @click="handleAddPayment">
				<i-tooltip
					v-if="coinConfig.tip_6_1"
					:content="coinConfig.tip_6_1"
					transfer
					placement="top"
					max-width="220"
				>
					<img :src="OSS_PROP_ICON2">
				</i-tooltip>
				录入到账
			</span>
			<span v-if="getAuth(isOwn,441,449)" class="g-red-btn-line g-m-r-5" @click="handleOrder">
				<i-tooltip 
					v-if="coinConfig.tip_7_1" 
					:content="coinConfig.tip_7_1"
					transfer 
					placement="top" 
					max-width="220"
				>
					<img :src="OSS_PROP_ICON2">
				</i-tooltip>
				下单
			</span>
			<i-dropdown v-if="hasMore" style="position: relative;top: 1px;">
				<span class="g-red-btn-line g-m-r-5">
					更多
					<i class="iconfont icon-down g-pointer"/>
				</span>
				<i-dropdown-menu slot="list">
					<i-dropdown-item v-if="getAuth(isOwn,444,452)">
						<div style="text-align:center" @click="handleAddTag">添加标签</div>
					</i-dropdown-item>

					<i-dropdown-item v-if="getAuth(isOwn,445,453)">
						<div style="text-align:center" @click="handleDistribute">指派</div>
					</i-dropdown-item>
					<i-dropdown-item v-if="getAuth(isOwn,442,443)">
						<div style="text-align:center" @click="handleRelateCompany">关联公司</div>
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</div>
		<i-spin v-if="spin" fix/>
	</div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem, Poptip, Button, Spin, Tooltip } from "iview";
import { debounce } from 'lodash';
import { CustomerDetail } from "@components/sale/_common/customer/popup";
import { UpdateCustonmer } from '@components/sale/_common/customer/update-customer';
import API from '@stores/apis/root';
import { getHashUrl } from '@utils/utils';
import { OSS_PROP_ICON2 } from '@constants/constants';
import { services } from '@stores/services/sale';
import { Confirm } from '@common/confirm/confirm';

import { PayLeft } from "../_common/customer/pay-left";
import { ApplyLeftRefund } from "../_common/customer/apply-left-refund";
import { AddTag } from "../_common/customer/add-tag";
import { Distribute } from "../_common/customer/distribute";
import { ChooseStaff } from "../_common/customer/choose-staff";
import { getAuth } from '../_common/util';
import { RelateApply } from '../customer-deal-relation/popup/relate-apply';

export default {
	name: 'oa-filter',
	components: {
		'i-button': Button,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'i-spin': Spin,
		'i-tooltip': Tooltip
	},
	mixins: [services.coinConfig()],
	data() {

		return {
			OSS_PROP_ICON2,
			headData: {
				contract_company_id: '', // 合同公司ID
				customer_name: "", // 客户姓名
				phone: "", // 客户手机号
				contract_company_name: "", // 合同公司名称
				customer_id: '',
				our_company_id: '',
				our_company_name: [], // 我方合同公司
				deal_time: "",
				invite_staff_id: '',
				invite_staff_name: "", // 邀约人
				total_balance_amount: "", // 可用余额
				deal_status: 1,
				label: [{ label_id: '', label_name: "" }],
				is_update: 0,
				is_own: undefined
			},
			spin: true

		};
	},
	computed: {
		isOwn() {
			const isOwn = this.headData.is_own || this.$route.query.is_own;
			return isOwn == '1';
		},
		hasMore() {
			return (this.getAuth(this.isOwn, 444, 452) || this.getAuth(this.isOwn, 445, 453)) || getAuth(isOwn, 442, 443);
		}
	},
	beforeCreate() {
		this.Button = Button;
		this.getAuth = getAuth;
	},
	created() {
		this.loadHead();
		this.$vc.on('SALE_CUSTOMER_PAY_LEFT', this.loadHead);

	},
	beforeDestroy() {
		this.$vc.off('SALE_CUSTOMER_PAY_LEFT', this.loadHead);
	},
	methods: {
		loadHead() {
			this.$request({
				url: API._SALE_SALE_DEAL_CUSTOMER_DETAIL_GET,
				type: "GET",
				loading: false,
				param: {
					contract_company_id: this.$route.query.contract_company_id
				}
			}).then(res => {
				this.headData = res.data;
				this.spin = false;
			}).catch(res => {
				this.spin = false;
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		async handleAddPayment() {
			if (!this.$global.staff.is_charge
				&& !this.headData.is_update
				&& this.headData.contract_company_name.length >= 6) {
				let ok = await Confirm.popup({
					msg: '请先更新' + this.headData.contract_company_name + '的资料信息，再进行录账操作',
					okText: '确定并去更新'
				}).then(() => 1).catch(e => e && console.error(e));
				if (ok) {
					ok = await UpdateCustonmer.popup({
						companyName: this.headData.contract_company_name,
						customerId: this.headData.customer_id,
						type: 3, // 客户类型 1 意向客户 2 公海 3 成交客户

					}).then(() => 1).catch(e => e && console.error(e));
				}
				if (!ok) return;
			}

			this.$router.push(
				getHashUrl("/sale/customer/deal/arrive/record", {
					customer_id: this.headData.customer_id,
					staff_id: this.headData.invite_staff_id,
					staff_name: this.headData.invite_staff_name.split('(')[0],
					deal_status: 1, // 这个deal_status的意义和后端的deal_status不同，他代表这个公司是否已成交 1 是已成交 2是未成交
					contract_company_id: this.headData.contract_company_id,
					// company_name: this.headData.contract_company_name, // 从成交客户里录入到账不显示公司名称
					customer_name: this.headData.customer_name,
					action: 'add'
				})

			);
		},
		handleOrder() {
			this.$router.push(
				getHashUrl(
					"/sale/customer/deal/contract/order",
					{
						 customer_id: this.headData.customer_id,
						 contract_company_id: this.headData.contract_company_id,
						  action: 'add'
					}
				)
			);

		},
		handleApplyLeftRefund() {
			ApplyLeftRefund.popup({
				data: {
					title: "余额退款",
					contract_company_id: this.headData.contract_company_id
				}
			}).catch((res => { }));

		},
		handlePayLeft() {
			PayLeft.popup({
				data: {
					contract_company_id: this.headData.contract_company_id,
					chooseContract: true,
					action: 'add'
				}
			}).catch(res => { });
		},
		handleAddTag() {
			AddTag.popup({
				data: {
					curTags: this.headData.label,
					contract_company_id: this.headData.contract_company_id
				}
			}).then(() => {
				this.loadHead();
			}).catch(() => { });
		},
		handleDistribute() {
			Distribute.popup({
				customerIds: [this.headData.customer_id],
				contractCompanyId: this.headData.contract_company_id,
				distributeCompany: true,

			}).then(() => {
				// 进行指派
				this.$router.go(-1);
			}).catch(() => {
			});
			// ChooseStaff.popup({
			// 	customer_ids: [this.headData.customer_id],
			// 	contract_company_id: this.headData.contract_company_id,
			// 	distributeCompany: true,
			// 	type: "distribute",
			// 	title: "选择指派人"

			// }).then(() => {
			// 	// 进行指派
			// 	this.$router.go(-1);
			// }).catch(() => {
			// });
		},
		handleOpenDetail() {
			CustomerDetail.popup({
				read: true,
				data: {
					...this.headData,
					is_own: this.isOwn,
					readOnly: true,
					// 成交客户的合同公司已经成交了不需要指派也没有删除等操作，只能录入到账
					hideOption: true,
				},
				readOnly: false,
				showContacts: true,
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleRelateCompany() {
			RelateApply.popup({
				data: {
					title: "关联公司申请",
					action: 'add',
					contract_company_name: this.headData.contract_company_name,
					contract_company_id: this.headData.contract_company_id
				}
			}).catch(err => err && console.error(err));

		}
	}
};

</script>

<style lang="scss" >
.v-customer-deal-deal-detail-head {
    box-shadow: 0px 0px 5px 2px #eee;
	position: relative;
    padding: 20px 20px ;
    ._label {
        display: inline-block;
        width: 250px;
        margin-top: 10px;
    }
}
</style>
