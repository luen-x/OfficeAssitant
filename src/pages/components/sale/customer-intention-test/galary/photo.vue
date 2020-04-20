<template>
	<div :style="styleC" class="v-test-photo" @click="handleClick">
		<img :src="img" class="_photo">
		<div class="g-tc">
			{{ title }}
		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';

export default {
	name: 'oa-galary-photo',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		position: {
			type: Object,
			default: () => ({ left: 0, top: 0 })
		},
		rotate: {
			type: Number,
			default: 0
		},
		img: String,
		title: String,
		center: {
			type: Object,
			default: () => ({ left: 0, top: 0 })
		},
		active: Boolean
		

	},
	data() {
		return {
			zIndex: '',
			// active: false
		};
	},
	computed: {
		styleC() {
			const position = this.active ? this.center : this.position;
			const rotate = this.active ? 0 : this.rotate;
			const maxWidth = this.active ? 100 : 400;
			const maxHeight = this.active ? 100 : 400;
			const transform = this.active ? `scale(4)` : `rotate(${rotate}deg)`;
			const zIndex = this.active ? 10 : '';

			return { 
				left: position.left + 'px', 
				top: position.top + 'px', 
				transform,
				maxWidth: maxWidth + 'px',
				maxHeight: maxHeight + 'px',
				zIndex: this.zIndex
				
			};

		}

	},
	watch: {
		active(newVal) {
			if (newVal) {
				this.zIndex = 10;
			} else {
				setTimeout(() => {
					this.zIndex = '';
				}, 500);
			}
			
		}


	},
	methods: {
		handleClick() {
			window.event.stopPropagation();
			this.$emit('active-change');
			// this.active = !this.active;
		}
	}
};
</script>
<style lang="scss">
.v-test-photo {
	position: absolute;
	transition: all .5s ease-in-out ;
	transform: rotate(0deg);
	cursor: pointer;
	._photo {
		max-width: 100px;
		max-height: 100px;
	}

}
</style>