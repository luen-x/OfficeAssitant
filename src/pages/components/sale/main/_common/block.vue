<template>
	<div class="v-sale-main-block">
		<div
			:style="{paddingLeft:paddingLeft+'px'}"
			style="height: 46px;line-height: 46px;background: #f8f8f8;"
			class="g-c-black1 g-flex-cc"
		>
			<span class="g-tc g-col g-fs-14" >{{ title }} </span>
			<slot v-if="showExtra" name="extra">
				<span
					class="g-operation"
					style="padding-right: 20px; font-size:14px"
					@click="()=>{ this.$emit('getDetail')}" 
				>更多</span>
			</slot>
		</div>
		<slot/>
	</div>
</template>

<script>
export default {
	components: {

	},
	props: {
		title: {
			type: String,
			default: '标题'
		},
		paddingLeft: {
			type: Number,
			default: 40,
		},
		showExtra: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {

		};
	},
	methods: {
		handleOpenDetail() {

		}
	}
};
</script>

<style lang="scss">
.v-sale-main-block{
	background-color: rgba(0, 0, 0, 0);
	box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
	height: inherit;
}
</style>
