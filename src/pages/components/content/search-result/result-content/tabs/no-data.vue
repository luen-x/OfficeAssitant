<template>
	<div class="g-fw-w v-content-detail-tabs-no-data">
		<div class="_content-wrapper">
			<div class="_image">
				<img :src="OSS_SEARCH_CUSTOMER">
			</div>
			<div class="_text">没有搜索到相关内容，请更改搜索条件后重新搜索</div>
		</div>
	</div>
</template>

<script>
import { OSS_SEARCH_CUSTOMER } from '@constants/constants';

export default {
	name: 'content-detail-tabs-no-data',
	data() {
		return {
			OSS_SEARCH_CUSTOMER
		};
	},
	computed: {
	},
	created() {
	},
	methods: {

	}
};
</script>

<style lang="scss" scoped>
.v-content-detail-tabs-no-data {
	._content-wrapper {
		padding-left: 200px;
		._image{
			height: 220px;
			width: 240px;
			text-align: center;
		}
		._text {
			color: #000;
		}
	}
}
</style>


