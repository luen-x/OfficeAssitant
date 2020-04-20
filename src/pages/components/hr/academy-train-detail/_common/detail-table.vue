<template>
	<div class="detail-table">
		<table class="_table">
			<thead class="__thead g-tl">
				<tr class="__tr">
					<th class="g-pd-l-20">题型</th>
					<th class="g-tc">单选题</th>
					<th class="g-tc">多选题</th>
					<th class="g-tc">判断题</th>
					<th class="g-tc">填空题</th>
					<th class="g-tc">问答题</th>
				</tr>
			</thead>
			<tbody>
				<tr class="__tr">
					<td class="g-pd-l-20">题数</td>
					<td class="g-tc">{{ scoreInfo.single }}道</td>
					<td class="g-tc">{{ scoreInfo.mul }}道</td>
					<td class="g-tc">{{ scoreInfo.judge }}道</td>
					<td class="g-tc">{{ scoreInfo.space }}道</td>
					<td class="g-tc">{{ scoreInfo.short }}道</td>
				</tr>
				<tr class="__tr">
					<td class="g-pd-l-20">分数</td>
					<td class="g-tc">{{ scoreInfo.single_score }}分</td>
					<td class="g-tc">{{ scoreInfo.mul_score }}分</td>
					<td class="g-tc">{{ scoreInfo.judge_score }}分</td>
					<td class="g-tc">{{ scoreInfo.space_score }}分</td>
					<td class="g-tc">{{ scoreInfo.short_score }}分</td>
				</tr>
				<tr class="__tr __total">
					<td class="g-pd-l-20">合计</td>
					<td colspan="5" class="g-tr g-pd-r-40" style="padding-right: 40px"> 
						<span class="g-c-black1">卷面目前总计：</span><span class="g-c-red-mid g-fs-20">{{ scoreInfo.total }}分</span>
						<span class="g-c-black1" style="margin-left: 40px">及格分：
							<slot name="title"/>
							<slot/>
						</span>
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
		paperList: Array
	},
	data() {
		return {

		};
	},
	computed: {
		scoreInfo() {
			let obj = {};
			obj.total = this.paperList.reduce((init, cur) => init + cur.score, 0);
			obj.single_score = this.paperList.filter(v => v.type == 1).reduce((init, cur) => init + cur.score, 0);
			obj.mul_score = this.paperList.filter(v => v.type == 2).reduce((init, cur) => init + cur.score, 0);
			obj.judge_score = this.paperList.filter(v => v.type == 3).reduce((init, cur) => init + cur.score, 0);
			obj.space_score = this.paperList.filter(v => v.type == 4).reduce((init, cur) => init + cur.score, 0);
			obj.short_score = this.paperList.filter(v => v.type == 5).reduce((init, cur) => init + cur.score, 0);
			obj.single = this.paperList.filter(v => v.type == 1).length;
			obj.mul = this.paperList.filter(v => v.type == 2).length;
			obj.judge = this.paperList.filter(v => v.type == 3).length;
			obj.space = this.paperList.filter(v => v.type == 4).length;
			obj.short = this.paperList.filter(v => v.type == 5).length;
			return obj;
		}
	},
	created() {
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
        min-width: 1000px;
        max-width: 1200px;
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


