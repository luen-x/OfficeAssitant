<template>
	<div
		class="vc-quill-editor"
		@paste="handlePasteImg($event)"
	>
		<slot v-if="$slots.toolbar" name="toolbar"/>
		<template v-else>
			<toolbar>
				<!-- <button id="img" style="outline: none" >
					<vc-upload
						v-bind="upload"
						accept="image/gif,image/jpeg,image/jpg,image/png" 
						style="outline: none"
						@file-success="handleImgSuccess"
						@file-error="$emit('file-error', arguments[0], arguments[1], arguments[2])"
					>
						<vc-icon type="image" />
					</vc-upload>
				</button> -->
				<span class="self-btn" >
					<vc-upload
						v-bind="upload"
						accept="image/gif,image/jpeg,image/jpg,image/png" 
						style="outline: none"
						@file-success="handleImgSuccess"
						@file-error="$emit('file-error', arguments[0], arguments[1], arguments[2])"
					>
						<vc-icon type="image" @mousedown.native.prevent />
					</vc-upload>
				</span>
				<span class="self-btn" >
					<vc-upload
						v-bind="upload"
						accept="video/mp4,audio/mp4" 
						style="outline: none"
						@file-success="handleVedioSuccess"
						@file-error="$emit('file-error', arguments[0], arguments[1], arguments[2])"
					>
						<i class="icon iconfont icon-video" style="position:relative;bottom:2px" @mousedown.prevent/>
					</vc-upload>
				</span>
				<!-- <button id="vedio" style="outline: none" @click.prevent >
					<vc-upload
						v-bind="upload"
						accept="image/gif,image/jpeg,image/jpg,image/png" 
						style="outline: none"
						@file-success="handleImgSuccess"
						@file-error="$emit('file-error', arguments[0], arguments[1], arguments[2])"
					>
						<i class="icon iconfont icon-video g-operation-hover"/>
					</vc-upload>
				</button> -->

				
				<!-- icon-video -->
				<slot name="extend" />
			</toolbar>
		</template>
		<div ref="editor"/>
	</div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import emitter from 'wya-vc/lib/extends/mixins/emitter'; // 表单验证
import { Upload, ImgsPreview, Icon } from 'wya-vc';
// import Upload from 'wya-vc/lib/upload/index';
import { getUid } from 'wya-vc/lib/utils/utils';
import { postFile } from '@components/sale/_common/manul-upload/postFile';
import Toolbar from './toolbar';
// import Icon from '../icon/index';
// import ImgsPreview from '../imgs-preview/index';
import defaultOptinos from './options';

const VideoBlot = Quill.import('formats/video');
class MyVideoBlot extends VideoBlot {
	static create(value) {
		let node = super.create(value);
		node.setAttribute('frameborder', '0');
		node.setAttribute('allowfullscreen', true);
		node.setAttribute('src', value);
		node.setAttribute('style', 'display: inline-block;width: 100%;height: 400px;');
		return node;
	}
}
// const BlockEmbed = Quill.import('blots/block/embed');
// class VideoBlot extends BlockEmbed {
// 	static create(value) {
// 		let node = super.create();
// 		node.setAttribute('src', value.url);
// 		node.setAttribute('controls', value.controls);
// 		node.setAttribute('width', value.width);
// 		node.setAttribute('height', value.height);
// 		node.setAttribute('webkit-playsinline', true);
// 		node.setAttribute('playsinline', true);
// 		node.setAttribute('x5-playsinline', true);
// 		node.setAttribute('style', value.style);
// 		return node;
// 	}
 
// 	static value(node) {
// 		return {
// 			url: node.getAttribute('src'),
// 			controls: node.getAttribute('controls'),
// 			width: node.getAttribute('width'),
// 			height: node.getAttribute('height'),
			
// 		};
// 	}
// }
// VideoBlot.blotName = 'video';
// VideoBlot.tagName = 'video';
// VideoBlot.className = 'ql-video';
Quill.register(MyVideoBlot);

