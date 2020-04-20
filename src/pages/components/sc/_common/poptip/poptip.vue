<template>
	<div class="v-sc-cooperate-poptip">
		<i-poptip :transfer="true" placement="right" trigger="hover">
			<i class="iconfont icon-tag g-c-red-dark g-m-l-10"/>
			<i-tag 
				v-for="(item,index) in tag"
				slot="content"
				:key="index" 
				color="#d9444f"
			>
				{{ item }}
			</i-tag>
		</i-poptip>
	</div>
</template>

<script>
import { Tag, Poptip } from "iview";

export default {
	components: {
		"i-poptip": Poptip,
		"i-tag": Tag
	},

	props: {
		tag: Array
	}
};
</script>

<style lang="scss">
.v-sc-cooperate-poptip{
    display: inline-block;
}

.ivu-tag{
	line-height: 20px;
}

.ivu-poptip-popper{ 
	min-width: 80px !important;
}
</style>