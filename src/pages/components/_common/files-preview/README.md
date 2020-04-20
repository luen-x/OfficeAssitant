## 功能
文件预览

## API

#### 属性

属性 | 说明 | 类型
---|---|---|---
data | 文件路径 | `string`
X | 窗口横向大小 | `string`,`number`
Y| 窗口纵向 |  `string`,`number`

#### 基础用法

```js
FilePreview.popup(data:{
	fileUrl:'xxxx.mp4',
	x:'',
	y:'', }).then(() => console.log('ok')).catch(() => console.log('cancel'));

```

