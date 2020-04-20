<template>
	<div class="c-loading">
		<div class="_mask"/>

		<transition name="slide-fade">
			<div class="_loading-container">
				<div class="_loading">
					<div class="_circle">
						<img src="./circle.png" alt="circle">
					</div>
					<div class="_logo g-absolute g-flex g-jc-c g-ai-c">
						<img src="./logo.png" alt="logo">
					</div>
				</div>
				<slot/>
			</div>
			
		</transition>
	</div>
</template>

<script>
export default {
	name: 'oa-loading',
	components: {

	},
	props: {
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

<style lang="scss" scoped>
.c-loading {
	position: absolute;
	width: 100%;
	height: 100%;
	.slide-fade-enter-active, .slide-fade-leave-active {
		transition: all 1.5s linear;
	}
	.slide-fade-leave-active {
		transition: all 0.5s linear;
	}
	.slide-fade-enter, .slide-fade-enter-active {
		opacity: 0;
	}
	.slide-fade-enter-to {
		opacity: 1;
	}
	.slide-fade-leave, .slide-fade-leave-active {
		opacity: 1;
	}
	.slide-fade-leave-to {
		opacity: 0;
	}
	._mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		opacity: 0.4;
		z-index: 100;
	}
	._loading {
		-webkit-transform: translate(-0%, -0%);
		transform: translate(-0%, -0%);
		@keyframes turn {
			25% {
				-webkit-transform: rotate(90deg);
				transform: rotate(90deg);
			}
			50% {
				-webkit-transform: rotate(180deg);
				transform: rotate(180deg);
			}
			75% {
				-webkit-transform: rotate(270deg);
				transform: rotate(270deg);
			}
			100% {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}
		._circle, ._logo {
			width: 60px;
			height: 60px;
		}
		._circle {
			-webkit-animation: rotate(360deg);
			animation: turn 1.5s infinite linear;
			img {
				width: 100%;
				height: 100%;
			}
		}
		._logo {
			top: 0;
			left: 0;
			img {
				width: 40px;
			}
		}
	}
	._loading-container {
		// top: 50%;
		// left: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: absolute;
		z-index: 300;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

	}
}
</style>
