<template>
	<div
		:style="{right: toggle ? (spread ? spread :'708px'): '0px'}"
		class="v-collage-main-bookmark"
		@click="$emit('toggle')">
		{{ toggle ? '收起': '展开' }}
	</div>
</template>

<script>
export default {
	name: 'oa-bookmark',
	props: {
		toggle: Boolean,
		spread: String
	},
	data() {
		return {

		};
	},
	methods: {

	}
};
</script>

<style lang="scss" scoped>
.v-collage-main-bookmark {
	width: 60px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	background: #e84854;
	color: #fff;
	position: fixed;
	right: 0px;
	top: 66px;
	transition: right .3s;
	border-top-left-radius: 8px;
	border-bottom-left-radius: 8px;
	cursor: pointer;
}
.v-collage-main-bookmark::after {
	position: absolute;
	z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
	height: 100%;
	border-top-left-radius: 8px;
	border-bottom-left-radius: 8px;
	border: 8px solid #e84854;
	content: "";
	animation: statusProcessing 1.2s infinite ease-in-out;
}
@keyframes statusProcessing {
	0% {
		-webkit-transform: scale(0.9);
		transform: scale(0.9);
		transform-origin: right center;
		opacity: 0.7;
	}
	100% {
		-webkit-transform: scale(1.2, 1.5);
		transform: scale(1.2, 1.5);
		transform-origin: right center;
		opacity: 0;
	}
}
</style>

