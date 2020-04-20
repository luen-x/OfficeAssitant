<template>
	<div class="v-hr-details">
		<oa-hearder ref="header" :handle-status="handleStatus" class="g-m-t-20"/>
		<i-tabs :animated="false" :value="type" class="_hrtab g-tabs" @on-click="handleChange">
			<i-tab-pane label="在职信息" name="1" class="g-pd-lr-20">
				<oa-info v-if="type==1"/>
			</i-tab-pane>
			<i-tab-pane label="简历信息" name="2" class="g-pd-lr-20">
				<oa-resume v-if="type==2"/>
			</i-tab-pane>
			<i-tab-pane label="入职资料" name="3" class="g-pd-lr-20">
				<oa-profile v-if="type==3"/>
			</i-tab-pane>
			<i-tab-pane label="合同信息" name="4" class="g-pd-lr-20">
				<oa-contract v-if="type==4" :name="name"/>
			</i-tab-pane>
			<i-tab-pane v-if="staffStatus!=4" label="工资社保" name="5" class="g-pd-lr-20">
				<oa-treatment v-if="type==5"/>
			</i-tab-pane>
			<i-tab-pane v-if="staffStatus!=4" label="晋级信息" name="6" class="g-pd-lr-20">
				<oa-promotion v-if="type==6"/>
			</i-tab-pane>
			<i-tab-pane v-if="staffStatus!=4" label="晋升信息" name="7" class="g-pd-lr-20">
				<oa-upgrade v-if="type==7"/>
			</i-tab-pane>
		</i-tabs>
		<oa-record v-if="$auth['1246']"/>
	</div>
</template>

<script>
import { Tabs, TabPane } from "iview";
import { getParseUrl, getHashUrl } from "@utils/utils";
import Info from "./details/information/info";
import Hearder from "./details/hearder/hearder";
import Contract from "./details/contract/contract";
import Resume from "./details/resume/resume";
import Profile from "./details/profile/profile";
import Treatment from "./details/treatment/treatment";
import Promotion from "./details/promotion/promotion";
import Upgrade from "./details/upgrade/upgrade";
import Record from "./record";

export default {
	name: "hr-employee-summary-details",
	components: {
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-info": Info,
		"oa-hearder": Hearder,
		"oa-contract": Contract,
		"oa-resume": Resume,
		"oa-profile": Profile,
		"oa-treatment": Treatment,
		"oa-promotion": Promotion,
		"oa-upgrade": Upgrade,
		"oa-record": Record
	},
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"),
			name: String(query.staff_name || ""),
			is_from_avatar: query.from === 'avatar' || false,
			staffStatus: ''
		};
	},
	methods: {
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type
			};
			this.$router.replace(
				getHashUrl(this.$router.path, { ...query })
			);
		},
		handleStatus(data) {
			this.staffStatus = data;
		}
	}
};
</script>

<style lang="scss" >
.v-hr-details {
    padding: 0 20px;
    ._hrtab {
        position: relative;
        top: -36px;
        margin-left: -10px;
        padding-left: 10px;
        .ivu-tabs-ink-bar {
			margin-left: 15px !important;
			margin-right: 15px !important;
			width: 58px !important;
            border-bottom: 3px solid #e84c57 !important;
        }
    }
}
</style>
