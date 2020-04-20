<template>
	<i-input :placeholder="placeholder" :style="styleObj" type="textarea" />
</template>

<script>
import { Input } from "iview";

export default {
	name: "sc-textarea",
	components: {
		"i-input": Input
	},
	props: {
		styleObj: Object,
		placeholder: String
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
</style>


