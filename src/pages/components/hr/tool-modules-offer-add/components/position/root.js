import Viewer from '../../common/text/viewer.vue';
import Editor from '../../common/text/editor.vue';
import Widget from './widget';

export const position = {
	module: "position",
	type: '基础组件',
	name: "应聘职位",
	Viewer,
	Editor, 
	Widget,
	// 初始数据
	data: {
		// for draggable
		type: '2',
		value: '应聘职位',
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