<template>
	<div class="v-hr-recruit-paper-question">
		<i-form 
			ref="formData" 
			:model="formData" 
			:rules="rules" 
			:label-width="90"
			inline
			@submit.native.prevent
		>
			<vc-sort-list 
				v-model="formData.questions" 
				:mask="false"
				value-key="front_que_id"
				class="g-block"
			>
				<div 
					slot-scope="item"
					class="g-flex g-jc-sb g-pd-t-20 g-m-b-20"
					style="background-color: #fafafa;"
				>
					<span class="g-m-l-30 g-inline-block g-c-black2 _sort">{{ item.sortIndex + 1 }}</span>
					<div class="g-flex g-fd-c" style="width: 100%;">
						<i-form-item 
							:rules="rules.title"
							:prop="'questions.'+ (item.sortIndex || 0) + '.title'"
							label="题目"
							class="_question"
						>
							<i-input
								v-model="formData.questions[item.sortIndex || 0].title" 
								:maxlength="50"
								clearable
								placeholder="请输入题目" 
								style="width:300px;"
							/>
						</i-form-item>
						<div v-for="(it, i) in item.option" :key="it.uid" class="g-flex">
							<i-form-item 
								:label="optionMap[i + 1]"
								:rules="rules.option_name"
								:prop="'questions.'+ (item.sortIndex || 0) + '.option.' + i + '.option_name'"
							>
								<i-input
									v-model="formData.questions[item.sortIndex || 0].option[i].option_name" 
									:maxlength="50"
									clearable
									placeholder="请输入选项" 
									style="width:300px;"
								/>
								<span class="g-m-lr-10">
									<i 
										v-if="item.option.length > 2"
										class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
										@click="handleDelOption(item.sortIndex, i)"
									/>
									<i 
										v-if="item.option.length < 5"
										class="icon iconfont icon-add1 g-c-blue-mid g-pointer" 
										@click="handleAddOption(item.sortIndex, i)"
									/>
								</span>
							</i-form-item>
							<i-form-item 
								label=""
								class="_no-label"
								style="margin-right: 5px;"
							>
								<i-select
									v-model="formData.questions[item.sortIndex || 0].option[i].dimension_id"
									filterable
									transfer
									clearable
									placeholder="请选择测试维度"
								>
									<i-option
										v-for="(dimension, d) in dimensions"
										:key="d"
										:value="dimension.dimension_id"
									>{{ dimension.dimension_name }}</i-option>
								</i-select>
							</i-form-item>
							<i-form-item 
								label=""
								class="_no-label"
							>
								<i-input-number
									v-model="formData.questions[item.sortIndex || 0].option[i].score"
									:min="1"
									:max="9"
									placeholder="请输入分值" 
									style="width:80px;"
								/>
							</i-form-item>
						</div>
					</div>
					<div class="_btn-icon g-flex g-ai-c g-jc-fe g-m-r-20">
						<i 
							v-if="formData.questions.length !== 1"
							class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
							@click="handleDelQuestion(item, item.sortIndex)"
						/>
						<i 
							v-if="item.sortIndex === formData.questions.length - 1"
							class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-5" 
							@click="handleAddQuestion"
						/>
					</div>
				</div>
			</vc-sort-list>
		</i-form>
		<div class="_submit">
			<i-button 
				type="primary" 
				@click="handleSave"
			>
				保存
			</i-button>
		</div>
	</div>
</template>
<script>
import { Form, FormItem, Input, InputNumber, Button, Select, Option } from 'iview';
import { SortList } from 'wya-vc';
import { Confirm } from '@components/_common/confirm/confirm';
import { uid } from '@utils/utils';

