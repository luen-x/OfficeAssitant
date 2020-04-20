<template>
	<div>
		<div v-if="showStatistic" style="background-color:#F5F5F6" class="g-pd-20 g-fs-14">
			<div>
				当前已选中：<span class="g-c-red-mid">{{ questionStatic.allNum }}</span>道题目
				<span 
					v-if="showScore" 
					class="g-m-l-30">共计：
				<span class="g-c-red-mid">{{ questionStatic.allScore }}</span> 分</span>
			</div>
			<div class="g-flex g-jc-sa g-pd-lr-20 g-pd-t-20">
				<div >
					<div class="g-flex" >
						<span class="g-m-r-20">题型</span> <span style="flex:1" class="g-tc" >单选题</span>
					</div>
					<div class="g-flex g-m-t-10">
						<span class="g-m-r-20">题数</span><span style="flex:1" class="g-tc" >{{ questionStatic['1'].num }}</span>
					</div>
					<div v-if="showScore" class="g-flex g-m-t-10">
						<span class="g-m-r-20">分数</span><span style="flex:1" class="g-tc" >{{ questionStatic['1'].score }}</span>
					</div>
				</div>
				<div style="width:1px;height:80px;background:lightgrey"/>
				<div>
					<div class="g-tc" >
						多选题
					</div>
					<div class="g-tc g-m-t-10" >
						{{ questionStatic['2'].num }}
					</div>
					<div v-if="showScore" class="g-tc g-m-t-10" >
						{{ questionStatic['2'].score }}
					</div>
				</div>
				<div style="width:1px;height:80px;background:lightgrey"/>
				<div >
					<div class="g-tc " >
						判断题
					</div>
					<div class="g-tc g-m-t-10" >
						{{ questionStatic['3'].num }}
					</div>
					<div v-if="showScore" class="g-tc g-m-t-10" >
						{{ questionStatic['3'].score }}
					</div>
				</div>
				<div style="width:1px;height:80px;background:lightgrey"/>
				<div>
					<div class="g-tc" > 
						填空题
					</div>
					<div class="g-tc g-m-t-10" >
						{{ questionStatic['4'].num }}
					</div>
					<div v-if="showScore" class="g-tc g-m-t-10" >
						{{ questionStatic['4'].score }}

					</div>
				</div>
				<div style="width:1px;height:80px;background:lightgrey"/>
				<div>
					<div class="g-tc" >
						问答题
					</div>
					<div class="g-tc g-m-t-10" >
						{{ questionStatic['5'].num }}
					</div>
					<div v-if="showScore" class="g-tc g-m-t-10" >
						{{ questionStatic['5'].score }}
					</div>
				</div>

			</div>
		</div>
		<oa-filter class="g-m-t-20"/>
		<oa-list v-model="selectedQuestions" @to-use="handleToUse" @remove-all="handleRemoveAll" />
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import Filter from '../filter';
import List from '../list';

export default {
	name: 'oa-add-paper-step2',
	components: {
		'i-input': Input,
		'i-button': Button,
		'oa-list': List,
		'oa-filter': Filter,
	},
	model: {
		prop: 'questions',
		event: 'change'
	},
	props: {
		questions: {
			type: Array,
			default: () => []
		},
		questionStatic: Object,
		showStatistic: Boolean
	},
	data() {
		return {
			selectedQuestions: [...this.questions],
		};
	},
	computed: {
		showScore() {
			return this.$route.query.paper_type === 'default';
		}
	},
	watch: {
		selectedQuestions(val) {
			this.$emit('change', val);

		}
	},
	methods: {
		handleToUse() {
			if (this.selectedQuestions.length) {
				this.$emit('to-use');
			} else {
				this.$Message.error("请选择题目");
			}
		},
		handleRemoveAll() {
			this.selectedQuestions = [];
			this.$emit('change', this.selectedQuestions);
			
		}
	}
};
</script>
<style lang="scss">
</style>