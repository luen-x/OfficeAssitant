import Viewer from '../../common/text/viewer.vue';
import Editor from '../../common/text/editor.vue';
import Widget from './widget.vue';

export const validTime = {
	module: "validTime",
	type: '基础组件',
	name: "模版",
	Viewer,
	Editor, 
	Widget,
	// 初始数据
	data: {
		// for draggable
		type: '5',
		value: '有效期限',
		w: 268,
		h: 32,
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