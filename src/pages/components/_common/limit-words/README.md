## 功能
文本框

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
value | 文本内容 | `string` | -
max | 最大字数 | `number` | `200`
placeholder | 无内容时提示 | `string` | `请输入备注信息`
width | 文本框宽度 | `string` | `320px`
type | 显示剩余字数还是已输入字数 | `string` | `current`
disabled | 是否禁用 | `Boolean`| `false`
readonly | 是否只读| `Boolean`| `false`
autosize | 自适应内容高度| `object`| `{ minRows: 4, maxRows: 8 }`

#### 基础用法

```js
<oa-limit-words
	v-if="isShow"
	v-model="remarks"
	style="width: 300px;marginLeft: 12px;"
	placeholder="请添加备注"
/>	
```
