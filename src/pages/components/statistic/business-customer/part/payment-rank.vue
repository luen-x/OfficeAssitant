<template>
	<div class="v-statistic-business-customer-payment-rank" style="width:500px">
		<oa-panel 
			:tabs="tabs" 
			v-model="tabValue" 
			title="客户交易金额排名（业绩达30万）" 
			padding="20px 0 20px 20px" 
			@tab-change="handleTabChange" >
			<div class="g-m-b-10">
				<i-select
					v-if="tabValue==2"
					v-model="year"
					:clearable="false"
					placeholder="请选择年份"
					class="g-m-r-5"
					style="width:150px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in yearList"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
				<i-select
					v-model="depart_id"
					clearable
					placeholder="请选择部门"
					style="width:150px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item,index) in departList"
						:key="index"
						:value="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
			<oa-scroll 
				:bottom="200"
				throttle
				class="_table g-col g-overlay g-relative" 
				style="height:595px" 
				@reach-bottom="handleReachBottom"
			>
				<oa-loading v-if="loading"/>
				<div v-else-if="customerList.length==0" class="g-tc g-m-t-30">
					<img :src="OSS_SEARCH_EMPTY">
				</div>
				<div v-for="(customer,index) in customerList" :key="index" class="g-c-black2 _row" >
					<span class="g-dp-ib g-pd-l-10" style="width:40px">
						<span :class="index<3?'_rank-'+index:''" class="g-rank-index">{{ index+1 }}</span>
					</span>
					<span class="g-dp-ib" style="width:140px">
						<oa-auto-tooltip
							:content="customer.contract_company_name"
							theme="dark"
							placement="bottom"
							label-class="__hover"
							@click-label="handleLink(customer)"

						/>
					</span>
					<span class="g-dp-ib g-m-l-5" style="width:45px">
						<oa-auto-tooltip
							:content="customer.industry"
							theme="dark"
							placement="bottom"
							label-class=" "
						/>
					</span>
					<span class="g-dp-ib g-m-l-5" style="width:120px">
						<oa-auto-tooltip
							:content="customer.staff_name+'('+customer.depart_name+')'"
							theme="dark"
							placement="bottom"
							label-class=" "
						>
							<span>{{ customer.staff_name }}</span>
							<span class="g-c-black7">({{ customer.depart_name }})</span>
						</oa-auto-tooltip>

						
					</span>
					<span class="g-dp-ib g-m-l-5" style="width:80px">
						<oa-auto-tooltip
							:content="customer.payment"
							theme="dark"
							placement="bottom"
							label-class=" "
						/>
					</span>
				</div>
			</oa-scroll>
		</oa-panel>
	</div>
</template>
<script>
import { Input, Button, Select, Option } from 'iview';
import { services } from '@stores/services/sale';
import { getYearList, getFormatNum } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import Scroll from '@common/scroll/scroll';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Loading from '@common/loading/loading';
import { download } from '@utils/download';

import Panel from '../../_common/panel';




export default {
	name: 'oa-business-customer-statistic-payment-rank',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'oa-panel': Panel,
		'oa-auto-tooltip': AutoTooltip,
		'oa-scroll': Scroll,
		'oa-loading': Loading

	},
	mixins: [services.departAll(), services.firstDepartId()],
	data() {
		const yearList = getYearList(2018);
		return {
			OSS_SEARCH_EMPTY,
			tabs: [
				{ label: "累计", value: 1 },
				{ label: "年度", value: 2 }
			],
			tabValue: 1,
			depart_id: '',
			year: yearList[yearList.length - 1].value,
			yearList: getYearList(2018),
			customerList: [],
			allCustomer: [],
			page: 0,
			loading: false
		};
	},
	computed: {
		departList() {
			if (this.firstDepartId.sale) {
				const sale = this.departAll.find(dep => dep.value == this.firstDepartId.sale);
				if (!sale) return [];
				const deps = sale.children.map(it => ({ value: it.value, label: it.label }));
				// deps.unshift({ value: this.firstDepartId.sale, label: '营销中心' });
				return deps; 
			} else return [];
		},
	},
	async created() {
		await this.loadDepartAllPromise;
		await this.loadFirstDepartIdPromise;
		// 	this.depart_id = this.firstDepartId.sale;
		this.loadData();
	},
	
	methods: {
		loadData() {
			this.loading = true;
			this.clearData();
			const param = { 
				depart_id: this.depart_id, 
				type: this.tabValue,
				year: this.year, 
			};
			this.$request({
				url: "_STATISTIC_BUSINESS_CUSTOMER_DEAL_PAYMENT_GET",
				type: "GET",
				param,
				loading: false,
			}).then(res => {
				
				res.data.forEach(it => {
					it.payment = getFormatNum(it.payment, 2, '¥');
				});
				this.allCustomer = res.data;
				this.handleReachBottom();
			}).catch((res) => {
				// this.customerList = [];
				// // for (let i = 0; i < 100; i++) {
				// // 	this.customerList.push({ 
				// // 		customer_name: "A客户", staff_name: '张三', depart_name: '杭一1部', industry_name: '大健康', payment: '500000.00'
				// // 	});
					
				// // }
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});

		},
		handleSearch() {
			setTimeout(() => {
				this.loadData();
			}, 10);
		},
		handleTabChange() {
			this.handleSearch();
		},
		handleReachBottom() {
			if (this.allCustomer.length > this.customerList.length) {
				const arr = this.allCustomer.filter((i, index) => index >= this.page * 30 && index < (this.page + 1) * 30);
				this.customerList.push(...arr);
				this.page += 1;
			}
		},
		clearData() {
			this.allCustomer = [];
			this.customerList = [];
			this.page = 0;
		},
		handleLink(customer) {
			if (!this.$auth[410]) {
				this.$Message.error('暂无查看权限');
				return;
			}
			this.$router.push({
				path: '/sale/customer/deal/deal/detail',
				query: {
					contract_company_id: customer.contract_company_id,
				}
			});
		}
	}
};
</script>
<style lang="scss">
.v-statistic-business-customer-payment-rank {
	._table {
		._row {
			padding: 10px 0;
			border-bottom: 1px solid #F2F2F2;
			margin-right: 20px;
			transition: all 0.3s ease;
			&:hover {
				background:rgba(250,250,250,1);
			}
			.__hover {
				transition: all 0.3s ease;
				cursor: pointer;
				&:hover { 
					color:#2296f9; 
				}
			}
		}
	}

}
</style>