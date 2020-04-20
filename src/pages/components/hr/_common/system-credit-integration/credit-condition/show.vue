<template>
	<div class="v-integration-condition-show">
		<i-formitem prop="display_text">
			<span v-if="id === '10'" class="_btn">审核类型</span>
			<i-input
				v-model="formdata.display_text"
				:maxlength="20"
				style="width: 220px;"
				placeholder="输入提示文字"
			/>
			<span v-if="['1', '2', '3'].some(item => item === id)" class="_btn">展示必修课名称</span>
			<span v-if="id === '4'" class="_btn">展示通关比例</span>
			<span v-if="id === '5'" class="_btn">展示选修课名称</span>
			<span v-if="id === '7'" class="_btn">展示素材名称</span>
			<span v-if="id === '8'" class="_btn">展示开课名称</span>
			<span v-if="id === '9'" class="_btn">学分排名</span>
			<span class="_btn">展示获得学分</span>
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
		},
		rules: Object
	},
	methods: {
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


