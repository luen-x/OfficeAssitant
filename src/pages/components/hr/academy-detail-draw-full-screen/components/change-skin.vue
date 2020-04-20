<template>
	<div class="c-skin-change">
		<div ref="skin" class="_skin">
			<div class="__line"/>
			<div class="__btn" @click="handleChangeBackgroud">
				<i 
					class="icoon iconfont icon-chuqinrenshu"
					style="padding-right: 5px;"/>
				<span class="g-fs-14">换肤</span>
			</div>
		</div>
		<div ref="out" class="_background g-bg-red-mid">
			<img ref="img" :src="BG_IMG[nowBgIndex]" class="__img">
		</div>
	</div>
</template>

<script>
import { OSS_LUCKDRAW_BG01, OSS_LUCKDRAW_BG02, OSS_LUCKDRAW_BG03, OSS_LUCKDRAW_BG04 } from '@constants/constants';

const BG_IMG = [
	OSS_LUCKDRAW_BG01,
	OSS_LUCKDRAW_BG02,
	OSS_LUCKDRAW_BG03,
	OSS_LUCKDRAW_BG04];

export default {
	data() {
		return {
			BG_IMG,
			nowBgIndex: 0,
		};
	},
	methods: {
		handleChangeBackgroud() {
			this.handleAnimate();
			if (this.nowBgIndex === BG_IMG.length - 1) {
				this.nowBgIndex = 0;
			} else {
				this.nowBgIndex = this.nowBgIndex + 1;
			}
		},
		handleAnimate() {
			this.$refs.skin.style.transform = 'translateY(-50px)';
			setTimeout(() => {
				this.$refs.skin.style.transform = 'translateY(-60px)';
			}, 300);
		}
	}
};
</script>
<style lang="scss" scoped>
.c-skin-change {
    ._background {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -10;
		.__img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
    ._skin {
		position: absolute;
		transform: translateY(-60px);
		transition: all .8s cubic-bezier(0.6, 4, 1, -0.27);
		right: 60px;
		.__line {
			width: 2px;
			height: 80px;
			background: rgba(191,37,41,1);
			transform: translateX(40px);
		}
		.__btn {
			width: 80px;
			height: 32px;
			cursor: pointer;
			text-align: center;
			line-height: 32px;
			background: rgba(191,37,41,1);
			border-radius: 4px;
			user-select: none;
			color: #ded7d7;
		}
	}
}
</style>


