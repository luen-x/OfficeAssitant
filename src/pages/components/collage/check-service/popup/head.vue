<template>
	<div class="v-collage-service-manage-head  g-pd-b-5 g-relative">
		<div>
			<div class="g-c-black g-fs-16 g-pd-15">
				<span>
					{{ customer_base_info.contract_company_name ? customer_base_info.contract_company_name : "--" }}
				</span>
			</div>

			<ul class="g-flex g-flex-ac g-pd-l-15">
				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">客户姓名：</span>
						<span class="g-c-black2">
							{{ customer_base_info.customer_name ? customer_base_info.customer_name : "--" }}
						</span>
					</p>
				</li>

				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">客户职位：</span>
						<span class="g-c-black2">
							{{ customer_base_info.customer_position ? customer_base_info.customer_position : "--" }}
						</span>
					</p>
				</li>

				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">客户手机号：</span>
						<span v-if="customer_base_info.phone">
							<span v-if="!$global.staff.seat_number" class="g-c-black2">
								{{ customer_base_info.phone }}
							</span>
							<span v-else class="g-operation" @click="handleCall(customer_base_info.phone)">
								{{ customer_base_info.phone }}
								<i class="icon iconfont icon-call2 g-m-l-5" />
							</span>
						</span>
						<span v-else>--</span>
					</p>
				</li>

				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">邀约人：</span>
						<span class="g-c-black2">
							{{ customer_base_info.invitor_name ? customer_base_info.invitor_name : "--" }}
						</span>
					</p>
				</li>

				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">品牌名称：</span>
						<span class="g-c-black">
							<i-tooltip
								v-if="customer_base_info.brand_name.length > 12"
								:max-width="300" 
								:content="customer_base_info.brand_name"
								transfer
							>
								{{ customer_base_info.brand_name.substr(0, 12) + '...' }}
							</i-tooltip>
							<span v-else>
								{{ customer_base_info.brand_name ? customer_base_info.brand_name : "--" }}
							</span>
						</span>
					</p>
				</li>

				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">部门经理：</span>
						<span class="g-c-black">
							<i-tooltip
								v-if="customer_base_info.depart_manage.length > 6"
								:max-width="300" 
								:content="customer_base_info.depart_manage"
								transfer
							>
								{{ customer_base_info.depart_manage.substr(0, 6) + '...' }}
							</i-tooltip>
							<span v-else>
								{{ customer_base_info.depart_manage ? customer_base_info.depart_manage : "--" }}
							</span>
						</span>
					</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Tooltip } from "iview";
import callService from '@components/sale/call-manage/call/service';

export default {
	name: "service-manage-detail-head",

	components: {
		"i-tooltip": Tooltip
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
	},
	methods: {
		handleCall(phone) {
			let cus = {
				...this.data,
				tel: phone
			};
			callService.prepareToCallOut(phone, { customer: cus });
		},
	}
};
</script>

<style lang="scss" scoped>
    .v-collage-service-manage-head{
        ul{
            flex-wrap: wrap;

            li{
                width: 25%;
                list-style: none;
            }
        }
    }
</style>