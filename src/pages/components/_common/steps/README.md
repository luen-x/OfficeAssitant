## 功能
文本框

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
type | 1 表示_dot-active向上,其余的表示向下 | Number | 
data-source |  数据源，一个数组 | `Array` | []
render-title | 用于渲染title,见基础用法中的函数 | `Function` | 
render-content | 用于渲染content,见基础用法中的函数 | `Function` | 
min-width | 最小宽度 | String | 

#### 基础用法

```js
<oa-steps
	type="1"
	data-source="info.rate_detail"
	render-title="renderTitle"
	render-content="renderContent"
	min-width="200px"
/>
// *******************************************************************************
renderTitle(h, params = {}) {
	const { create_time, operate_name } = params.rows;
	return (
		<div>
			<span class="g-fs-14 g-c-black2 g-m-l-10">{operate_name}</span>
			<span class="g-c-black4 g-m-l-30 g-nobreak">{create_time}</span>
		</div>
	);
},
// *******************************************************************************
renderContent(h, params = {}) {
	const { event_rate_detail } = params.rows;
	return (
		<div class="g-fs-14 g-m-l-10 g-pd-t-5 g-pd-b-20" style="color: #666;">{event_rate_detail}</div>
	);
},
// *******************************************************************************
```
