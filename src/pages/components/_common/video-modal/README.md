## 功能
播放视频

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
title | 弹窗标题 | `string` | `视频教程`
videoUrl | 视频类型， 对应constants.js 中的字段 | `string` | `constants.js`

#### 基础用法

```js
VideoModal.popup({ title: '流程管理', urlType: 'HR_TOOL_WORKFLOW_VIDEO' })	
	.then(() => console.log('ok')).catch(() => console.log('cancel'));
			
```

