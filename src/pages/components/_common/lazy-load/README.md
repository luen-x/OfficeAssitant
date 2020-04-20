## 功能
加载较大的图片时，表现为类似loading的等待效果，使体验更加顺畅。

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
fileUrl | 图片文件url | `string` | ''
imgData | 图片文件数组 | `array` | []



#### 事件

事件名 | 说明 | 返回值 
--- | --- | ---
load | 图片文件加载时触发 | 原生Event
click | 点击图片文件进行预览 | 原生Event

#### 方法

方法名 | 说明 | 返回值
--- | --- | ---
handleLoad | 加载图片文件时显示loading | undefined
handlePreview | 预览图片文件 | undefined

#### 基础用法

```jsx
<oa-lazy-load file-url="图片文件url" img-data="图片文件数组"/>
			
```

