<template>
	<div class="v-finance-tab">
		<div v-if="spin">
			<oa-title
				v-for="item of data.after_contract"
				:key="item.contract_id"
				:show-type="true"
				class="g-m-b-10" 
				type="expand"
			>
				<template slot="title">{{ item.create_time }}</template>
				<span slot="extra" class="g-operation">
					<span @click="() => handleDetail(item.contract_num)">查看详情</span>
				</span>
				<div slot="content">
					<div class="g-m-tb-15">换前产品： {{ item.before_product_name }}</div>
					<div 
						v-for="info of item.project"
						:key="info.project_id"
						class="g-fw-w g-m-b-10">
						<oa-detail-item :content="info.product_name" label="换后产品">{{ info.need_amount }}</oa-detail-item>						
						<oa-detail-item :content="info.need_amount" label="应付金额">{{ info.need_amount }}</oa-detail-item>
						<oa-detail-item :content="info.payment_amount" label="实付金额">{{ info.payment_amount }}</oa-detail-item>
						<oa-detail-item :content="info.need_cost_amount" class="g-m-t-15" label="产品成本">{{ info.need_cost_amount }}</oa-detail-item>
						<oa-detail-item 
							v-for="(mess, index) of info.project_request" 
							:key="index" 
							:label="mess.component_label"
							:content="mess.component_value"
							class="g-m-t-15" 
						>
							<span v-if="mess.component_type === 8">
								<span v-for="(val, index) of mess.component_value" :key="index">
									{{ val }} 
									<span v-if="index < mess.component_value.length - 1">-</span>
								</span>
							</span>
							<span v-else-if="mess.component_type === 6">
								<oa-imgs-preview :data-source="mess.component_value || []" />
							</span>
							<span v-else>{{ mess.component_value }}</span>
						</oa-detail-item>
						<oa-detail-item
							:content="info.cost_amount"
							class="g-m-t-15" 
							label="实扣成本"
						>
							<i-poptip trigger="hover">
								<span class="g-operation">{{ info.cost_amount !== '' ? info.cost_amount : '--' }}</span>
								<div slot="content">
									<p v-for="(data, index) of info.cost_service_detail" :key="index">
										{{ data.staff_name }}： {{ data.cost_amount }}
									</p>
								</div>
							</i-poptip>
						</oa-detail-item>
						<oa-detail-item
							v-if="info.service_amount != 0"
							:content="info.service_amount"
							class="g-m-t-15" 
							label="服务提成"
						>
							<i-poptip trigger="hover">
								<span class="g-operation">{{ info.service_amount !== '' ? info.service_amount : '--' }}</span>
								<div slot="content">
									<p v-for="(data, index) of info.cost_service_detail" :key="index">
										{{ data.staff_name }}： {{ data.service_amount }}
									</p>
								</div>
							</i-poptip>
						</oa-detail-item>
					</div>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix/>
	</div>
</template>

<script>
import { Timeline, TimelineItem, Spin, Poptip } from 'iview';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import Loading from '@components/_common/loading/loading';
import API_ROOT from '@stores/apis/root';
import Title from '../../title';
import DetailItem from '../../detail-item';

export default {
	name: 'finance-detail-tabs-record',
	components: {
		'oa-loading': Loading,
		'oa-title': Title,
		'oa-detail-item': DetailItem,
		'i-poptip': Poptip
	},
	props: {
		contractId: Number,
		show: Boolean
	},
	data() {
		return {
			spin: false,
			isfetching: 0,
			data: {
				after_contract: []
			}
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
		handleDetail(contract_num) {
			this.$router.replace(getHashUrl(
				'/finance/customer/contract', 
				{ 
					contract_num
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_CONTRACT_LIST_INIT');
		},
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_CAHNGE_RECORD_GET,
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


