<template>
	<div style="background-color:#F5F5F6" class="g-pd-20 g-fs-14">
		<div>
			当前已选中：<span class="g-c-red-mid">{{ allNum }}</span>道题目
			<span class="g-m-l-30">共计：<span class="g-c-red-mid">{{ allScore }}</span>分</span>
		</div>
		<div class="g-flex g-jc-sa g-pd-lr-20 g-pd-t-10">
			<div >
				<div class="g-flex" >
					<span class="g-m-r-20">题型</span> <span style="flex:1" class="g-tc" >单选题</span>
				</div>
				<div class="g-flex g-m-t-10">
					<span class="g-m-r-20">题数</span><span style="flex:1" class="g-tc" >{{ showQuestions[0].num }}</span>
				</div>
				<div v-if="showScore" class="g-flex g-m-t-10">
					<span class="g-m-r-20">分值</span><span style="flex:1" class="g-tc" >{{ showQuestions[0].score }}</span>
				</div>
			</div>
			<template v-for="item in showQuestions.filter(it=>it.type!=1)">
				<div :key="item.type+'line'" style="width:1px;height:60px;background:lightgrey"/>
				<div :key="item.type+'con'">
					<div class="g-tc" >
						{{ typeName[item.type] }}
					</div>
					<div class="g-tc g-m-t-10" >
						{{ item.num }}
					</div>
					<div v-if="showScore" class="g-tc g-m-t-10" >
						{{ item.score }}
					</div>
				</div>
			</template>

		</div>
	</div>
</template>
<script>
import { Input, Button } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		questions: {
			type: Array,
			default: () => []
		},
		showScore: Boolean

	},
	data() {
		return {
			showQuestions: [
				{ type: 1, num: 0 },
				{ type: 2, num: 0 },
				{ type: 3, num: 0 },
				{ type: 4, num: 0 },
				{ type: 5, num: 0 }
			],
			allNum: 0,
			allScore: 0,
			typeName: {
				1: '单选题',
				2: '多选题',
				3: '判断题',
				4: '填空题',
				5: '简答题'
			}	
		};
	},
	watch: {
		questions(newQuestions) {
			this.showQuestions.forEach(que => {
				que.num = 0;
				que.score = 0;
			});
			this.allNum = 0;
			this.allScore = 0;
			newQuestions.forEach(que => {
				this.showQuestions[+que.type - 1].num++;
				this.showQuestions[+que.type - 1].score += que.score;
				this.allNum++;
				this.allScore += que.score;
			});
		}

	},
	methods: {
	}
};
</script>
<style lang="scss">
</style>