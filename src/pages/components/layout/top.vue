<template>
	<div class="c-layout-top-bar">
		<div v-if="menus.length > 1" class="_bar g-flex-cc g-fw-w">
			<div 
				v-for="(menu) in menus.filter(item=>item.show)"
				:key="menu.route"
				:class="$route.path.indexOf(menu.route) > -1 ? '__menu-item-active' : '__menu-item-unactive'" 
				class="__menu-item g-noselect"
				@click="handleLinkTo(menu, menu.showSelf)"
			>
				<span class="g-relative">
					{{ menu.name }}
					<span v-if="notice[menu.route] === 1" class="__red-dot" />
				</span>
			</div>
		</div>
		<div v-if="childMenus.length > 0 && !isHide" class="_child-bar g-flex-ac g-fw-w" >
			<div
				v-for="(child) in childMenus.filter(item=>item.show)"
				:key="child.route"
				:class="$route.path.indexOf(child.route) > -1 ? '__child-item-active' : '__child-item-unactive'" 
				class="__child-item g-noselect"
				@click="handleLinkTo(child)"
			>
				{{ child.name }}
			</div>
		</div>
		<i 
			v-if="fullRouter && isAutoGenerate"
			class="icon iconfont icon-close g-pointer g-fs-18 _close"
			@click="handleBack" 
		/>
	</div>
</template>

<script>
import { getItem, setItem, delItem, getIndexRoute, goBack } from '@utils/utils';
import { AutoGenerate } from './hack/full-router';


export default {
	name: 'layout-top-nav',
	props: {
		menus: {
			type: Array,
			default() { return []; }
		},
		onMounted: {
			type: Function,
			default: () => {}
		},
		routePath: String,
		fullRouter: Boolean,
	},
	computed: {
		isHide() {
			let routes = this.getChildMenus();
			let current = routes.filter((item) => item.route == this.$route.path);
			// 没有四级导航时 默认隐藏顶部二级导航栏
			if (current.length === 0) return true;

			return current[0].isHide;
		},
		childMenus() {
			return this.getChildMenus();
		},
		notice() {
			return this.$store.state.socketCommon;
		},
		isAutoGenerate() {
			// 顶部导航自动生成的
			return AutoGenerate.includes(this.routePath);
		},

	},
	mounted() {
		this.getTopBarHeight();
		// 监听esc事件
		// document.body.addEventListener('keyup', this.handleEsc);
	},
	updated() {
		this.getTopBarHeight();
	},
	beforeDestroy() {
		// document.body.removeEventListener('keyup', this.handleEsc);
	},
	methods: {
		handleLinkTo(menu, showSelf) {
			if (showSelf) {
				this.$router.push(menu.route);
			} else {
				this.$router.push(menu.children ? getIndexRoute(menu.children) : menu.route);
			}
		},
		handleEsc(event) {
			if (this.fullRouter && event.keyCode == 27) {
				this.$router.back();
			}
		},
		getTopBarHeight() {
			const { onMounted } = this;
			onMounted && onMounted(this.$el.clientHeight);
		},
		getChildMenus() {
			let menu = this.menus.filter((item) => this.$route.path.indexOf(item.route) > -1)[0] || {};
			let routes = (menu.children || []).filter((item) => item.show);
			return routes || [];
		},
		handleBack() {
			const closePath = getItem('closePath_' + _global.version);
			goBack(closePath);
			// closePath ? this.$router.push(closePath) : this.$router.back();
		},
		
	}
};
</script>

<style lang="scss" scoped>
.c-layout-top-bar {
	position: relative;
	background-color: #ffffff;
	._close {
		position: absolute;
		right: 30px;
		top:50%;
		transform:translateY(-50%);
	}
	._bar {
		box-sizing: border-box;
		border-bottom: 1px solid #e1e3e5;
		.__menu-item {
			height: 46px;
			line-height: 46px;
			font-size: 16px;
			margin-right: 20px;
			margin-left: 20px;
			cursor: pointer;
			.__red-dot {
				position: absolute;
				top: 0px;
				right: -6px;
				width: 6px;
				height: 6px;
				border-radius: 3px;
				background-color: #f14b5f;
			}
			// &:last-of-type {
			// 	margin-right: 0px;
			// }
		}
		.__menu-item-unactive {
			color: #818794;
			opacity: 0.8;
			&:hover {
				opacity: 1;			
				will-change: opacity;
				transition: opacity 0.2s ease-in-out;
			}
		}
		.__menu-item-active {
			color: #f14b5f;
			border-bottom: 3px solid #f14b5f;
			box-sizing: border-box
		}

		.__prompt{
			line-height: 1;
			vertical-align: middle;
			position: absolute;
			-webkit-transform: translateX(85%);
			transform: translateX(85%);
			top: -10px;
			right: 0;
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
	}
	
	._child-bar {
		padding: 0 30px;
		box-shadow: 0 5px 12px -3px rgba(221, 222, 225, 0.5);
		.__child-item {
			height: 40px;
			line-height: 40px;
			font-size: 14px;
			margin-right: 40px;
			cursor: pointer;
		}
		.__child-item-unactive {
			color: #333333;
			opacity: 0.8;
			&:hover {
				opacity: 1;	
				color: #f14b5eb1;		
				will-change: opacity;
				transition: all 0.2s ease-in-out;
			}
		}
		.__child-item-active {
			color: #f14b5f;
			box-sizing: border-box
		}
	}
}
</style>


