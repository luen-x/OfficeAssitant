## 功能
确认弹窗

## API

#### 属性

属性 | 说明 | 类型 | 默认值
---|---|---|---
content | 文本内容 | `string` | `确认？`
msg | 文本内容 | `string` | `确认？`
title | 弹窗标题 | `string` | `提示`
showIcon | 是否显示Icon | `boolean` | `false`
iconClass | icon的class | `string` | `icon-question`
cancelText | 取消按钮文字,如果是空串就不渲染取消按钮| `string` | `取消`
okText | 确定按钮的文字 | `string` | `确认`
footerHide| 是否隐藏footer| `Boolean`| `false`
renderContent| 自定义渲染内容| `function`| -
showIcon | 是否显示提示icon | `boolean` | `false`
status | icon的状态'success', 'error', 'question', 'info', '' | `string` | `''`
iconClass | 自定义icon的样式class,此时不要传status属性，否则优先使用status的样式 | `string` | -
okCallback | 点击确定时的回调，如果返回Promise则会等待这个Promise结束，如果promise状态变为resolve则关闭弹窗，否则不关闭弹窗；如果返回的不是promise则判断返回值是否为真，是则关闭弹窗，否则不关闭弹窗 | `function` | -

#### 基础用法

```js
Confirm.popup({ msg: '确认删除吗？' }).then(() => console.log('ok')).catch(() => console.log('cancel'));
			
```

