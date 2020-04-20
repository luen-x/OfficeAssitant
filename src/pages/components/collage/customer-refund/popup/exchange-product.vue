<template>
	<div class="v-collage-refund-exchange-product">
		<div v-if="spin">
			<div class="g-flex g-flex-cc">
				<oa-across-table :data="refund_data.audit_schedule"/>
			</div>

			<div
				v-for="(item,index) in refund_data.audit_info"
				:key="index"
				class="g-m-t-30"
			>
				<span 
					class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					{{ item.audit_depart_name }}
				</span>

				<div class="g-m-l-15 g-m-t-15">
					<oa-detail-item 
						:content="item.audit_staff_name"
						label="审核人"
					/>
					<oa-detail-item
						:content="item.audit_time" 
						label="审核时间"
					/>
					<oa-detail-item
						v-if="type != 1"
						:content="item.audit_remark" 
						:label="type == 3 && item.status == 3 ? '驳回原因' : '通过说明'"
						class="g-m-t-15"
					/>
				</div>
			</div>

			<div class="g-m-t-30">
				<span 
					class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					退款信息
				</span>

				<div class="g-m-l-15 g-m-t-15">
					<oa-detail-item 
						:content="refund_data.refund_info.refund_names"
						label="被换产品"
					/>
					<oa-detail-item
						:content="refund_data.refund_info.real_refund_amount" 
						label="退款金额"
					/>
					<oa-detail-item
						:content="refund_data.refund_info.product_names" 
						label="换后产品"
						class="g-m-t-15"
					/>
					<oa-detail-item
						:content="refund_data.refund_info.remark" 
						label="退款理由"
						class="g-m-t-15"
					/>
					<oa-detail-item
						:content="refund_data.refund_info.staff_name" 
						label="申请人"
						class="g-m-t-15"
					/>
					<oa-detail-item
						:content="refund_data.refund_info.create_time"
						label="申请时间"
						class="g-m-t-15"
					/>
				</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { DetailItem, Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import AcrossTable from "@components/_common/across-table/across-table";

export default {
	name: "collage-refund-exchange-product",

	components: {
		"oa-title": Title,
		"oa-detail-item": DetailItem,
		"oa-across-table": AcrossTable
	},

	props: {
		refund_id: Number,
		type: String
	},

	data() {
		return {
			refund_data: {},
			spin: false
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: "_SALE_REFUND_INFO_GET",
				type: "GET",
				param: {
					refund_id: this.refund_id
				},
				loading: false
			}).then(res => {
				this.refund_data = res.data;
				let arr = [];
				let brr = [];
				this.refund_data.refund_info.after_product.forEach(item => {
					arr.push(item.product_name);
				});
				this.refund_data.refund_info.product_names = arr.join("、");
				this.refund_data.refund_info.refund_project.forEach(item => {
					brr.push(item.product_name);
				});
				this.refund_data.refund_info.refund_names = brr.join("、");
				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-refund-exchange-product {
    padding-left: 20px;
	min-height: 300px;
	padding-bottom: 100px;
}
</style>