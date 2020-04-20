<template>
	<div class="v-academy-paper-2-arrange">
		<oa-provide-qcrode 
			v-if="!showNextStep && url" 
			:url="url" 
			:relation_id="relation_id"
			:activity_type="2"
			:activity_id="$route.query.exam_id"
		/>
		<oa-title style="margin-bottom: 15px">发放设置</oa-title>
		<i-form 
			ref="formValidate"
			:model="formValidate" 
			:rules="ruleValidate"
			:label-width="110"
		>
			<i-form-item label="选择考试时间：" prop="examTime">
				<i-data-picker 
					v-model="formValidate.examTime"
					:options="option1"
					:editable="false"
					format="yyyy-MM-dd HH:mm"
					type="datetimerange"
					separator=" 至 "
					transfer
					style="width: 300px"
					placeholder="请选择考试时间"
					class="_long"/>
			</i-form-item>

			<i-form-item label="答题时长">
				<i-input-number
					v-model="formValidate.time" 
					:min="0"
					:max="300"
					:precision="0"
					clearable
					style="width: 220px"
					placeholder="请输入答题时长"
				/>
				<span 
					class="g-c-black2 g-absolute __tip">分钟</span>
				<span class="g-c-black5">（不填表示不限）</span>
			</i-form-item>

			<i-form-item label="验证考试信息：">
				<i-checkbox-group v-model="formValidate.verify_items">
					<i-checkbox 
						v-for="(sign, i) in SIGN_INFO"
						:key="i"
						:disabled="i < 2"
						:label="i + 1"
						style="margin-right: 40px">
						{{ sign }}
					</i-checkbox>
					<i-checkbox :label="4" style="margin-right: 40px">
						性别
					</i-checkbox>
				</i-checkbox-group>
			</i-form-item>

			<i-form-item label="是否可以补考：" style="margin-top: -10px">
				<i-radio-group v-model="formValidate.exam_again_status">
					<i-radio :label="1" >是</i-radio>
					<i-radio :label="0" >否</i-radio>
				</i-radio-group>

				<i-form-item v-if="formValidate.exam_again_status" key="100" label="试卷与本次相同：">
					<i-radio-group v-model="formValidate.is_equal" @on-change="handlePaperChange">
						<i-radio :label="1" >是</i-radio>
						<i-radio :label="0" >否</i-radio>
					</i-radio-group>
				</i-form-item>

				<template v-if="formValidate.exam_again_status && formValidate.examTime[0]">
					<i-form-item 
						v-for="(item, i) in formValidate.exam_again"
						:label-width="140"
						:key="item.id"
						:label="`第${i + 1}次补考开始时间：`" 
						:prop="'exam_again.' + i + '.time'"
						:rules="ruleValidate.examTime"
						:style="{ marginTop: i === 0 ? '-10px' : 0}"
						separator=" 至 "
						style="margin: 0 0 0 -30px"
						class="__hide-require">
						<i-data-picker 
							v-model="item.time"
							:options="item.options"
							format="yyyy-MM-dd HH:mm"
							type="datetimerange"
							split-panels
							transfer
							style="width: 300px"
							separator=" 至 "
							placeholder="请选择补考时间"/>
						<i
							v-if="showRemoveTime"
							style="vertical-align: middle"  
							class="g-c-red-light iconfont icon-remove-circle g-m-r-5 g-m-l-10 g-pointer" 
							@click="handleRemoveTime(i)"/>
						<i
							v-if="showAddTime && i+1 === formValidate.exam_again.length"
							:style="{cursor: 'pointer', 'margin-left': showRemoveTime ? 0 : '10px'}" 
							class="g-c-blue-light iconfont icon-add1  g-pointer"
							style="vertical-align: middle" 
							@click="handleAddTime"/>
						<span 
							v-if="!formValidate.is_equal"
							:style="{ paddingLeft: i+1 !== formValidate.exam_again.length && showAddTime ? '20px' : 0}"
							class="g-m-l-10 g-c-blue-mid g-pointer"
							@click="handleSelectPaper(i)"
						>关联试卷</span> 
						<span v-if="!formValidate.is_equal">{{ item.paper_name || '未关联试卷' }}</span>
					</i-form-item>
				</template>
			</i-form-item>

			<i-form-item label="人员名单信息：" style="margin-top: -20px">
				<span>名单中已有<span class="g-c-blue-mid">{{ participator_num }}</span>位学员，你还可以去人员名单中</span>
				<span class="g-pd-l-10 g-c-blue-mid g-pointer" @click="handleStudent">继续添加</span>
			</i-form-item>

			<oa-title style="margin-bottom: 15px">考试限制</oa-title>
			<i-form-item label="人员限制：">
				<i-radio-group v-model="formValidate.exam_limit">
					<i-radio :label="2" >限“参与人员”考试</i-radio>
					<i-radio :label="3" >限“公司内部人员”考试</i-radio>
					<i-radio :label="1" style="margin-left: 30px">允许任何人参加考试</i-radio>
				</i-radio-group>
			</i-form-item>

			<i-form-item label="交卷限制：" style="margin-top: -15px">
				<i-checkbox 
					v-model="formValidate.hand_limit"
					:true-value="1"
					:false-value="0"
				>学员必须答完所有题才能交卷</i-checkbox>
			</i-form-item>

			<oa-title style="margin-bottom: 15px">提示设置</oa-title>
			<i-form-item label="交卷后显示：">
				<i-checkbox-group v-model="formValidate.show_info">
					<i-checkbox 
						v-for="(info, i) in NOTICE_INFO"
						:key="i"
						:label="i + 1"
						style="margin-right: 40px">
						{{ info }} 
						<span v-if="i + 1 == NOTICE_INFO.length" class="g-c-black5">点击这里设置提醒或感谢，如：感谢您的参与 </span>
					</i-checkbox>
				</i-checkbox-group>

				<i-form-item v-if="formValidate.show_info.includes(4)" prop="notice_tips" style="margin-top: 10px">
					<oa-limit-words
						v-model="formValidate.notice_tips"
						:rows="4"
						:max="50"
						width="520px"
						placeholder="在此输入活动相关说明"/>
				</i-form-item>
			</i-form-item>
		</i-form>

		<div class="_footer">
			<i-button 
				type="primary"
				style="margin-right: 300px;" 
				@click="handleNextStep">{{ showNextStep ? '下一步' : '保存' }}</i-button>
		</div>
	</div>
