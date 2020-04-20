<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<!-- <oa-across-table 
				v-if="refundType === 2"
				:data="data.audit_schedule" /> -->
			<oa-across-table 
				:data="data.audit_schedule"
			/>
			<oa-title v-for="(item, index) of data.audit_info" :key="index" class="g-m-b-30">
				<template slot="title">
					<span class="g-fs-14">{{ data.audit_info.length !== 1 ? item.audit_depart_name : '审核信息' }}</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item :content="item.audit_staff_name" label="审核人">{{ item.audit_staff_name }}</oa-detail-item>
					<oa-detail-item :content="item.audit_time" label="审核时间">{{ item.audit_time }}</oa-detail-item>
					<oa-detail-item 
						v-if="item.status !== 1"
						:content="item.audit_remark" 
						:label=" item.status === 2 ? '通过说明' : '驳回原因'" 
						class="g-m-t-15">{{ item.audit_remark }}</oa-detail-item>
				</div>
			</oa-title>
			<oa-title class="g-m-b-30">
				<template slot="title">
					<span class="g-fs-14">退款信息</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-10">
					<oa-detail-item 
						v-if="refundType !== 3"
						:content="data.refund_info.refund_project" 
						:label="refundType === 1 ? '退款产品' : '被换产品'"
						class="g-m-t-15" 
					>
						<span 
							v-for="(info, index) of data.refund_info.refund_project"
							:key="info.product_id"
						>
							<span v-if="index">/</span>
							{{ info.product_name }}
						</span>
					</oa-detail-item>
					<oa-detail-item
						:content="data.refund_info.real_refund_amount" 
						class="g-m-t-15" 
						label="退款金额">
						<oa-money-tooltip
							:total="data.refund_info.real_refund_amount"
							:data="data.refund_info.real_refund_amount_detail"
						/>
					</oa-detail-item>
					<oa-detail-item 
						v-if="refundType === 2" 
						:content="data.refund_info.after_product.reduce((a, b) => (a.product_name + ',' + b.product_name))"
						class="g-m-t-15"  
						label="换后产品">
						<span 
							v-for="(info, index) of data.refund_info.after_product"
							:key="info.product_id"
						>
							<span v-if="index">/</span>
							{{ info.product_name }}
						</span>
					</oa-detail-item>
					<oa-detail-item 
						v-if="refundType === 3"
						:content="data.refund_info.refund_mode_name" 
						class="g-m-t-15" 
						label="退款种类">
						{{ data.refund_info.refund_mode_name }}
					</oa-detail-item>
					<oa-detail-item 
						:content="data.refund_info.refund_reason_str" 
						class="g-m-t-15" 
						label="退款原因">
						{{ data.refund_info.refund_reason_str }}
					</oa-detail-item>
					<oa-detail-item 
						:content="data.refund_info.remark" 
						class="g-m-t-15" 
						label="备注说明">{{ data.refund_info.remark }}</oa-detail-item>
					<oa-detail-item 
						:content="data.refund_info.staff_name" 
						class="g-m-t-15" 
						label="申请人">{{ data.refund_info.staff_name }}</oa-detail-item>
					<oa-detail-item 
						:content="data.refund_info.create_time" 
						class="g-m-t-15" 
						label="申请时间">{{ data.refund_info.create_time }}</oa-detail-item>
					<template v-if="type === '2'">
						<oa-detail-item 
							v-if="refundType !== 3"
							:content="data.refund_info.return_cost_amount" 
							class="g-m-t-15" 
							label="退还成本">
							<oa-money-tooltip
								:total="data.refund_info.return_cost_amount"
								:data="data.refund_info.return_cost_amount_detail"
							/>
						</oa-detail-item>
						<oa-detail-item 
							v-if="refundType === 3"
							:content="data.refund_info.minus_month" 
							class="g-m-t-15" 
							label="业绩扣除月份">{{ data.refund_info.minus_month }}</oa-detail-item>
						<oa-detail-item 
							v-if="refundType !== 3"
							:content="data.refund_info.minus_month" 
							class="g-m-t-15" 
							label="提成扣除月份">{{ data.refund_info.minus_month }}</oa-detail-item>
						<oa-detail-item 
							v-if="refundType !== 3"
							:content="data.refund_info.pro" 
							class="g-m-t-15" 
							label="促单业绩">
							<oa-money-tooltip
								:total="data.refund_info.pro"
								:data="data.refund_info.pro_detail"
								init-type="1"
							/>
						</oa-detail-item>
						<oa-detail-item 
							v-if="refundType !== 3"
							:content="data.refund_info.team_performance" 
							class="g-m-t-15" 
							label="团队业绩">
							<oa-money-tooltip
								:total="data.refund_info.team_performance"
								:data="data.refund_info.team_performance_detail"
								init-type="1"
							/>
						</oa-detail-item>
					</template>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix/>
	</div>
</template>

<script>
import { Steps, Step, Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import AcrossTable from '@components/_common/across-table/across-table.vue';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import API_ROOT from '@stores/apis/root';
import DetailItem from '../../detail-item';
import Title from '../../title';

export default {
	name: 'finance-detail-drawer-refundtype',
	components: {
		'oa-detail-item': DetailItem,
		'oa-title': Title,
		'i-steps': Steps,
		'i-steps-step': Step,
		'oa-loading': Loading,
		'oa-across-table': AcrossTable,
		'oa-money-tooltip': MoneyTooltip
	},
	props: {
		label: String,
		refundId: Number,
		show: Boolean,
		type: String,
		refundType: Number
	},
	data() {
		return {
			data: {
				refund_info: {},
				audit_schedule: [],
				audit_info: []
			},
			spin: true,
			isfetching: 0,
			current: 0,
			status: 'process'
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		refundId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	methods: {
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_REFUND_TYPE_INFO_GET,
				type: 'GET',
				param: {
					refund_id: this.refundId
				},
				loading: false
			}).then(res => {
				const { audit_schedule = [], refund_info } = res.data;
				if (refund_info.refund_reason && refund_info.refund_reason.length) {
					const arr = [];
					refund_info.refund_reason.forEach(item => {
						item.reason_list.forEach(it => {
							arr.push(item.reason_category_name + '-' + it.reason_name);
						});
					});
					refund_info.refund_reason_str = arr.join('、');
				} else refund_info.refund_reason_str = '';
				this.data = res.data;
				let current;
				audit_schedule.forEach((item, index) => {
					if (item.status === 2) {
						current = index + 1;
					}
				});
				if (audit_schedule[current] && audit_schedule[current].status === 3) {
					this.status = 'error';
				}
				
				this.current = current;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		},
	}
};
</script>

<style lang="scss">

</style>



