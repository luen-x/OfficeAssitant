<template>
	<div class="v-miss-match">
		<img :src="img" >
		<span class="g-m-t-20">你目前登录的账号不能填写该单据, 请退出后重新登录</span>
		<i-button class="g-m-t-20" type="primary" @click="handleSignOut">退出登录</i-button>
	</div>
</template>

<script>
import { OSS_NOBASE } from '@constants/constants';
import { clearLoginAuth } from '@routers/hooks';
import { Button } from 'iview';

export default {
	name: 'oa-miss-match',
	components: {
		'i-button': Button
	},
	data() {
		return {
			img: OSS_NOBASE
		};
	},
	methods: {
		handleSignOut() {
			sessionStorage.removeItem('notice');
			clearLoginAuth();
		}
	}
};
</script>

<style lang="scss" scoped>
.v-miss-match {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
</style>


