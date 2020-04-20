<template>
	<div class="c-layout-top-bar">
		<i class="icon iconfont icon-close g-pointer g-fs-18" style="position: absolute;right: 30px;top: 16px;" @click="$router.go(-1)" />
		<div class="_bar g-flex-ac g-fw-w g-flex-cc" >
			<div
				:class="curRoute.indexOf('/sale/call/manage') > -1 ? '__menu-item-active' : '__menu-item-unactive'" 
				class="__menu-item"
				@click="handleLinkTo('/sale/call/manage')"
			>
				拨号管理
			</div>
			<div
				v-if="$auth[601]"
				:class="curRoute.indexOf('/sale/call/record') > -1 ? '__menu-item-active' : '__menu-item-unactive'" 
				class="__menu-item "
				@click="handleLinkTo('/sale/call/record')"
			>
				通话记录
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'oa-sale-call-top-nav',
	props: {
		menus: {
			type: Array,
			default() { return []; }
		},
		onMounted: {
			type: Function,
			default: () => {}
		}
	},
	computed: {
		curRoute() {
			return this.$route.path;
		},
	},
	created() {
		document.body.addEventListener('keyup', this.handleKeyup);
	},
	beforeDestroy() {
		document.body.removeEventListener('keyup', this.handleKeyup);
	},
	methods: {
		handleLinkTo(path) {
			this.$router.replace(path);
		},
		handleKeyup(event) {
			if (event.keyCode == 27) {
				this.$router.go(-1);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.c-layout-top-bar {
	position: fixed;
	top: 56px;
	left: 0px;
	right: 0;
	z-index: 4;
	background-color: #ffffff;
	._bar {
		border-bottom: 1px solid #e1e3e5;
		.__menu-item {
			height: 60px;
			line-height: 60px;
			font-size: 16px;
			margin-right: 40px;
			cursor: pointer;
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
	}
	
	._child-bar {
		padding: 0 30px;
		box-shadow: 0 5px 12px -3px rgba(221, 222, 225, 0.5);
		.__child-item {
			height: 42px;
			line-height: 42px;
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


