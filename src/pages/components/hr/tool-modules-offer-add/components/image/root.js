import Viewer from '../../common/image/viewer.vue';
import Editor from '../../common/image/editor.vue';
import Widget from './widget.vue';

export const image = {
	module: "image",
	type: '基础组件',
	name: "模版",
	Viewer,
	Editor, 
	Widget,
	// 初始数据
	data: {
		// for draggable
		type: '6',
		value: [],
		w: 100,
		h: 100,
		r: 0,
		x: 0, // 动态分配
		y: 0, // 动态分配
		z: 1,
		weight: 400,
		fs: 14,
		parent: true,
		// for content
		name: '名称'
	},
	dataValidity: (res = {}) => {
		if (!res.name) {
			return {
				error: "输入框内容必填"
			};
		}
		return null;
	}
};