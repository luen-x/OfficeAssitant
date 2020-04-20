<template>
	<div class="v-hr-archives-achie-trend-zone">
		<div class="_count">
			<div class="_count-title g-flex g-ai-c g-pd-l-15 g-bg-gray-mid">
				<h3 class="g-m-r-20">
					战区排名
				</h3>
				<i-select
					v-if="departList.length>1"
					v-model="depart_id"
					placeholder="请选择战区"
					style="width: 220px"
					clearable
					transfer
					class="g-m-r-5"
					@on-change="handleDepartChange"
				>
					<i-option
						v-for="item in departList"
						:key="item.value"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</div>
			<div class="_charts">
				<oa-echarts :value="data" />
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import { DebounceClick } from "wya-vc";
import { Button, Cascader, Select, Option } from "iview";
import echarts from './oa-charts.vue';

export default {
	name: "oa-tpl",
	components: {
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		'oa-echarts': echarts,
	},
	mixins: [
		services.departAll()
	],
	data() {
		return {
			// close: true,
			timer: null,
			in_count: 0,
			current_entry: 0,
			current_leave: 0,
			current_birth: 0,
			number: "",
			depart_id: [],	// 选中部门
			// 省份统计
			data: [],
			addressLabel: [],
			departList: [],
		};
	},
	created() {
		// 初始化图表数据
		this.loadData();
		this.loadDepartList();
	},
	mounted() {
	},
	methods: {
		loadData(val) {
			this.addressLabel = [];
			this.data = [];
			this.$request({
				url: API_ROOT._HR_ARCHIVES_ACHIE_TREND_ZONE_GET,
				type: "GET",
				param: {
					depart_id: val || ''
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.$forceUpdate();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadDepartList() {
			this.$request({
				url: API_ROOT._HR_ARCHIVES_ACHIE_TREND_SEARCH_DEPART_GET,
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.departList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleChange(val) {
			this.depart_id = val;
			this.loadData();
		},
		handleDepartChange(val) {
			this.loadData(val);
		}
	}
};
</script>

<style lang="scss" scoped>
.v-hr-archives-achie-trend-zone {
	min-width: 804px;
	border:1px solid rgba(212, 215, 219, 1);
	margin-top:20px;
    ._count {
        height: 400px;
		margin-bottom: 20px;
        ._count-title {
            height: 50px;
        }
    }
    ._charts {
        height: 400px;
        ._charts-title {
            height: 46px;
            line-height: 46px;
        }
	}
}
</style>
