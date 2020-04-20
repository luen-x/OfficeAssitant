<template>
	<div class="v-hr-archives-person-details-person">
		<oa-header/>
		<div class="_tabs">
			<i-tabs
				:value="personType"
				:animated="false"
				name="tab2"
				class="g-tabs"
				@on-click="handleChange"
			>
				<i-tab-pane
					v-for="item in tabs"
					:key="item.value"
					:label="item.label"
					:name="item.value"
					tab="tab2"
				>
					<oa-recruit v-if="personType==='1'&&personType===item.value"/>
					<oa-entry v-if="personType==='2'&&personType===item.value"/>
					<oa-in-service v-if="personType==='3'&&personType===item.value"/>
					<oa-follow v-if="personType==='4'&&personType===item.value"/>
					<oa-resigned v-if="personType==='5'&&personType===item.value"/>
				</i-tab-pane>
			</i-tabs>
		</div>
	</div>
</template>

<script>
import { Tabs, TabPane } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import DetailItem from "../../employee-summary-details/details/detail-item";
import Header from "./details/header";
import Entry from "./details/entry";
import Follow from "./details/follow";
import Service from "./details/inservice";
import Recruit from "./details/recruit";
import Resigned from "./details/resigned";

export default {
	name: "v-hr-archives-person-details-person",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-header": Header,
		"oa-entry": Entry,
		"oa-follow": Follow,
		"oa-in-service": Service,
		"oa-recruit": Recruit,
		"oa-resigned": Resigned
	},

	data() {
		const { query } = this.$route;
		let tabs = [
			{
				label: "招聘信息",
				value: "1"
			},
			{
				label: "入职信息",
				value: "2"
			},
			{
				label: "在职信息",
				value: "3"
			},
			{
				label: "跟进信息",
				value: "4"
			}
		];
		query.dimission === "4" && tabs.splice(4, 0, {
			label: "离职信息",
			value: "5"
		});
		return {
			data: {},
			personType: String(query.personType || "1"), // 同tabs下的value
			type: String(query.type || "1"),
			current: {},
			tabs
		};
	},
	methods: {
		handleChange(personType) {
			this.personType = personType;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				personType
			};
			this.$router.replace(
				getHashUrl("/hr/archives/person/details", { ...query })
			);
		}
	}
};
</script>

<style lang="scss">
.v-hr-archives-person-details-person {
    ._tabs {
        margin-top: -38px;
        .ivu-tabs-bar .ivu-tabs-tab {
            border-radius: 0;
            background: transparent !important;
        }
        .ivu-tabs-tab {
            margin-right: 15px !important;
        }
        .ivu-tabs-ink-bar {
            margin-left: 13px !important;
            margin-right: 1px !important;
            width: 58px !important;
            border-bottom: 3px solid #e84c57 !important;
        }
		.ivu-tabs-tabpane {
			padding-left: 16px;
		}
    }
}
</style>
