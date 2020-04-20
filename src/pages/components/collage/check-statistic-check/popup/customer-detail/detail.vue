<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-collage-check-statistic-checkcustomer-detail"
		@on-close="handleCancel"
	>
		<div class="g-pd-b-20 _header">
			<div class="g-m-t-30 g-c-black __title">
				<span class="g-fs-20">{{ contract_company_name }}</span>
			</div>

			<ul class="g-flex g-flex-ac g-m-t-10">
				<li class="g-m-t-20">
					<span>客户姓名：</span>
					<oa-detail :content="head_data.customer_name"/>
				</li>

				<li class="g-m-t-20">
					<span>客户职位：</span>
					<oa-detail :content="head_data.customer_position"/>
				</li>

				<li class="g-m-t-20">
					<span>客户手机号：</span>
					<oa-detail :content="head_data.phone"/>
				</li>

				<li class="g-m-t-20">
					<span>邀约人：</span>
					<oa-detail :content="head_data.invitor_name"/>
				</li>

				<li class="g-m-t-20">
					<span>品牌名称：</span>
					<oa-detail :content="head_data.brand_name"/>
				</li>
			</ul>
		</div>

		<div>
			<oa-check-records
				ref="records"
				:flag="1"
				:contract_company_id="contract_company_id"
			/>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer } from "iview";
import { CreatePortal } from "wya-vc";
import CheckRecords from "../../../check-service/popup/check-records";
import Detail from "../../../_common/detail-item";

export default {
	name: "collage-customer-predistribute-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"oa-detail": Detail,
		"oa-check-records": CheckRecords
	},

	props: {
		contract_company_name: String,
		contract_company_id: Number
	},

	data() {
		return {
			closable: false,
			show: false,
			head_data: {}
		};
	},

	mounted() {
		this.loadData();
		this.closable = true;
	},

	methods: {
		loadData() {
			this.$request({
				url: "_COLLAGE_CHECK_STATISTIC_QUALITY_COMPANY_INFO_LIST_GET",
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.head_data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-collage-check-statistic-checkcustomer-detail {
    .ivu-drawer-body{
        padding: 0px;
    }

    ._header{
        border-bottom: 1px solid #D4D7DB;
        padding-left: 22px;

        .__title{
            padding-left: 6px;
        }

        ul{
            flex-wrap: wrap;

            li{
                width: 25%;
                list-style: none;
            }
        }
    }
}
</style>