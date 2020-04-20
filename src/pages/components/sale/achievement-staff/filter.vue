<template>
	<div class="v-achievement-staff-filter js-filter">
		<div v-if="showMouth" >
			<i-date-picker
				v-model="month"
				:options="{disabledDate:TimeDisable}"
				format="yyyy-MM"
				class="g-m-t-10"
				type="month"
				placeholder="请选择月份"
				style="width: 220px;"
				@on-change="handleMonth"
			/>
			<vc-debounce-click 
				:tag="Button" 
				type="primary" 
				class="g-m-l-5"
				@click="handleSearch"
			>搜索</vc-debounce-click>
		</div>
		<div class="g-flex _piece">
			<div>
				<div class="g-fs-24 g-c-black1 _number" >￥{{ realRank.pk_performance }}</div>
				<div class="g-c-black4">
					pk业绩(元)
					<oa-explain
						content="客户实际支付的金额，不用减手续费和退款，需要考虑分单情况，例：当月客户打款10万，分单出去5万，则PK业绩为5万"
					/>
				</div>
			</div>
			<div v-if="0">
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.received_performance }}</div>
				<div class="g-c-black4">
					到账业绩(元)
					<oa-explain
						content="客户打款到账金额扣除手续费后的业绩，财务已审核通过"
					/>
				</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.refund_amount }}</div>
				<div class="g-c-black4">退款金额(元)</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.real_performance }}</div>
				<div class="g-c-black4">
					实际业绩(元)
					<oa-explain
						content="当月的到账业绩减去退款金额"
					/>
				</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.minus_performance }}</div>
				<div class="g-c-black4">
					提成业绩(元)
					<oa-explain
						content="当月可以算提成的业绩，如：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万"
					/>
				</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.total_commission }}</div>
				<div class="g-c-black4">总提成(元)</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.grant_commission }}</div>
				<div class="g-c-black4">实发提成(元)</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.service_commission }}</div>
				<div class="g-c-black4">服务提成(元)</div>
			</div>
			<div>
				<div class="g-fs-24 g-c-black1 _number">￥{{ realRank.grant_service_commission }}</div>
				<div class="g-c-black4">达标服务提成(元)</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Breadcrumb, BreadcrumbItem } from 'iview';
import API from "@stores/apis/root";
import { Expand } from 'wya-vc';
import Explain from '@components/_common/explain/explain';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { PKRecord } from './popup/pk-record';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
		'i-breadcrumb': Breadcrumb,
		'i-breadcrumbItem': BreadcrumbItem,
		'oa-explain': Explain

	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false,
			realRank: "", // 数据
			month: String(query.month || ''),
		};
	},
	computed: {
		showMouth() {
			if (this.$route.query.staff_id) {
				return false;
			} else {
				return true;
			}
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		if (!this.$route.query.month) {
			this.month = moment().format('YYYY-MM');
		} else {
			this.month = moment(this.$route.query.month).format('YYYY-MM');
		}
		this.handleNum();
		this.staff = this.$route.query.name;
	},
	methods: {
		TimeDisable(date) {
			return moment(date).isAfter(moment());
		},
		handleSearch(v) {
			if (this.month == '') {
				let i = moment().format('YYYY-MM');
				this.month = i;
			} else {
				this.month = moment(this.month).format('YYYY-MM');
			 }
			this.$router.replace(getHashUrl(
				'/sale/achievement/staff',
				{
					...this.$route.query,
					keyword: this.keyword,
					name: this.name,
					month: this.month,
					staff_id: this.$route.query.staff_id ? this.$route.query.staff_id : ""
				}
			));
			this.$store.commit('SALE_ACHIEVEMENT_STAFF_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleNum() {
			this.$request({
				url: API._FINANCE_COUNT_STAFF_DETAIL_GET,
				type: 'GET',
				param: {
					month: this.month,
					staff_id: this.$route.query.staff_id ? this.$route.query.staff_id : ""
				},
			}).then((res) => {
				this.realRank = res.data;
			});
		},
		handleMonth(v) {
			this.month = v;
			this.handleSearch();
			this.handleNum();
		},
		handlePKRecord() {
			PKRecord.popup({
				data: {
					staff_id: this.$route.query.staff_id ? this.$route.query.staff_id : '',
					month: this.$route.query.month ? this.$route.query.month : '',
					change_type: '2'
				}
			}).then(() => {});
		},
	}
};

</script>

<style lang="scss" scoped>
	.v-achievement-staff-filter {
		._title{
			line-height: 40px;
			padding-left:40px ;
			position:fixed;
			z-index: 99;
			height: 42px;
			top: 56px;
			right: 0;
			left: 180px;
			box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
		}
		._number{
			padding-top:10px ;
		}
	    ._piece {
	        margin-top: 20px;
	        background: #f5f5f6;
	        height: 130px;
	        padding: 10px 0;
	        & > div {
	            flex: 1;
	            border-right: 1px solid #d4d7db;
	            display: flex;
	            flex-direction: column-reverse;
	            align-items: center;
	            justify-content: center;
	            & > div:last-child {
	                font-size: 14px;
	                color: #818794;
	            }
	        }
	        & > div:last-child {
	            border: none;
	        }
	    }
	}
</style>
