<template>
	<div class="v-statistic-business-customer-renew-product">
		<oa-panel 
			title="续费产品" 
			padding="20px 0px 20px 0px"
		>
			<div class="g-m-b-10 g-pd-l-20">
				<i-select
					v-model="year"
					:clearable="false"
					placeholder="请选择年份"
					class="g-m-r-5"
					style="width:220px"
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
			</div>
			<div class="_table g-col g-overlay g-relative" style="min-height:300px;">
				<oa-loading v-if="loading"/>
				<div v-else-if="productList.length==0" class="g-tc g-m-t-30">
					<img :src="OSS_SEARCH_EMPTY">
				</div>
				<div v-for="(item,index) in productList" :key="index" class="g-c-black2 _row g-flex g-jc-sb g-fs-14" >
					<span class="g-dp-ib">
						<span class="g-dp-ib" style="width:35px">
							<span :class="index<3?'_rank-'+index:''" class="g-rank-index">{{ index+1 }}</span>
						</span>
						<span class="g-dp-ib _hover g-pointer" style="width:100px" @click="handleDetail(item)">{{ item.product_name }}</span>
					</span>
					<span class="g-dp-ib" style="width:100px">续费客户:{{ item.customer_renew_num }}个</span>
					<span class="g-d-ib" style="width:100px">续费次数：{{ item.renew_num }}次</span>
					<span class="g-c-black7 g-dp-ib" style="width:250px">续费率：{{ item.renew_rate_str }}</span>
					<span class="g-dp-ib" style="width:200px">续费金额：¥ {{ item.renew_amount_total }}</span>
				</div>
			</div>
		</oa-panel>
	</div>
</template>
<script>
import { Input, Button, Select, Option } from 'iview';
import { services } from '@stores/services/sale';
import { getYearList } from '@utils/utils';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Loading from '@common/loading/loading';
import Panel from '../../_common/panel';


export default {
	name: 'oa-renew-product',
	components: { 
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'oa-panel': Panel,
		'oa-loading': Loading

	},
	data() {
		const yearList = getYearList(2018);
		return {
			OSS_SEARCH_EMPTY,
			loading: false,
			year: yearList[yearList.length - 1].value,
			yearList: getYearList(2018),
			productList: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loading = true;
			this.productList = [];
			this.$request({
				url: "STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_GET",
				type: "GET",
				param: {
					is_page: 0,
					year: this.year
				},
				loading: false,
			}).then(res => {
				const rateStrFn = it => it.percent + '(' + it.year + ')';
				res.data.list.forEach(it => {
					it.renew_rate_str = it.renew_rate.map(rateStrFn).join('/') || '-';
				});
				this.productList = res.data.list;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => {
				this.loading = false;
			});

		},
		handleSearch() {
			this.loadData();

		},
		handleDetail(item) {
			if (!this.$auth[1798]) {
				this.$Message.warning('暂无权限查看');
				return;
			}
			this.$router.push({
				path: '/statistic/business/customer/reproduct',
				query: {
					year: this.year,
					product_id: item.product_id,
					product_name: item.product_name,
				}
			});
		}
	}
};
</script>
<style lang="scss">
.v-statistic-business-customer-renew-product {
	.v-statistic-common-panel {
		._content {
			padding-right: 0;
		}
	}
	._table {
		._row {
			padding: 10px 0;
			border-bottom: 1px solid #F2F2F2;
			transition: all 0.3s ease;
			padding-left: 10px;
			margin: 0 20px;
			._hover {
				transition: all 0.3s ease;
			}
			&:hover {
				background:rgba(250,250,250,1);
				._hover {
					color: #2296f9;
				}
			}
		}
	}

}
</style>