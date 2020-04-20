<template>
	<footer class="c-page-footer g-flex-cc">
		<template v-if="$slots.default">
			<slot />
		</template>
		<template v-else>
			<div 
				class="g-gray-btn-small g-m-r-10" 
				@click="handleCancel"
			>
				{{ cancelText }}
			</div>
			<vc-debounce-click 
				class="g-red-btn-small" 
				@click="handleOk"
			>
				{{ okText }}
			</vc-debounce-click>
		</template>
	</footer>
</template>

<script>
export default {
	name: 'c-page-footer',
	components: {

	},
	props: {
		cancelText: {
			type: String,
			default: '取消'
		},
		okText: {
			type: String,
			default: '保存'
		},
	},
	data() {
		return {
		};
	},
	computed: {

	},
	watch: {
		
	},
	created() {
		
	},
	methods: {
		handleCancel() {
			this.$emit('cancel');
		},
		handleOk() {
			this.$emit('ok');
		}
	},
};
</script>

<style lang="scss">
.c-page-footer {
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: #ffffff;
	width: 100%;
	height: 60px;
	box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
}
</style>
