<template>
	<div class="v-sale-sale-records g-relative g-pd-t-15" style="min-height:260px;">
		<oa-loading v-if="loading"/>
		<div v-if="!readOnly" class="g-tr">
			<vc-debounce-click
				:loading="saveLoading"
				class="g-red-btn-line"
				@click="handleAddFollowRecord"
			>
				添加销售记录
			</vc-debounce-click>
		</div>
		<div style="width:680px;margin-right:30px;">
			<!-- <div class="g-m-tb-15">
				<span class="_title-bar g-bg-red-mid"/>
				<span class="g-fs-14 g-m-lr-5">销售记录</span>
			</div> -->
			<div v-if="!records.length" class="g-flex g-jc-c">
				<div style="margin-top:80px">
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc">暂无销售记录{{ dealStatus==2 ? '，赶快添加一条吧~':'' }}</div>
				</div>
			</div>
			<oa-record
				v-else
				:records="records"
				class="g-col"
				style="overflow-y: auto"
			>
				<div slot-scope="{data}">
					<div class="g-fs-12 g-c-black4 g-m-b-5">
						<span class="g-fs-14 g-c-black2 g-m-r-10">{{ data.staff_name }}</span>
						{{ data.create_time }}
					</div>
					<div v-if="data.tel" class="g-fs-14 g-c-black4 g-m-b-5">拨打 {{ data.tel }}</div>
					<div>
						<span class="g-fs-14 g-c-black2 g-m-r-5">接通状态：</span>
						<span class="g-fs-14 g-c-black2 g-m-r-30">{{ data.connect_status || '--' }}</span>
						<span class="g-fs-14 g-c-black2 g-m-r-5">客户意向：</span>
						<span class="g-fs-14 g-c-black2 g-m-r-10">
							{{ data.customer_intention || '--' }}
						</span>

					</div>
					<div class="g-fs-14 g-c-black4">{{ data.remark }}</div>
				</div>
			</oa-record>
		</div>

	</div>
</template>
<script >
import { Button, Form, FormItem } from "iview";
import { debounce } from 'lodash';
import LimitWords from '@common/limit-words/limit-words';
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import callService from '@components/sale/call-manage/call/service';
import { getAuth } from '../../../../util';
import Record from '../../../../record';
import { AddFollowRecord } from '../../../add-follow-record';

export default {
	name: "oa-sale-sale-records",
	components: {
		'i-button': Button,
		"oa-limit-words": LimitWords,
		
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-loading': Loading,
		'oa-record': Record,
	},
	props: {
		isOwn: Boolean,
		customerId: Number,
		dealStatus: Number,
		readOnly: Boolean

	},
	data() {
		return {
			loading: false,
			saveLoading: false,
			changed: false,
			OSS_SEARCH_EMPTY,
			formData: {
				remarks: ''
			},
			rules: {
				remarks: [{ required: true, message: "请填写销售记录", trigger: "blur" }]
			},
			records: []
		};
	},
	computed: {
	},
	watch: {
		customerId(newVal, oldVal) {
			this.loadData();
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
		this.loadData();
		callService.callEmitter.on('add-record', this.loadSaleRecords, this);
	},
	beforeDestroy() {
		callService.callEmitter.off('add-record', this.loadSaleRecords, this);
	},
	methods: {
		loadData() {
			this.loadSaleRecords();
		},
		loadSaleRecords() {
			this.loading = true;
			this.$request({
				url: "_SALE_INTENTION_SHOW_SALE_LOG_GET",
				type: "GET",
				loading: false,
				param: {
					customer_id: this.customerId
				}
			}).then(res => {
				this.records = res.data;				
				this.loading = false;
			}).catch((res) => {
				this.loading = false;
				console.error(res);
			});
		},
		handleAddFollowRecord() {
			AddFollowRecord.popup({ customer_id: this.customerId }).then(() => {
				this.changed = true;
				this.$emit("change");
				this.loadSaleRecords();
			}).catch(() => {
			});
		},
	}
};
</script>
<style lang="scss">
</style>