<template>
	<div class="v-sale-product-explain">
		{{ name.length > 17 ? name.substr(0, 17) + '...' : name }}
		<i-poptip 
			ref="poptip"  
			:title="name" 
			:content="describe" 
			:width="300"
			word-wrap
			trigger="hover"
			transfer
		>
			<i class="iconfont icon-question g-c-orange-mid g-m-lr-20 g-pointer" @mousewheel="handleMouseWeel" />
		</i-poptip>
	</div>
</template>
<script >
import { Poptip } from 'iview';

export default {
	name: "oa-sale-product-explain",
	components: {
		'i-poptip': Poptip
	},
	props: {
		name: String,
		describe: String
	},
	methods: {
		handleMouseWeel() {
			this.$refs.poptip.cancel();
		}
	} 
};
</script>
<style lang="scss" >
.v-sale-product-explain {
	.ivu-poptip-content {
		max-width: 400px
	}
}

</style>

