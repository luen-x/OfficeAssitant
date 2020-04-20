<template>
	<div 
		:style="{height,maxHeight}"
		class="ql-container ql-snow c-editor-preview"
	>
		<div 
			class="ql-editor"
			@click="handleClickEditor"
			v-html="content"
		/>
	</div>
</template>
<script>
import { ImgsPreview, Editor } from 'wya-vc';

export default {
	name: 'c-editor-preview',
	components: {
		'vc-editor': Editor // 注册Editor以引入其样式
	},
	props: {
		content: {
			default: '',
			type: String
		},
		maxHeight: {
			default: '',
			type: String
		},
		height: {
			default: '',
			type: String
		},
	},
	data() {
		return {
		};
	},
	methods: {
		handleClickEditor({ target }) {
			if (target.tagName === "IMG") {
				this.handlePreview(target);
			}
		},
		handlePreview(target) {
			let pos = {};
			let imgRex = /<img.*?(?:>|\/>)/gi;
			let imgArr = this.content.match(imgRex) || [];
			// eslint-disable-next-line no-useless-escape
			let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
			let dataSource = [];

			imgArr.forEach(item => {
				const matchs = item.match(srcReg);
				matchs && dataSource.push(matchs[1]);
			});
			let idx = dataSource.indexOf(target.src) || 0;

			try {
				const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
				const rect = target.getBoundingClientRect();
				pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
			} catch (err) {
				console.error(err);
			}
			ImgsPreview.popup({
				visible: true,
				// dataSource: [target.currentSrc],
				dataSource,
				opts: {
					index: idx,
					history: false,
					getThumbBoundsFn: (index) => pos
				}
			}).then(() => {

			}).catch(() => {

			});
		},
	}
};
</script>
<style lang="scss">
.c-editor-preview {
	&.ql-container.ql-snow {
		border:none
	}

	.ql-editor{
		padding: 0px;
		img {
			cursor: zoom-in
		}
	}
}
</style>