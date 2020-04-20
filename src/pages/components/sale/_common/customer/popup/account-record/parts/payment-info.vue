<template>
	<div class="v-sale-customer-info g-relative" style="min-height:260px;width:680px">
		<oa-loading v-if="loadingShow"/>
		
		<oa-info-block title="审核信息" >
			<oa-info-item :content="auditInfo.status_name" label="审核状态"/>
			<oa-info-item :content="auditInfo.audit_staff_name" label="审核人"/>
			<oa-info-item :content="auditInfo.audit_time" label="审核时间"/>
			<oa-info-item v-if="auditInfo.status>0" :content="auditInfo.audit_remark" :label="auditRemarkName[auditInfo.status]" tooltip/>
		</oa-info-block>
		<oa-info-block title="基本信息" >
			<oa-info-item :content="baseInfo.customer_name" label="客户姓名"/>
			<oa-info-item :content="baseInfo.phone" label="客户手机"/>
			<oa-info-item :content="baseInfo.our_company_name" label="我方合同公司" tooltip/>
			<oa-info-item :content="baseInfo.invite_staff_name" label="邀约人"/>
			<oa-info-item :content="baseInfo.staff_name" label="录入人"/>
			<oa-info-item :content="baseInfo.create_time" label="录入时间"/>
		</oa-info-block>
		<oa-info-block title="款项信息" >
			<oa-info-item :content="paymentInfo.payment_amount" content-class="g-c-red-mid" label="实付金额"/>
			<oa-info-item :content="paymentInfo.received_amount" content-class="g-c-red-mid" label="到账金额"/>
			<oa-info-item :content="paymentInfo.poundage" content-class="g-c-red-mid" label="手续费"/>
			<oa-info-item :content="paymentInfo.after_share_performance" content-class="g-c-red-mid" label="分单后业绩"/>
			<oa-info-item label="分单金额">
				<i-poptip v-if="showShareTooltip" transfer trigger="hover">
					<span class="g-operation">{{ paymentInfo.share_performance }}</span>
					<div slot="content" style="padding:0 4px">
						<div v-for="(percent) in paymentInfo.staff_share.filter(i=>!i.is_invite_staff)" :key="percent.staff_id+'staff'">
							{{ percent.staff_name }}
							：
							{{ percent.convert || percent.performance }} 元
						</div>
						<div v-for="(percent) in paymentInfo.depart_share" :key="percent.depart_id+'depart'">
							{{ percent.depart_name }}
							：
							{{ percent.performance }} 元
						</div>
						<div v-for="(percent,index) in paymentInfo.cooperation_share" :key="index">
							外部合作
							：
							{{ percent.performance }} 元
						</div>
					</div>
				</i-poptip>
				<span v-else class="g-c-black2">{{ paymentInfo.share_performance }}</span>
			</oa-info-item>
			<oa-info-item v-if="paymentInfo.refund_amount && +paymentInfo.refund_amount!=0" :content="paymentInfo.refund_amount" label="退款金额"/>
			<oa-info-item :content="paymentInfo.payment_label" label="款项标签"/>
			<oa-info-item :content="paymentInfo.original_time" label="原始时间"/>
			<oa-info-item :content="paymentInfo.received_company_name" label="收款公司" tooltip/>
			<oa-info-item :content="paymentInfo.remark" label="备注" tooltip />
				
		</oa-info-block>
		<oa-info-block
			v-for="(method,index) in payMethods"
			:key="index"
			:data="method"
			:notitle="index>0"
			title="缴款方式"
		>
			<div slot="head" class="g-m-t-10 g-m-l-10">
				{{ method.method_name + (method.item_name ? ('--' + method.item_name) : '') }}
			</div>
			<oa-info-item :content="method.payment_time" label="付款时间"/>
			<oa-info-item :content="method.payment_amount" label="付款金额"/>
			<oa-info-item :content="method.image_url" type="imgs" label="凭证"/>
			<oa-info-item :content="method.poundage" label="手续费"/>
			<!-- <oa-info-item v-if="index==(payMethods.length-1)" :content="baseInfo.remark" label="备注"/> -->
		</oa-info-block>
		<oa-product-info 
			v-if="make_product_info.has_payment" 
			:products="make_product_info.product" 
			:payment-id="paymentId" 
			:disabled="money_change"
			:show-option="getAuth(isOwn,834,835)"
		/>
	</div>
