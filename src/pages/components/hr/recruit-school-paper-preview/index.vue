<template>
	<div class="v-hr-recruit-paper-preview g-m-b-30">
		<div class="g-m-t-20">
			<div 
				v-for="(item, index) in questions" 
				:key="index"
				class="g-pd-b-10"
			>
				<oa-answer-question
					v-model="item.answer"
					:data="item"
					:index="index + 1"
					exam
					style="padding-left: 10px;"
				/>
				<div v-if="index !== questions.length - 1" class="_line" />
			</div>
		</div>
		<div class="_submit">
			<i-button 
				type="primary" 
				@click="handleSubmit"
			>
				提交
			</i-button>
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
import AnswerQuestion from '@components/_common/questions/answer-question';
import { setItem } from "@utils/utils";

export default {
	name: 'oa-paper-preview',
	components: {
		'i-button': Button,
		'oa-answer-question': AnswerQuestion,
	},
	data() {
		return {
			paperTheme: '',
			questions: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_RECRUIT_SCHOOL_QUESTION_PREVIEW_GET',
				type: 'GET',
				loading: false,
				param: {
					paper_id: this.$route.query.paper_id
				},
				autoTip: false
			}).then(res => {
				this.paperTheme = res.data.paper_theme;
				this.questions = res.data.questions.map(it => ({
					...it,
					type: 1,
					option: it.option.map(_it => ({
						..._it,
						value: _it.option_id,
					})),
				}));
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSubmit() {
			this.questions = this.questions.map(it => ({
				...it,
				select_option_id: it.answer,
				dimension_id: it.option.filter(_it => _it.option_id == it.answer)[0].dimension_id,
				score: it.option.filter(_it => _it.option_id == it.answer)[0].score
			}));

			this.$request({
				url: '_HR_RECRUIT_SCHOOL_PAPER_ANSWER_POST',
				type: "POST",
				loading: false,
				param: {
					type: 0,
					paper_id: this.$route.query.paper_id,
					answer_id: this.$global.staff_id,
					answer_name: this.$global.staff_name,
					answer_mobile: this.$global.answer_mobile,
					questions: this.questions
				},
				autoTip: true
			}).then(res => {
				let data = res.data;
				data.match_progress /= 2;
				setItem(`paper-result${this.$global.version}`, JSON.stringify(data));
				this.$router.replace({
					name: 'hr-recruit-school-paper-result'
				});
			}).catch(error => {});
		}
	},
};
</script>

<style lang="scss">
.v-hr-recruit-paper-preview {
	._submit {
		position: fixed;
		width: calc(100% - 160px);
		height: 45px;
		line-height: 45px;
		text-align: center;
		bottom: 0;
		right: 0;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		background: #fff;
	}
	._line {
		width: 100%;
		height: 1px;
		background-color: #EBEEF1;
	}
	.ivu-radio-group.ivu-radio-group-default.ivu-radio-default {
		margin-left: 0!important;
	}
	._question-type, ._answer-score {
		display: none;
	}
}
</style>