export default {
	name: "vc-editor",
	components: {
		'toolbar': Toolbar,
		'vc-upload': Upload,
		'vc-icon': Icon
	},
	mixins: [emitter],
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		value: {
			type: String,
			default: ''
		},
		options: {
			type: Object,
			default() {
				return {};
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		upload: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			content: '',
			overlay: '',
			nowImg: '',
			boxes: []
		};
	},
	computed: {
		
	},
	watch: {
		disabled(newVal, oldVal) {
			if (this.editor) {
				this.editor.enable(!newVal);
			}
		},
		value(newVal, oldVal) {
			if (this.editor) {
				if (newVal && newVal !== this.content) {
					this.content = newVal;
					this.editor.clipboard.dangerouslyPasteHTML(newVal);
					this.editor.setSelection(newVal.length + 1);
				} else if (!newVal) {
					this.editor.setText('');
				}
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.init();
			this.initListener();
		});
	},
	beforeDestroy() {
		this.editor = null;
		delete this.editor;
	},
	methods: {
		init() {
			this.editor = new Quill(this.$refs.editor, { ...defaultOptinos, ...this.options });
			this.editor.enable(!this.disabled);

			if (this.value) {
				this.editor.setText('zhellll');
				this.editor.clipboard.dangerouslyPasteHTML(this.value);
			}
			
			this.editor.on('selection-change', range => {
				if (!range) {
					this.$emit('blur', this.editor);
				} else {
					this.$emit('focus', this.editor);
				}
			});

			// 监听文本内容变化
			this.editor.on('text-change', (delta, oldDelta, source) => {
				let html = this.$refs.editor.children[0].innerHTML;
				const editor = this.editor;
				const text = this.editor.getText();
				if (html === '<p><br></p>') html = '';
				
				this.content = html;

				const changeLink = delta.ops && delta.ops[1] && delta.ops[1].attributes && delta.ops[1].attributes.link;
				if (changeLink && !changeLink.startsWith('http')) {
					const pathArr = this.$route.fullPath.split('/');
					pathArr.length -= 1;
					const targetLink = pathArr.join('/') + '/' + changeLink;
					const aNodes = document.querySelectorAll('.ql-editor a');
					
					aNodes && aNodes.forEach(n => {
						if (n.href.endsWith(targetLink)) {
							n.href = "https://" + changeLink;
						} 
					});
				}

				this.$emit('input', this.content);
				this.$emit('change', { html, text, editor });
				this.dispatch('FormItem', 'on-form-change', this.content);
				if (delta.ops.find(op => op.delete || op.insert)) {
					this.hide();
				}
				this.repositionOverlay();
			});
			
		},
		initListener() {
			const ImageBlot = Quill.import('formats/image');
			const Parchment = Quill.import('parchment');
			this.editor.root.addEventListener('click', (ev) => {
				let image = Parchment.find(ev.target);
				// if (image instanceof ImageBlot) {
				// let imgs = this.getImgs();
				// this.handlePreview(ev, 0);
				// }

				if (ev.target && ev.target.tagName && ev.target.tagName.toUpperCase() === 'IMG') {
					if (this.nowImg === ev.target) {
						// we are already focused on this image
						return;
					}
					if (this.nowImg) {
						// we were just focused on another image
						this.hide();
					}
					// clicked on an image inside the editor
					this.show(ev.target);
				} else if (this.nowImg) {
					// clicked on a non image
					this.hide();
				}
			});
			this.editor.root.addEventListener('scroll', event => {
				this.repositionOverlay();
			});
		},
		show(img) {
			this.nowImg = img;
			this.showOverlay();
		},
		// 创建蒙层
		showOverlay() {
			 if (this.overlay) {
				this.hideOverlay();
			}

			// 添加蒙层
			this.overlay = document.createElement('div');
			this.overlay.addEventListener('click', this.handleClickOverlay);
			this.$refs.editor.appendChild(this.overlay);
			 // 定位蒙层和大小
			this.repositionOverlay();
		},
		hideOverlay() {
			if (!this.overlay) {
				return;
			}

			 // 移除蒙层
			this.$refs.editor.removeChild(this.overlay);
			this.overlay = "";
		},
		repositionOverlay() {
			if (!this.overlay || !this.nowImg) {
				return;
			}

			let imgRect = this.nowImg.getBoundingClientRect();
			let editorRect = this.$refs.editor.getBoundingClientRect();
			// 设置蒙层宽高和位置
			Object.assign(this.overlay.style, {
				position: 'absolute',
				top: `${imgRect.top - editorRect.top + this.$refs.editor.scrollTop}px`,
				left: `${imgRect.left - editorRect.left - 1 + this.$refs.editor.scrollLeft}px`,
				width: `${imgRect.width}px`,
				height: `${imgRect.height}px`,
				boxSizing: 'border-box',
				border: '1px dashed red',
				cursor: 'zoom-in'
			});
			// 添加四个顶点拖拽框
			this.createBox();
		},
		createBox() {
			this.overlay.innerHTML = '';
			this.boxes = [];
			
			this.addBox('nwse-resize'); // top left
			this.addBox('nesw-resize'); // top right
			this.addBox('nwse-resize'); // bottom right
			this.addBox('nesw-resize'); // bottom left
			this.positionBoxes(); // 设置四个拖拽框位置
		},
		addBox(cursor) {
			const box = document.createElement('div');

			Object.assign(box.style, {
				position: 'absolute',
				height: '12px',
				width: '12px',
				backgroundColor: 'white',
				border: '1px solid #777',
				boxSizing: 'border-box',
				opacity: '0.80'
			});
			box.style.cursor = cursor;
			box.addEventListener('mousedown', this.handleMousedown, false); // 顺便添加事件
			box.addEventListener('click', event => event.stopPropagation(), false); // 顺便添加事件

			this.overlay.appendChild(box);
			this.boxes.push(box);
		},
		positionBoxes() {
			let handleXOffset = `-6px`;
			let handleYOffset = `-6px`;

			[{ left: handleXOffset, top: handleYOffset },
				{ right: handleXOffset, top: handleYOffset },
				{ right: handleXOffset, bottom: handleYOffset },
				{ left: handleXOffset, bottom: handleYOffset }].forEach((pos, idx) => {
				Object.assign(this.boxes[idx].style, pos);
			});
		},
		handleMousedown(e) {
			this.dragBox = e.target;
			this.dragStartX = e.clientX;
			this.preDragWidth = this.nowImg.width;
			this.setCursor(this.dragBox.style.cursor);
			document.addEventListener('mousemove', this.handleDrag);
			document.addEventListener('mouseup', this.handleMouseup);
		},
		handleDrag(e) {
			if (!this.nowImg) {
				// image not set yet
				return;
			}
			// 计算水平拖动距离
			const deltaX = e.clientX - this.dragStartX;
			// 修改图片大小
			if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) { // 左边的两个框
				this.nowImg.width = Math.round(this.preDragWidth - deltaX);
			} else { // 右边的两个框
				this.nowImg.width = Math.round(this.preDragWidth + deltaX);
			}
			// 同时修改蒙层大小
			this.repositionOverlay();
		},
		handleMouseup() {
			this.setCursor('');
			// 拖拽结束移除事件监听
			document.removeEventListener('mousemove', this.handleDrag);
			document.removeEventListener('mouseup', this.handleMouseup);
		},
		setCursor(value) {
			// 设置鼠标样式
			[document.body, this.nowImg].forEach(el => {
				el.style.cursor = value;
			});
		},
		hide() {
			this.hideOverlay();
			// this.removeModules();
			this.nowImg = "";
		},
		getImgs() {
			let imgs = [];
			let deltas = this.editor.getContents().ops || [];

			for (let i = 0; i < deltas.length; i++) {
				if (deltas[i].insert.image) {
					imgs.push({
						src: deltas[i].insert.image,
						thumbnail: deltas[i].insert.image + '!4-4',
						title: 'Image' + (i + 1),
						w: 1200,
						h: 900
					});
				}
			}
			return imgs;
		},
		handleImgSuccess(res) {
			// 获取光标所在位置
			let length;
			let selection = this.editor.getSelection();
			if (!selection) {
				length = this.editor.getLength();
			} else {
				length = selection.index;
			}
			this.editor.insertEmbed(length, 'image', res.data.url);
			// 光标向后移动一位
			this.editor.setSelection(length + 1);
		},

		handleVedioSuccess(res) {
			// 获取光标所在位置
			let length;
			let selection = this.editor.getSelection();
			if (!selection) {
				length = this.editor.getLength();
			} else {
				length = selection.index;
			}
			this.editor.insertEmbed(length, 'video', res.data.url);
			// this.editor.insertEmbed(length, 'video', {
			// 	url: res.data.url,
			// 	controls: 'controls',
			// 	width: '300px',
			// 	style: "outline:none;display:inline-block"
			// 	// height: '100%'
			// });
			// 光标向后移动一位
			this.editor.setSelection(length + 2);
		},
		handlePreview(target, idx = 0) {
			let pos = {};
			try {
				const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
				const rect = target.getBoundingClientRect();

				pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };

			} catch (err) {
				console.error(err);
			}

			ImgsPreview.popup({
				visible: true,
				dataSource: [target.currentSrc],
				opts: {
					index: idx,
					history: false,
					getThumbBoundsFn: (index) => pos
				}
			}).then(() => {

			}).catch(() => {

			});
		},
		// 粘贴图片
		handlePasteImg(e) {
			if (!(e.clipboardData && e.clipboardData.items)) {
				return;
			}
		
			let items = e.clipboardData.items;
			let images = ["image.png", "image.jpg", "image.jpeg", "image.gif"];
	
			items = Array.prototype.slice.call(items);
	
			items.forEach(item => {
				const file = item.getAsFile();
				if (file && images.indexOf(file.name) > -1) {
					postFile(file).then(res => {
						this.handleImgSuccess(res);
					});
				}
			});
		},
		handleClickOverlay(event) {
			this.nowImg && this.handlePreview(this.nowImg);
		}
	}
};
</script>

<style lang="scss">
.vc-quill-editor {
	color: #333 !important;
	.ql-editor{
		height:500px;
	}
	.ql-container.ql-snow {
		overflow-y: hidden;
	}
	.self-btn {
		background: none;
		border: none;
		cursor: pointer;
		float: left;
		height: 24px;
		padding: 3px 5px;
		width: 28px;
		&:hover {
			color: #06c;
		}
	}
}
</style>