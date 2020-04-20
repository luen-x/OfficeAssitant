<template>
	<ul ref="bg" class="v-login-bg">
		<li class="_fade-enter">
			<img :src="OSS_LOGIN_BG01">
		</li>
		<li>
			<img :src="OSS_LOGIN_BG02">
		</li>
		<li>
			<img :src="OSS_LOGIN_BG03">
		</li>
		<li>
			<img :src="OSS_LOGIN_BG04">
		</li>
	</ul>
</template>

<script>
import { 
	OSS_LOGIN_BG01,
	OSS_LOGIN_BG02,
	OSS_LOGIN_BG03,
	OSS_LOGIN_BG04
} from '@constants/constants';

export default {
	name: 'oa-login-bg',
	data() {
		return {
			OSS_LOGIN_BG01,
			OSS_LOGIN_BG02,
			OSS_LOGIN_BG03,
			OSS_LOGIN_BG04,
			index: 0,
			imgs: [],
		};
	},
	mounted() {
		this.imgs = this.$refs.bg.children;
		// this.imgs[0].className = '_fade-enter';
		this.animateStart();
	},
	beforeDestroy() {
		this.timer && clearInterval(this.timer);
	},
	methods: {
		animateStart() {
			setTimeout(() => {
				if (this.index === 3) {
					this.imgs[3].className = '_fade-leave';
					this.imgs[0].className = '_fade-enter';
				} else {
					this.imgs[this.index].className = '_fade-leave';
					this.imgs[this.index + 1].className = '_fade-enter';
				}
				setTimeout(() => {
					if (this.index === 3) {
						this.index = 0;
					} else {
						this.index += 1;
					}
					this.animateStart();
				}, 2000);
			}, 3000);
		}
	}
};
</script>


<style lang="scss">
.v-login-bg {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: -1;
	li {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit:cover;
	}
	._fade-enter {
		animation: FadeEnter 2s cubic-bezier(0.18, 0.89, 0.32, 1);
		animation-fill-mode: both; // 以动画最终值展示
	}
	._fade-leave {
		animation-fill-mode: both; // 以动画最终值展示
		animation: FadeLeave 2s cubic-bezier(0.55, 0, 0.55, 0.2);
	}
}
@keyframes FadeEnter {
	0% {
		opacity: 0;
	}
	100% {
		// 最终形态
		opacity: 1;
	}
}

@keyframes FadeLeave {
	0% {
		opacity: 1;
	}
	100% {
		// 最终形态
		opacity: 0;
	}
}
</style>

