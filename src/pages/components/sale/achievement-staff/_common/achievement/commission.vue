<template>
	<div class="c-sale-common-achievement">
		<div v-if="is_show" class="_header-content g-pd-t-20">
			<div class="g-flex _header">
				<div style="flex: 0.2;">
					<span>实发提成:</span>
					<span style="font-weight: bold;" class="g-c-blue-light ">&yen;{{ base_info.grant_commission }}</span>
				</div>
				<div style="flex: 0.2;">
					<span>提成业绩:</span>
					<span style="font-weight: bold;" class="g-c-orange-mid">&yen;{{ base_info.minus_performance }}</span>
				</div>
				<div style="flex: 0.2;">
					<span>距第一名提成:</span>
					<span style="font-weight: bold;" class="g-c-red-mid">&yen;{{ base_info.distance_first_minus_performance }}</span>
				</div>
			</div>
			<div class="g-flex _header g-m-t-20">
				<div>
					<span>总提成:</span>
					<span>&yen;{{ base_info.total_commission }}</span>
				</div>
				<div >
					<span>服务提成:</span>
					<span>&yen;{{ base_info.service_commission }}</span>
				</div>
				<div>
					<span>达标服务提成:</span>
					<span>&yen;{{ base_info.grant_service_commission }}</span>
				</div>
				<div>
					<span>应扣回提成:</span>
					<span>&yen;{{ base_info.deduction_commission }}</span>
				</div>
				<div>
					<span>之前累计应扣回提成:</span>
					<span>&yen;{{ base_info.last_deduction_commission }}</span>
				</div>
			</div>
			<div class="g-m-l-40 g-m-t-20 g-c-black5" style="margin-left:40px">
				{{ base_info.remark }}
			</div>
			<div class="g-operation g-fr g-m-r-10" @click="()=>{calcShow=!calcShow}">{{ calcShow?'收起计算公式':'展开计算公式' }}</div>
		</div>
		<div v-else class="g-tc g-m-t-20">
			<img style="width:100px" src="https://wya-oa.oss-cn-hangzhou.aliyuncs.com/common/no-message-02.png" alt="">
			<div>暂无数据</div>
		</div>
		<oa-commission-detailed
			v-for="(item,index) of contract_list"
			:calc-show="calcShow"
			:data-source="item"
			:open="index==0"
			:key="index"/>
	</div>
</template>

<script type="text/ecmascript-6">
import commissionDetailed from './commission-detailed';

export default {
	components: {
		"oa-commission-detailed": commissionDetailed,
	},
	data() {
		return {
			base_info: {},
			contract_list: [],
			calcShow: false,
			is_show: 1
		};
	},
	watch: {
		$route() {
			this.loadData();
		},
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = this.$route;
			this.contract_list = [];
			 this.$request({
				url: '_SALE_ACHIEVEMENT_STAFF_COMMISSION_DETAIL_BASIC_GET',
				type: 'GET',
				param: {
					...query,
				},
			}).then(res => {
				this.base_info = res.data.base_info;
				this.contract_list = res.data.contract_list;
				this.is_show = res.data.is_show;
			}).catch(err => {
				console.error(err, 'err');
			});
		},
	},
};
</script>

<style  lang="scss">
.c-sale-common-achievement{
	._header-content{
		background-color: #FAFAFA;
		min-height: 160px;
		._header{
		margin-left:40px;
		margin-right: 30%;
		div{
			flex: 1;
			display:flex;
			span{
				margin-right: 10px;
			}
		}
	}
	}
}
</style>
