## 功能
确认弹窗

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
dataShow | 显示的列 | `Array` | `[{key: string, value: string, is_optional: boolean}, ...]`
dataHide | 隐藏的列 | `Array` | `[{key: string, value: string, is_optional: boolean}, ...]`
saveUrl | 保存时请求的地址 | `string` | ``
mutation | 同步到mutation的type | `string` | `1`
scenario | 保存时的数据场景 | `number` | `2`
params | 保存时的参数 | `Object` | `{}`

#### 基础用法

``` js
TableTitle.popup({

}).then().catch();
			
```

