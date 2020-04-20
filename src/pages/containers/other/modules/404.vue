<template>
	<div class="v-404 g-flex g-jc-c g-ai-c">
		<div class="_bg">
			<img :src="notFound" alt="">
			<div class="_text">
				<div class="text1">我们在哪？</div>
				<div class="g-fs-16 g-m-b-10 text2">这不是我们要找的地盘啊</div>
				<div class="_btn g-bg-blue-light g-br-sem" @click="toPrev">
					返回上页
				</div>
				<div class="_btn g-bg-blue-light g-br-sem" @click="toLogin">
					重新登陆
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
// import { getParseUrl, getHashUrl } from "@utils/utils";
import { OSS_NOT_FOUND } from '../../../constants/constants';

export default {
	name: 'oa-404',
	components: {
		'i-button': Button
	},
	props: {

	},
	data() {
		return {
			notFound: OSS_NOT_FOUND
		};
	},
	computed: {

	},
	watch: {

	},
	created() {

	},
	methods: {
		toPrev() {
			this.$router.back();
		},
		toLogin() {
			this.$router.push('/login');
		}

	},
};
</script>

<style lang="scss" scoped>
.v-404 {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20%;
	min-width: 700px;
	min-height: 483px;
	background-color: #b8dce8;
	._bg {
		position: relative;
		min-width: 700px;
		min-height: 483px;
		img {
			max-width: 100%;
			max-height: 100%;
		}
		._text {
			position: absolute;
			top: 33%;
			left: 8%;
			.text1 {
				color: #32A5BA;
				font-size: 34px;
				font-weight: bold;
			}
			.text2 {
				color: #3F6B73;
				font-weight: 600;
			}
			._btn {
				padding: 8px 15px;
				display: inline-block;
				font-size: 18px;
				box-shadow: 0px 2px 6px 0px rgba(25, 156, 224, 0.5);
				display: inline-block;
				cursor: pointer;
			}
		}
	}
}
</style>
