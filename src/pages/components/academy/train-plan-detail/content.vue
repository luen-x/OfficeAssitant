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
			<router-view class="__router-view"/>
		</div>
	</div>
</template>

<script>
// import Breadcrumb from "./_common/breadcrumb";
import getHrTrainRoute from './academy';

export default {
	components: {
		// 'oa-breadcrumb': Breadcrumb
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
	},
	methods: {
		handleRouteChange(route) {
			const tagetRoute = route.path;
			this.$router.push({ path: tagetRoute, query: { course_id: this.$route.query.course_id || '1' } });
		},
	}
};
</script>

<style lang="scss">
.v-academy-train-detail {
	height: 100%;
	padding: 20px 0 0 20px;
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


