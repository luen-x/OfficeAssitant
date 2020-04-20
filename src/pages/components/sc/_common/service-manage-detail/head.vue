<template>
	<div class="v-sc-manage-inspection-head">
		<div class="g-m-t-30 g-c-black">
			<oa-item :content="customer_base_info.contract_company_name" class="g-fs-18"/>
		</div>

		<ul class="g-flex g-flex-ac g-fw-w g-m-t-10">
			<li class="g-m-t-20">
				<span>客户姓名：</span>
				<oa-item :content="customer_base_info.customer_name"/>
			</li>

			<li class="g-m-t-20">
				<span>客户手机号：</span>
				<span v-if="customer_base_info.phone">
					<span v-if="!$global.staff.seat_number" class="g-c-black">
						{{ customer_base_info.phone }}
					</span>
					<span v-else class="g-operation" @click="handleCall(customer_base_info.phone)">
						{{ customer_base_info.phone }}
						<i class="icon iconfont icon-call2 g-m-l-5" />
					</span>
				</span>
				<span v-else>--</span>
			</li>

			<li class="g-m-t-20">
				<span>行业：</span>
				<oa-item :content="customer_base_info.industry_name"/>
			</li>

			<li class="g-m-t-20">
				<span>地区：</span>
				<span v-if="address && address.length > 14" class="g-c-black">
					<i-tooltip 
						:content="address" 
						max-width="180" 
						transfer
						placement="bottom-start"
					>
						{{ address.slice(0,14) + "..." }}
					</i-tooltip>
				</span>
				<span v-else-if="address" class="g-c-black">
					{{ address }}
				</span>
				<span v-else class="g-c-black">
					--
				</span>
			</li>

			<li class="g-m-t-20">
				<span>注册资金：</span>
				<span class="g-c-black">
					{{ customer_base_info.capital ? customer_base_info.capital !== '-1.00' ? `${customer_base_info.capital}万元` : '--' : "--" }}
				</span>
			</li>

			<li class="g-m-t-20">
				<span>服务人：</span>
				<span class="g-c-black">
					{{ customer_base_info.service_person ? customer_base_info.service_person : "--" }}
					（{{ customer_base_info.service_person_depart ? customer_base_info.service_person_depart : "--" }}）
				</span>
			</li>

			<li class="g-m-t-20">
				<span>部门经理：</span>
				<span class="g-c-black">
					{{ customer_base_info.depart_manage }}
				</span>
			</li>
		</ul>

		<div v-if="customer_base_info.return_visit_info" class="g-flex g-flex-ac">
			<div class="g-m-t-20" style="width: 25%;">
				<span>要求质检人：</span>
				<span class="g-c-black">
					{{ customer_base_info.return_visit_info.return_visit_staff_name 
					? customer_base_info.return_visit_info.return_visit_staff_name : "--" }}
					（{{ customer_base_info.return_visit_info.depart_name ? customer_base_info.return_visit_info.depart_name : "--" }}）
				</span>
			</div>

			<div class="g-m-t-20" style="width: 25%;">
				<span>发起时间：</span>
				<oa-item :content="customer_base_info.return_visit_info.return_visit_time"/>
			</div>
			
			<div class="g-m-t-20" style="width: 25%;">
				<span>备注：</span>
				<span v-if="markes && markes.length > 15" class="g-c-black">
					<i-tooltip 
						:content="customer_base_info.return_visit_info.return_visit_mark" 
						max-width="300" 
						transfer
						placement="bottom"
					>
						{{ markes }}
					</i-tooltip>
				</span>
				<span v-else class="g-c-black">
					{{ markes }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Tooltip } from "iview";
import callService from "@components/sale/call-manage/call/service";
import Item from "../detail/head/item";

export default {
	name: "sc-manage-inspection-detail-head",

	components: {
		'i-tooltip': Tooltip,
		'oa-item': Item
	},

	props: {
		contract_company_id: Number,
		customer_base_info: Object,
		data: Object,
	},

	data() {
		return {
			address: "",
			markes: ""
		};
	},

	updated() {
		this.address = this.customer_base_info.province_name + " " + this.customer_base_info.city_name + " " + this.customer_base_info.area_name;

		if (this.customer_base_info.return_visit_info && this.customer_base_info.return_visit_info.return_visit_mark.length > 14) {
			this.markes = this.customer_base_info.return_visit_info.return_visit_mark.slice(0, 14) + "...";
		} else if (!this.customer_base_info.return_visit_info) {
			this.markes = "--";
		} else {
			this.markes = this.customer_base_info.return_visit_info.return_visit_mark;
		}
	},
	methods: {
		handleCall(phone) {
			let cus = {
				...this.data,
				tel: phone,
				contract_company_name: this.data.company_name
			};
			callService.prepareToCallOut(phone, { customer: cus });
		},
	}
};
</script>

<style lang="scss" scoped>
.v-sc-manage-inspection-head{
    padding-left: 22px;

    ul{
        li{
            width: 25%;
            list-style: none;
        }
    }
}
</style>