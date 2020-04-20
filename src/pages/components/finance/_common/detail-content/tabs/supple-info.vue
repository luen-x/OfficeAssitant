<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<oa-title class="g-m-b-30">
				<template slot="title">
					<span class="g-fs-14">财务审核</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item 
						:content="data.finance_audit.audit_staff_name" 
						label="审核人">{{ data.finance_audit.audit_staff_name }}</oa-detail-item>
					<oa-detail-item 
						:content="data.finance_audit.audit_time" 
						label="审核时间">{{ data.finance_audit.audit_time }}</oa-detail-item>
					<oa-detail-item
						v-if="type !== '1'"
						:content="data.finance_audit.audit_remark" 
						:label="data.finance_audit.status === 3 ? '驳回原因' : '通过说明'"
						class="g-m-t-15" 
					>
						{{ data.finance_audit.audit_remark }}
					</oa-detail-item>
				</div>
			</oa-title>
			<oa-title class="g-m-t-30">
				<template slot="title">款项信息</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item
						:content="data.supply_info.payment_amount"
						label="补款金额"
					>
						<oa-money-tooltip
							:total="data.supply_info.payment_amount"
							:data="data.supply_info.payment_amount_detail"
						/>
					</oa-detail-item>
					<oa-detail-item
						:content="data.supply_info.total_cost_amount"
						label="补交成本"
					>
						<oa-money-tooltip
							:total="data.supply_info.total_cost_amount"
							:data="data.supply_info.total_cost_amount_detail"
							type="cost"
						/>
					</oa-detail-item>
					<oa-detail-item
						:content="data.supply_info.commission_performance"
						label="提成业绩"
						class="g-m-t-15"
					>
						<oa-money-tooltip
							:total="data.supply_info.commission_performance"
							:data="data.supply_info.commission_performance_detail"
						/>
					</oa-detail-item>
					<oa-detail-item
						:content="data.supply_info.service_amount"
						label="服务提成"
						class="g-m-t-15"
					>
						<oa-money-tooltip
							:total="data.supply_info.service_amount"
							:data="data.supply_info.service_amount_detail"
						/>
					</oa-detail-item>
				</div>
			</oa-title>
			<oa-title class="g-m-t-30">
				<template slot="title">产品信息</template>
				<div slot="content">
					<div
						v-for="item of data.project_info" 
						:key="item.project_id" 
					>
						<template slot="title" class="g-flex g-ai-c g-m-t-20">
							<span class="g-fs-14">
								{{ item.product_name }}
							</span>
							<span 
								v-if="type === '1' || type === '2'"
								class="g-operation g-m-l-20"
							>
								<span @click="() => handleEditModal(item)">编辑成本</span>
							</span>
						</template>
						<div slot="content" class="g-fw-w g-pd-t-25">
							<oa-detail-item
								v-if="item.cost_amount != 0"
								:content="item.cost_amount"
								label="补交成本"
							>
								<oa-money-tooltip
									:total="item.cost_amount"
									:data="item.cost_amount_detail"
									type="cost"
								/>
							</oa-detail-item>
						</div>
					</div>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix />
	</div>
</template>

<script>
import { Spin, Timeline, TimelineItem, Divider } from 'iview';
import { ImgsPreview } from 'wya-vc';
import Loading from '@components/_common/loading/loading';
import Steps from '@components/_common/steps/steps';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import API_ROOT from '@stores/apis/root';
import Title from '../../title';
import DetailItem from '../../detail-item';
import { EditModal } from '../../../customer-contract/popup/edit';
import { RecordModal } from '../../../customer-contract/popup/record';

export default {
	name: 'finance-detail-tabs-suppleinfo',
	components: {
		'oa-title': Title,
		'oa-detail-item': DetailItem,
		'oa-loading': Loading,
		'i-timeline': Timeline,
		'i-timeline-item': TimelineItem,
		'oa-steps': Steps,
		'oa-imgs-preview': ImgsPreview,
		'oa-money-tooltip': MoneyTooltip,
		'i-divider': Divider
	},
	props: {
		type: String,
		supplyId: Number,
		show: Boolean,
		companyId: Number,
		contractId: Number
	},
	data() {
		return {
			data: {
				invalid_record: {},
				finance_audit: {},
				project_info: [],
				cost_record: [],
				parent_contract: [],
			},
			spin: true,
			isfetching: 0
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		supplyId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	methods: {
		handleRecordModal() {
			RecordModal.popup({

			}).then(res => {

			}).catch(err => {

			});
		},
		handleEditModal(item) {
			const { project_id } = item;
			EditModal.popup({
				project_id,
				contract_id: this.contractId,
				contract_company_id: this.companyId,
				supply_id: this.supplyId
			}).then(res => {
				this.loadData();
			}).catch(err => {

			});
		},
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_SUPPLEMENT_INFO_GET,
				type: 'GET',
				param: {
					supply_id: this.supplyId
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
.v-finance-tab {
	min-height: 400px;
	position: relative;
	padding-bottom: 60px;
}
</style>


