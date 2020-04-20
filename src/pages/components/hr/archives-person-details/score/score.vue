<template>
	<div>
		<div class="v-hr-scores-details g-m-t-20">
			<div class="_top">
				<div class="g-flex g-flex-ac">
					<div class="g-fs-16 g-c-black1">{{ info.staff_name }}</div>
					<div class="g-fs-12 g-c-black4 g-m-l-20">{{ info.position_name }}</div>
				</div>
				<div class="g-flex  g-m-t-10">
					<div class="g-m-r-30 ">
						<span class="g-fs-12 g-c-black4">本月业绩:</span>
						<span class="g-fs-14 g-c-black6 g-m-l-5">{{ info.performance }}</span>
					</div>
					<div class="g-m-lr-30 ">
						<span class="g-fs-12 g-c-black4">微一案师傅:</span>
						<span class="g-fs-14 g-c-black6  g-m-l-5">{{ info.is_master===1?'是':'否' }}</span>
					</div>
					<div class="g-m-lr-30 ">
						<span class="g-fs-12 g-c-black4">管理:</span>
						<span class="g-fs-14 g-c-black6  g-m-l-5">{{ info.is_charge===1?'是':'否' }}</span>
					</div>
					<div class="g-m-lr-30 ">
						<span class="g-fs-12 g-c-black4">徒弟:</span>
						<span class="g-fs-14 g-c-black6  g-m-l-5">{{ info.apprentice }}</span>
					</div>
				</div>
			</div>
			<i-tabs
				:value="cate"
				:animated="false"
				type="card"
				style="margin-top: 20px"
				name="tabScore"
				@on-click="handleChange"
			>
				<i-tab-pane
					v-for="item in tabs"
					:key="item.value"
					:label="item.label"
					:name="item.value"
					tab="tabScore"
				>
					<oa-content v-if="cate===item.value" :cate="item.value"/>
				</i-tab-pane>
			</i-tabs>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Tabs, TabPane } from "iview";
import { getParseUrl, getHashUrl, formatMoment, getItem } from "@utils/utils";
import Title from "../../_common/title";
import Filter from "./filter";
import Credit from "./credit";
import Content from "./detail/content";

export default {
	name: "oa-score",
	components: {
		"oa-filter": Filter,
		"oa-title": Title,
		"oa-credit": Credit,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-content": Content
	},
	data() {
		const { query = {} } = this.$route;
		return {
			tabs: [
				{
					label: "积分详情",
					value: "1"
				},
				{
					label: "学分详情",
					value: "2"
				}
			],
			info: {},
			cate: String(query.cate || "1"),
			integralObj: {
				month: {
					detail: []
				},
				year: {
					detail: []
				}
			},
			creditObj: {
				month: {
					detail: []
				},
				year: {
					detail: []
				}
			}
		};
	},
	watch: {
		$route(to, from) {
			if (to.query.cate != from.query.cate) {
				if (this.$route.query.cate === '1') {
					this.loadScoreData(1);
				} else {
					this.loadScoreData(2);
				}
			}
		}
	},
	mounted() {
		this.loadBaseInfo();
		this.loadScoreData(1);
		// this.loadScoreData(2);
	},
	methods: {
		loadBaseInfo() {
			this.$request({
				url:
                    API_ROOT._HR_ARCHIVES_PERSON_DETAIL_PERSON_STAFF_INFO_LIST_GET,
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id
				},
				loading: false
			})
				.then(res => {
					this.info = { ...res.data };
				})
				.catch(err => {});
		},
		loadScoreData(cate) {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SCORE_CREDITINTE_GOAL_GET,
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id,
					cate
				},
				loading: false
			})
				.then(res => {
					if (cate === 1) {
						this.integralObj = { ...res.data };
					} else if (cate === 2) {
						this.creditObj = { ...res.data };
					}
				})
				.catch(err => {});
		},
		handleChange(type) {
			this.cate = type;
			let { query = {} } = getParseUrl();
			query = {
				...query,
				cate: type
			};
			this.$router.replace(
				getHashUrl("/hr/archives/person/details", { ...query })
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-scores-details {
    ._top {
        border: 1px solid #e8e8e8;
        padding: 20px;
        width: 900px;
        height: 98px;
    }
}
</style>