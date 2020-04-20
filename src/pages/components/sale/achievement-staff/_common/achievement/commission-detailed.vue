<template>
	<div class="c-sale-common-commission-detailed g-m-t-20" style="border: 1px solid #d4d7db">
		<div
			:style="{borderBottom:show?'1px solid #d4d7db':'none'}"
			class="g-bg-light3 g-c-black3 g-pd-10"
			style="overflow: hidden;position: relative;"
			@click="handleToggle"
		>
			<i
				:class="show?'icon-triangle-up':'icon-triangle-down'"
				class="iconfont g-fs-12 g-c-black-dark"
			/>
			{{ dataSource.contract_company_name }}
			<span class="g-m-l-20 g-c-black4">{{ dataSource.audit_time }}</span>
			<span :style="{background:label[type]}" class="_tag">{{ tags[type] }}</span>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div style="padding-left:40px">
				<div class="g-m-t-20">
					<span>{{ pay_amount_name }}：</span>
					<oa-money-tooltip
						:total="pay_amount.amount"
						:data="pay_amount.details"
						class="g-pd-l-10"
					/>
				</div>
				<div v-if="type != 6&&type!= 5" class="g-m-t-20">
					<span>{{ cost_all_name }}：</span>
					<span class="g-pd-l-10">{{ contractDetail.product_names }}</span>
				</div>
				<div class="g-m-t-20 g-flex">
					<div v-if="type != 6&&type!= 5">
						<span>{{ product_name }}：</span>
						<oa-money-tooltip
							v-if="cost_all.amount"
							:total="cost_all.amount"
							:data="cost_all.details"
							class="g-pd-l-10"
						/>
					</div>
					<div v-if="type == 6||type == 5">
						<span>{{ cost_all_name }}：</span>
						<span class="g-pd-l-10">{{ contractDetail.product_names }}</span>
					</div>
					<div v-if="type == 6||type == 5" class="g-m-l-20">
						<span>{{ type==6?'换后产品:':'退款产品' }}</span>
						<span class="g-pd-l-10">{{ type==6?after_product_name:product_names }}</span>
					</div>
				</div>
			</div>
			<div v-if="type == 6||type == 5" class="g-m-t-20" style="padding-left:40px">
				<span>{{ product_name }}：</span>
				<oa-money-tooltip
					v-if="cost_all.amount"
					:total="cost_all.amount"
					:data="cost_all.details"
					class="g-pd-l-10"
				/>
			</div>
			<div
				v-if="contractDetail.cost_detail&&contractDetail.cost_detail.length"
				class="g-flex g-m-t-20"
				style="padding: 12px 40px; background:#fafafa">
				<div v-for="(item,index) in contractDetail.cost_detail" :key="index">
					<span>{{ item.name }}：</span>
					<oa-money-tooltip :total="item.amount" :data="item.details" class="g-pd-lr-10" />
				</div>
			</div>
			<template v-if="calcShow">
				<div v-for="(item,index) in contractDetail.remarks" :key="index" class>
					<div>
						<div
							style="padding-left:40px"
							class="g-c-black2 g-m-tb-10"
						>{{ item.staff_name }}</div>
						<div
							v-for="(details,num) in item.details"
							:key="num"
							class="g-m-b-10"
							style="padding: 12px 40px; background:#fafafa"
						>
							<div class="g-c-red-light">{{ details.month }}</div>
							<div>{{ details.minus_remark }}</div>
							<div>{{ details.service_remark }}</div>
							<div>{{ details.real_minus_remark }}</div>
							<div>{{ details.real_commission_remark }}</div>
							<div>{{ details.all_minus_commission_remark }}</div>
							<div>{{ details.all_commission_remark }}</div>
							<div>{{ details.deduction_commission_remark }}</div>
						</div>
					</div>
				</div>
			</template>
			<slot />
			<div class="g-flex g-m-t-20 g-jc-sb g-m-b-10" style="width:600px;padding-left: 40px;">
				<div v-if="contractDetail.minus_performance!=undefined">
					<span>提成业绩：</span>
					<span
						class="g-pd-l-10 g-fs-14"
						style="font-weight: bold;"
					>&yen;{{ contractDetail.minus_performance }}</span>
				</div>
				<div v-if="contractDetail.service_amount!=undefined">
					<span>服务提成：</span>
					<span
						class="g-pd-l-10 g-fs-14 g-c-blue-light"
						style="font-weight: bold;"
					>&yen;{{ contractDetail.service_amount }}</span>
				</div>
				<div v-if="contractDetail.deduction_commission!=undefined">
					<span>应扣回提成：</span>
					<span
						class="g-pd-l-10 g-fs-14"
						style="font-weight: bold;"
					>&yen;{{ contractDetail.deduction_commission }}</span>
				</div>
				<div v-if="contractDetail.return_service_commission!=undefined">
					<span>返还服务提成：</span>
					<span
						class="g-pd-l-10 g-fs-14 g-c-blue-light"
						style="font-weight: bold;"
					>&yen;{{ contractDetail.return_service_commission }}</span>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script type="text/ecmascript-6">
import { Expand } from 'wya-vc';
import AchieveTooltip from './achieve-tooltip';

export default {
	components: {
		'vc-expand': Expand,
		'oa-money-tooltip': AchieveTooltip
	},
	props: {
		dataSource: {
			type: Object,
			default() {
				return {};
			}
		},
		open: {
			type: Boolean,
			default() {
				return false;
			}
		},
		calcShow: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			show: this.open,
			pay_amount: {}, // 实付金额、退款金额
			contractDetail: {},
			cost_all: {}, // 总产品成本信息、退还成本信息
			type: '', // 0 新合同 1补充协议 2更换产品 3 续费合同 4补款，5退产品，6换产品
			pay_amount_name: '实付金额',
			cost_all_name: '下单产品',
			product_name: '实扣成本',
			after_product_name: '',
			label: ["#2397F9", "#2397F9", "#ed8f4a", "#4FC43D", "#7e23f9", "#f97923", "#ED8F4A"],
			tags: ["新建合同", "补充协议", "更换产品", "续费合同", "补款", "产品退款", "换产品退款"],
		};
	},
	created() {
		this.open && this.loadData();
	},
	methods: {
		handleToggle() {
			this.$refs.expand.toggle();
			if (!this.pay_amount.amount) this.loadData();
		},
		loadData() {
			let { query = {} } = this.$route;
			this.$request({
				url: '_SALE_ACHIEVEMENT_STAFF_COMMISSION_DETAIL_GET',
				type: 'GET',
				param: {
					...this.dataSource,
					month: query.month || '',
				},
			}).then(res => {
				this.pay_amount = res.data.pay_amount;
				this.contractDetail = res.data;
				this.cost_all = res.data.cost_all;
				this.type = res.data.symbol_type;
				this.after_product_name = res.data.after_product_name;
				if (this.type == 4) {
					this.pay_amount_name = '补款金额';
					this.cost_all_name = '下单产品';
					this.product_name = '补交成本';
				} else if (this.type == 5 || this.type == 6) {
					this.pay_amount_name = '退款金额';
					this.cost_all_name = '退款产品';
					this.product_name = '退还成本';
				}
			}).catch(err => {
				console.error(err, 'err');
			});
		},
	}
};
</script>

<style  lang="scss">
    .c-sale-common-commission-detailed {
        ._tag {
			text-align: center;
            position: absolute;
			right: -30px;
			top: 7px;
			width: 114px;
			color: #fff;
            transform: rotate(26deg);
        }
    }
</style>
