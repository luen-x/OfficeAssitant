<template>
	<div class="g-relative g-pd-t-20 v-sale-customer-call-record " style="height:100%" >
		<oa-loading v-if="loading"/>
		
		<div style="height:100%" >
			<div
				v-if="!call_records.length"
				class="g-flex g-jc-c"
				style="position: relative;top: 100px;"
			>
				<div>
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc" >暂无通话记录</div>
				</div>
			</div>
			<div v-else style="height:100%;display:flex;flex-direction: column;">
				<div class="g-pd-b-10" >
					<span class="_title-bar g-bg-red-mid" /> 
					<span class="g-fs-14 g-m-lr-5">通话记录</span>
				</div>
				<oa-scroll 
					:loading="scrollLoading"
					style="overflow:auto;flex:1;margin-bottom:10px"
					@reach-bottom="loadCallRecords"
				>
					<div v-for="(record,index) in call_records" :key="index" class="_record-block" style="background:#f5f5f6;border-radius:4px" >
						<div>
							<span class="g-m-r-30 g-c-black4"> 拨打人：<span class="g-c-black2">{{ record.staff_name }}</span></span>
							<span class="g-c-black4">拨打时间：<span class="g-c-black2">{{ record.start_time }}</span></span>
						</div>
						
						<oa-cus-audio :src="record.tape_link" class="_audio-background" mode="mid" show-tip="never"/>
						
					</div>
				</oa-scroll>
				
				
			</div>
		</div>
	</div>
</template>

<script >
import { Button } from "iview";
import Loading from '@components/_common/loading/loading';
import Scroll from '@components/_common/scroll/scroll';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import CusAudio from '@components/sale/_common/audio/audio';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-call-records",
	components: {
		'i-button': Button,
		'oa-loading': Loading,
		'oa-cus-audio': CusAudio,
		'oa-scroll': Scroll
	},
	props: {
		isOwn: Boolean,
		customerId: Number,
		dealStatus: Number,
	},
	data() {
		return {
			loading: false,
			call_records: [],
			OSS_SEARCH_EMPTY,
			scrollLoading: false,
			currentPage: 0,
		};
	},
	watch: {
		customerId(newVal, oldVal) {
			this.clearData();
			this.loadData();
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadCallRecords();
		},
		clearData() {
			this.currentPage = 0;
			this.scrollLoading = false;
			this.call_records = [];

		},
		loadCallRecords: debounce(function () {
			this.scrollLoading = true;
			const customerId = this.customerId;// 加载中切换数据时的打断请求
			return this.$request({
				url: "_SALE_DIALING_RECORDING_CALL_RECORD",
				type: "GET",
				loading: false,
				param: {
					relation_id: this.customerId,
					page: this.currentPage + 1,
					list_type: 1
				}
			}).then(res => {
				this.scrollLoading = false;
				if (this.customerId != customerId) return;
				this.currentPage = res.data.currentPage;
				this.call_records = this.call_records.concat(res.data.list);
			}).catch(res => {
				this.scrollLoading = false;
				console.error(res);
				this.$Message.error(res.msg);
			});
		 }, 100)
	}
};
</script>

<style lang="scss">
.v-sale-customer-call-record {
	._title-bar {
		display: inline-block;
		width: 3px;
		height: 14px;
		position: relative;
		top: 1px;
	}
	._record-block{
		background:#f5f5f6;
		width:680px;
		height:90px;
		padding:10px;
		margin-bottom: 10px;
	}
	._audio-background{
		width: 460px;
		background: white;
		padding: 0 10px;
		border-radius: 4px;
		border: 1px solid #d9dce0;
		margin-top: 10px
	}
 }
</style>
