<template>
	<div class="c-read-simple-answer g-c-black1 g-pd-l-20 g-lh-32">
		<div>
			<div class="g-c-black1 g-fl" style="width: 70px; height: 100%">学员回答：&nbsp;&nbsp;</div>
			<div style="overflow: hidden">
				{{ question.staff_answer.join('') || '未填' }}
			</div>
		</div>
		<div v-if="question.status == 2">
			<div class="g-c-black1 g-of-h" style="padding-right: 20px">
				阅卷评分：&nbsp;&nbsp;{{ question.question_score }}分
				<span class="g-c-orange-mid ">
					<i 
						style="vertical-align: middle; padding: 0 2px 0 20px; font-weight: 600"
						class="icon iconfont icon-open-eyes g-fs-18 g-dp-ib"/>
					<span class="g-fs-12">已阅</span>
				</span>
				<span
					class="g-c-orange-mid g-fr"
				>得{{ question.question_score }}分</span>
			</div>
		</div>
		<div v-else>
			<div v-if="type == '3'" class="g-c-black1 g-dp-ib">
				<i-form 
					ref="formValidate" 
					:model="question"
					style="margin: 15px 0 -5px -30px;"
					class="g-dp-ib g-relative"
					@submit.native.prevent>
					<i-form-item 
						:label-width="101"
						label="阅卷评分："
						class="__hide-require">
						<i-input-number
							v-model="question.question_score" 
							:min="0"
							:precision="0"
							:max="question.score"
							clearable
							style="width: 120px"
							placeholder="请输本题得分"
						/>
						<span 
							class="g-c-black2 g-absolute __tip">分</span>
					</i-form-item>
					<i-button 
						type="primary"
						class="g-absolute"
						style="right: -380px; top: 0"
						@click="handleRead">已阅</i-button>
				</i-form>
			</div>
			<div v-else>
				<div class="g-c-black1 g-of-h" style="padding-right: 40px">
					阅卷评分：&nbsp;&nbsp;{{ question.question_score }}分
					<span class="g-c-blue-mid g-pd-l-30">待评</span>
				</div>
			</div>
		</div>
		<div v-if="!question.isReaded && type == '3'">
			<div class="g-c-black1 g-fl" style="width: 70px; height: 100%">参考答案：&nbsp;&nbsp;</div>
			<div style="overflow: hidden">
				{{ question.question_answer.join('') || '未设置答案' }}
			</div>
		</div>
	</div>
</template>

<script>
import { InputNumber, Form, FormItem, Button } from 'iview';
import API_ROOT from "@stores/apis/root";

export default {
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'i-input-number': InputNumber,
	},
	props: {
		question: Object,
		type: Number | String,
		examInfo: Object
	},
	data() {
		return {
			
		};
	},
	methods: {
		handleRead() {
			if (typeof this.question.question_score === 'number') {
				const { question_id, question_score } = this.question;
				this.$request({
					url: API_ROOT['_HR_ACADEMY_TRAIN_DETAIL_READ_PAPER_GET'],
					type: "POST",
					param: {
						result_id: this.examInfo.result_id,
						question: [{
							question_id,
							score: question_score
						}]
					},
					is_effective: this.examInfo.is_effective
				}).then(res => {
					this.$Message.success(res.msg);
					this.question.status = 2;
				});
			} else {
				this.$Message.warning('请输入分数');
			}
		}
	}
};
</script>

<style lang="scss">
.c-read-simple-answer {
	.ivu-form-item-label {
		color: #333!important
	}
	width: 606px;
	.__tip {
		top: 3px;
        right: 3px;
        width: 22px;
        height: 29px;
        background: #fff;
	}
}
</style>


