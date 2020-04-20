<template>
	<div class="v-uniq-scroll" @scroll="handleScroll">
		<slot />
	</div>
</template>

<script>
export default {
	name: 'uniq-scroll',
	props: {
		loadData: Function
	},
	methods: {
		handleScroll(e) {
			const scrollDom = e.target;
			const displacement = scrollDom.scrollHeight - scrollDom.clientHeight - scrollDom.scrollTop;
			if (displacement === 0) {
				this.loadData();
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.v-uniq-scroll {
	max-height: 170px;
	overflow-y: scroll;
}
</style>


