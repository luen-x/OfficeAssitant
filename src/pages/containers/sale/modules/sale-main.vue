<template>
	<set-title title="我的首页" class="g-tabs-card v-sale-main" style="min-width: 1186px;overflow: hidden;">
		<oa-work-table/>
		<oa-schedule class="g-m-10"/>
		<!-- <div class="g-flex v-margin"> -->
		<div class="g-flex" >
			<div ref="left" style="width:50%;height:fit-content">

				<component v-for="(com,index) in left" :is="com" :key="index" class="_module"/>
				<!-- <oa-customer-statistics class="_module"/> -->
				<!-- <oa-service-quality class="_module"/>
				<oa-pk class="_module"/> -->
				<!-- <oa-notice class="_module"/>
				<oa-achievement-ranking class="_module"/> -->


			</div>
			<div ref="right" style="width:50%;height:fit-content">
				<component v-for="(com,index) in right" :is="com" :key="index" class="_module"/>
				<!-- <oa-notice class="_module"/>
				<oa-achievement-ranking class="_module"/> -->
				

			</div>

		</div>
		
		<!-- <oa-notice class="_module"/>
		<oa-service-quality class="_module"/>
		<oa-achievement-ranking class="_module"/>
		<oa-pk class="_module"/> -->
		<!-- // <oa-achievement-ranking class="_module"/> -->
		<!-- </div> -->
		<!-- <div class="g-flex  g-m-t-20 g-fw-w v-margin" style="height: calc(100% - 190px)" >
			<div style="width: 40%; height:100%">
				<oa-service-quality/>
				<oa-pk class="g-m-t-20" style="margin-bottom:80px"/>
			</div>
			<div class="g-m-l-20" style="width: calc(60% - 40px);height:100%">
				<oa-achievement-ranking style="margin-bottom:80px"/>
			</div>
		</div> -->
	</set-title>
</template>

<script>

import achieve from '@components/sale/main/achieve';
import pk from '@components/sale/main/pk';
import schedule from '@components/sale/main/schedule/content';
import screen from '@components/sale/main/screen';
import rankings from '@components/sale/main/rankings';
import notice from '@components/sale/main/notice';
import WorkTable from '@components/tech/_common/work-table/work-table';
import WorkData from '@components/sale/main/work-data/content';
import achievementRanking from '@components/sale/main/achievement-ranking/content';
import serviceQuality from '@components/sale/main/service-quality/content';
import Case from '@components/sale/main/case/content';
import Circle from '@components/sale/main/circle/content';
import Remind from '@components/sale/main/remind/content';
import Coin from '@components/sale/main/coin/content';

export default {
	name: 'oa-sale-main',
	components: {
		'oa-work-table': WorkTable,
		'oa-schedule': schedule,
	},
	data() {
		return {
			comps: [Case, Circle, WorkData, achievementRanking, Remind, Coin, notice, serviceQuality, pk],
			left: [],
			right: [],
		};
	},
	beforeDestroy() {
	},
	mounted() {
		this.insertComp();
	},
	methods: {
		insertComp() {
			for (let i = 0; i < this.comps.length; i++) {
				setTimeout(() => {
					if (this.$refs.left.clientHeight <= this.$refs.right.clientHeight) {
						this.left.push(this.comps[i]);
					} else {
						this.right.push(this.comps[i]);
					}
				}, i * 50);
			}
		}
	}
};
</script>

<style lang="scss">
.v-sale-main {
	padding:10px;
	._module {
		width: calc(100% - 20px);
		margin: 10px;
		margin-bottom: 20px;
		// float: left;

	}
}

</style>
