<template>
	<div class="c-breadcrumb g-flex-ac g-c-black4">
		<div class="_link" @click.prevent="handleBack">返回</div>
		<i class="iconfont icon-vertical-line g-m-lr-10" />
		<div 
			v-for="(route, index) in routes"
			:key="index"
		>
			<span 
				:class="index === routes.length - 1 ? 'g-c-black2' : route.path && '_link'"
				@click="handleTo(route)"
			>
				{{ route.name }}
			</span>
			<span v-if="index < routes.length - 1" class="_divider">/</span>
		</div>
	</div>
</template>

<script>
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'common-breadcrumb',
	props: {
		routes: {
			type: Array,
			default() {
				return [];
			}
		},
		beforeBack: Function
	},
	methods: {
		async handleBack() {
			const { beforeBack } = this;
			let canback = true;
			if (beforeBack) {
				canback = await beforeBack();
			}
			canback && this.$router.back();
		},
		handleTo(route) {
			route.path && this.$router.push(getHashUrl(
				route.path,
				{ 
					project_id: this.$route.query.project_id 
				}
			));
		}
	}
};
</script>

<style lang="scss">
.c-breadcrumb {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	height: 44px;
	line-height: 44px;
	background-color: #ffffff;
	padding-left: 40px;
	font-size: 14px;
	box-shadow: 0 5px 12px -3px rgba(221, 222, 225, 0.5);
	user-select: none !important;
	._link {
		cursor: pointer;
		&:hover {
			color: #e74854;
		}
	}
	._divider {
		margin: 0 6px;
	}
}
</style>


