<template>
	<div>
		<div v-if="showTopTel" class="g-m-t-5  g-flex g-flex-cc">
			<span class="g-m-l-10  g-c-black2">{{ customerInfo.tel }}</span>
		</div>
		<div class="g-m-t-5 g-flex">
			<span style="width:70px" class="g-tr">公司名称：</span>
			<span v-if="customerList.length==0" class="g-m-l-10 g-col  g-c-black2">--</span>
			<span v-else-if="customerList.length==1" class="g-m-l-10 g-col  g-c-black2">{{ customerList[0].company_name }}</span>
			<i-select 
				v-else
				v-model="customerId" 
				style="width:220px"
				class="g-m-l-10" 
				placeholder="请选择公司"
				@on-change="handleCompanyChange"
			>
				<i-option v-for="(customer) in customerList" :key="customer.relation_id" :value="customer.relation_id" >
					{{ customer.company_name }}
				</i-option>
			</i-select>
		</div>
		<div class="g-m-t-5 g-flex">
			<span style="width:70px" class="g-tr">客户姓名：</span>
			<span class="g-m-l-10 g-col  g-c-black2">{{ customerInfo.customer_name || '--' }}</span>
		</div>
		<template v-if="firstDepartName=='sale'">
			<div class="g-m-t-5  g-flex g-ai-c">
				<div style="width:70px" class="g-tr" >归属方：</div>
				<span 
					v-if="customerInfo.sign && customerInfo.sign.length" 
					class="g-m-l-10 g-col g-c-black2 g-flex g-ai-c"
				>
					<span>{{ customerInfo.attribution }}</span>
					<i-tooltip 
						:max-width="300"
						placement="top"
						trigger="hover"
					>
						<i 
							class="icon iconfont icon-tag1 g-fs-24 g-pointer g-c-blue-mid"
							style="position: relative;top: 2px;"
						/>
						<div slot="content">
							<div 
								v-for="(item, index) in customerInfo.sign" 
								:key="index"
							>
								<span>{{ item.reason }}</span>
								<span>（{{ item.num }}）</span>
							</div>
						</div>
					</i-tooltip>
				</span>
				<span 
					v-else 
					class="g-m-l-10 g-col  g-c-black2"
				>
					{{ customerInfo.attribution || '未知客户' }}
				</span>
			</div>
			<div v-if="showBottomTel" class="g-m-t-5 g-flex" >
				<span style="width:70px" class="g-tr">联系号码：</span>
				<span class="g-m-l-10 g-col g-c-black2">{{ customerInfo.tel || '--' }}</span>
			</div>
			<div v-if="showSignTime && customerInfo.call_sign_times" class="g-c-red-mid g-pd-l-10 g-m-t-5">
				温馨提示：该号码已经被标记为错误联系方式{{ customerInfo.call_sign_times }}次	
			</div>
		</template>
	</div>
</template>
<script >
import { Tooltip, Select, Option } from 'iview';
import { getFirstDepartName } from './util';
import callService from './service';

export default {
	name: "oa-sale-call-customer-info",
	components: {
		'i-tooltip': Tooltip,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		showTopTel: Boolean,
		showBottomTel: Boolean,
		showSignTime: Boolean
		// relationId: Number,


	},
	data() {
		return {
			firstDepartName: getFirstDepartName(),
			customerId: app.$store.state.saleCallModal.selectedRelationId,
			// signTimeShow: true
		};
	},
	computed: {
		isStaff() {
			return this.customerInfo.relation_type == 3;
		},
		customerList() {
			return this.$store.state.saleCallModal.customerList || [];

		},
		customerInfo() {
			return this.customerList.find(customer => customer.relation_id === this.customerId) || {};
		}
	},
	watch: {
		customerId: {
			immediate: false,
			handler(val) {
				this.$store.commit('CALL_MOADL_CHANGE_RELATION_ID', { relation_id: val });

			}
		},
		// relationId(val) {
		// 	this.customerId = val;

		// },
		customerList: {
			immediate: false,
			handler(val) {
				if (val.length == 0) {
					this.customerId = 0;
				} else if (val.length == 1) {
					this.customerId = val[0].relation_id;
				} else {
					this.customerId = 0;
				}
			}

		}
	},
	methods: {
		handleCompanyChange(relation_id) {
			callService.updateRecord(relation_id);

		},
		
	}
};
</script>
<style lang="scss">
	
</style>
