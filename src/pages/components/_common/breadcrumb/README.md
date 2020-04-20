## 功能
面包屑组件

## 作者
潘英杰

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
routes | 当前页面路由数组 | `Array` | `[]`
beforeBack | 返回前的钩子 | `Function` | `无`



#### 事件

事件名 | 说明 | 返回值 
--- | --- | ---
toggle | 点击触发 | 无

#### 基础用法

```html
<oa-breadcrumb :routes="路由数组" :before-back="钩子函数" />
			
```

