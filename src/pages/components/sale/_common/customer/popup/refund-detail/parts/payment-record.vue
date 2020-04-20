<template>
	<div class="v-sale-refund-payment-record g-relative" style="min-height:260px;width:680px">
		<oa-loading v-if="loading"/>
		<oa-expand-panel v-for="(record,index) in paymentRecord" :key="index" :border="false" class="g-relative" >
			<span slot="header" class="g-pd-l-10">{{ record.top_audit_time }}</span>
			
			<div class="g-flex g-pd-b-25 g-pd-l-30 g-pd-t-15" style="flex-wrap:wrap">
				<oa-info-item :content="record.deal_month" label="成交月份"/>
				<oa-info-item :content="record.actual_month" label="业绩归属"/>
				<oa-info-item :content="record.payment_amount" label="实付金额"/>
				<oa-info-item :content="record.received_amount" label="到账金额"/>
				<oa-info-item :content="record.poundage" label="手续费"/>
				<oa-info-item :content="record.after_share_performance" label="分单后业绩"/>
				<oa-info-item :content="record.share_performance" label="分单金额">
					<i-poptip v-if="record.is_share" transfer trigger="hover">
						<span class="g-operation">{{ record.share_performance }}</span>
						<div slot="content" style="padding:0 4px">
							<div v-for="(percent) in record.staff_share.filter(i=>!i.is_invite_staff)" :key="percent.staff_id+'staff'">
								{{ percent.staff_name }}
								：
								{{ percent.performance }}
								{{ percent.share_type==1?' %' : ' 元' }}
							</div>
							<div v-for="(percent) in record.depart_share" :key="percent.depart_id+'depart'">
								{{ percent.depart_name }}
								：
								{{ percent.performance }} 元
							</div>
							<div v-for="(percent,index) in record.cooperation_share" :key="index">
								外部合作
								：
								{{ percent.performance }} 元
							</div>
						</div>
					</i-poptip>
					<span v-else class="g-c-black2">{{ record.share_performance }}</span>
				</oa-info-item>
				
				<oa-info-item :content="record.payment_label" label="款项标签"/>
				<oa-info-item :content="record.original_time" label="原始时间"/>
				<oa-info-item :content="record.payment_time" label="付款时间"/>
				<oa-info-item :content="record.create_time" label="录入时间"/>
				<oa-info-item :content="record.audit_time" label="审核时间"/>
				<oa-info-item :content="record.remark" type="remark" label="备注"/>
			</div>
			<div class="_product-label">
				<oa-product-label :color-id="record.use_status" :name="record.use_status_name" />
			</div>
		</oa-expand-panel>
	</div>
</template>
<script>
import { Input, Button, Poptip } from 'iview';
import Loading from '@components/_common/loading/loading';
import ExpandPanel from '@common/expand-panel/expand-panel';
import ProductLabel from '@common/product-label/product-label';
import InfoItem from '../../../../info-item';

export default {
	name: 'oa-payment-record',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-loading': Loading,
		'oa-info-item': InfoItem,
		'oa-expand-panel': ExpandPanel,
		'oa-product-label': ProductLabel
	},
	props: {
		contractCompanyId: Number
	},
	data() {
		return {
			loading: false,
			paymentRecord: []
		};
	},
	watch: {
		contractCompanyId() {
			this.loadData();
		}

	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loading = true;
			this.$request({
				url: "_SALE_CUSTOMER_COMPANY_PAYMENT_LIST",
				type: "GET",
				param: {
					contract_company_id: this.contractCompanyId
				},
				loading: false,
			}).then(async res => {
				const paymentRecord = res.data.data || [];
				paymentRecord.forEach(record => {
					record.payment_time = record.payment_method.map(method => method.payment_time).join('/');
					record.payment_label = record.payment_label.map(label => label.label_name).join('、');
				});
				// this.paymentRecord = paymentRecord;
				for (let i = 0; i < paymentRecord.length; i++) {
					// eslint-disable-next-line no-await-in-loop
					const data = await this.loadPaymentShare(paymentRecord[i].payment_id);
					paymentRecord[i] = { ...paymentRecord[i], ...data };
				}
				this.paymentRecord = [...paymentRecord];
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});
		},
		loadPaymentShare(payment_id) {
			return this.$request({
				url: "_SALE_PAYMET_PAYMENT_SHARE_GET",
				type: "GET",
				param: {
					payment_id
				},
				loading: false,
			}).then(res => {
				return res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
				return {};
			});
		}


	}
};
</script>
<style lang="scss">

.v-sale-refund-payment-record {
	.c-components-common-expand-panel {
		.v-sale-customer-info-item {
			width: 280px;
			._value {
				width:180px;
			}

		}

	}
}

</style>