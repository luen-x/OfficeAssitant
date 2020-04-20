<template>
	<div class="v-sale-pk_head  g-fs-14 g-c-black4">
		<span class="_return _link" @click="handleReturn">返回</span>
		<i class="iconfont icon-vertical-line g-m-l-10" />
		<span class="g-pd-l-10">
			<!-- <span class="_link" @click="$router.push('/sale/main')">我的首页</span>&nbsp; -->
			<!-- <span class="">/&nbsp;</span> -->
			<span class="g-c-black1">PK</span>
		</span>
	</div>
</template>
<script>
export default {
	name: 'oa-pk-head',
	data() {
		return {

		};
	},
	mounted() {
	},
	methods: {
		handleReturn() {
			this.$router.push('/sale/main');
		}
	},
};
</script>

<style lang="scss" scoped>
  .v-sale-pk_head {
		background-color: #fff;
    width: 100%;
    position: fixed;
    height: 44px;
		line-height: 44px;
    top: 54px;
    left: 160px;
    z-index: 4;
		box-shadow: 0 0px 12px -1px rgba(221, 222, 225, 0.5);
		._return {
			padding-left: 40px;
		}
		._link {
		cursor: pointer;
		&:hover {
			color: #e74854;
		}
	}
  }
</style>

