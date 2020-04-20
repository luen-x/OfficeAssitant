<template>
	<div class="v-hr-recruit-paper-result">
		<i-form 
			ref="formData" 
			:model="formData" 
			:rules="rules" 
			:label-width="70"
			inline
			@submit.native.prevent
		>
			<div 
				v-for="(item, index) in formData.results" 
				:key="item.uid"
				class="g-flex g-jc-sb g-pd-t-20 g-m-b-20"
				style="background-color: #fafafa;"
			>
				<div class="g-m-l-30" style="width: 60px;">
					<span class=" g-inline-block g-c-black2 _sort">
						{{ index + 1 }}
					</span>
					<div v-if="index === 0" style="position: relative;left: -15px;">默认结果</div>
				</div>
				
				<div class="g-flex g-fd-r" style="width: 95%;">
					<div class="g-flex g-fd-c">
						<i-form-item 
							:rules="rules.test_result"
							:prop="'results.'+ index + '.test_result'"
							label="测试结果"
						>
							<i-input
								v-model="item.test_result" 
								:maxlength="10"
								clearable
								placeholder="请输入测试结果" 
								style="width:300px;"
							/>
						</i-form-item>
						<i-form-item 
							:rules="rules.external_explain" 
							:prop="'results.'+ index + '.external_explain'"
							label="对外解释"
						>
							<oa-limit-words 
								v-model="item.external_explain"
								placeholder="请输入对外解释"
								clearable
								style="width:300px;"
							/>
						</i-form-item>
						<i-form-item 
							v-if="index === 0"
							:rules="rules.priority"
							:prop="'results.'+ index + '.priority'"
							label="优先级"
						>
							<span>最低</span>
							<input 
								v-model="item.priority" 
								type="hidden" 
								style="width:300px;"
							>
						</i-form-item>
						<div v-if="index !== 0" class="g-flex g-fd-r">
							<i-form-item label="需要得分"/>
							<div class="g-flex g-fd-c">
								<div 
									v-for="(it, i) in item.result_dimensions" 
									:key="it.uid"
								>
									<i-form-item 
										:rules="rules.dimension_id"
										:prop="'results.'+ index + '.result_dimensions.' + i + '.dimension_id'"
										label=""
										class="_no-label"
										style="margin-right: 5px;"
									>
										<i-select
											v-model="it.dimension_id"
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
										:rules="rules.score"
										:prop="'results.'+ index + '.result_dimensions.' + i + '.score'"
										label=""
										class="_no-label"
									>
										<i-input-number
											v-model="it.score"
											:min="1"
											placeholder="请输入分值" 
											style="width:80px;"
										/>
										<span class="g-m-l-10">
											<i 
												v-if="item.result_dimensions.length !== 1"
												class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
												@click="handleDelScore(index, i)"
											/>
											<i 
												class="icon iconfont icon-add1 g-c-blue-mid g-pointer" 
												@click="handleAddScore(index, i)"
											/>
										</span>
									</i-form-item>
								</div>
							</div>
						</div>
					</div>
					<div class="g-flex g-fd-c g-m-l-30">
						<i-form-item required label="匹配程度">
							<i-rate v-model="item.match_progress" allow-half />
						</i-form-item>
						<i-form-item 
							:rules="rules.inner_conclusion" 
							:prop="'results.'+ index + '.inner_conclusion'"
							label="内部结论"
						>
							<oa-limit-words 
								v-model="item.inner_conclusion"
								placeholder="请输入内部结论"
								clearable
								style="width:300px;"
							/>
						</i-form-item>
						<i-form-item 
							v-if="index !== 0"
							:rules="rules.priority"
							:prop="'results.'+ index + '.priority'"
							label="优先级"
						>
							<i-input-number
								v-model="item.priority"
								:min="1"
								placeholder="请输入优先级" 
								style="width:300px;"
							/>
						</i-form-item>
					</div>
				</div>
				<div class="_btn-icon g-flex g-ai-c g-jc-fe g-m-r-20">
					<i 
						v-if="formData.results.length !== 1 && index !== 0"
						class="icon iconfont icon-remove-circle g-c-red-mid g-pointer"
						@click="handleDelResult(item, index)"
					/>
					<i 
						v-if="index === formData.results.length - 1"
						class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-5" 
						@click="handleAddResult"
					/>
				</div>
			</div>
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
import { Form, FormItem, Input, InputNumber, Button, Select, Option, Rate } from 'iview';
import LimitWords from '@components/_common/limit-words/limit-words';
import { Confirm } from '@components/_common/confirm/confirm';
import { uid } from '@utils/utils';