</template>
<script>
import { Poptip } from "iview";
import { debounce } from 'lodash';
import LimitWords from '@common/limit-words/limit-words';
import API from '@stores/apis/root';
import Loading from '@components/_common/loading/loading';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { getHashUrl } from '@utils/utils';
import ProductInfo from '../../components/product-info';
import { getAuth, setData } from '../../../../util';
import InfoItem from "../../../../info-item";
import InfoBlock from '../../../../info-block';
import Record from '../../../../record';

export default {
	name: 'oa-',
	components: {
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'oa-product-info': ProductInfo,
		'i-poptip': Poptip,
		"oa-auto-tooltip": AutoToolTip

	},
	props: {
		paymentId: Number,
		isOwn: Boolean

	},
	data() {
		return {
			loadingShow: false,
			dealStatus: '1',
			contract_company_name: '',
			auditRemarkName: {
				1: "通过说明",
				2: "驳回说明"
			},
			auditInfo: { // 审核信息
				status: 0,
				status_name: '',
				audit_staff_name: '',
				audit_time: '',
				audit_remark: ''
			},
			baseInfo: { // 基本信息
				contract_company_id: '',
				customer_name: '',
				our_company_name: '',
				staff_name: '',
				phone: '',
				invite_staff_name: '',
				create_time: '',


			},
			paymentInfo: { // 款项信息
				is_share: 0,
				refund_amount: '',
				payment_type: [],
				payment_amount: '',
				poundage: '',
				original_time: '',
				received_amount: '',
				share_performance: '',
				after_share_performance: '',
				received_company_name: '',
				staff_share: [],
				depart_share: [],
				cooperation_share: [],
				payment_label: '', //  {label_id:1,label_name:'222'}
				remark: '',
				rest_amount: '0.00',


			},
			payMethods: [],
			records: [],
			money_change: 1,
			make_product_info: {
				payment_id: "",
				has_payment: 0, // 是否有到账记录
				product: [
					// {
					// 	"product_name": "微商城",
					// 	"product_id": "9",
					// 	"make_depart_name": "平台制作部",
					// 	"staff_name": "超管"
					// }
				]
			},
		};
	},
	computed: {
		showShareTooltip() {
			return (this.paymentInfo.staff_share.filter(i => !i.is_invite_staff).length 
			|| this.paymentInfo.depart_share.length || this.paymentInfo.cooperation_share.length);
		}

	},

	watch: {
		paymentId() {
			this.loadData();

		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadingShow = true;
			this.$request({
				url: '_SALE_PAYMENT_DETAIL_GET',
				type: "GET",
				loading: false,
				param: {
					payment_id: this.paymentId,
				}
			}).then(res => {
				const { audit_info, base_info, payment_info, make_product_info = {}, money_change } = res.data;
				this.dealStatus = base_info.deal_status;
				this.contract_company_name = base_info.contract_company_name;
				this.$emit('company-name-change', this.contract_company_name);
				this.auditInfo = audit_info;
				this.baseInfo = base_info;
				if (payment_info.is_share && payment_info.share_type == 1) {
					let payment_amount = parseFloat(payment_info.payment_amount);
					payment_info.staff_share.forEach(i => {
						i.performance = (payment_amount * parseFloat(i.performance) / 100).toFixed(2);
					});
				}
				this.paymentInfo = payment_info;
				this.paymentInfo.payment_label = (payment_info.payment_label && payment_info.payment_label.map(i => i.label_name).join('、')) || '';
				this.payMethods = payment_info.payment_method;
				setData(this.make_product_info, make_product_info);
				this.money_change = money_change;
				this.loadingShow = false;
				this.$emit('rest-amount-change', this.paymentInfo.rest_amount);
			}).catch(res => {
				this.loadingShow = false;
				console.error(res);
			});
		}
	}
};
</script>
<style lang="scss">
</style>