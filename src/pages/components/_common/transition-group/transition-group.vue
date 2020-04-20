<template>
	<transition-group :name="'c-transition-'+name" :tag="tag" class="g-relative">
		<slot/>
	</transition-group>
</template>
<script>

export default {
	name: 'oa-c-transition-group',
	props: {
		tag: {
			type: String,
			default: 'div'
		},
		name: {
			type: String,
			default: 'fade'
		}
	}
};
</script>
<style lang="scss">
.c-transition-fade-enter {
	opacity: 0;
	transition:all .5s ease;
}
.c-transition-fade-enter-active {
	transition:all .5s ease;
}
.c-transition-fade-move {
	transition:all .5s ease;
}
.c-transition-fade-leave {
	position: absolute;
	transition:all .5s ease;
}
.c-transition-fade-leave-active {
	position: absolute;
	transition:all .5s ease;
}
.c-transition-fade-leave-to {
	position: absolute;
	transition:all .5s ease;
	opacity: 0;
}
</style>