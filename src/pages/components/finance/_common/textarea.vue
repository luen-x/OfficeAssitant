<template>
	<i-input
		:placeholder="placeholder" 
		type="textarea"
	/>
</template>

<script>
import { Input } from 'iview';

export default {
	name: 'finance-textarea',
	components: {
		'i-input': Input
	},
	props: {
		placeholder: String
	},
	data() {
		return {

		};
	}
};
</script>

<style lang="scss" scoped>

</style>


