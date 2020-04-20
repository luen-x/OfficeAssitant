<template>
	<div class="g-pd-20 v-sc-manage-statistics-data">
		<div class="_top">
			<oa-service-score/>
		</div>

		<div class="g-m-tb-20 _center">
			<oa-added-service/>
		</div>

		<div class="_bottom">
			<oa-dissatisfied/>
		</div>
	</div>
</template>

<script>
import ServiceScore from "./service-score";
import Dissatisfied from "./dissatisfied";
import AddedService from "./added-service";

export default {
	name: 'sc-manage-statistics-data',

	components: {
		'oa-service-score': ServiceScore,
		'oa-dissatisfied': Dissatisfied,
		'oa-added-service': AddedService
	},
	data() {
		return {
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss">
.v-sc-manage-statistics-data{
	._top,._center,._bottom{
		width: 100%;
		border-radius: 4px;
		border: 1px solid #ebeef1;

		&:hover{
			box-shadow: 0 0 7px 0 rgba(0,0,0,0.1);
		}
	}

	._top{
		height: 480px;
	}

	._center{
		height: 1800px;
	}

	._bottom{
		height: 400px;
		padding-top: 50px;
	}
}
</style>