## 功能
展示流程进度

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
data | 数据源，一个对象数组，对象必须要有status属性 | `Array` | `undefined`
mode | 历史原因，默认为‘audit’，此时会内部重新处理传进来的status，不需要时传‘other’ |`string`|`audit`



#### 事件

事件名 | 说明 | 返回值 
---|---|---
click-icon | 点击图标,返回点击元素的数据和下标 | （item，index) 

#### 插槽

插槽名 | 说明 | 插槽属性
---|---|---
default | 在每个图标下面可以自定义渲染， | {item，index}
side  | 在每个图标右边面可以自定义渲染，| {item，index}

##### 基础用法

```html
<oa-across-table :data="auditInfo.steps" mode="other" style="margin-bottom: 65px;">
	<div slot-scope="{item,index}" :style="index==0 ?'left:-20px':'left:-30px'" class="g-m-t-5 g-relative">
		<div class="g-tc g-c-black2 g-m-t-5">{{ item.staff_name || '' }}</div>
			<div class="g-tc g-c-black2 g-m-t-5">{{ item.depart_name || '' }}</div>
			<div class="g-tc">{{ item.time || '' }}</div>
		</div>
		<span 
			slot="side" 
			slot-scope="{item}"
			:class="item.status==3 ?'g-c-red-mid':'g-c-blue-mid'"
			class="g-m-l-10"
		>
			{{ item.name }}
		</span>
</oa-across-table>
			
```

