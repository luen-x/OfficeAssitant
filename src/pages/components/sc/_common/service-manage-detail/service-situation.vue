<template>
	<div class="g-m-t-30 g-pd-l-20 g-pd-r-20 g-relative v-sc-service-sitution">
		<i-tabs
			:animated="false"
			:value="tabs"
			type="card"
			class="g-tabs-card"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane
				key="1"
				name="1"
				label="销售服务"
			>
				<keep-alive>
					<oa-sale-service
						v-if="+tabs === 1"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane
				key="2"
				name="2"
				label="增值服务"
			>
				<keep-alive>
					<oa-increment-service 
						v-if="+tabs === 2"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from "iview";
import SaleService from "./sale-service";
import IncrementService from "./increment-service";

export default {
	name: "sc-manage-inspection-sitution",
    
	components: {
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-sale-service": SaleService,
		"oa-increment-service": IncrementService
	},

	props: {
		contract_company_id: Number
	},
    
	data() {
		return {
			spin: false,
			tabs: "1"
		};
	},

	methods: {
		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		}
	}
};
</script>

<style lang="scss">
.v-sc-service-sitution{
    padding-bottom: 160px;
	width: 100%;
	min-height: 90%;

	.ivu-tabs-bar{
		border-bottom: none !important;
	}

	.ivu-tabs-nav-scroll{
		background: #ffffff !important;
		border-bottom: none !important;
	}

	.ivu-tabs-tab{
		border-bottom: 1px solid #dcdee2 !important;
	}
}
</style>