<template>
	<div class="v-pk-summary">
		<div class="_outer">
			<div class="_my-grade g-fl">
				<div class="_title g-c-black1">我的业绩</div>
				<div class="g-pd-t-25 g-pd-b-25 _bgc _height">
					<p>业绩</p>
					<p class="g-fs-26">{{ pkSummary.performance }}</p>
				</div>
			</div>
			<div class="_pk-status g-fl g-m-l-30">
				<div class="_title g-c-black1">PK情况</div>
				<div class="g-pd-t-25 g-pd-b-25 _bgc _height">
					<div class="g-br g-fl" style="width: 33.33%">
						<p>胜</p>
						<p class="g-fs-26">{{ pkSummary.victory }}</p>
					</div>
					<div class="g-br g-fl" style="width: 33.33%">
						<p>平</p>
						<p class="g-fs-26">{{ pkSummary.draw }}</p>
					</div>
					<div class="g-fl" style="width: 33.33%">
						<p>负</p>
						<p class="g-fs-26">{{ pkSummary.defeat }}</p>
					</div>
				</div>
			</div>
			<div class="_pk-result g-fl g-m-l-30">
				<div class="_title g-c-black1">盈亏情况</div>
				<div class="g-pd-t-25 g-pd-b-25 _bgc _height">
					<div class="g-br g-fl" style="width: 33.33%">
						<p>净赚</p>
						<p class="g-fs-26">{{ pkSummary.net_profit }}</p>
					</div>
					<div class="g-br g-fl" style="width: 33.33%">
						<p>输</p>
						<p class="g-fs-26">{{ pkSummary.loss }}</p>
					</div>
					<div class="g-fl" style="width: 33.33%">
						<p>赢</p>
						<p class="g-fs-26">{{ pkSummary.profit }}</p>
					</div>
				</div>
			</div>
      
		</div>
	</div>
</template>

<script>
export default {
	name: 'oa-pk-summary',
	data() {
		return {};
	},
	computed: {
		pkSummary() {
			return this.$store.state.saleMainPk.pkSummary;
		}
	},
};
</script>

<style lang="scss" scoped>
  .v-pk-summary {
    text-align: center;
    ._bgc {
      background-color: #f5f5f6;
    }
    ._height {
      height: 115px;
    }
    ._pk-status, ._pk-result {
      width: 490px;
    }
    ._title {
      text-align: left;
      padding: 0px 15px;
      // font-size: 14px;
      margin: 25px 0 10px;
      border-left: 2px solid #e74854;
    }
    ._outer {
      width: 100%;
			min-width: 1250px;
      overflow: hidden;
      ._my-grade {
        width: 175px;
      }
      
    }
  }
</style>


