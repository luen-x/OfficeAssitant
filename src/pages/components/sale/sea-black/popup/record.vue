<template>
	<div 
		:style="!record_list.length ? 'height:100%;' : 'height:auto;'"
		:class="{'g-m-t-30':record_list.length}"
		class="g-relative v-sale-black-record"
	>
		<oa-loading v-if="loading"/>
		<div 
			v-if="!record_list.length" 
			class="g-flex g-jc-c g-ai-c"
			style="height:100%"
		>
			<div style="width:416px;">
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无销售记录</div>
			</div>
		</div>
		<oa-record
			v-else 
			:records="record_list"
		>
			<div slot-scope="{data}">
				<div class="g-fs-12 g-c-black4 g-m-b-5">
					<span class="g-fs-14 g-c-black2 g-m-r-10">{{ data.staff_name }}</span>
					{{ data.create_time }}
				</div>
				<div v-if="data.tel" class="g-fs-14 g-c-black4 g-m-b-5">拨打 {{ data.tel }}</div>
				<div class="g-fs-14 g-c-black2">{{ data.remark }}</div>
			</div>
		</oa-record>
	</div>
</template>

<script>
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import Record from "../../_common/record";

export default {
	name: "oa-black-record",
	components: {
		'oa-loading': Loading,
		'oa-record': Record,
	},
	props: {
		customerId: [String, Number]
	},
	data() {
		return {
			loading: false,
			record_list: [], // 销售记录列表
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		customerId() {
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 获取销售记录
		 */
		loadData() {
			this.loading = true;
			this.record_list = [];
			this.$request({
				url: '_SALE_SALE_RECORD_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.record_list = res.data;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
	}
};

export const BlackRecord = module.exports.default;

</script>

<style lang="scss">

</style>
