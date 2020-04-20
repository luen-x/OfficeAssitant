<template>
	<div class="v-detail-draw-header">
		<div class="g-fs-14 g-c-black2">{{ drawInfo.lottery_topic }}</div>
		<div class="_statistic g-m-b-20">
			<div class="__item">
				<div class="__desc">抽奖人数</div>
				<div class="__num">{{ drawInfo.participator_num }}</div>
			</div>
			<div class="__line" />
			<div class="__item">
				<div class="__desc">中奖人数</div>
				<div class="__num">{{ drawInfo.winning_num }}</div>
			</div>
			<div class="__line" />
			<div class="__item">
				<div class="__desc">已颁发</div>
				<div class="__num">{{ drawInfo.give_num }}</div>
			</div>
			<div class="__line" />
			<div class="__item">
				<div class="__desc">未颁发</div>
				<div class="__num">{{ drawInfo.not_give_num }}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		drawInfo() {
			return this.$store.state.hrAcademyTrainDetailDraw1Result.drawInfo;
		}
	},
};
</script>

<style lang="scss" scoped>
.v-detail-draw-header {
    ._statistic {
        flex: 1;
        background:rgba(245,245,246,1);
        margin-top: 12px;
        width: 100%;
        height: 130px;
        display: flex;
        .__line {
			width:1px;
			height:90px;
			margin-top: 20px;
			background-color: rgba(212,215,219, 0.5);
		}
        .__item {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
        }
        .__desc {
            color: #818794;
            font-size: 14px
        }
        .__num {
            font-size: 24px;
            color: #333;
        }
        &:first-child {
            margin-right: 20px
        }
    }
}
</style>



