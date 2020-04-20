<template>
	<div class="v-collage-statistic-data-quality-number">
		<div 
			class="g-bg-gray-mid g-fs-16 g-pd-l-20 g-c-black"
			style="height: 50px;line-height: 50px;"
		>
			质检数量统计
		</div>

		<div class="g-flex">
			<div style="width: 50%;">
				<oa-quality-bar-echars
					v-if="num_data.quality_num_static && num_data.quality_num_static.length"
					:quality_num_static="num_data.quality_num_static"
					class="g-pd-r-15" 
					style="border-right: 1px dashed #ebeef1;"
				/>
			</div>
			<div class="g-pd-l-15" style="width: 50%;">
				<oa-quality-ring-echars
					v-if="num_data.quality_lesson_count && num_data.quality_lesson_count.wait_quality_count"
					:quality_lesson_count="num_data.quality_lesson_count"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment";
import QualityBarEchars from "./quality-bar-echars";
import QualityRingEchars from "./quality-ring-echars";

export default {
	components: {
		"oa-quality-bar-echars": QualityBarEchars,
		"oa-quality-ring-echars": QualityRingEchars
	},

	data() {
		return {
			num_data: {}
		};
	},

	mounted() {
		this.loadNumData();
	},

	methods: {
		loadNumData() {
			this.$request({
				url: "_COLLAGE_CHECK_SERVICE_QUALITY_STATIC_GET",
				type: "GET",
				param: {
					begin_date: moment(moment().format("YYYY-MM")).subtract(11, "month").format("YYYY-MM"),
					end_date: moment().format("YYYY-MM")
				},
				loading: false
			}).then(res => {
				this.num_data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-statistic-data-quality-number{
    height: 500px;
    border: 1px solid #ebeef1;

	&:hover{
		box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
    }
}
</style>