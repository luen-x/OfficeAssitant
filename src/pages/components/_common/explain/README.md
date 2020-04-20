## 功能
确认弹窗

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
type | 渲染类型(tooltip | collpase) | `string` | `icon`
trigger | 触发方式 | `string` | `hover`
title | 标题 | `string` | ``
content | 内容 | `string` | ``
placement | 浮窗位置 | `number` | `230`
transfer | 是否穿梭 | `Boolean` | `true`
wordWrap | 换行 | `Boolean` | ``
icon | icon图标 | `string` | `info`

#### 基础用法

```html
<oa-explain :title="xxx" :content="xxxx" />
			
```

