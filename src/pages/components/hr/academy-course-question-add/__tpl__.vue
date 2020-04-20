<template>
	<div class="v-hr-academy-course-question-add">
		<div class="g-flex g-flex-cc">
			<oa-question 
				v-if="show" 
				ref="question" 
				:data="question" 
				show-keyword 
				show-tip
			/>
		</div>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button v-if="action=='add'" type="primary" @click="handleSave('next')">继续添加</i-button>
			<i-button :type="action=='readd'?'primary':undefined" @click="handleSave()">保存</i-button>
		</div>
	</div>
</template>

<script>
import Question from '@components/_common/questions/question'; 
import { Confirm } from '@common/confirm/confirm';
import { Button } from 'iview';

const config = {
	hr: {
		saveUrl: '_HR_TRAIN_LIBRARY_QUESTION_SAVE_POST',
	},
	sale: {
		saveUrl: '_SALE_TRAIN_EXAM_SAVE_QUESTION_POST',
		readdUrl: '_SALE_TRAIN_EXAM_APPLY_AGAIN_QUESTION_POST'

	}
};

export default {
	name: 'oa-hr-academy-course-question-add',
	components: {
		'oa-question': Question,
		'i-button': Button
	},
	data() {
		return {
			question: {
				type: 1,
				action: 'add'
			},
			show: false
		};
	},
	computed: {
		author() {
			return this.$route.query.author || 'hr';
		},
		action() {
			return this.$route.query.action || 'add';
		}

	},
	created() {
		if (this.action == 'readd') {
			this.show = false;
			this.loadQuestion();
		} else {
			this.show = true;
		}
	},
	methods: {
		async handleSave(next) {
			const valid = await this.$refs.question.validate();
			if (!valid) return;
			const formData = this.$refs.question.getFormData();
			if (this.action == 'readd') {
				formData.question_id = '';
				formData.original_question_id = this.$route.query.question_id;
			}
			this.$request({
				url: this.action == 'add' ? config[this.author].saveUrl : config[this.author].readdUrl,
				type: "POST",
				param: formData,
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				if (next) {
					this.$refs.question.reset();
				} else {
					this.$router.go(-1);
				}
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		handleCancel(event) {
			Confirm.popup({ 
				msg: '确定取消吗？', 
				renderContent: (h) => {
					return (
						<div class="g-fs-14">
							您填写的内容，还没有进行保存，<br/>
							取消后内容将无法恢复，确定取消吗？	
						</div>
					);
				}
			 }).then(() => {
				this.$router.go(-1);
			}).catch(() => {});
		},
		loadQuestion() {
			this.$request({
				url: "_SALE_TRAIN_EXAM_QUESTION_DETAIL_GET", // 只有销售有重新申请，
				type: "GET",
				param: {
					question_id: this.$route.query.question_id
				},
				loading: false,
			}).then(res => {
				this.question = res.data;
				this.show = true;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}

	},
};
</script>

<style lang="scss" scoped>
.v-hr-academy-course-question-add{
	height: calc(100% - 55px);
    overflow-y: auto;
    margin-top: -6px;
	._footer {
		width: calc(100% - 160px);
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
