## [Demo Basic](https://wya-team.github.io/wya-vc/dist/web/tree-select/basic.html)
## 功能
下拉树形选择

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
value | 可以使用 v-model 双向绑定数据，返回所选的`value`值数组 | `array` | -
data-source | 数据源，标签和选项的字段为`label`，返回的值字段为`value` | `array` | -
width | 组件默认显示的宽度 | `number | string` | 200
<!-- max-width | 组件显示的最大宽度，过小对标签的显示会有影响 | `number | string` | 200 -->
placeholder | - | `string` | -


#### 事件

属性 | 说明 | 类型 | 默认值
---|---|---|---
blur | 失去焦点时触发 |  |
slide-down | 展开时触发 |  |
slide-up | 收起时触发 |  |
delete | 删除标签时触发，返回包含`value`和`label`的对象 |  |
change-select | 下拉框中选择或者取消选择时触发，返回当前的对象|  |



## 基础用法

```jsx
<vc-tree-select
    v-model="selects"
    :data-source="data"
    width="200"
	max-width="300"
	placeholder="请选择"
    @blur="handleBlur"
    @slide-down="handleSlideDown"
    @slide-up="handleSlideUp"
    @delete="handleDelete"
    @change-select="handleChangeSelect"
/>
```
## 数据结构
```vue
export default {
    data() {
        return {
            data: [
                {
                    label: '选项1',
                    value: '1',
                    children: [
                        {
                            label: '选项1-1',
                            value: '1-1',
                            children: [
                                {
                                    label: '选项1-1-1',
                                    value: '1-1-1',
                                }
                            ]
                        },
                        {
                            label: '选项1-2',
                            value: '1-2',
                        }
                    ]
                },
                {
                    label: '选项2',
                    value: '2',
                }
            ],
            selects: []
        }
    },
    methods: {
        handleChangeSelect(v) {
            this.selects=v
        }
    }
}
```
