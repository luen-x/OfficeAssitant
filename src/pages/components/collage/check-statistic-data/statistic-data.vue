<template>
	<div class="g-pd-t-20 g-pd-lr-20">
		<oa-nest/>
		<oa-quality-number class="g-m-t-30"/>
		<oa-method-number class="g-m-t-30 g-m-b-30"/>
	</div>
</template>

<script>
import Nest from "./nest";
import QualityNumber from "./quality-number";
import MethodNumber from "./method-number";

export default {
	name: "oa-static-data",
	components: {
		"oa-nest": Nest,
		"oa-quality-number": QualityNumber,
		"oa-method-number": MethodNumber
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
</style>