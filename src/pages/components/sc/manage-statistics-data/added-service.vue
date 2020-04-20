<template>
	<div>
		<div 
			class="g-fs-16 g-pd-l-20 g-c-black" 
			style="background: #F8F8F8;height: 47px;line-height:47px;"
		>
			增值服务评分统计
		</div>

		<div class="g-flex g-fw-w">
			<div 
				v-for="(item,index) in serviceScore" 
				:key="index"
				class="g-relative"
				style="width: 50%;height: 350px;"
			>
				<div class="g-fs-14 g-c-black g-pd-t-25 g-absolute" style="margin-left: 15%;">
					{{ item.name }}
				</div>
                
				<oa-score-echars 
					:key="index"
					:average="+item.average_score"
					:service="item.add_service_score_static"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ScoreEchars from "./score-echars";

export default {
	components: {
		"oa-score-echars": ScoreEchars
	},
    
	data() {
		return {
			serviceScore: []
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.$request({
				url: "_SC_MANAGE_STATISTICS_ADD_SERVICE_SCORE",
				type: "GET",
				param: {}
			}).then(res => {
				this.serviceScore = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
</style>