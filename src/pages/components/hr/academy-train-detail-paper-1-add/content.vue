<template>
	<div class="v-hr-academy-train-detail-exam-add g-m-l-20 g-jc-sb">
		<div v-if="$route.query.paper_id && exam_result_count" class="_empty g-pd-10">
			<i class="icon iconfont icon-attention g-c-red-dark"/>
			已有学员参加考试，你可以修改试卷的问题描述。重新编辑试卷，将清空学员的考试数据，
			<span class="g-operation g-c-blue-light" @click="handleEmpty()">点击清空</span>
			。清空后，请提醒学员重新参加考试。
		</div>
		<i-form
			ref="form"
			:model="formData"
			:rules="formDataRule"
			:label-width="84"
			style="margin-top: 65px;"
		>
			<div class="_title" style="margin-top: 10px;">
				<i-form-item prop="paper_name">
					<i-input 
						ref="papername"
						v-model="formData.paper_name" 
						:maxlength="30"
						style="width: 800px"
						placeholder="请在这里输入试卷名称"
					/>
				</i-form-item>
				<i-form-item prop="paper_describe">
					<oa-limit-words
						v-model="formData.paper_describe"
						:max="500"
						placeholder="可以输入试卷考试要点，如：考核点、是否影响绩效、建议等提示信息"
						style="width:800px"
					/>
				</i-form-item>
				<i-form-item 
					ref="relation"
					label="关联事项："
					prop="label"
				>
					<span class="g-c-blue-mid g-pointer" @click="hadleRelatedMaster">关联事项</span>
					<span 
						v-if="formData.relation_type"
					>{{ formData.label }}</span>
				</i-form-item>
			</div>
			<div 
				v-if="formData.paper_type == 1"
				class="__change-content"
			>
				<div v-if="formData.dataList.length" class="__change-button">
					<div :style="formData.dataList[0].type == 1 ? selectedItem : ''" class="__item" @click="handleEditFirst(1)">单选题</div>
					<div :style="formData.dataList[0].type == 2 ? selectedItem : ''" class="__item" @click="handleEditFirst(2)">多选题</div>
					<div :style="formData.dataList[0].type == 3 ? selectedItem : ''" class="__item" @click="handleEditFirst(3)">判断题</div>
					<div :style="formData.dataList[0].type == 4 ? selectedItem : ''" class="__item" @click="handleEditFirst(4)">填空题</div>
					<div :style="formData.dataList[0].type == 5 ? selectedItem : ''" class="__item" @click="handleEditFirst(5)">问答题</div>
				</div>
			</div>
			<div 
				v-for="(item, index) in formData.dataList"
				:key="index"
				class="_content"
			>
				<div class="g-flex g-relative __question-wrapper" style="margin-top: -20px;">
					<span 
						:style="item.isEdit && item.isEdit ? editStyle : detailStyle" 
						class="__index g-absolute"
					>{{ index + 1 }}、</span>
					<div class="__question">
						<oa-question 
							v-if="item.isEdit"
							ref="question" 
							:data="item" 
							:show-change="false"
							:show-relate="false"
							style="margin-left:-23px"
						/>
						<oa-question-pre 
							v-else 
							:data="item" 
							:width="650" 
							:relate="false" 
							:paper-type="formData.paper_type"
							style="width: 860px;margin-left: -13px;min-height: 100px;"/>
					</div>
					<div class="__operation">
						<div class="__top">
							<i 
								v-if="formData.paper_type == 1"
								class="iconfont icon-up g-block" 
								@click="handleUp(item, index)"
							/>
							<i 
								v-if="formData.dataList.length !== 1" 
								class="iconfont icon-delete g-block"
								@click="handleDeleteTopic(item, index)"
							/>
							<i 
								v-if="formData.paper_type == 1"
								class="iconfont icon-down g-block" 
								@click="handleDown(item, index)"
							/>
						</div>
						<div v-if="formData.paper_type == 1" class="__bottom">
							<!-- <i 
								v-if="!item.isEdit" 
								class="iconfont icon-edit1"
								@click="handleEditTopic(item, index)"
							/> -->
							<i-button 
								v-if="!item.isEdit"  
								type="primary"
								@click="handleEditTopic(item, index)"
							>
								编辑
							</i-button>
							<i-button
								v-else  
								type="primary"
								@click="handleSaveTopic(item, index)"
							>
								保存
							</i-button>
							<!-- <i 
								v-else 
								class="iconfont icon-duihaocheckmark17-copy"
								@click="handleSaveTopic(item, index)"
							/> -->
						</div>
					</div>
				</div>
				<div 
					v-if="formData.paper_type == 1"
					class="__select-content"
					@mouseover="handleOver(item, index)"
					@mouseout="handleOver(item, index)"
				>
					<div v-show="item.button_show" class="__pre-button"><i-icon class="g-m-r-5" type="md-add" />添加题目</div>
					<div v-show="!item.button_show" class="__select-button">
						<div class="__item" @click="handleAddTopic(1, index)">单选题</div>
						<div class="__item" @click="handleAddTopic(2, index)">多选题</div>
						<div class="__item" @click="handleAddTopic(3, index)">判断题</div>
						<div class="__item" @click="handleAddTopic(4, index)">填空题</div>
						<div class="__item" @click="handleAddTopic(5, index)">问答题</div>
					</div>
				</div>
			</div>
			<oa-title class="g-m-b-20">
				试卷详情
			</oa-title>
			<oa-detail-table v-if="formData.paper_type == 1" :paper-list="formData.dataList" class="_score">
				<i-form-item prop="pass_score" class="g-inline-block">
					<i-input :disabled="!!exam_result_count" v-model="formData.pass_score" style="width: 100px"/>
				</i-form-item>
			</oa-detail-table>
			<oa-random-table
				v-else 
				ref="random" 
				:questions="formData.dataList" 
				:num-and-score="numAndScore" 
				class="_score"
			>
				<i-form-item prop="pass_score" class="g-inline-block">
					<i-input :disabled="!!exam_result_count" v-model="formData.pass_score" style="width: 100px"/>
				</i-form-item>
			</oa-random-table>
			<div class="_check g-m-t-20 g-m-b-30">
				<i-checkbox 
					v-model="formData.is_to_library_paper" 
					:true-value="1"
					:false-value="0"
					class="g-m-r-30"
				>
					将试卷保存到试卷库
				</i-checkbox>
				<i-checkbox 
					v-if="!$route.query.paper_id" 
					v-model="formData.is_to_library_question" 
					:true-value="1"
					:false-value="0"
				>
					将题目保存到题库
				</i-checkbox>
			</div>
			<div class="_footer g-flex-cc" style="height: 45px;">
				<i-button 
					type="primary"
					@click="handleSavePaper"
				>
					保存试卷
				</i-button>
			</div>
		</i-form>

		<div>
			<div :style="leftButton" class="_left-button">
				<vc-debounce-click
					class="g-red-btn-line g-m-r-5"
					@click="handleToStore">
					从题库选题
				</vc-debounce-click>
				<vc-debounce-click
					class="g-red-btn-line g-m-r-20 "
					@click="handleToPaper">
					选择试卷模板
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>
import Question from '@components/_common/questions/question';
import API_ROOT from '@stores/apis/root';
import QuestionPreview from '@components/_common/questions/question-preview';
import { Form, FormItem, Input, Message, Checkbox,
	CheckboxGroup, Button, Icon, RadioGroup, Radio } from 'iview';
