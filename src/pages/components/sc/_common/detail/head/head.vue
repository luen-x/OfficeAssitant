<template>
	<div class="v-sc-detail-header g-relative g-pd-b-5">
		<div v-if="flag == 1" class="g-c-black g-fs-16 g-flex g-pd-15">
			<p style="white-space:nowrap;" @mouseenter="show = true" @mouseleave="show = false">
				{{ company_information.contract_company_name }}
				<span class="g-fs-14">（合同编号：{{ company_information.contract_num }}）</span>

				<oa-explain 
					v-if="(type=='3' || type=='4') && !head_contract.is_relation && $auth[309]"
					content="针对客户换合同不换产品的情况，或是系统续费重新下单的情况，可以关联之前的合同。关联操作会影响单量计算，发起关联的合同不计入单量"
				>
					<i 
						v-show="show" 
						class="iconfont icon-lianjie g-m-r-10 g-pointer"
						style="color: #2397f9;" 
						@click="handleRelation"
					/>
				</oa-explain>
			</p>

			<i-tooltip max-width="300">
				<span
					v-if="head_contract.is_relation" 
					class="g-pointer g-inline-block _relate"
					@click="handleCancel"
				>
					关联合同编号：{{ head_contract.relation_contract_num }} 
					<span class="g-inline-block g-m-l-10 g-pd-l-10 __relate">
						关联产品：{{ head_contract.relation_product_name }}
					</span>
				</span>
				<div slot="content">
					<p>关联合同编号：{{ head_contract.relation_contract_num }} </p>
					<p>关联产品：{{ head_contract.relation_product_name }}</p>
				</div>
			</i-tooltip>
		</div>

		<div v-else class="g-c-black g-fs-16 g-flex g-pd-15">
			<p style="white-space:nowrap;">
				{{ company_information.contract_company_name }}
				<span class="g-fs-14">（合同编号：{{ company_information.contract_num }}）</span>

				<oa-explain
					content="针对客户换合同不换产品的情况，或是系统续费重新下单的情况，可以关联之前的合同。关联操作会影响单量计算，发起关联的合同不计入单量"
				/>
			</p>
		</div>

		<ul class="g-flex g-pd-lr-15 g-pd-b-15 g-fs-12">
			<li class="g-1of4">
				<p class="g-m-b-10">
					<span class="g-c-black4">客户姓名：</span>
					<oa-item :content="company_information.customer_name"/>
				</p>
				<p class="g-m-b-10">
					<span class="g-c-black4">下单人：</span>
					<oa-item :content="company_information.staff_name"/>
				</p>
			</li>
			<li class="g-1of4">
				<p class="g-m-b-10">
					<span class="g-c-black4">客户手机号：</span>
					<oa-item :content="company_information.phone"/>
				</p>
				<p style="margin-bottom:0;">
					<span class="g-c-black4">下单时间：</span>
					<oa-item :content="company_information.create_time"/>
				</p>
			</li>
			<li class="g-1of4">
				<p class="g-m-b-10">
					<span class="g-c-black4">谈判人：</span>
					<oa-item :content="company_information.negotiator"/>
				</p>
				<p class="g-flex">
					<span class="g-c-black4">部门经理：</span>
					<oa-auto-tooltip
						:content="company_information.leader_staff_name"
						width="150px"
						theme="dark"
						placement="bottom" 
						label-class="g-c-000"
					/>
				</p>
			</li>
			<li class="g-1of4">
				<p class="g-m-b-10">
					<span class="g-c-black4">邀约人：</span>
					<oa-item :content="company_information.invite_staff_name"/>
				</p>
				<p>
					<span class="g-c-black4">邀约人微信：</span>
					<oa-item :content="company_information.wechat"/>
				</p>
			</li>
		</ul>
	</div>
</template>

<script>
import Explain from '@components/_common/explain/explain';
import { Tooltip } from "iview";
import { Confirm } from '@common/confirm/confirm';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { AssociationModal } from "./association-progress";
import Item from "./item";

export default {
	name: 'sc-detail-head',

	components: {
		'i-tooltip': Tooltip,
		'oa-explain': Explain,
		'oa-auto-tooltip': AutoToolTip,
		'oa-item': Item
	},

	props: {
		type: String,
		company_information: Object,
		head_contract: Object,
		product_id: Number,
		contract_id: Number,
		project_id: Number,
		contract_num: String,
		flag: Number
	},
    
	data() {
		return {
			show: false
		};
	},
    
	methods: {
		// 关联进度
		handleRelation() {
			AssociationModal.popup({
				product_id: this.product_id,
				contract_id: this.contract_id,
				project_id: this.project_id,
				contract_num: this.contract_num
			}).then(res => {
				if (res) {
					this.$parent.$parent.loadHeadData();
					this.$parent.$parent.loadRelationData();
				}
			});
		},
		handleCancel() {
			Confirm.popup({ title: '取消关联', msg: '确认取消关联该合同？' }).then(() => {
				this.$request({
					url: "_SC_CUSTOMER_COOPERATE_RELATION_CANCEL_GET",
					type: "GET",
					param: {
						project_id: this.project_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.$parent.$parent.loadHeadData();
					this.$parent.$parent.loadRelationData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-detail-header{
    ul {
        li {
            list-style: none;
        }
	}

	._relate{
		width: 400px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
		color: #eb6772;
		margin-top:2px;

		.__relate{
			border-left: 1px solid #ea4c5b;
			height: 14px;
			line-height: 14px;
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