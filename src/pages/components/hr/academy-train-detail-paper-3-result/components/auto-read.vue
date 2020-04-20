<template>
	<div class="c-auto-read">
		<div class="__answer">
			<span 
				class="g-c-black1 g-dp-ib"
				style="width: 100px">学员回答：{{ handleSelectAnswer() }}</span>
			<span :class="[Number(question.question_score) ? 'l-c-blue' : 'g-c-red-mid']">
				<i
					:class="[Number(question.question_score) ? 'icon-checked  g-fs-16' : 'icon-clear g-fs-14']"
					class="icon iconfont g-pd-r-10"
					style="vetical-align: middle"/>{{ Number(question.question_score) ? '正确' : '错误' }}
			</span>
			<span
				:class="[Number(question.question_score) ? 'l-c-blue' : 'g-c-red-mid', 'g-fr', 'g-pd-r-20']"
			>得{{ Number(question.question_score) ? question.question_score : '0' }}分</span>
		</div>
	</div>
</template>

<script>
const OPTION = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

export default {
	props: {
		question: Object
	},
	data() {
		return {};
	},
	methods: {
		handleSelectAnswer() {
			const result = this.question.option.reduce((init, cur, index) => {
				this.question.staff_answer.includes(cur.option_id) && init.push(OPTION[index]);
				return init;
			}, []);
			return result.join('') || '未填';
		}
	}
};
</script>
<style lang="scss" scoped>
.c-auto-read {
	width:606px;
  .l-bg-blue {
		background: rgba(79,196,61,0.05);
	}
	.__answer {
		width:606px;
		height:32px;
		line-height: 32px;
		padding-left: 20px;
	}
}
</style>


