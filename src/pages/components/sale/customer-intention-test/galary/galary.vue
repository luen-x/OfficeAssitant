<template>
	<div ref="container" class="v-test-galary" @click="handleClickBackGround">
		<oa-photo v-for="(item,index) in photos" :key="index" v-bind="item" @active-change="handleActiveChange(item)" />
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { OSS_NO_MESSAGE03, OSS_NO_MESSAGE04, OSS_NO_MESSAGE05 } from '@constants/constants';
import Photo from './photo';

export default {
	name: 'oa-galary',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-photo': Photo
	},
	props: {
		imgs: {
			type: Array,
			default: () => ([OSS_NO_MESSAGE03, OSS_NO_MESSAGE04, OSS_NO_MESSAGE05])
		}

	},
	data() {
		return {
			photos: [],
			width: 0,
			height: 0
		};
	},
	mounted() {
		this.width = this.$refs.container.clientWidth;
		this.height = this.$refs.container.clientHeight;
		this.photos = this.getInitPhotos(this.imgs);
	},
	methods: {
		getInitPhotos(ps) {
			return ps.map(p => {
				return {
					position: { 
						left: Math.random() * (this.width - 120),
						top: Math.random() * (this.height - 120), 
					},
					center: {
						left: this.width / 2 - 50,
						top: this.height / 2 - 50

					},
					rotate: Math.random() * 180 - 90,
					img: p,
					active: false,

				};
			});


		},
		handleActiveChange(item) {
			this.photos.forEach(it => {
				if (it === item) {
					it.active = !it.active;
				} else {
					it.active = false;
					it.zIndex = '';
				}
			});
		},
		handleClickBackGround() {
			this.handleActiveChange();

		}
	}
};
</script>
<style lang="scss">
.v-test-galary {
	background: lightskyblue;
	width: inherit;
	height: 400px;
	position: relative;
}
</style>