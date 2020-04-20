<template>
	<div class="v-admins-tailor">
		<i-tooltip
			v-if="content.length > length"
			:content="content"
			:max-width="200"
			transfer
		>
			{{ content.substr(0, length) + '...' }}
		</i-tooltip>
		<span v-else>{{ content }}</span>
	</div>
</template>

<script>
import { Tooltip } from 'iview';

export default {
	name: 'admins-tailor',
	components: {
		'i-tooltip': Tooltip
	},
	props: {
		content: String,
		length: {
			type: Number,
			default: () => 10
		}
	}
};
</script>

<style lang="scss" scoped>
.v-admins-tailor {
	display: inline-block;
}
</style>

