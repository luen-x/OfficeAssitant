<template>
	<div v-show="show">
		<div v-if="spin">
			<oa-title v-for="(item,index) of data" :key="index" class="g-m-b-30">
				<template slot="title">
					<span class="g-fs-14">{{ item.type === 2 ? '下单' : '补款' }}</span>
					<span class="g-m-l-20">{{ item.create_time }}</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item :content="item.payment_amount" label="实付金额">{{ item.payment_amount }}</oa-detail-item>
					<oa-detail-item :content="item.total_cost_amount" label="扣除成本">{{ item.total_cost_amount }}</oa-detail-item>
					<oa-detail-item 
						:content="item.commission_performance" 
						class="g-m-t-15" 
						label="提成业绩">{{ item.commission_performance }}</oa-detail-item>
					<oa-detail-item 
						:content="item.total_service_amount" 
						class="g-m-t-15" 
						label="服务提成">{{ item.total_service_amount }}</oa-detail-item>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix/>
	</div>	
</template>

<script>
import { Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import DetailItem from '../../detail-item';
import Title from '../../title';

export default {
	name: 'finance-detail-drawer-info',
	components: {
		'oa-detail-item': DetailItem,
		'oa-title': Title,
		'oa-loading': Loading
	},
	props: {
		contractId: Number,
		show: Boolean
	},
	data() {
		return {
			data: [{

			}, {

			}],
			spin: true,
			isfetching: 0
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
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
				url: API_ROOT._FINANCE_CUSTOMER_REFUND_MONEY_INFO_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">

</style>



