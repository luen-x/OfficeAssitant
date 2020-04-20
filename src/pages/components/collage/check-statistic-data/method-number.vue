<template>
	<div class="v-collage-statistic-data-method-number">
		<div 
			class="g-bg-gray-mid g-fs-16 g-pd-l-20 g-c-black"
			style="height: 50px;line-height: 50px;"
		>
			质检方式统计
		</div>

		<div v-if="method_data.total_quality_type_static" class="g-flex">
			<template v-for="(item,index) in arr">
				<oa-method-ring-echars 
					:key="index" 
					:content="item"
					:total_data="method_data.total_quality_type_static[index]"
					style="width: 20%;"
				/>
			</template>
		</div>

		<div v-if="method_data.date_quality_type_static && method_data.date_quality_type_static.length">
			<oa-method-bar-echars
				:date_quality_type_static="method_data.date_quality_type_static"
				:total_data="method_data.total_quality_type_static"
			/>
		</div>
	</div>
</template>

<script>
import moment from "moment";
import MethodRingEchars from "./method-ring-echars";
import MethodBarEchars from "./method-bar-echars";

export default {
	name: "collage-method-number",

	components: {
		"oa-method-ring-echars": MethodRingEchars,
		"oa-method-bar-echars": MethodBarEchars
	},
    
	data() {
		return {
			arr: [{
				name: "电话质检",
				color: "#682EFA"
			}, {
				name: "微信质检",
				color: "#FFB42B"
			}, {
				name: "QQ质检",
				color: "#2E9DFA"
			}, {
				name: "短信质检",
				color: "#E8DC46"
			}, {
				name: "其他",
				color: "#EC505B"
			}],
			method_data: {}
		};
	},

	mounted() {
		this.loadMethodData();
	},

	methods: {
		loadMethodData() {
			this.$request({
				url: "_COLLAGE_CHECK_SERVICE_QUALITY_TYPE_GET",
				type: "GET",
				param: {
					begin_date: moment(moment().format("YYYY-MM")).subtract(11, "month").format("YYYY-MM"),
					end_date: moment().format("YYYY-MM")
				},
				loading: false
			}).then(res => {
				this.method_data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-statistic-data-method-number{
    height: 878px;
    border: 1px solid #ebeef1;

	&:hover{
		box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
    }
}
</style>