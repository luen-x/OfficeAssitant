<template>
	<div class="c-layout-left-menu g-relative">
		<slot name="avatar" />
		<div
			v-for="(menu, index) in menusShow.filter(m=>!m.fullRouter)"
			:key="index"
			:class="routePath.indexOf(menu.route) > -1 ? '_menu-item-active' : '_menu-item-unactive'"
			:title="menu.name"
			class="_menu-item g-noselect g-oneline"
			@click="handleLinkTo(menu)"
		>
			<i :class="menu.icon" class="iconfont g-m-r-10" />
			{{ menu.name }}
		</div>
	</div>
</template>

<script>
import { getIndexRoute, getItem, setItem, delItem } from '@utils/utils';

const SPECIAL_ROUTE = ['/sale/main'];
export default {
	name: 'layout-left-menus',
	props: {
		menus: {
			type: Array,
			default() {
				return [];
			}
		},
		routePath: String,
	},

	data() {
		return {
		};
	},
	computed: {
		menusShow() {
			if (this.$route.path.startsWith('/hr/personnel')) {
				return getItem('avatarLeftMenus_' + this.$global.version) || [];
			} else {
				return this.menus;
			}
		}
	},
	methods: {
		handleLinkTo(menu) {
			this.$router.push(menu.children ? getIndexRoute(menu.children) : menu.route);
		}
	}
};
</script>

<style lang="scss" scoped>
.c-layout-left-menu {
	background-color: #f5f5f7;
	width: 160px;
	height: 100%;
	float: left;
	transition: width .2s linear;
	overflow-y: auto;
	._menu-item {
		height: 40px;
		line-height: 40px;
		padding-left: 20px;
		font-size: 14px;
		cursor: pointer;
		margin-bottom: 8px;
		will-change: border-left;
		transition: border-left .2s linear;
	}
	._menu-item-unactive {
		color: #818794;
		&:hover {
			background-color: #f2f1f4;
			opacity: 1;
			will-change: opacity;
			transition: opacity 0.2s ease-in-out;
		}
	}
	._menu-item-active {
		background-color: #eeedf2;
		color: #f14b5f;
		border-left: 4px solid #f14b5f;
	}

	._prompt{
		display: inline-block;
		line-height: 1;
		vertical-align: middle;
		-webkit-transform: translateX(23%);
		transform: translateX(23%);
		height: 16px;
		border-radius: 10px;
		min-width: 25px;
		background: #ed4014;
		border: 1px solid transparent;
		color: #fff;
		line-height: 15px;
		text-align: center;
		padding: 0 6px;
		font-size: 12px;
		white-space: nowrap;
		-webkit-transform-origin: -10% center;
		transform-origin: -10% center;
		z-index: 10;
		box-shadow: 0 0 0 1px #fff;
		.__text {
			display: inline-block;
			transform: scale(.8);
		}
	}

	._views{
		color: #2397F9;
		bottom: 20px;
		left: 46px;
	}
}
</style>
