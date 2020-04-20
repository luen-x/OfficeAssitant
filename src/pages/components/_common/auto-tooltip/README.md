## 功能
根据内容是否超过容器宽度，自动判断是否显示tooltip

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
content | 文本内容 | `string` | -
width | 宽度（带单位的字符串），不传时默认充满父元素 | `string` | -
placement | 悬浮窗出现的位置，和iview的tooltip一致 | `string` | `top`
theme | 主题 light或dark| `string` | `light`
labelClass| 显示的标签的class名| `string`| `g-operation`
show| 组件会监听这个属性的变化，一旦变化就会重新计算一遍内容是否超过容器，解决初始渲染时被dsplay:none，宽度无法计算的问题| `boolean`| true

#### 事件

事件名 | 说明 | 返回值 
--- | --- | ---
click-label | 点击标签 | 原生Event

#### 方法

方法名 | 说明 | 返回值
--- | --- | ---
updateShowTooltip | 重新计算内容是否超过容器宽度，以决定是否显示tooltip | undefined


#### 基础用法

```jsx
<AutoTooltip content="内容内容内容内容内容" theme="dark" placement="bottom"/>
			
```

