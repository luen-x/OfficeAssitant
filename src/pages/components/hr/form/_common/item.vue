<template>
	<div class="c-hr-interview-item">
		<span v-if="typeof (content) == 'number'">{{ content==1?'是':'否' }}</span>
		<span v-else-if="typeof (content) == 'string'">{{ content }}</span>
		<span v-else>--</span>
	</div>
</template>

<script>
export default {
	name: "c-hr-interview-item",
	components: {},
	props: {
		content: String | Number,
	},
	data() {
		return {};
	},
	created() {},
	methods: {}
};
</script>

