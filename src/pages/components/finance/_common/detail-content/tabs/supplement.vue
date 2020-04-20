<template>
	<div class="v-finance-tab">
		<oa-steps 
			v-if="spin"
			:type="1"
			:data-source="data"
			:render-title="renderTitle"
			:render-content="renderContent"
		/>
		<!-- <i-timeline v-if="spin">
			<i-timeline-item v-for="(item, index) of data" :key="item.supply_id" color="red">
				<p>
					<span>{{ item.create_time }}</span>
					<span v-if="index === data.length -1">
						<span>下单</span>
						<span class="g-m-l-10">下单人:</span>
						<span class="g-m-l-10">{{ item.staff_name }}</span>
					</span>
				</p>
				<p v-for="(info, index) of item.detail" :key="index">
					<span>{{ info.product_name }}</span>
					<span class="g-m-l-10">{{ info.payment_amount }}</span>
				</p>
			</i-timeline-item>
		</i-timeline> -->
		<oa-loading v-else fix/>
	</div>
</template>

<script>
import { Timeline, TimelineItem, Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import Steps from '@components/_common/steps/steps';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'finance-detail-tabs-supplement',
	components: {
		'oa-steps': Steps,
		'oa-loading': Loading
	},
	props: {
		contractId: Number,
		show: Boolean
	},
	data() {
		return {
			data: [],
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
		renderTitle(h, param = {}) {
			const { create_time, staff_name, index, supply_id } = param.rows;
			const data = param.rows;
			return (
				<div class="g-fs-14 g-c-black2 g-m-l-10 g-nobreak">
					{	supply_id ? <span>
						<span class="g-c-black4 g-fs-12">{ data.create_time }</span>
						{
							data.type == 2 ? (
								<span class="g-c-black1 g-fs-14 ">
									<span class="g-pd-lr-20">
									下单
									</span>
									<span class="g-pd-r-10">实付金额：{ data.payment_amount } </span>
									<span>
										{ data.staff_name }
									</span>
								</span>
							) : (
								<span class="g-c-black1 g-fs-14 ">
									<span class="g-pd-lr-20">
										补款
									</span>
									<span class="g-pd-r-10">补款金额：{ data.payment_amount } </span>
								</span>
							)
						}
					</span>
						
						// <span>
						// 	<span class="g-c-black4 g-fs-12">{create_time}</span>
						// 	{
						// 		(index === this.data.length - 1) && <span>
						// 			<span class="g-m-l-10">下单</span>
						// 			<span class="g-m-l-10">下单人:</span>
						// 			<span class="g-m-l-10">{staff_name}</span>
						// 		</span>
						// 	}
						// </span> 
						: <span class="g-c-black4 g-fs-12">暂无补款记录</span>
					}
				</div>
			);
		},
		renderContent(h, param = {}) {
			const { detail, type, supply_id, payment_amount } = param.rows;
			return (
				<div class="g-c-black2 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak">
					{
						supply_id && detail.map(item => {
							return (
								<div>
									{ '【' + item.product_name + '】'}
									<span class="g-m-l-10">实扣成本：{item.cost_amount}元</span>
								</div>
							);
						})
					}
				</div>
			);
		},
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_SUPPLEMENT_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId
				},
				loading: false
			}).then(res => {
				if (res.data.length === 1) {
					res.data.unshift({});
				}
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


