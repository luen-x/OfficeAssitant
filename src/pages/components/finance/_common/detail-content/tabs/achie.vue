<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<div v-if="data.length==0 " class="g-flex g-flex-cc g-fd-c g-m-t-20">
				<img :src="OSS_NO_MESSAGE05">
				<p>暂无到账记录</p>
			</div>
			<div class="g-m-b-20">
				<i-row v-if="data.length">
					<i-col span="8">
						<span class="g-c-black4">总打款金额：</span>
						<span class="g-c-black2">{{ account.total_payment }}</span>
					</i-col>
					<i-col span="8">
						<span class="g-c-black4">总退款金额：</span>
						<span class="g-c-black2">{{ account.total_refund }}</span>
					</i-col>
					<i-col span="8">
						<span class="g-c-black4">实际打款金额：</span>
						<span class="g-c-black2">{{ account.total_real_payment }}</span>
					</i-col>
				</i-row>
			</div>
			<oa-title 
				v-for="item of data" 
				:key="item.payment_id" 
				:show-type="true" 
				class="g-m-b-10" 
				type="expand">
				<template slot="title">
					<span class="g-fs-14">{{ item.top_audit_time }}</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25 g-relative">
					<div class="_sign">
						<oa-product-label 
							:color-id="item.use_status"
							:name="item.use_status_name"
						/>
					</div>
					<oa-detail-item :content="item.deal_month" label="成交月份">{{ item.deal_month }}</oa-detail-item>
					<oa-detail-item :content="item.actual_month" label="业绩归属">{{ item.actual_month }}</oa-detail-item>
					<oa-detail-item :content="item.payment_amount" label="实付金额">{{ item.payment_amount }}</oa-detail-item>
					<oa-detail-item 
						:content="item.received_amount" 
						class="g-m-t-15" 
						label="到账金额">{{ item.received_amount }}</oa-detail-item>
					<oa-detail-item :content="item.poundage" class="g-m-t-15" label="手续费">{{ item.poundage }}</oa-detail-item>
					<oa-detail-item 
						label="分单金额"
						class="g-m-t-15" >
						<i-poptip v-if="handlePerformance(item)" trigger="hover">
							<span class="g-operation">{{ item.share_performance !== '' ? item.share_performance : '--' }}</span>
							<div slot="content">
								<p v-for="(data, index) of item.staff_share.filter(item => item.is_invite_staff !== 1)" :key="index">
									<span v-if="data.share_type === 2">{{ data.staff_name }}： {{ data.performance }}</span>
									<span v-else>{{ data.staff_name }}： {{ data.performance/100 * item.payment_amount }}</span>
								</p>
								<p v-for="(data, index) of item.depart_share" :key="index">
									{{ data.depart_name }}： {{ data.performance }}
								</p>
								<p v-for="(data, index) of item.cooperation_share" :key="index">
									{{ data.cooperation_name }}：{{ data.performance }}
								</p>
							</div>
						</i-poptip>	
						<span v-else class="g-operation">
							{{ item.share_performance !== '' ? item.share_performance : '--' }}
						</span>
					</oa-detail-item> 
					<oa-detail-item 
						:content="item.payment_label" 
						class="g-m-t-15" 
						label="款项标签">
						<span 
							v-for="(info, index) of item.payment_label" 
							:key="info.label_id">
							<span v-if="index">、</span>
							{{ info.label_name }}
						</span>
					</oa-detail-item>
					<oa-detail-item 
						:content="item.after_share_performance" 
						class="g-m-t-15" 
						label="分单后业绩">{{ item.after_share_performance }}</oa-detail-item>
					<oa-detail-item 
						:content="item.original_time"
						class="g-m-t-15" 
						label="原始时间">
						{{ item.original_time }}
					</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="付款时间">
						<span v-for="(info, i) of item.payment_method" :key="i + '1'">
							<span v-if="i">/</span>
							{{ info.payment_time }}
						</span>
					</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="录入时间">
						{{ item.create_time }}
					</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="审核时间">
						{{ item.audit_time }}
					</oa-detail-item>
					<oa-detail-item 
						:content="item.remark"
						label="备注" 
						class="g-m-t-15"
					>
						{{ item.remark }}
					</oa-detail-item>
					<div v-if="name === 'payment'">
						<div v-for="info of item.payment_method" :key="info.method_id" class="g-m-t-20">
							<p class="g-m-tb-20" style="color: #333;">
								{{ info.method_name }}
								<template v-if="info.item_name">-- {{ info.item_name }}</template>
							</p>
							<div class="g-fw-w">
								<oa-detail-item :content="info.payment_time" label="付款时间">{{ info.payment_time }}</oa-detail-item>
								<oa-detail-item :content="info.payment_amount" label="付款金额">{{ info.payment_amount }}</oa-detail-item>
								<oa-detail-item :content="info.poundage" class="g-m-t-15" label="手续费">{{ info.poundage }}</oa-detail-item>
								<oa-detail-item :content="info.image_url" class="g-m-t-15" label="凭证">
									<oa-upload 
										v-if="spin"
										:data-source="info.image_url.map(item => ({ type: '.png', url: item }))"
										:show-title="false"
										disabled 
									/>
								</oa-detail-item>
							</div>
						</div>
					</div>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix/>
	</div>