import Title from '@components/hr/academy-train-detail/_common/title';
import DetailTable from '@components/hr/academy-train-detail/_common/detail-table';
import RandomTable from '@components/hr/academy-train-detail/_common/random-table';
import { getParseUrl, getHashUrl, setItem, getItem } from '@utils/utils';
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { ChoosePaper } from '../_common/academy-course/drawers/choose-paper';
import { ChooseQuestion } from '../_common/academy-course/drawers/choose-question'; 
import { ReplaceModal } from './popup/replace-modal';

const DEFAULT_SETTING = [
	{ type: 1, type_name: '单选题', max_num: 0, num: null, score: null },
	{ type: 2, type_name: '多选题', max_num: 0, num: null, score: null },
	{ type: 3, type_name: '判断题', max_num: 0, num: null, score: null },
	{ type: 4, type_name: '填空题', max_num: 0, num: null, score: null },
	{ type: 5, type_name: '简答题', max_num: 0, num: null, score: null }
];

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'oa-title': Title,
		'oa-detail-table': DetailTable,
		'oa-random-table': RandomTable,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'oa-question': Question,
		'oa-question-pre': QuestionPreview,
		'i-button': Button,
		'i-icon': Icon,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	data() {
		const validateAve = (rule, value, callback) => {
			let reg = /^(\.*)(\d+)(\.?)(\d{0,1}).*$/g;
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error('请输入数字，小数限一位'));
			}
		};
		return {
			selectedItem: 'color: #fff;background-color: #E74854;', // 第一题选中样式
			editStyle: 'left: 4px;top: 27px;',
			detailStyle: 'left: 4px;top: 31px;',
			firstStyle: 'left: 24px;top: 42px;',
			leftButton: window.innerHeight > 769 ? 'top: 225px; right: 10px;position: fixed;' : 'top: -55px;right: 10px;position: absolute',
			exam_result_count: '',
			formData: {
				label: '',
				relation_id: '',
				relation_type: '',
				paper_name: '',
				paper_type: 1,
				paper_describe: '',
				pass_score: '',
				save_option: [],
				is_replace: 0,
				library_paper_id: '', // 从试卷库选题后更新
				is_to_library_paper: 0, // 保存到试卷库
				is_to_library_question: 0, // 保存到题库
				dataList: [
					{	
						action: 'add',
						question_id: 0,
						button_show: true,
						isEdit: true,
						type: 1, // 1 单选  2 多选  3 判断  4 填空  5 简答
						subject_id: 1, // 关联课题
						title: '',
						score: 0,
						single_score: 2,
						option: [],
						success_tips: '',
						error_tips: '',
						explain: '',
						keyword: '',
						maker_staff_id: 1,
					}
				]
			},
			formDataRule: {
				paper_name: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
				pass_score: [{ required: true, message: '请输入及格分', trigger: 'blur' },
					{ validator: validateAve, trigger: 'blur' }],
				label: [{ required: true, message: '请选择关联事项', trigger: 'change' }]
			},
			numAndScore: DEFAULT_SETTING
		};
	},
	computed: {
		allScore() {
			return this.numAndScore.reduce((init, queType) => {
				return init += (queType.num * queType.score) || 0;
			}, 0);
		}	
	},
	created() {
		this.$route.query.paper_id && this.loadPaperEditData(this.$route.query.paper_id, this.$route.query.exam_id);
	},
	methods: {
		// 清空试卷
		handleEmpty() {
			ModalTip.popup({
				title: '提示',
				content: '您将清空该考试中所有提交的考试数据，确定清空吗？清空后，已参加的学员需要重新考试，请谨慎操作！'
			}).then(res => {
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_EXAM_RESULT_DELETE_POST,
					type: "POST",
					param: {
						exam_id: this.$route.query.exam_id
					}
				}).then(re => {
					this.loadPaperEditData(this.$route.query.paper_id, this.$route.query.exam_id);
					this.$Message.success('清空成功');
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			});
		},
		// 第一道题换题型
		handleEditFirst(type) {
			if (!this.exam_result_count) {
				if (this.formData.dataList[0].type == type) return;
				let editArr = [];
				this.formData.dataList.filter((v, index) => index !== 0).map(v => {
					editArr.push(v.isEdit);
					return;
				});
				if (editArr.includes(true)) {
					this.$Message.warning('请确保已保存所有题目再进行更改');
					return;
				}
				ModalTip.popup({
					title: '提示',
					content: '变换题型后当前填写的题目内容将被清空，确认变换题型吗？'
				}).then(res => {
					this.formData.dataList.shift();
					this.$nextTick(() => {
						this.formData.dataList.splice(0, 0, {
							question_id: 0,
							action: 'add',
							button_show: true,
							isEdit: true,
							type, // 1 单选  2 多选  3 判断  4 填空  5 简答
							subject_id: 1, // 关联课题
							title: '',
							score: 0,
							single_score: 2,
							option: [],
							success_tips: '',
							error_tips: '',
							explain: '',
							keyword: '',
							maker_staff_id: 1,
						});
					});
				});
			} else {
				this.$Message.error('已有人进行考试不能更改此项');
			}
			
		},

		// 编辑时获取试卷数据
		loadPaperEditData(paper, exam) {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_PAPER_DETAIL_GET,
				type: "GET",
				param: {
					paper_id: paper,
					exam_id: exam
				}
			}).then(res => {
				this.formData.paper_id = res.data.paper_id;
				this.formData.paper_name = res.data.paper_name;
				this.formData.paper_describe = res.data.paper_describe;
				this.formData.pass_score = res.data.pass_score + '';
				this.formData.paper_type = res.data.paper_type;
				this.formData.relation_type = res.data.relation_type;
				this.formData.relation_id = res.data.relation_id.map(v => v.course_id);
				this.formData.label = res.data.relation_type == 1 ? '整个项目' : res.data.relation_id.map(v => v.course_name).join(',');
				this.exam_result_count = res.data.exam_result_count;
				res.data.question.forEach(v => {
					this.$set(v, 'isEdit', false);
					this.$set(v, 'button_show', true);
				});
				this.formData.dataList = res.data.question;
				if (this.formData.paper_type === 2) {
					this.handleInitSetting(res.data.setting);
				}
				if (window.innerHeight > 769) {
					this.leftButton = this.exam_result_count ? 'top: 269px;right: 10px;position: fixed;' : 'top: 225px; right: 10px;position: fixed;';
				} else {
					this.leftButton = this.exam_result_count ? 'top: 58px;right: 10px;position: absolute;'
						: 'top: 225px; right: 10px;position: absolute;';
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		// 试卷库选题
		loadPaperData(paper) {
			this.$request({
				url: API_ROOT._HR_TRAIN_LIBRARY_PAPER_INFO_GET,
				type: "GET",
				param: {
					paper_id: paper,
				}
			}).then(res => {
				this.formData.paper_id = res.data.paper_id;
				this.formData.paper_name = res.data.paper_name;
				this.formData.paper_type = res.data.paper_type;
				this.formData.paper_describe = res.data.paper_describe;
				this.formData.pass_score = res.data.pass_score + '';
				this.formData.library_paper_id = res.data.paper_id;
				res.data.question.forEach(v => {
					this.$set(v, 'isEdit', false);
					this.$set(v, 'button_show', true);
				});
				let newArr = this.formData.dataList.filter(v => v.is_hand_new);
				this.formData.dataList = [];
				res.data.question.forEach(v => {
					this.formData.dataList.push(v);
				});
				this.formData.dataList = this.formData.dataList.concat(newArr);
				if (this.formData.paper_type === 2) {
					this.handleInitSetting(res.data.setting);
				}
				if (this.$refs.papername) {
					this.$refs.form.validateField("paper_name");
				}
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},

		// 随机试卷返回数据， 新建试卷不用处理
		hanldeGetSetting() {
			if (this.formData.paper_type === 2) {
				const { formData: { numAndScore } } = this.$refs.random;
				return {
					single_num: numAndScore[0].num || 0,
					single_score: numAndScore[0].score || 0,
					multiple_num: numAndScore[1].num || 0,
					multiple_score: numAndScore[1].score || 0,
					judgement_num: numAndScore[2].num || 0,
					judgement_score: numAndScore[2].score || 0,
					blanks_num: numAndScore[3].num || 0,
					blanks_score: numAndScore[3].score || 0,
					content_num: numAndScore[4].num || 0,
					content_score: numAndScore[4].score || 0
				};
			}
		},

		// 初始化setting
		handleInitSetting(setting) {
			const { single_num, multiple_num, judgement_num, blanks_num, content_num,
				single_score, multiple_score, judgement_score, blanks_score, content_score } = setting;
			const settingObj = [
				{ num: single_num, score: single_score },
				{ num: multiple_num, score: multiple_score },
				{ num: judgement_num, score: judgement_score },
				{ num: blanks_num, score: blanks_score },
				{ num: content_num, score: content_score }
			];
			this.numAndScore = this.numAndScore.map((v, i) => ({
				...v,
				num: (settingObj[i].num || settingObj[i].num === 0) ? settingObj[i].num : null,
				score: (settingObj[i].score || settingObj[i].score === 0) ? settingObj[i].score : null
			}));
		},

		// 关联事项
		hadleRelatedMaster() {
			this.exam_result_count ? this.$Message.error('已有人进行考试不能更改此项')
				: PModalRetatedMatter.popup({ 
					type: 'exam',
					datas: {
						relation_type: this.formData.relation_type,
						relation_id: this.formData.relation_id
					}
				}).then(res => {
					this.formData.label = res.label;
					this.formData.relation_id = res.relation_id;
					this.formData.relation_type = res.relation_type + '';
					if (this.$refs.relation) {
						this.$refs.form.validateField("label");
					}
				});
		},
		// 题库选题
		handleToStore() {
			this.exam_result_count ? this.$Message.error('已有人进行考试不能更改此项')
				: ChooseQuestion.popup().then(res => {
					let question = res.map(v => v.question_id);
					this.handleQuestionData(question);
				});
		},
		// 试卷库选题
		handleToPaper() {
			this.exam_result_count ? this.$Message.error('已有人进行考试不能更改此项')
				: ChoosePaper.popup().then(res => {
					let paper = res.paper_id;
					ModalTip.popup({
						title: '提示',
						content: '重新选择试卷后之前的选择的试卷会被覆盖，新增的题目会自动移动选择试卷的最下面，是否确认更换？'
					}).then(re => {
						this.loadPaperData(paper);
					});
				});
		},
		// 请求题目数据
		handleQuestionData(question) {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_EXAM_QUESTION_ID_POST,
				type: "POST",
				param: {
					question_ids: question
				}
			}).then(res => {
				res.data.forEach(v => {
					this.$set(v, 'isEdit', false);
					this.$set(v, 'button_show', true);
					this.$set(v, 'is_hand_new', true);
				});
				// this.formData.dataList.splice(-1, 0, ...res.data);
				this.formData.dataList.push(...res.data);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		// 新增题目 hover
		handleOver(item, index) {
			this.formData.dataList.forEach((v, i) => {
				i == index ? v.button_show = !v.button_show : '';
			});
		},
		// 删除题目
		handleDeleteTopic(item, index) {
			this.exam_result_count ? this.$Message.error('已有人进行考试不能更改此项')
				: this.formData.dataList.splice(index, 1);
		},
		// 添加一道题目
		handleAddTopic(topic_type, index) {
			if (this.exam_result_count) {
				this.$Message.error('已有人进行考试不能更改此项');
			} else {
				let flag = false;
				let editArr = [];
				this.formData.dataList.map(v => {
					editArr.push(v.isEdit);
					return;
				});
				if (editArr.includes(true)) {
					this.$Message.warning('请先保存编辑再进行新建');
					this.$refs.question[0].$el.scrollIntoView(false);
				} else {
					this.formData.dataList.splice(index + 1, 0, {
						question_id: 0,
						action: 'add',
						button_show: true,
						isEdit: true,
						type: topic_type, // 1 单选  2 多选  3 判断  4 填空  5 简答
						subject_id: 1, // 关联课题
						title: '',
						score: 0,
						single_score: 2,
						option: [],
						success_tips: '',
						error_tips: '',
						explain: '',
						keyword: '',
						maker_staff_id: 1,
					});
				}
			}
		},
		// 编辑一道题
		async handleEditTopic(item, index) {
			if (this.exam_result_count) {
				this.$Message.error('已有人进行考试不能更改此项');
			} else {
				let editArr = [];
				this.formData.dataList.map(v => {
					editArr.push(v.isEdit);
					return;
				});
				if (editArr.includes(true)) {
					this.$Message.warning('请先对未保存题目进行保存再编辑');
					this.$refs.question[0].$el.scrollIntoView(false);
					return;
				}
				if (this.$refs.question && this.$refs.question.length > 0) {
					const valid = await this.$refs.question[0].validate();
					this.$refs.question[0].$el.scrollIntoView(false);
					if (!valid) return;
				// this.$Message.warning('请不要同时编辑多道题目');
				} else {
					this.formData.dataList.forEach((v, i) => {
						if (i == index) {
							v.isEdit = true;
						}
					});
				}
			}
			
		},
		// 保存一道题
		async handleSaveTopic(item, index) {
			const valid = await this.$refs.question[0].validate();
			if (!valid) return;
			const formData = this.$refs.question[0].getFormData();
			this.formData.dataList.map((v, i) => {
				if (i == index) {
					v = formData;
					this.$set(this.formData.dataList, i, formData);
					this.$set(v, 'isEdit', false);
					this.$set(v, 'button_show', true);
					this.$set(v, 'is_hand_new', true);
				}
				return;
			});
		},
		async handleSavePaper() {
			if (this.$refs.question && this.$refs.question.length > 0) {
				const valid = await this.$refs.question[0].validate();
				this.$refs.question[0].$el.scrollIntoView(false);
				if (!valid) return;
				this.$Message.warning('请保存题目后再保存试卷');
			} else {
				this.formData.paper_type == 2 ? this.$refs.random.$refs.form.validateAndScroll((valid1) => {
					if (valid1) {
						this.handleSavePaperValid();
					}
				}) : this.handleSavePaperValid();
			}
		},
		handleSavePaperValid() {
			this.$refs.form.validateAndScroll((valid) => {
				if (this.formData.relation_type == '') {
					this.$Message.warning('请选择关联事项');
				}
				if (valid) {
					this.formData.paper_type == 2 ? this.handleChangeRandomScore() : '';
					let total = this.formData.dataList.reduce((init, cur) => init + cur.score, 0);
					if ((this.formData.paper_type == 1 ? total : this.allScore) < this.formData.pass_score) {
						this.$Message.warning('及格分必须小于总分');
						return;
					}
								
					try {
						// this.formData.is_to_library_paper ? 
						this.formData.is_to_library_paper ? this.$request({
							url: API_ROOT._HR_ACADEMY_TRAIN_PAPER_NAME_VERIFY_GET,
							type: "GET",
							param: {
								paper_name: this.formData.paper_name
							},
							loading: false,
						}).then(res => {
							res.data.count ? ReplaceModal.popup({}).then(re => {
								this.formData.is_replace = re;
								this.handleSavePaperPost();
							}) : this.handleSavePaperPost();
						}).catch((res) => {
							this.$Message.error(`${res.msg}`);
						}) : this.handleSavePaperPost();
					} catch (error) {
						console.error(error);
					}
				}
			});
		},
		// 随机试卷保存时将所有题目分数改为与所改分数一致
		handleChangeRandomScore() {
			this.formData.dataList.forEach(v => {
				v.score = this.numAndScore[v.type - 1].score;
			});
		},
		// 保存试卷请求
		handleSavePaperPost() {
			this.formData.dataList.forEach((v, index) => {
				v.sort = index + 1;
			});
			let obj = {
				project_id: this.$route.query.project_id,
				relation_type: this.formData.relation_type,
				relation_id: this.formData.relation_id.length ? this.formData.relation_id : '',
				paper_name: this.formData.paper_name,
				paper_describe: this.formData.paper_describe,
				pass_score: this.formData.pass_score,
				is_replace: this.formData.is_replace,
				paper_type: this.formData.paper_type,
				library_paper_id: this.formData.library_paper_id,
				is_to_library_paper: this.formData.is_to_library_paper,
				is_to_library_question: this.formData.is_to_library_question,
				question: this.formData.dataList,
				setting: this.hanldeGetSetting() || {}
			};

			let url = '_HR_ACADEMY_TRAIN_DETAIL_EXAM_PAPER_SAVE_POST';
			if (this.$route.query.paper_id) {
				obj.paper_id = this.$route.query.paper_id;
				obj.exam_id = this.$route.query.exam_id;
				url = '_HR_ACADEMY_TRAIN_DETAIL_EXAM_PAPER_UPDATE_POST';
			}
			this.$request({
				url: API_ROOT[url],
				type: "POST",
				param: obj,
				loading: false,
			}).then(res => {
				this.$Message.success('保存成功');
				this.$router.push(getHashUrl(
					'/hr/academy/train/detail/paper/0/pass', 
					{ 
						project_id: this.$route.query.project_id,
					}
				));
			}).catch((res) => {
				this.$Message.error(`${res.msg}`);
			});
		},
		swapItems(arr, index1, index2) {
			arr[index1] = arr.splice(index2, 1, arr[index1])[0];
			return arr;
		},
		// 上移题目
		handleUp(item, index) {
			this.exam_result_count ? this.$Message.error('已有人进行考试不能更改此项')
				: index ? this.swapItems(this.formData.dataList, index, index - 1) : this.$Message.warning('已经是第一道题了');
		},
		// 下移题目
		handleDown(item, index) {
			this.exam_result_count ? this.$Message.error('已有人进行考试不能更改此项')
				: index == this.formData.dataList.length - 1 ? this.$Message.warning('已经是最后一道题了')
					: this.swapItems(this.formData.dataList, index, index + 1);
		}
	},
};
</script>

<style lang="scss">
.v-hr-academy-train-detail-exam-add {
	padding-bottom: 100px;
	position: relative;
	._empty {
		background-color: #fbebe9;
		color: #E74854;
		margin-right: 12px;
		height: 40px;
		font-size:14px;
	}
	._title {
		.ivu-form-item-content {
			margin-left: 0 !important;
		}
	}
	.__change-content {
			margin: 20px 0 0 0px;
			padding-bottom: 40px;
			.__pre-button {
				display: inline-block;
				height: 32px;
				line-height: 32px;
				width: 90px;
				color: #fff;
				background-color: #e84c57;
				border-radius: 4px;
				margin-right: 10px;
				text-align: center;
				cursor: pointer;
			}
			.__change-button {
				display: inline-block;
				.__item {
					display: inline-block;
					margin-right: 10px;
					width: 80px;
					height: 32px;
					line-height: 32px;
					color: #E74854;
					background-color: #fbebe9;
					border-radius: 4px;
					text-align: center;
					cursor: pointer;
				}
				.__item:hover {
					color: #fff;
					background-color: #E74854;
				}
			}
		}
	._content {
		.__question-wrapper {
			padding: 20px 0 20px 0;
			width: 950px;
			.__question {
				display: inline-block;
			}
			.__operation {
				display: inline-block;
				position: relative;
				height: 100%;
				width: 100px;
				.__top {
					position: absolute;
					cursor: pointer;
					top: 42px;
					left: 30px;
				}
				.__bottom {
					position: absolute;
					cursor: pointer;
					top: 0;
					left: 11px;
				}
			}
		}
		.__question-wrapper:hover {
			background-color: #f8f8f8;
			border-radius: 3px;
			width: 950px;
		}
		.__select-content {
			margin: 20px 0 20px 0;
			padding-bottom: 20px;
			.__pre-button {
				display: inline-block;
				height: 32px;
				line-height: 32px;
				width: 90px;
				color: #fff;
				background-color: #e84c57;
				border-radius: 4px;
				margin-right: 10px;
				text-align: center;
				cursor: pointer;
			}
			.__select-button {
				display: inline-block;
				.__item {
					display: inline-block;
					margin-right: 10px;
					width: 80px;
					height: 32px;
					line-height: 32px;
					color: #E74854;
					background-color: #fbebe9;
					border-radius: 4px;
					text-align: center;
					cursor: pointer;
				}
				.__item:hover {
					color: #fff;
					background-color: #E74854;
				}
			}
		}
	}
	._score {
		.ivu-form-item {
			vertical-align: 0;
		}
		.ivu-form-item-content {
			margin-left: 0 !important;
		}
	}
	._check {
		.ivu-checkbox-group-item {
			margin-right: 35px;
		}
	}
	._footer {
		position: fixed;
		bottom: 0;
		left: 340px;
		width: calc(100% - 340px);
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	._left-button {
	}
}
</style>
