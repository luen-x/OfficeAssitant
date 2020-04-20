<template>
	<div class="v-integration-condition-show">
		<i-formitem prop="display_text">
			<i-input
				v-model="formdata.display_text"
				:maxlength="20"
				style="width: 220px;"
				placeholder="输入提示文字"
			/>
			<span v-if="id === '1' || id === '3'" class="_btn">对应员工/部门</span>
			<span v-if="(id > 3 && id < 7) || id === '19'" class="_btn">对应员工</span>
			<span v-if="id === '1'" class="_btn">展示业绩排名</span>
			<span v-if="id === '3'" class="_btn">展示业绩</span>
			<span v-if="id === '4'" class="_btn">展示积分排名</span>
			<span v-if="id === '5'" class="_btn">展示晋级级称</span>
			<span v-if="id === '6'" class="_btn">展示晋升职位</span>
			<span v-if="id === '7'" class="_btn">展示到达目标</span>
			<span v-if="id === '8'" class="_btn">徒弟姓名&徒弟工龄</span>
			<span v-if="id === '9'" class="_btn">周期内徒弟个数</span>
			<span v-if="id === '11'" class="_btn">展示知识水平</span>
			<span v-if="id === '12'" class="_btn">展示缺勤次数</span>
			<span v-if="id === '13'" class="_btn">展示员工姓名</span>
			<span class="_btn">展示获得积分</span>
		</i-formitem>
	</div>
</template>

<script>
import { FormItem, Input } from 'iview';

export default {
	name: 'hr-integration-condition-show',
	components: {
		'i-formitem': FormItem,
		'i-input': Input
	},
	props: {
		id: String,
		formdata: {
			type: Object,
			default: () => {}
		}
	}
};
</script>

<style lang="scss" scoped>
.v-integration-condition-show {
	._btn {
		display: inline-block;
		background: #E84C57;
		color: #fff;
		border-radius: 3px;
		padding: 0px 10px;
		height: 20px;
		line-height: 20px;
		margin-left: 10px;
	}
}
</style>


