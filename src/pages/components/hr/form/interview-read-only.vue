<template>
	<div class="v-hr-interview-read-only">
		<div class="_content">
			<oa-title title="个人信息" class="_title" />
			<div class="g-flex g-fw-w _item">
				<div class="g-flex">
					<div class="_left">应聘者姓名：</div>
					<oa-item :content="info.applicant_name" />
				</div>
				<div class="g-flex">
					<div class="_left">应聘职位：</div>
					<oa-item :content="info.position_name" />
				</div>
				<div class="g-flex">
					<div class="_left">年龄：</div>
					<oa-item :content="info.age" />
				</div>
				<div class="g-flex">
					<div class="_left">婚否：</div>
					<oa-item :content="info.is_married" />
				</div>
				<div class="g-flex">
					<div class="_left">是否有小孩：</div>
					<oa-item :content="info.has_kids" />
				</div>
				<div class="g-flex">
					<div class="_left">是否有对象：</div>
					<oa-item :content="info.has_partner" />
				</div>
				<div class="g-flex">
					<div class="_left">另一半所在公司地址：</div>
					<oa-item :content="info.partner_company_address" />
				</div>
				<div class="g-flex">
					<div class="_left">另一半公司所属行业：</div>
					<oa-item :content="info.partner_company_industry" />
				</div>
				<div class="g-flex">
					<div class="_left">家庭成员：</div>
					<oa-item :content="info.family_member" />
				</div>
				<div class="g-flex">
					<div class="_left">父母工作：</div>
					<oa-item :content="info.family_job" />
				</div>
				<div class="g-flex">
					<div class="_left">是否有车房：</div>
					<oa-item :content="info.has_car_house_name" />
				</div>
			</div>
			<!-- 工作经历 -->
			<oa-title title="工作经历" class="_title" />
			<div class="g-flex g-fw-w _item">
				<div class="g-flex">
					<div class="_left">是否应届生：</div>
					<oa-item :content="info.is_this_year_graduate" />
				</div>
				<div class="g-flex">
					<div class="_left">本岗位工作时间：</div>
					<oa-item :content="info.this_job_time" />
				</div>
				<div class="g-flex">
					<div class="_left">原公司所属行业：</div>
					<oa-item :content="info.last_company_industury" />
				</div>
				<div class="g-flex">
					<div class="_left">团队内承担角色：</div>
					<oa-item :content="info.role_in_team" />
				</div>
				<div class="g-flex">
					<div class="_left">是否有突出结果：</div>
					<oa-item :content="info.has_excellent_result" />
				</div>
				<div class="g-flex">
					<div class="_left">职位知识及技巧掌握情况：</div>
					<oa-item :content="info.technology" />
				</div>
				<div class="g-flex">
					<div class="_left">上家公司离职原因：</div>
					<oa-item :content="info.last_leave_reason" />
				</div>
				<div class="g-flex">
					<div class="_left">开始找工作至今时间：</div>
					<oa-item :content="info.start_find_work_time" />
				</div>
				<div class="g-flex">
					<div class="_left">找不到合适工作原因：</div>
					<oa-item :content="info.unable_to_find_work_reason" />
				</div>
				<div class="g-flex">
					<div class="_left">是否认真了解过本公司：</div>
					<oa-item :content="info.is_know_company" />
				</div>
				<div class="g-flex">
					<div class="_left">选择本公司原因：</div>
					<oa-item :content="info.choose_company_reason" />
				</div>
				<div class="g-flex">
					<div class="_left">遇到问题的钻研能力：</div>
					<oa-item :content="info.study_skill" />
				</div>
				<div class="g-flex">
					<div class="_left">有主见还是随遇而安：</div>
					<oa-item :content="info.has_ideas" />
				</div>
				<div class="g-flex">
					<div class="_left">对金钱欲望是否强烈：</div>
					<oa-item :content="info.money_appetency" />
				</div>
				<div class="g-flex">
					<div class="_left">是否注重平台和学习机会：</div>
					<oa-item :content="info.attention_platform" />
				</div>
				<div class="g-flex">
					<div class="_left">是否特别在意休息和吃喝玩乐：</div>
					<oa-item :content="info.attention_platform" />
				</div>
			</div>

			<!-- 综合评价 -->
			<oa-title title="综合评价" class="_title" />
			<div class="g-flex">
				<div 
					class="_left" 
					style="width: 200px; text-align: right; margin-bottom: 20px;"
				>应聘者优点：</div>
				<i-checkbox-group v-model="info.excellent">
					<i-checkbox label="1" disabled>偏踏实、勤奋</i-checkbox>
					<i-checkbox label="2" disabled>脑袋灵活反应能力快</i-checkbox>
					<i-checkbox label="3" disabled>表达条理清晰知识面广</i-checkbox>
					<i-checkbox label="4" disabled>知识面一般但注重学习可培养</i-checkbox>
				</i-checkbox-group>
			</div>
			<div class="g-flex g-fw-w _item">
				<div class="g-flex">
					<div class="_left">其他评价：</div>
					<oa-item :content="info.else_valuate" />
				</div>
				<div class="g-flex">
					<div class="_left">是否对薪资有基本底线：</div>
					<oa-item :content="info.has_salary_line_name" />
				</div>
				<div class="g-flex">
					<div class="_left">无底线原因：</div>
					<oa-item :content="info.has_no_line_reason" />
				</div>
				<div class="g-flex">
					<div class="_left">面试结果：</div>
					<oa-item :content="info.interview_result_name" />
				</div>
				<div class="g-flex">
					<div class="_left">备注：</div>
					<oa-item :content="info.remarks" />
				</div>
			</div>
			<!-- 打印内容 -->
			<div style="display: none;">
				<vc-print ref="pageTarget">
					<oa-print-interview :info="info" />
				</vc-print>
			</div>
			<footer v-if="!is_person" class="g-flex-cc _footer">
				<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handlePrint">打印</vc-debounce-click>
			</footer>
		</div>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, CheckboxGroup, Checkbox
} from 'iview';
import { Print } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import Title from "../_common/title";
import Item from "./_common/item";
import PrintInterview from './print/interview';

export default {
	name: 'hr-form-interview',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'vc-print': Print,
		'oa-limit-words': LimitWords,
		'oa-print-interview': PrintInterview,
		"oa-title": Title,
		"oa-item": Item
	},
	data() {
		const { query = {} } = this.$route;
		return {
			isSaved: false,
			is_person: !!query.from,
			info: {
			},
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_INTERVIEW_GET'],
				type: "GET",
				param: {
					...this.$route.query
				},
				loading: false
			}).then(res => {
				this.info = {
					...this.info,
					...res.data,
					age: res.data.age
				};
				this.isSaved = res.data.is_submit == 0;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		async handlePrint() {
			this.$refs.pageTarget.print();
		},
	},
};
</script>

<style lang="scss" scoped>
.v-hr-interview-read-only {
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
	margin-bottom: 80px;
	._content {
		width: 1000px;
		._title {
			margin-left: 13%;
		}
		._item > div {
			width: 50%;
			margin-bottom: 20px;
			._left {
				width: 200px;
				min-width: 200px;
				max-width: 200px;
				text-align: right;
				margin-right: 10px;
			}
		}
	}
	._footer {
		._disabled:hover {
			color: #333 !important;
			border: 1px solid #d4d7d8;
			cursor: not-allowed;
		}
	}
}
</style>
