<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<oa-across-table :data="data.audit_schedule" />
			<oa-title 
				v-for="(item, index) of data.project" 
				:key="index" 
				:show-type="true" 
				type="expand"
				class="g-m-b-10">
				<template slot="title">
					<span class="g-fs-14">{{ item.product_name }}</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25 g-relative">
					<img :src="auditIcon[item.status]" class="_audit-img">
					<!-- <oa-detail-item 
						v-if="item.refund_amount" 
						:content="item.refund_amount" 
						label="退款金额">{{ item.refund_amount }}</oa-detail-item> -->
					<oa-detail-item :content="item.audit_staff_name" label="审核人">{{ item.audit_staff_name }}</oa-detail-item>
					<oa-detail-item :content="item.audit_time" label="审核时间">{{ item.audit_time }}</oa-detail-item>
					<oa-detail-item 
						v-if="item.status !== 1"
						:content="item.audit_remark" 
						:label="item.remark_explain" 
						class="g-m-t-15">{{ item.audit_remark }}</oa-detail-item>
				</div>
			</oa-title>
			<oa-title v-if="1" :show-type="true" type="expand" class="g-m-b-10">
				<template slot="title">
					<span class="g-fs-14">财务审核</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item 
						:content="data.audit_staff_name" 
						label="审核人">{{ data.audit_staff_name }}</oa-detail-item>
					<oa-detail-item 
						:content="data.audit_time" 
						label="审核时间">{{ data.audit_time }}</oa-detail-item>
					<oa-detail-item
						v-if="data.status !== 0"
						:content=" data.audit_remark" 
						:label="data.status === 2 ? '驳回原因' : '通过说明'"
						class="g-m-t-15" 
					>
						{{ data.audit_remark }}
					</oa-detail-item>
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
import { OSS_REJECT, OSS_PASS, OSS_WAIT_CONFIRM, OSS_ACTIVE } from "@constants/constants";
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
		'oa-across-table': AcrossTable
	},
	props: {
		label: String,
		contractId: Number,
		show: Boolean
	},
	data() {
		return {
			data: {
				refund_info: {},
				audit_schedule: [],
				audit_info: [],
				finance_audit: {}
			},
			auditIcon: {
				1: OSS_WAIT_CONFIRM,
				2: OSS_PASS,
				3: OSS_PASS,
				4: OSS_PASS,
				5: OSS_REJECT,
				6: OSS_PASS
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
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_AUDIT_GET,
				type: 'GET',
				param: {
					contract_id: this.contractId
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				const { audit_schedule = [] } = res.data;
				let current;
				audit_schedule.forEach((item, index) => {
					// item.content = item.create_time;
					item.status += 1;
				});
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
.v-finance-tab {
	._audit-img {
		width: 80px;
		height: 80px;
		position: absolute;
		right: 0;
		top: 35px;
	}
}
</style>