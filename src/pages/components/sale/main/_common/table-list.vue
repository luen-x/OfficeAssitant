<template>
	<div :style="{height:height+'px'}" class="v-sale-table-list">
		<div style="height:40px;padding-left:40px;border-bottom: 1px solid #E8E8E8" class="g-flex g-jc-sb g-flex-cc" >
			<slot name="header">
				<span class="g-col">战区</span><span class="g-col">添加客户</span><span class="g-col">领取客户</span>
			</slot>
		</div>
		<div style="margin-left:40px">
			<slot>
				<div class="g-flex-cc g-flex-ac g-m-t-20">
					<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
				</div>
			</slot>
		</div>
	</div>
</template>

<script>
import { OSS_SEARCH_EMPTY } from "@constants/constants";

export default {
	components: {

	},
	props: {
		height: {
			type: [String, Number],
			default: 300,
		}
	},
	data() {
		return {
			OSS_SEARCH_EMPTY
		};
	},
};
</script>

<style  lang="scss">
.v-sale-table-list{
	border:1px solid #e8e8e8;
}
</style>
