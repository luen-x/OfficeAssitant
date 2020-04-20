<template>
	<div class="c-layout-top-bar">
		<div v-if="modules.length > 1" class="_bar g-flex-cc g-fw-w">
			<div 
				v-for="(menu) in modules"
				:key="menu.route"
				:class="$route.path.indexOf(menu.path) > -1 ? '__menu-item-active' : '__menu-item-unactive'" 
				class="__menu-item g-noselect"
				@click="handleLinkTo(menu)"
			>
				{{ menu.name }}
			</div>
		</div>
		<div v-if="curMenu.children && curMenu.children.length" class="_child-bar g-flex-ac g-fw-w" >
			<div
				v-for="(child) in curMenu.children.filter((item) => item.show)"
				:key="child.path"
				:class="$route.path.indexOf(child.path) > -1 ? '__child-item-active' : '__child-item-unactive'" 
				class="__child-item g-noselect"
				@click="handleLinkTo(child)"
			>
				{{ child.name }}
			</div>
		</div>
		<router-view />
	</div>
</template>

<script>
import { getItem, setItem, delItem, getHashUrl, getParseUrl } from '@utils/utils';
import Breadcrumb from "@common/breadcrumb/breadcrumb";
// import menus from './menu';
import { getChunks, getIndexRoute } from './menu';

export default {
	name: 'oa-tpl',
	components: {
	},
	data() {
		return {
			modulesData: getChunks(this.$auth),
			// menus
		};
	},
	computed: {
		curMenu() {
			return this.modulesData.find(item => this.$route.path.includes(item.path));
			// return this.menus.find(item => this.$route.path.includes(item.path));
		},
		modules() {
			return this.modulesData.filter(item => item.show);
		}
	},
	methods: {
		handleLinkTo(menu) {
			let { query = {} } = getParseUrl(); 
			const indexRoute = getIndexRoute(menu);
			this.$router.push({
				path: indexRoute,
				query: { staff_id: query.staff_id, staff_name: query.staff_name, from: query.from }

			});
			// if (menu.children && menu.children.filter(i => i.show).length) {
			// 	this.handleLinkTo(menu.children.filter(i => i.show).children[0]);	
			// } else {
			// 	this.$router.push(
			// 		getHashUrl(menu.path, { staff_id: query.staff_id, staff_name: query.staff_name, from: query.from })
			// 	);
			// }
			// if (menu.showSelf) {
			// 	let { query = {} } = getParseUrl(); 
			// 	this.$router.push(
			// 		getHashUrl(menu.path, { staff_id: this.$global.staff.staff_id, staff_name: query.staff_name, from: query.from })
			// 	);
			// } else {
			// 	let { query = {} } = getParseUrl(); 
			// 	this.$router.push(
			// 		getHashUrl(menu.children 
			// 			? menu.children[0].path
			// 			: menu.path, { staff_id: query.staff_id, staff_name: query.staff_name, from: query.from })
			// 	);
			// }
		},
		
		// handleLinkTochild(child) {
		// 	let { query = {} } = getParseUrl(); 
		// 	this.$router.push(
		// 		getHashUrl(child.path, { from: query.from })
		// 	);
		// }
	},
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
			margin-right: 40px;
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