</template>

<script>
import { Spin, Poptip, Row, Col } from 'iview';
import { debounce } from 'lodash';
import { ImgsPreview } from 'wya-vc';
import Upload from '@components/_common/upload/upload';
import { OSS_NO_MESSAGE05 } from "@constants/constants";
import ProductLabel from '@components/_common/product-label/product-label';
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import DetailItem from '../../detail-item';
import Title from '../../title';

const auditRemarkName = {
	1: "通过说明",
	2: "驳回说明"
};
export default {
	name: 'finance-detail-drawer-achi',
	components: {
		'oa-detail-item': DetailItem,
		'oa-title': Title,
		'oa-loading': Loading,
		'i-poptip': Poptip,
		'i-row': Row,
		'i-col': Col,
		'oa-upload': Upload,
		'oa-product-label': ProductLabel,
		'vc-imgs-preview': ImgsPreview
	},
	props: {
		companyId: Number,
		show: Boolean,
		paymentId: Number,
		name: String,
		contractId: Number
	},
	data() {
		return {
			data: {
			},
			account: {},
			auditRemarkName,
			spin: true,
			isfetching: 0,
			OSS_NO_MESSAGE05
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching == 0 && this.loadData();
		},
		paymentId() {
			this.loadData();
		},
		companyId() {
			this.loadData();
		},
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	mounted() {
		this.$vc.on('remain-refresh', (res) => {
			this.loadData();
		});
	},
	beforeDestroy() {
		this.$vc.off('remain-refresh');
	},
	methods: {
		loadData: debounce(async function () { 
			this.spin = false;
			this.isfetching = 1;
			let arr = await this.loadInfo();
			let que = [];
			arr.data.forEach(item => {
				que.push(this.loadRefresh(item.payment_id));
			});
			Promise.all(que).then(res => {
				let handleArr = arr.data.map((item, i) => {
					if (res[i].refund_amount) {
						item = {
							...item,
							...res[i],
							staff_share: res[i].staff_share && res[i].staff_share.map(info => {
								info.share_type = 2;
								return info;
							})
						};
					}
					return item;
				});
				this.spin = true;
				this.account = arr.account;
				this.data = handleArr;
			});
		}, 50),
		handlePerformance(item) {
			let filterStaff = item.staff_share.filter(info => info.is_invite_staff !== 1);
			return item.depart_share.length || filterStaff.length || item.cooperation_share.length;
		},
		loadRefresh(payment_id) {
			return this.$request({
				url: '_FINANCE_CUSTOMER_PAYMENT_SHARE_GET',
				type: 'GET',
				param: {
					payment_id,
				},
				loading: false
			}).then(res => {
				// this.data = res.data;
				return res.data;
			}).catch(err => {
				this.spin = true;
				this.$Message.error(err.msg);
			});
		},
		loadInfo() {
			return this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_REFUND_RECEIVE_GET,
				type: 'GET',
				param: {
					contract_company_id: this.companyId,
					payment_id: this.paymentId,
					contract_id: this.contractId
				},
				loading: false
			}).then(res => {
				return res.data;
			}).catch(err => {
				this.spin = true;
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-finance-tab {
	._sign {
		position: absolute;
		right: -20px;
		top: 20px;
	}
}
</style>



