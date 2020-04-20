## 功能
新建题目，题目详情的展示

## API

#### 属性
question
属性 | 说明 | 类型 | 默认值
---|---|---|---
action | 调用时的操作 | `String` | ''
data | 题目初始值 | `function` | () => ({
                                    question_id: '',
                                    action: 'add',
                                    type: 1, // 1 单选  2 多选  3 判断  4 填空  5 简答
                                    subject_id: '', // 关联课题
                                    title: '',
                                    score: null,
                                    single_score: null,
                                    option: [
                                        { option_name: "" },
                                        { option_name: "" },
                                        { option_name: "" },
                                        { option_name: "" }
                                    ],
                                    success_tips: '',
                                    error_tips: '',
                                    explain: '',
                                    keyword: '',
                                    maker_staff_id: _global.staff.staff_id,
                                    maker_staff_name: _global.staff.staff_name
                                })
expand | 是否展开题目解析 | `Boolean` | 
showKeyword | 是否展示关键字，出题人 | `Boolean` | 
showChange | 是否可以单题更改与选择课题 | `Boolean` | true
showRelate | 课程库样式与培训中心样式 | `Boolean` | true

question-preview
属性 | 说明 | 类型 | 默认值
---|---|---|---
data | 题目初始值 | `` | () => ({
				question_id: '',
				type: 1, // 1 单选  2 多选  3 判断  4 填空  5 简答
				subject_id: '1', // 关联课题
				subject_name: '课题name',
				title: '我是题目___我是题目我是___题目我是题目我是___题目我是题目___我是题目',
				score: 10,
				single_score: 2,
				explain: '解析解析解析解析解析解析',
				keyword: 'AA BB',
				maker: 1,
				maker_staff_id: 1,
				maker_staff_name: 'Lawrence',
				success_tips: '正确提示',
				error_tips: '错误提示',
				option: [
					{
						option_name: "4万/款、5.9万/款",
						is_answer: "1",
						sort: 1
					},
					{
						option_name: "5万/款、6.9万/款",
						is_answer: "0",
						sort: 2
					}
				],
		 })
noTip | 是否展示题目出题人及详解 | `Boolean` | 
width | 宽度 | `Number` | 700
relate | 课程库样式与培训中心样式 | `Boolean` | true
paperType | 试卷类型，是否显示分值 | `Number` | 1

#### 基础用法

```jsx
<oa-question 
    v-if="item.isEdit"
    ref="question" 
    :data="item" 
    :show-change="false"
    :show-relate="false"
/>
<oa-question-pre 
    v-else 
    :data="item" 
    :width="650" 
    :relate="false" 
    :paper-type="formData.paper_type"
/>
```