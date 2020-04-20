<template>
	<div class="v-academy-train-detail">
		<div class="_left g-fs-14">
			<div 
				v-for="route in routeConfig.filter(v => v.show)" 
				:key="route.path"
				:class="[{ '__active': $route.path.includes(route.path)}, route.icon ? 'l-c-black2' : ['l-c-black4', 'g-pd-l-30']]"
				class="__route"
				@click="handleRouteChange(route)">
				<i
					v-if="route.icon"
					:class="['icon', 'iconfont', route.icon]"
					class="g-fs-14 g-c-blue-mid"
				/>
				{{ route.name }}
			</div>
		</div>
		<div class="_right">
			<div class="__breadcrumb">
				<oa-breadcrumb 
					v-if="routes.breadcrumbRoutes && routes.breadcrumbRoutes.length > 0" 
					:routes="routes.breadcrumbRoutes"
				/>
			</div>
			<div v-if="routes.showNav" class="__nav">
				<span 
					v-for="subRoute in routes.navRoutes" 
					:key="subRoute.path"
					:class="[{'__subActive': subRoute.path === $route.path}, 
						{'__border': subRoute.path === $route.path && routes.navRoutes.length > 1}]"
					class="__sub-route"
					@click="handleSubRouteChange(subRoute)">
					{{ subRoute.name }}
				</span>
			</div>
			<router-view class="__router-view"/>
		</div>
	</div>
</template>

<script>
import Breadcrumb from "./_common/breadcrumb";
import getHrTrainRoute from './academy';

export default {
	components: {
		'oa-breadcrumb': Breadcrumb
	},
	data() {
		return {
			// routeConfig: getHrTrainRoute(this.$auth, this.$route).filter(v => v.show)
		};
	},
	computed: {
		routeConfig() {
			return getHrTrainRoute(this.$auth, this.$route).filter(v => v.show);
		},
		routes() {
			const { index, leftIndex } = this.handleSearchRouteIndex();
			const breadcrumbRoutes = this.routeConfig[leftIndex].children[index].routes;
			const navRoutes = this.routeConfig[leftIndex].children[index].children.filter(v => v.show);
			const showNav = this.routeConfig[leftIndex].children[index].showNav;
			return {
				breadcrumbRoutes, navRoutes, showNav
			};
		}
	},
	methods: {
		handleRouteChange(route) {
			const tagetRoute = route.children[0].children[0].path;
			this.$router.push({ path: tagetRoute, query: { project_id: this.$route.query.project_id || '1' } });
		},
		handleSubRouteChange(route) {
			const { query = {}, fullPath } = this.$route;
			const exclude = ['depart_id']; // 小路由切换时不需要的携带的id
			const _query = {};
			if (fullPath.includes(route.path)) return;
			Object.keys(query).forEach(v => {
				if (v.includes('id') && !exclude.includes(v)) {
					_query[v] = query[v];
				}
			});
			this.$router.push({
				path: route.path,
				query: {
					..._query
				}
			});
		},
		handleSearchRouteIndex() {
			let leftIndex = 0;
			let index = 0;
			// index = +this.$route.path.split('/')[6];
			let nowPath = this.$route.path.split('/').slice(0, 6).join('/');
			let subPath = this.$route.path.split('/').slice(0, 7).join('/');
			this.routeConfig.forEach((route, i) => {
				if (route.path === nowPath) {
					leftIndex = i;
				}
			});
			this.routeConfig[leftIndex].children.forEach((route, i) => {
				if (route.path === subPath) {
					index = i;
				}
			});
			return {
				index, leftIndex
			};
		}
	}
};
</script>

<style lang="scss">
.v-academy-train-detail {
	height: 100%;
	padding: 15px 0 0 20px;
	._left {
		padding: 5px 0 0 20px;
		width: 160px;
		float: left;
		height: 100%;
		background-color: #f5f5f6;
	}
	._right {
		height: 100%;
		overflow: hidden;
		padding-top: 10px;
	}
	.__breadcrumb {
		padding-left: 20px;
		margin-top: -10px;
		.c-breadcrumb {
			position: static;
			height: 36px;
			line-height: 36px;
			background-color: #F5F5F6;
			border-bottom: 1px solid #D4D7DB;
			margin-bottom: 10px;
			box-shadow: none;
			& > ._link {
				color: #2397F9!important
			}
		}
	}
	.__nav {
		font-size: 14px;
		padding-left: 20px;
		cursor: pointer;
	}
	.__route {
		height: 35px;
		line-height: 35px;
		cursor: pointer;
	}
	.__subActive {
		color: #E74854!important;
	}
	.__subActive.__border {
		border-bottom: 2px solid #E74854;
	}
	.__sub-route {
		padding-bottom: 8px;
		text-align: center;
		display: inline-block;
		margin-right: 45px;
		color: #818794
	}
	.__active {
		color: #2397F9!important
	}
	.l-c-black2 {
		color: #333
	}
	.l-c-black4 {
		color: #818794
	}
	.__router-view {
		width: 100%;
		height: calc(100% - 35px);
		overflow-y: auto;
		overflow-x: hidden;
	}
}
</style>


