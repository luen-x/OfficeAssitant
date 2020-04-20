<template>
	<div :class="'c-title _mode-'+mode">
		<span class="_left-border-bar"/>
		<slot>{{ title }}</slot>
	</div>
</template>
<script>
export default {
	name: 'c-title',
	components: {

	},
	props: {
		title: String,
		mode: {
			type: String,
			default: 'black' // or  red
		}
	},
	data() {
		return {
		};
	},
	methods: {
	}
};
</script>
<style lang="scss">
.c-title {
	display: inline-block;
	._left-border-bar {
		display: inline-block;
		width: 2px;
		position: relative;
		top: 2px;
		background-color: #e74854;
		margin-right: 5px;
	}
	&._mode-red {
		font-size: 16px;
		line-height: 16px;
		color:#e74854;
		._left-border-bar {
			height: 16px;
		}

	}
	&._mode-black {
		font-size: 14px;
		line-height: 14px;
		color: #4b4f57;
		._left-border-bar {
			height: 14px;
			
		}
	}

}
</style>