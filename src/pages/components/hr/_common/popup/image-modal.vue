<template>
	<div 
		v-if="visible" 
		:class="{ 'hr-modal-hide': hide }"
		class="g-prevent-portal hr-image-modal g-flex " 
		@click="handleCancel">
		<div class="g-flex g-fw-w">
			<div v-for="(item, index) of dataSource" :key="index" class="_img">
				<img :src="item.url || item" v-bind="attrs">
			</div>
		</div>
	</div>
</template>

<script>
import { CreatePortal } from 'wya-vc';

export default {
	name: 'hr-image-modal',
	props: {
		dataSource: Array
	},
	data() {
		return {
			visible: false,
			hide: true,
			attrs: {
				height: 500
			}
		};
	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			this.hide = false;
		}, 0);
	},
	methods: {
		handleCancel() {
			this.hide = true;
			this.$emit('close');
		}
	}
};
export const ImagePreview = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.hr-modal-hide {
	transform: scale(0);
}
.hr-image-modal {
	position: fixed;
	top: 0;
	bottom: 0;
	overflow: auto;
	right: 0;
	left: 0;
	background: #000;
	z-index: 10000;
	padding: 20px;
	transition: transform .3s;

	._img {
		transition: transform .3s;
		margin-top: 50px;
		margin-left: 50px;
	}
	._img:hover {
		transform: scale(1.1)
	}
}
</style>