export default {
	name: 'oa-recruit-paper-result',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-rate': Rate,
		'oa-limit-words': LimitWords
	},
	props: {
		paperTheme: String,
		results: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		const defaultOption = { dimension_id: '', score: '' };

		return {
			dimensions: [], // 维度列表
			defaultOption,
			formData: {// 表单
				paper_theme: this.paperTheme,
				results: this.results.length ? this.results.map(it => ({
					uid: uid(),
					result_id: it.result_id,
					test_result: it.test_result,
					external_explain: it.external_explain,
					match_progress: it.match_progress / 2,
					inner_conclusion: it.inner_conclusion,
					priority: it.priority,
					result_dimensions: it.dimensions.map(_it => ({
						uid: uid(),
						record_id: _it.record_id,
						dimension_id: _it.dimension_id,
						score: _it.score
					}))
				})) : [this.getNewResult()]
			},
			rules: {// 表单验证
				test_result: [
					{ required: true, message: '请输入测试结果', trigger: "blur" }
				],
				external_explain: [
					{ required: true, message: '请输入对外解释', trigger: "blur" }
				],
				dimension_id: [
					{ required: true, type: "number", message: '请选择测试维度', trigger: "change" }
				],
				score: [
					{ required: true, type: "number", message: '请输入分值', trigger: "blur" }
				],
				inner_conclusion: [
					{ required: true, message: '请输入内部结论', trigger: "blur" }
				],
				priority: [
					{ required: true, type: "number", message: '请输入数字', trigger: "blur" }
				]
			}
		};
	},
	watch: {
		results(val) {
			this.formData.results = val.length ? val.map(it => ({
				uid: uid(),
				result_id: it.result_id,
				test_result: it.test_result,
				external_explain: it.external_explain,
				match_progress: it.match_progress / 2,
				inner_conclusion: it.inner_conclusion,
				priority: it.priority,
				result_dimensions: it.dimensions.map(_it => ({
					uid: uid(),
					record_id: _it.record_id,
					dimension_id: _it.dimension_id,
					score: _it.score
				}))
			})) : [this.getNewResult()];
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
		handleAddResult() {
			const result = this.getNewResult();
			this.formData.results.push({ ...result, priority: null });
		},
		handleDelResult(item, index) {
			Confirm.popup({
				title: "",
				msg: "是否确定删除该结果？",
				showIcon: true
			}).then(() => {
				if (item.result_id) {
					this.$request({
						url: '_HR_RECRUIT_SCHOOL_RESULT_DEL_POST',
						type: 'POST',
						loading: false,
						param: {
							paper_id: this.$route.query.paper_id,
							result_id: item.result_id
						},
						autoTip: true
					}).then(res => {
						this.$emit('reload', true);
					}).catch(error => {});
				} else {
					this.formData.results.splice(index, 1);
				}
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleAddScore(index, i) {
			const option = this.getNewScore();
			this.formData.results[index].result_dimensions.splice(i + 1, 0, { ...option });
		},
		handleDelScore(index, i) {
			this.formData.results[index].result_dimensions.splice(i, 1);
		},
		handleSave() {
			return this.$refs.formData.validate().then((valid) => {
				if (valid) {
					let param = {
						paper_id: this.$route.query.paper_id,
						paper_theme: this.formData.paper_theme,
						results: this.formData.results.map(it => ({ ...it, match_progress: it.match_progress * 2 }))
					};
					return this.$request({
						url: '_HR_RECRUIT_SCHOOL_RESULT_ADD_POST',
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
		getNewResult() {
			return {
				uid: uid(),
				test_result: '',
				external_explain: '',
				match_progress: 0,
				inner_conclusion: '',
				priority: 0,
				result_dimensions: [{ uid: uid(), ...this.defaultOption }]
			};
		},
		getNewScore() {
			return { uid: uid(), dimension_id: '', score: '' };
		}
	}
};

export const RecruitPaperResult = module.exports.default;
</script>
<style lang="scss">
.v-hr-recruit-paper-result {
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
