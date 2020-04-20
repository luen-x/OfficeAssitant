<template>
	<div class="v-hr-social-statistics-list">
		<ul class="g-flex g-bg-gray-mid _content g-flex-cc  g-fs-16 g-m-t-20">
			<li
				v-for="item in count"
				:key="item.detail_type"
				class="g-flex g-col g-flex-cc g-flex-ac g-fd-c _item"
			>
				<div class="g-flex g-col g-flex-cc g-flex-ac g-fd-c  g-pointer" style="width:50%" @click="handleCount(item.detail_type)">
					<div>{{ item.label }}</div>
					<div class="g-m-t-10">{{ item.value }}人</div>
				</div>
			</li>
		</ul>
		<div class="_charts">
			<oa-echarts :data-label="dateX" :value="dataY" :detail="detail"/>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { DebounceClick } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import { Button, Cascader, Select, Option, Input, DatePicker } from "iview";
import echarts from "./oa-charts.vue";

export default {
	name: "oa-tpl",
	components: {
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-input": Input,
		"i-date-picker": DatePicker,
		"oa-echarts": echarts
	},
	data() {
		let { query = {} } = getParseUrl(); 
		return {
			// close: true,
			// 省份统计
			echartsList: [
				{ label: "实际面试人数", value: 0 },
				{ label: "面试通过人数", value: 1 },
				{ label: "面试淘汰人数", value: 2 },
				{ label: "试岗人数", value: 3 },
				{ label: "入职人数", value: 4 }
			],
			count: [],
			dataY: [],
			dateX: [],
			detail: []
		};
	},
	watch: {
		$route(to, from) {
			this.loadData();
		}
	},
	created() {
		// 初始化图表数据
		this.loadData();
	},
	mounted() {},
	methods: {
		loadData() {
			const { query = {} } = this.$route;
			this.dateX = [];
			this.dataY = [];
			this.$request({
				url: API_ROOT.HR_RECRUIT_SOCIAL_STATISTICS_LIST_GET,
				type: "GET",
				param: {
					...query,
				},
				loading: false
			}).then(res => {
				// 省份统计
				this.dataY = res.data.value;
				this.dateX = res.data.label;
				this.count = res.data.count;
				this.detail = res.data.detail;
				this.$forceUpdate();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCount(detail_type) {
			this.$router.push(
				getHashUrl('/hr/recruit/social/social-statistics-details', {
					...this.$route.query,
					interview_time_month: this.$route.query.interview_time_month,
					is_all: this.$route.query.is_all || 1,
					staff_id: this.$route.query.staff_id,
					staff_name: this.$route.query.staff_name,
					type: this.$route.query.type,
					baseType: this.$route.query.baseType || '0',
					detail_type,
					entry_time_month: this.$route.query.entry_time_month,
					try_start_time_month: this.$route.query.try_start_time_month,
				})
			);
		},
	}
};
</script>

<style lang="scss" scoped>
.v-hr-social-statistics-list {
    ._content {
        height: 140px;
        color: #343434;
        li {
            height: 90px;
            width: 20%;
        }
		._item:hover div:nth-child(2){
			color: #2397f9;
		}
        li + li {
            border-left: 1px solid #d4d7db;
        }
    }

	
}
</style>
