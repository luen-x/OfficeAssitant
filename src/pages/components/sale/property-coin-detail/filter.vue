<template>
	<div class="v-sale-property-coin-detail g-flex-ac">
		<div class="_avatar g-flex-cc g-m-r-30 g-m-l-20">{{ baseInfo.staff_name }}</div>
		<div class="g-flex g-fd-c g-jc-sb" style="height:93px;margin-right: 60px;">
			<div><span class="g-fs-18 g-c-black3 g-m-r-20">{{ baseInfo.staff_name }}</span> <span class="g-fs-14 g-c-black4">
				{{ baseInfo.depart_name }}</span></div>
			<div>{{ baseInfo.mobile }}</div>
			<div class="_position g-flex-cc">{{ baseInfo.position_name }}</div>
		</div>
		<div class="_detail g-flex-ac ">
			<img :src="OSS_PROP_ICON1" class="_coin g-m-r-10 g-m-l-20">
			<div class="g-m-r-20">
				<div class="g-fs-24 g-c-green-light" >{{ baseInfo.settled_coins }}</div>
				<div class="g-fs-14 g-c-black4">可用余额</div>
			</div>
			<i-button @click="handleAdjust">调整余额</i-button>
			<span style="margin-right:80px" class="_border g-m-l-20"/>
			<img :src="OSS_PROP_ICON1" class="_coin g-m-r-10">
			<div class="g-m-r-20">
				<div class="g-fs-24" style="color:#E74854;">{{ baseInfo.settling_coins }}</div>
				<div class="g-fs-14 g-c-black4">待结算</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, DatePicker, Select } from 'iview';
import { OSS_PROP_ICON1 } from '@constants/constants';
import { AdjustModal } from '../property-coin/popup/adjust-modal';

export default {
	components: {
		'i-button': Button
	},
	data() {
		return {
			baseInfo: {},
			OSS_PROP_ICON1
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		handleAdjust() {
			AdjustModal.popup({
				datas: this.baseInfo
			}).then(res => {
				this.loadData();
				this.$store.commit('SALE_PROPERTY_COIN_DETAIL_LIST_INIT');
			});
		},
		loadData() {
			let { query = {} } = this.$route;
			this.$request({
				url: '_HR_PERSONNEL_CURRENCY_BASE_COIN_GET',
				type: 'GET',
				param: {
					staff_id: query.staff_id || 1
				},
			}).then((res) => {
				this.baseInfo = res.data;
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
	}
};
</script>

<style lang="scss">
.v-sale-property-coin-detail {
	background: #f5f5f6;
	height: 173px;
	._avatar{
		width: 90px;
		height: 90px;
		border-radius: 50%;
		color: white;
		background: #e84854;
		font-size: 18px;
		font-weight: 500;
		overflow: hidden;
	}
	._position{
		width:80px;
		height:23px;
		background:#fff;
		border-radius:4px;
	}
	._detail{
		width:520px;
		height:140px;
		background:#fff;
	}
	._border{
		width:1px;
		height:14px;
		background:rgba(212,215,219,1);
	}
	._coin{
		width: 48px;
		height: 48px;
		background:#e6b422;
		border-radius: 50%;
	}
}
</style>
