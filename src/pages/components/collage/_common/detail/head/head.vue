<template>
	<div class="v-collage-detail-top g-pd-b-5 g-relative">
		<div>
			<div class="g-c-black g-fs-16 g-pd-15 g-flex">
				<p>
					{{ company_information.contract_company_name }}
					<span class="g-fs-14">
						（合同编号：{{ company_information.contract_num }}）
					</span>
				</p>
			</div>

			<ul class="g-flex g-fs-12">
				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">客户姓名：</span>
						<oa-detail :content="company_information.customer_name"/>
					</p>
					<p class="g-m-b-10">
						<span class="g-c-black4">下单人：</span>
						<oa-detail :content="company_information.staff_name"/>
					</p>
				</li>
				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">客户手机号：</span>
						<oa-detail :content="company_information.phone"/>
					</p>
					<p style="margin-bottom:0;">
						<span class="g-c-black4">下单时间：</span>
						<oa-detail :content="company_information.create_time"/>
					</p>
				</li>
				<li class="g-1of4">
					<p class="g-m-b-10">
						<span class="g-c-black4">谈判人：</span>
						<oa-detail :content="company_information.negotiator"/>
					</p>
					<p class="g-m-b-10 g-flex">
						<span class="g-c-black4">部门经理：</span>
						<oa-auto-tooltip
							v-if="company_information.leader_staff_name"
							:content="company_information.leader_staff_name"
							width="150px"
							theme="dark"
							placement="bottom" 
							label-class="g-c-000"
						/>
						<span v-else class="g-c-black2">--</span>
					</p>
				</li>
				<li class="g-1of4">
					<p class="g-fs-12 g-m-b-10">
						<span class="g-c-black4">邀约人：</span>
						<oa-detail :content="company_information.invite_staff_name"/>
					</p>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { Spin } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import Detail from "../../detail-item";

export default {
	name: 'collage-detail-head',

	components: {
		"i-spin": Spin,
		"oa-detail": Detail,
		"oa-auto-tooltip": AutoToolTip
	},

	props: {
		type: String,
		company_information: Object,
		product_id: Number,
		contract_id: Number,
		project_id: Number,
		contract_num: String
	}
};
</script>

<style lang="scss">
.v-collage-detail-top{
	ul {
		padding: 0 16px;

		li {
			list-style: none;
		}
	}

	.v-auto-tooltip{
		width: 72%;

		._ecllips{
			color: #000000 !important;
		}
	}
}
</style>