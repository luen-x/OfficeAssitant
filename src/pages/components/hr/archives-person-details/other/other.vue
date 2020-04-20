<template>
	<div class="v-hr-archives-person-detail-other">
		<oa-title title="优劣势互荐表" style="padding-bottom:20px"/>
		<div class="_border">
			<div class="_switch">
				<div
					class="g-m-r-20 g-m-b-20 g-operation g-fr"
					@click="handleSwitch"
				>切换</div>
			</div>
			<oa-table v-if="advantageStatus==='2'"/>
			<oa-echarts v-else class="_ech"/>
		</div>

		<div class="g-flex g-flex-ac g-m-t-20 g-m-b-20 ">
			<oa-title title="心态跟踪"/>
		</div>
		<oa-mindset/>
	</div>

</template>

<script>
import API_ROOT from "@stores/apis/root";
import { Select, Option, Poptip, Button, Slider, Message, Collapse, Panel } from "iview";
import { getParseUrl, getHashUrl } from '@utils/utils';
import Title from "../../_common/title";
import Table from "./table/table";
import Echarts from "./echarts/table";
import Mindset from "./mindset/table";
// utils

export default {
	name: "v-hr-archives-person-detail-other",
	components: {
		"i-select": Select,
		"i-option": Option,
		"i-poptip": Poptip,
		"i-collapse": Collapse,
		"i-panel": Panel,
		'oa-title': Title,
		'oa-table': Table,
		'oa-echarts': Echarts,
		'oa-mindset': Mindset
	},
	data() {
		const { query } = this.$route;
		return {
			advantageStatus: String(query.advantageStatus || '1'),
			info: {
				staff_name: "", // 名称
				mobile: "", // 手机号
				sex: "", // 性别
				province: "", // 省
				constellation: "", // 星座
				create_time: "", // 入职时间
				position_name: "", // 职位名称
				work_day: "", // 工龄
				ei_status: 0, // 入职状态     0：未完善；1:已完善
				resume_status: 0, // 简历状态    0：未完善；1:已完善
				bank_status: 0, // 招商银行卡状态  0：未完善；1:已完善
				info: [],
				head_img: '',

			}
		};
	},

	mounted() {
		this.loadBaseInfo();
	},
	methods: {
		loadBaseInfo() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_SUMMARY_DETAILS_HEADER_GET,
				type: "GET",
				param: {
					staff_id: this.$route.query.staff_id
				},
				loading: false
			}).then(res => {
				this.info = { ...res.data };
			}).catch(err => {});
		},
		handleSwitch() {
			if (this.advantageStatus === '1') {
				this.advantageStatus = '2';
			} else {
				this.advantageStatus = '1';
			}
			let { query = {} } = getParseUrl();
			query = {
				...query,
				advantageStatus: this.advantageStatus,
			};
			this.$router.replace(
				getHashUrl("/hr/archives/person/details", { ...query })
			);
		},
	}
};
</script>

<style lang="scss">
.v-hr-archives-person-detail-other{
	padding-top:5px;
	._border{
		width: 100%;
		border:1px solid #E8E8E8;
		._switch{
			padding-top:20px;
			padding-right:20px;
			overflow: hidden;
		}
	}
}

</style>