</template>

<script>
import oaTitle from '@components/hr/academy-train-detail/_common/title';
import { Form, FormItem, DatePicker, RadioGroup, Radio, Checkbox, CheckboxGroup, Button, InputNumber } from 'iview';
import provideQcrode from '@components/hr/academy-train-detail/_common/provide-qcode';
import API_ROOT from '@stores/apis/root';
import moment from "moment";
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { setItem, getItem } from '@utils/utils';
import { ChoosePaper } from '../_common/academy-course/drawers/choose-paper';

const SIGN_INFO = ['姓名', '手机号码'];
const NOTICE_INFO = ['学员成绩', '答案解析', '点评', '提示信息'];

export default {
	name: 'oa-tpl',
	components: {
		'oa-title': oaTitle,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-data-picker': DatePicker,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-button': Button,
		'oa-provide-qcrode': provideQcrode,
		'i-input-number': InputNumber
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择考试时间');
			} else if (value[1] <= value[0]) {
				callback('开始时间需要小于结束时间');
			} else {
				callback();
			}
		};
		this.option1 = {
			disabledDate(date) {
				return date && date.valueOf() < Date.now() - 86400000;
			}
		};
		this.SIGN_INFO = SIGN_INFO;
		this.NOTICE_INFO = NOTICE_INFO;
		return {
			showNextStep: true,
			participator_num: 0,
			url: '',
			relatedCourse: this.$route.query.paper_name,
			relatedCourseId: this.$route.query.paper_id,
			relation_id: [],
			formValidate: {
				exam_id: this.$route.query.exam_id,
				examTime: [],
				time: null,
				verify_items: [1, 2],
				exam_again_status: 1,
				is_equal: 1, // 视觉是否和本次相同 0否  1 是
				exam_again: [{ 
					time: [], 
					paper_id: '', 
					paper_name: '',
					options: {
						disabledDate(date) {
							return true;
						}
					},
					sort: 1,
				}],
				exam_limit: 1,
				hand_limit: 1,
				show_info: [1, 2],
				notice_tips: ''
			},
			ruleValidate: {
				examTime: { validator: validateCreatedTime, trigger: 'change', required: true, },
				notice_tips: { required: true, trigger: 'blur', message: '请输入活动说明' }
			}
		};
	},
	computed: {
		showRemoveTime() {
			return this.formValidate.exam_again.length > 1;
		},
		showAddTime() {
			return this.formValidate.exam_again.length < 3;
		}

	},
	async created() {
		await this.loadData();
	},
	methods: {
		async loadData() {
			const { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_PAPER_ARRANGE_DETAIL_GET,
				type: "GET",
				param: { exam_id: this.$route.query.exam_id }
			});
			this.participator_num = data.participator_num;
			this.relation_id = data.relation_id;
			if (data.start_time) {
				this.formValidate = {
					exam_id: this.$route.query.exam_id,
					examTime: [data.start_time, data.end_time],
					time: +data.time || null,
					verify_items: data.verify_items.map(Number),
					exam_again_status: +data.exam_again_status,
					is_equal: +data.is_equal,
					exam_limit: +data.exam_limit,
					hand_limit: +data.hand_limit,
					show_info: data.show_info.map(Number),
					notice_tips: data.notice_tips || '',
					exam_again: +data.exam_again_status 
						? data.exam_again.map(v => ({
							...v,
							time: [v.start_time, v.end_time],
							paper_name: v.paper_name || '关联试卷',
							relation_paper_id: v.relation_paper_id
						})) : [{
							options: {
								disabledDate: (date) => {
									return date && date.valueOf() <= moment(data.start_time).valueOf() - 86400000;
								}
							},
							paper_name: +data.is_equal ? this.relatedCourse : '',
							time: [],
							library_paper_id: +data.is_equal ? this.relatedCourseId : '',
							relation_paper_id: 0
						}],
				};
				this.url = data.url;
				this.showNextStep = false;
			} else {
				this.handleInitRetake();
			}
		},
		handleRemoveTime(i) {
			this.formValidate.exam_again.splice(i, 1);
		},
		handleAddTime() {
			const exam_again = this.formValidate.exam_again;
			let paper = {
				paper_name: this.relatedCourse,
				relation_paper_id: 0,
				library_paper_id: this.relatedCourseId
			};
			if (!this.formValidate.is_equal) {
				paper = {
					paper_name: '',
					paper_type: this.formValidate.is_equal,
					relation_paper_id: 0,
					library_paper_id: ''
				};
			}
			exam_again.push({
				...paper,
				time: [],
				options: {
					disabledDate(date) {
						// 惰性验证  所以是减2 敲黑板！！！
						return date && date.valueOf() < exam_again[exam_again.length - 2].time[1].valueOf() - 86400000;
					}
				}
			});
		},
		handleStudent() {
			ModalTip.popup({
				content: '确定跳转到参与人员页面么？'
			}).then(() => {
				this.$router.push({
					path: '/hr/academy/train/detail/participate/0/roster',
					query: {
						course_id: this.relation_id.length === 1 ? this.relation_id[0].course_id : 0,
						project_id: this.$route.query.project_id
					}
				});
			});
		},
		handleInitRetake() {
			const exam_again = this.formValidate.exam_again;
			let firstInfo = exam_again[0];
			firstInfo = {
				...firstInfo,
				options: {
					disabledDate: (date) => {
						return date && date.valueOf() <= this.formValidate.examTime[1].valueOf() - 86400000;
					}
				},
				paper_name: this.relatedCourse,
				paper_type: this.formValidate.is_equal,
				relation_paper_id: 0,
				library_paper_id: this.relatedCourseId

			};
			exam_again.splice(0, 1, firstInfo);
		},
		handleSelectPaper(i) {
			if (this.formValidate.is_equal) {
				this.$Message.warning('试卷与本次相同不可修改！');
				return;
			}
			const nowPaper = this.formValidate.exam_again[i];
			ChoosePaper.popup().then(res => {
				this.formValidate.exam_again.splice(i, 1, {
					...nowPaper,
					paper_name: res.paper_name,
					library_paper_id: res.paper_id,
					relation_paper_id: 0
				});
			});
		},
		handleLinkTo(path) {
			this.$router.push({
				path,
				query: {
					project_id: this.$route.query.project_id,
					arrange: 1
				}
			});
		},
		handlePaperChange(v) {
			let exam_again = this.formValidate.exam_again;
			let defaultVal = {
				paper_name: this.relatedCourse,
				library_paper_id: this.relatedCourseId,
				relation_paper_id: 0
			};
			if (!v) {
				// 补考试卷与考试不相同
				defaultVal = {
					paper_name: '',
					library_paper_id: '',
					relation_paper_id: 0
				};
			}
			this.formValidate.exam_again = exam_again.map(val => {
				const newVal = {
					...val,
					...defaultVal,
				};
				return newVal;
			});
		},
		handleNextStep() {
			if (!this.handleCheckExamTime()) {
				this.$Message.error('考试时间需要按序递增奥');
				return;
			}
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					this.showNextStep = false;
					this.formValidate.exam_again.forEach((v, i) => {
						v.start_time = moment(v.time[0]).format("YYYY-MM-DD HH:mm");
						v.end_time = moment(v.time[1]).format("YYYY-MM-DD HH:mm");
						v.sort = i + 1;
					});
					this.$request({
						url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_PAPER_ARRANGE_POST,
						param: {
							...this.formValidate,
							start_time: moment(this.formValidate.examTime[0]).format("YYYY-MM-DD HH:mm"),
							end_time: moment(this.formValidate.examTime[1]).format("YYYY-MM-DD HH:mm"),
							paper_id: this.relatedCourseId,
							exam_again: this.formValidate.exam_again_status	
								? this.formValidate.exam_again
								: []
						},
						type: 'POST',
						loding: false
					}).then(async (res) => {
						await this.loadData();
						this.$Message.success(res.msg);
					}).catch(res => {
						this.$Message.error(res.msg);
					});
				}
			});
		},
		handleCheckExamTime() {
			const { examTime, exam_again } = this.formValidate;
			const allExamTime = [examTime];
			this.formValidate.exam_again_status && allExamTime.push(...exam_again.map(v => v.time));
			let valid = true;
			for (let i = 1; i < allExamTime.length; i++) {
				if (new Date(allExamTime[i][0]) < new Date(allExamTime[i - 1][1])) {
					valid = false;
				}
			}
			return valid;
		},
	},
};
</script>

<style lang="scss">
.v-academy-paper-2-arrange {
	padding: 20px 0 80px 30px;
	.__hide-require {
		.ivu-form-item-label::before {
			content: ''!important
		}
		.ivu-form-item-error-tip {
			left: 140px!important
		}
	}
	.__tip {
		top: 2px;
		left: 185px;
		width: 30px;
		height: 29px;
		background: #fff;
	}
	._footer {
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		margin-left: -30px;
		width: 100%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
}
</style>
