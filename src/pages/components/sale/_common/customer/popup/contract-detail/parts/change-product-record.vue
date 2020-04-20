<template>
	<div class="v-sale-customer-change-product g-pd-b-20 g-relative" style="min-height:260px;width:680px">
		<oa-loading v-if="loading"/>
		<div v-if="!projects.after_contract.length" class="g-flex g-flex-cc g-pd-t-30">暂无更换记录</div>
		<div v-for="(project,index) in projects.after_contract" :key="index" class="g-pd-l-10 g-m-t-20">
			<oa-sale-expand expand>
				<span slot="toggle" class="g-fs-12 g-m-t-10 g-c-black1">{{ project.create_time }}</span>
				<span slot="extra" class="g-operation g-m-l-20" @click="handleViewDetail(project)">查看详情</span>
				<div class="g-fs-12 g-m-t-10 g-c-black1" style="margin-bottom:-10px">换前产品：{{ project.before_product_name }}</div>
				<div v-for="(_project,index) in project.project" :key="index" class="g-flex g-fw-w" style="width:910px">
					<oa-info-item :content="_project.product_name" label="换后产品"/>
					<oa-info-item :content="_project.need_amount" label="应付金额"/>
					<oa-info-item :content="_project.cost_amount" label="实扣成本"/>
					<oa-info-item v-if="_project.sku.length" :content="_project.sku.sku_name" :label="_project.sku.sku_label"/>
					<oa-info-item :content="_project.payment_amount" label="实付金额" />
				</div>
			</oa-sale-expand>
		</div>
	</div>
</template>
<script >
import Loading from '@components/_common/loading/loading';
import { Poptip } from 'iview';
import InfoItem from '../../../../info-item';
import SaleExpand from '../../../../expand';

export default {
	name: "oa-sale-customer-change-product",
	components: {
		'oa-info-item': InfoItem,
		'oa-sale-expand': SaleExpand,
		'oa-loading': Loading
	},
	props: {
		contractId: Number
	},
	data() {
		return {
			loading: false,
			projects: {
				before_project: [],
				after_contract: []
			}
		};
	},
	watch: {
		contractId() {
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
				url: "_SALE_PROJECT_CAHNGE_RECORD_GET",
				type: "GET",
				param: {
					contract_id: this.contractId
				},
				loading: false,
			}).then(res => {
				this.loading = false;
				this.projects = res.data;
			}).catch((res) => {
				this.loading = false;
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		handleViewDetail(product) {
			window.open('http://' + location.host + '/sale/customer/deal/contract?contract_num=' + product.contract_num);
		}
	}
};
</script>
<style lang="scss">
</style>