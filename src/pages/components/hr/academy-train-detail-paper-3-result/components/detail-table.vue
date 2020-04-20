<template>
	<div class="detail-table">
		<table class="_table">
			<thead class="__thead g-tl">
				<tr class="__tr">
					<th class="g-pd-l-20">题型</th>
					<th class="g-tc">单选题<span class="g-c-black5">（共{{ scoreInfo[1].total || 0 }}道）</span></th>
					<th class="g-tc">多选题<span class="g-c-black5">（共{{ scoreInfo[2].total || 0 }}道）</span></th>
					<th class="g-tc">判断题<span class="g-c-black5">（共{{ scoreInfo[3].total || 0 }}道）</span></th>
					<th class="g-tc">填空题<span class="g-c-black5">（共{{ scoreInfo[4].total || 0 }}道）</span></th>
					<th class="g-tc">问答题<span class="g-c-black5">（共{{ scoreInfo[5].total || 0 }}道）</span></th>
				</tr>
			</thead>
			<tbody>
				<tr class="__tr">
					<td class="g-pd-l-20">答对题数</td>
					<td class="g-tc">{{ scoreInfo[1].successCount || 0 }}道</td>
					<td class="g-tc">{{ scoreInfo[2].successCount || 0 }}道</td>
					<td class="g-tc">{{ scoreInfo[3].successCount || 0 }}道</td>
					<td class="g-tc">{{ blankAndAnswer.blankQuestion }}</td>
					<td class="g-tc">{{ blankAndAnswer.answerQuestion }}</td>
				</tr>
				<tr class="__tr">
					<td class="g-pd-l-20">得分</td>
					<td class="g-tc">{{ scoreInfo[1].totalScore || 0 }}</td>
					<td class="g-tc">{{ scoreInfo[2].totalScore || 0 }}</td>
					<td class="g-tc">{{ scoreInfo[3].totalScore || 0 }}</td>
					<td class="g-tc">{{ scoreInfo[4].totalScore || 0 }}</td>
					<td class="g-tc">{{ scoreInfo[5].totalScore || 0 }}</td>
				</tr>
				<tr class="__tr __total">
					<td class="g-pd-l-20">合计</td>
					<td colspan="5" class="g-tr g-pd-r-40" style="padding-right: 40px"> 
						<span class="g-c-black1">卷面目前总计：</span><span class="g-c-red-mid g-fs-20">{{ scoreInfo.allScore }}分</span>
						<span class="g-c-black1" style="margin-left: 40px">及格分：{{ examInfo.pass_score }}分</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
export default {
	props: {
		// 传入题目数据
		examInfo: Object
	},
	data() {
		return {

		};
	},
	computed: {
		scoreInfo() {
			const initData = {
				'1': {},
				'2': {},
				'3': {},
				'4': {},
				'5': {},
				allScore: 0
			};
			return this.examInfo.detail.reduce((init, cur) => {
				init[cur.type + ''].total = (init[cur.type + ''].total || 0) + 1;
				init[cur.type + ''].totalScore = (init[cur.type + ''].totalScore || 0) + Number(cur.question_score);
				init.allScore += Number(cur.question_score);
				if (cur.type <= 3 && cur.question_score > 0) {
					init[cur.type + ''].successCount = init[cur.type + ''].successCount || 0;
					init[cur.type + ''].successCount += 1;
				}
				return init;
			}, initData);
		},
		blankAndAnswer() {
			const result = {
				'blankQuestion': '无',
				'answerQuestion': '无'
			};
			const blankQuestion = this.examInfo.detail.filter(v => v.type == 4);
			const answerQuestion = this.examInfo.detail.filter(v => v.type == 5);
			if (blankQuestion.length) {
				const every = blankQuestion.every(v => v.status == 2);
				result.blankQuestion = every ? '已阅完' : '待阅';
			}
			if (answerQuestion.length) {
				const every = answerQuestion.every(v => v.status == 2);
				result.answerQuestion = every ? '已阅完' : '待阅';
			}
			return result;
		}
	}
};
</script>

<style lang="scss" scoped>
.detail-table {
    table,
    table tr th,
    table tr td { 
        border: 1px solid rgba(217,220,224,1); 
    }
    table { 
        border-collapse: collapse;
        padding: 2px;
    }
    ._table {
       width: 870px;
        .__thead,
        .__tr {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
        }
        .__total {
            height: 90px;
            line-height: 90px;
        }
        .__thead {
            background: rgba(240,244,252,1);
        }
    }
}
</style>