export default {
	name: 'oa-recruit-paper-question',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'vc-sort-list': SortList
	},
	props: {
		paperTheme: String,
		questions: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		const defaultOption = { option_name: '', dimension_id: '', score: null };
		return {
			defaultOption,
			optionMap: { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H', 9: 'I', 10: 'J' },
			dimensions: [], // 维度列表
			formData: {// 表单
				paper_theme: this.paperTheme,
				questions: this.questions.length ? this.questions.map(it => ({
					front_que_id: uid(),
					question_id: it.question_id,
					title: it.title,
					option: it.option.map(_it => ({
						uid: uid(),
						option_id: _it.option_id,
						option_name: _it.option_name,
						dimension_id: _it.dimension_id,
						score: _it.score
					}))
				})) : [this.getNewQuestion()]
			},
			rules: {// 表单验证
				title: [
					{ required: true, message: '请输入题目', trigger: "blur" }
				],
				option_name: [
					{ required: true, message: '请输入选项', trigger: "blur" }
				]
			}
		};
	},
	watch: {
		questions(val) {
			this.formData.questions = val.length ? val.map(it => ({
				front_que_id: uid(),
				question_id: it.question_id,
				title: it.title,
				option: it.option.map(_it => ({
					uid: uid(),
					option_id: _it.option_id,
					option_name: _it.option_name,
					dimension_id: _it.dimension_id,
					score: _it.score
				}))
			})) : [this.getNewQuestion()];
		},
		paperTheme(val) {
			this.formData.paper_theme = val;
		}
	},
	mounted() {
		this.loadDimensionList();
	},
	methods: {
		loadDimensionList() {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_DIMENSION_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					paper_id: this.$route.query.paper_id
				},
				autoTip: false
			}).then(res => {
				this.dimensions = res.data;
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		handleAddQuestion() {
			const question = this.getNewQuestion();
			this.formData.questions.push(question);
		},
		handleDelQuestion(item, index) {
			Confirm.popup({
				title: "",
				msg: "是否确定删除该题目？",
				showIcon: true
			}).then(() => {
				if (item.question_id) {
					this.$request({
						url: '_HR_RECRUIT_SCHOOL_QUESTION_DEL_POST',
						type: 'POST',
						loading: false,
						param: {
							paper_id: this.$route.query.paper_id,
							question_id: item.question_id
						},
						autoTip: true
					}).then(res => {
						this.$emit('reload', true);
					}).catch(error => {});
				} else {
					this.formData.questions.splice(index, 1);
				}
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleAddOption(index, i) {
			const option = this.getNewOption();
			this.formData.questions[index].option.splice(i + 1, 0, option);
		},
		handleDelOption(index, i) {
			this.formData.questions[index].option.splice(i, 1);
		},
		handleSave() {
			return this.$refs.formData.validate().then((valid) => {
				if (valid) {
					let param = {
						paper_id: this.$route.query.paper_id,
						paper_theme: this.formData.paper_theme,
						questions: this.formData.questions
					};
					return this.$request({
						url: '_HR_RECRUIT_SCHOOL_QUESTION_ADD_POST',
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$router.replace({
							name: 'hr-recruit-school-paper-edit',
							query: {
								action: "update",
								paper_id: res.data.paper_id
							}
						});
						this.$emit('reload', true);
						return true;
					}).catch(error => { return false; });
				} else {
					return false;
				}
			});
		},
		getNewOption() {
			return { uid: uid(), ...this.defaultOption };
		},
		getNewQuestion() {
			return { 
				title: '',
				front_que_id: uid(),
				option: [
					{ uid: uid(), ...this.defaultOption, score: null }, 
					{ uid: uid(), ...this.defaultOption, score: null },
					{ uid: uid(), ...this.defaultOption, score: null },
					{ uid: uid(), ...this.defaultOption, score: null }
				] 
			};
		}
	}
};

export const RecruitPaperQuestion = module.exports.default;
</script>
<style lang="scss">
.v-hr-recruit-paper-question {
	margin-bottom: 80px;
	._sort {
		width: 15px;
		height: 15px;
		margin-top: 10px;
		border: 1px solid #333;
		border-radius: 50%;
		margin-bottom: 24px;
		line-height: 12px;
		text-align: center;
	}
	._question {
		.ivu-form-item-content {
			display: flex;
		}
	}
	._btn-icon {
		position: relative;
		top: -10px;
	}
	._submit {
		position: fixed;
		width: calc(100% - 160px);
		height: 60px;
		line-height: 60px;
		text-align: center;
		bottom: 0;
		right: 0;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
	._no-label {
		.ivu-form-item-content {
			margin-left: 0 !important;
		}
	}
	.ivu-form-inline .ivu-form-item {
		margin-right: 0;
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>
