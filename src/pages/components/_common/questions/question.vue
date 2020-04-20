<template>
	<div class="c-question">
		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="90" 
			inline 
		>
			<div v-if="showChange" style="width:860px;height:62px;background:rgba(245,245,246,1);padding:15px 0px;margin:20px 0">
				<i-form-item 
					:label-width="90" 
					label="题型:" 
					prop="type" 
					class="_hide-required">
					<i-select 
						v-model="formData.type" 
						class="_cus-select" 
						placeholder="请选择题型" 
						style="width:300px" 
						@on-change="handleTypeChange"
					>
						<i-option :value="1">单选题</i-option>
						<i-option :value="2">多选题</i-option>
						<i-option :value="3">判断题</i-option>
						<i-option :value="4">填空题</i-option>
						<i-option :value="5">问答题</i-option>
					</i-select>
				</i-form-item>
				<i-form-item 
					v-if="showRelate"
					:label-width="93" 
					label="关联课题:" 
					prop="subject_id" 
					class="_hide-required">
					<i-cascader
						v-model="formData.subject_id"
						:data="subjectTree"
						clearable
						class="g-m-r-5"
						placeholder="请选择关联课题"
						style="width: 300px"
					/>
					<!-- <i-select v-model="formData.subject_id" placeholder="请选择关联课题" style="width:300px">
						<i-option v-for="(subject,index) in relative_subjects" :key="index" :value="subject.id">{{ subject.name }}</i-option>
					</i-select> -->
				
				</i-form-item>
			</div>
			<oa-single-select v-if="formData.type==1" :form-data="formData" />
			<oa-muti-select v-else-if="formData.type==2" :form-data="formData" />
			<oa-true-or-false v-else-if="formData.type==3" :form-data="formData" />
			<oa-fill-blank v-else-if="formData.type==4" :form-data="formData" />
			<oa-simple-answer v-else-if="formData.type==5" :form-data="formData" />
			<div :style="showChange ? 'margin:20px 0' : 'margin: 20px 20px 20px 65px;width: 582px'" style="height:1px;background: #e1e3e5;"/>
			<div class="g-m-l-10">
				<div class="g-fs-14 g-pointer" style="margin-left:55px;margin-bottom:10px">
					<span @click="toggle">
						<i
							:class="showTip ? ' '+icon : '_rotate-180 '+icon"
							class="iconfont g-dp-ib _icon"
							style="font-size: 13px;"
						/>
						添加评语/解析
					</span>
					<i-poptip
						:width="450"
						content="你可以根据学员的回答状况，给出不同的点评，最后再给出题目的解析"
						word-wrap
						trigger="hover"
						placement="right"
					>
						<i
							class="iconfont icon-attention g-c-orange-mid g-m-l-5 g-m-r-10 g-pointer"
						/>
					</i-poptip>
				</div>
				<vc-expand ref="expand" v-model="showTip" :style="showChange ? '' : 'margin-left: 29px;'">
					<i-form-item label="回答正确:" prop="success_tips">
						<i-input v-model="formData.success_tips" :maxlength="50" placeholder=" 回答正确时，给点奖励的评语" style="width:520px"/>
					</i-form-item>
					<i-form-item label="回答错误:" prop="error_tips">
						<i-input v-model="formData.error_tips" :maxlength="50" placeholder=" 回答错误时，给点鼓励吧" style="width:520px"/>
					</i-form-item>
					<i-form-item label="解析:" prop="explain">
						<oa-limit-words
							v-model="formData.explain" 
							:max="500"
							width="520px" 
							placeholder="添加解析，帮助学员更好地理解题目"
						/>
					</i-form-item>
				</vc-expand>
				<template v-if="showKeyword" >
					<i-form-item label="关键字:" prop="keyword" class="_hide-required">
						<i-input v-model="formData.keyword" :maxlength="10" placeholder=" 在此输入关键词，多个关键词之间用空格隔开" style="width:520px"/>
					</i-form-item>
					<i-form-item label="出题人:" prop="maker_staff_id" class="_hide-required"> 
						<i-select 
							v-model="formData.maker_staff_id"
							:remote-method="handleSearchStaff"
							:loading="staffSearchLoading"
							placeholder="输入员工姓名搜索"
							style="width:300px"
							filterable
							remote
							clearable
							transfer
						>
							<i-option 
								v-for="staff in staffList"
								:key="staff.staff_id"
								:value="staff.staff_id"
							>{{ staff.staff_name }}</i-option>
						</i-select>
					</i-form-item>
				</template>
			</div>

		</i-form>
	</div>
