<template>
	<div class="v-sale-payment-customer-info g-relative" style="min-height:260px;width:680px">
		<oa-loading v-if="loadingShow"/>
		<oa-customer-base-info
			:customer-id="customerId"
			:show-contacts="showContacts"
			:show-call="showCall"
			:read-only="readOnly"
			:contacts="contacts"
			:basic-info="baseInfo"
			class="g-m-t-20"
		/>
		<!-- <div style="width:680px;margin-right:30px;">
			<div class="g-m-tb-15">
				<span class="_title-bar g-bg-red-mid"/>
				<span class="g-fs-14 g-m-lr-5">销售记录</span>
			</div>
			<div v-if="!records.length" class="g-flex g-jc-c" style="margin-top:60px">
				<div>
					<img :src="OSS_SEARCH_EMPTY" >
					<div class="g-tc">暂无销售记录</div>
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
		</div> -->
	</div>
</template>
<script>
import { Input, Button, Poptip } from 'iview';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { handleCopyPhone } from '@components/sale/call-manage/call/util';
import callService from "@components/sale/call-manage/call/service";
import CustomerBaseInfo from "@components/sale/_common/customer-base-info";
import { getAuth, setData } from '../../../../util';
import { ViewRao } from '../../../view-rao';
import InfoBlock from '../../../../info-block';
import InfoItem from '../../../../info-item';
import Record from '../../../../record';


export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'i-poptip': Poptip,
		'oa-record': Record,
		'oa-customer-base-info': CustomerBaseInfo

	},
	props: {
		customerId: Number,
		showContacts: {
			type: Boolean,
			return: false,
		},
		readOnly: {
			type: Boolean,
			return: true,
		},
		showCall: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			loadingShow: false,
			seat_number: _global.staff.seat_number,

			baseInfo: {},
			contacts: [],
			records: []

		};
	},
	watch: {
		customerId() {
			this.loadData();
		}
	},
	created() {
		this.loadData();

	},
	methods: {
		loadData() {
			this.loadingShow = true;
			Promise.all([
				this.loadCustomerInfo() 
				// this.loadSaleRecords()
			])
				.catch(err => console.error(err))
				.finally(() => {
					this.loadingShow = false;
				});
		},
		loadCustomerInfo() {
			return this.$request({
				url: "_SALE_CUSTOMER_CUSTOMER_INFO_GET",
				type: "GET",
				loading: false,
				param: {
					customer_id: this.customerId
				}
			}).then((res) => {
				this.baseInfo = res.data.basic_info;
				this.contacts = res.data.link_tel_list;
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},

		loadSaleRecords() {
			return this.$request({
				url: "_SALE_INTENTION_SHOW_SALE_LOG_GET",
				type: "GET",
				loading: false,
				param: {
					customer_id: this.customerId
				}
			}).then(res => {
				this.records = res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		handleViewRao() {
			this.baseInfo.link_tel.length > 0 && ViewRao.popup({ customerId: this.customerId }).catch(() => {});
		},
		handleCopyRao(event) {
			handleCopyPhone(event, { customer_id: this.customerId, relation_type: 2 });
		},
		handleCallOut(tel) {
			callService.prepareToCallOut(tel);
		},
	}
};
</script>
<style lang="scss">
.v-sale-payment-customer-info {
	._title {
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
	}

}

</style>