<template>
	<div class="c-rolling-draw-widget">
		<div class="__item" @click="$emit('change-content', 1)">
			<img :src="OSS_LUCKDRAW_ICON07" width="50" height="50" alt="">
			<div class="__text">说明</div>
		</div>
		<div class="__item" @click="$emit('change-content', 2)">
			<img :src="OSS_LUCKDRAW_ICON04" width="50" height="50" alt="">
			<div class="__text">滚动抽奖</div>
		</div>
		<div class="__item" @click="$emit('change-content', 3)">
			<img :src="OSS_LUCKDRAW_ICON05" width="50" height="50" alt="">
			<div class="__text">结果</div>
		</div>
		<div class="__item" @click="$emit('change-content', 4)">
			<img :src="OSS_LUCKDRAW_ICON06" width="50" height="50" alt="">
			<div class="__text">{{ !fullScreen ? '退出全屏' : '全屏' }}</div>
			<!-- <div class="__text">切换全屏</div> -->
		</div>
	</div>
</template>

<script>
import { OSS_LUCKDRAW_ICON04, OSS_LUCKDRAW_ICON05, OSS_LUCKDRAW_ICON07, OSS_LUCKDRAW_ICON06 } from '@constants/constants';

export default {
	props: {
		fullScreen: Boolean
	},
	data() {
		return {
			OSS_LUCKDRAW_ICON04,
			OSS_LUCKDRAW_ICON05,
			OSS_LUCKDRAW_ICON07,
			OSS_LUCKDRAW_ICON06
		};
	}
};
</script>
<style lang="scss" scoped>
.c-rolling-draw-widget {
    position: absolute;
    top: 100px;
    right: 45px;
    width: 320px;
    height: 76px;
    display: flex;
    justify-content: space-between;
    .__item {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 50px;
        color: #F5D1D3;
        align-items: center;
        cursor: pointer;
    }
}
</style>


