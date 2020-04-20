## 功能
下拉树形选择，多选

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
value | 初始值，初始选中项的value数组， `value`值数组 | `array` | -
data| 数据源，iview的树结构，标签和选项的字段为`title`，返回的值字段为`value` | `array` | -
width | 组件默认显示的宽度 | `number | string` | 200
max-width | 组件显示的最大宽度，过小对标签的显示会有影响 | `number | string` | 200
dropdownMaxHeight | 下拉的最大高度 | `number | string` | 300
inputMaxHeight | 输入框的最大高度|  `number | string` | 69
placeholder | 无选中项时的提示 | `string` | -
labelInValue| input事件是否抛出 带title的数据 | `boolean` | `false`
disabled | 禁用 | `boolean` | `false`


#### 事件

属性 | 说明 | 类型 | 默认值
---|---|---|---
blur | 失去焦点时触发 |  |
slide-down | 展开时触发 |  |
slide-up | 收起时触发 |  |
delete | 删除标签时触发，返回包含`value`和`label`的对象 |  |
change | 选中项变化时触发|  |

#### 方法

方法名 | 说明 | 返回值
--- | --- | ---
initValue | 根据当前的value重新计算checked | undefined

## 基础用法

```jsx
<oa-tree-select-check 
	ref="treeSelectCheck"
	v-model="formData.echelon" 
	:data="stageTree" 
	placeholder="选择人才梯队" 
	style="position:relative;left:-2px" 
/>
```