</template>
<script >
import { Form, FormItem, Select, Option, Input, InputNumber, Radio, RadioGroup, Checkbox, CheckboxGroup, Button, Poptip, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/hr';
import { findTreePath } from '@components/hr/_common/academy-course/util';
import formatData from './formatData';
import SingleSelect from './single-select';
import MutiSelect from './muti-select';
import TrueOrFalse from './true-or-false';
import FillBlank from './fill-blank.vue';
import SimpleAnswer from './simple-answer';

const baseOrigin = {
	1: {
		option: [{ label: '', value: 0 }, { label: '', value: 1 }, { label: '', value: 2 }, { label: '', value: 3 }],
		value: -1
	},
	2: {
		option: [{ label: '', value: 0 }, { label: '', value: 1 }, { label: '', value: 2 }, { label: '', value: 3 }],
		value: []
	},
	3: {
		option: [{ label: '正确', value: 0 }, { label: '错误', value: 1 }],
		value: ''
	},
	4: {
		option: [],
		value: ''
	},
	5: {
		option: [],
		value: ''
	}
};
export default {
	name: "c-question",
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-radio': Radio,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-radio-group': RadioGroup,
		'i-button': Button,
		'i-cascader': Cascader,
		'vc-expand': Expand,
		'i-poptip': Poptip,
		'oa-single-select': SingleSelect,
		'oa-muti-select': MutiSelect,
		'oa-true-or-false': TrueOrFalse,
		'oa-fill-blank': FillBlank,
		'oa-simple-answer': SimpleAnswer
	},
	mixins: [formatData, services.subjectTree()],
	props: {
		action: String, // 操作--新增 add ，编辑 update， 预览 pre 
		data: {
			type: Object, // 直接传入后端返回的question数据结构
			default: () => ({
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
		},
		expand: Boolean, // 是否展开题目解析
		showKeyword: Boolean,
		showChange: {
			type: Boolean,
			default: true
		}, // 是否可以单题更改
		showRelate: {
			type: Boolean,
			default: true
		} // 关联课题
	},
	data() {
		const formData = this.formatFormData();
		const origin = JSON.parse(JSON.stringify(baseOrigin));
		origin[formData.type].option = formData.options;
		origin[formData.type].value = formData.value;
		const staffList = [];
		if (formData.maker_staff_id) {
			staffList.push({ staff_id: formData.maker_staff_id, staff_name: formData.maker_staff_name });
		} else {
			staffList.push({ staff_id: _global.staff.staff_id, staff_name: _global.staff.staff_name });
		}
		return {
			formData,
			rules: {
				type: [{ required: true, type: 'number', message: "请选择题型", trigger: 'change' }],
				subject_id: [
					// { required: true, type: 'array', message: "请选择关联课题", trigger: 'change' }
				],
				title: [{ required: true, type: 'string', message: "请输入题目", trigger: 'blur' }],
				score: [{ required: true, type: 'number', message: "请输入分值", trigger: 'blur' }],
				single_score: [{ required: true, type: 'number', message: "请输入分值", trigger: 'blur' }],
				options: [],
				success_tips: [],
				error_tips: [],
				explain: [],
				keyword: [{ required: false, type: 'string', message: "请输入关键字", trigger: 'blur' }],
				maker_staff_id: [{ required: true, type: 'number', message: "选择出题人", trigger: 'change' }],
				value: [{ required: true, type: 'number', message: "选择答案", trigger: 'change' }],

			},
			relative_subjects: [{ id: 1, name: 'AAAA' }],
			showTip: this.expand,
			icon: 'icon-up-cycle',
			staffList,
			staffSearchLoading: false,
			origin
		};
	},
	computed: {
	},
	created() {
	},
	async mounted() {
		await this.loadSubjectTreePromise;
		this.formData.subject_id = findTreePath(this.formData.subject_id_end, this.subjectTree) || [];
	},
	methods: {
		toggle() {
			this.$refs.expand.toggle();
		},
		validate() {
			return this.$refs.form.validate().then(valid => {
				if (this.formData.type <= 3 && this.formData.options.length == 0) {
					this.$Message.error('至少添加一个选项');
					return false;
				} else if (this.formData.type == 4 && this.formData.options.length == 0) {
					this.$Message.error('填空题至少设置一个答案');
					return false;
				} else if (
					(this.formData.value === '' 
					|| this.formData.value < 0
					|| this.formData.value === undefined 
					|| (
						Array.isArray(this.formData.value) 
						&& this.formData.value.length == 0
					))
					&& this.formData.type < 4) {
					this.$Message.error('请设置答案');
					return false;
				} else {
					return valid;
				}
			});
		},
		handleTypeChange(type) {
			this.formData.value = this.origin[type].value;
			this.formData.options = this.origin[type].option;
		},
		reset() {
			this.staffList = [{ staff_id: _global.staff.staff_id, staff_name: _global.staff.staff_name }];
			this.origin = JSON.parse(JSON.stringify(baseOrigin));
			this.formData = this.formatFormData();
			this.$refs.form.resetFields();
			
			// 处理下拉搜索单选的reset问题
			this.$nextTick(() => {
				this.$refs.form.resetFields();
				this.$nextTick(() => {
					this.formData.maker_staff_id = this.$global.staff.staff_id;
				});
			});
		},
		handleSearchStaff(query) {
			this.staffSearchLoading = true;
			this.$request({
				url: "_HR_NAME_OR_PHONE_STAFF_GET",
				type: 'GET',
				param: {
					search: query.trim()
				},
				loading: false
			}).then((res) => {
				this.staffSearchLoading = false;
				this.staffList = Array.isArray(res.data) ? res.data : [];
			}).catch((error) => {
				this.staffSearchLoading = false;
			});
		},
	}
};
</script>
<style lang="scss">
.c-question{
	width:860px;
	._hide-required.ivu-form-item-required .ivu-form-item-label:before{
		content: ''
	}
	._rotate-180 {
        transform: rotate(180deg);
	}
	.ivu-input-number {
		.ivu-input-number-handler-wrap {
			display: none;
		}
	}
	._add-option {
		width:300px;
		margin-left:110px;
		&:hover {
			color: #57a3f3 !important;
			background-color: #fff !important;	
			border-color: #57a3f3 !important;
		}
		&:focus {
			box-shadow: none !important;
		}
	}
	._cus-select {
		.ivu-select-selection {
			padding-top: 2px;
		}
	}
	.vc-sort-list {
		.__item-forbid {
			cursor: default
		}
		& > div {
			margin: 0;
		}
	}
}
</style>