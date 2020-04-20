## 功能
日历组件

## 作者
潘英杰

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
date | 选中的时间 | `String` | `''`
onRefresh | 刷新状态函数 | `Function` | `无`
addSched | 加待办事项 | `Function` | `无`
dataSource | 事项数据 | `Object` | `{}`



#### 事件

事件名 | 说明 | 返回值 
--- | --- | ---
toggle | 点击触发 | 无

#### 基础用法

```html
<oa-calendar 
	:data-source="scheduleDate"
	:date.sync="date"
	:on-refresh="loadData"
	:add-sched="handleAddSched"
/>
			
```

