<template>
	<div class="v-hr-recruit-paper-result">
		<i-form 
			v-if="JSON.stringify(basicInfo) != '{}'"
			:label-width="100" 
			class="g-m-t-20"
		>
			<i-form-item label="测试结果">
				<span class="g-c-black2">{{ basicInfo.test_result }}</span>
			</i-form-item>
			<i-form-item label="对外解释" style="width: 98%;word-break: break-all;">
				<span class="g-c-black2">{{ basicInfo.external_explain }}</span>
			</i-form-item>
			<i-form-item label="匹配程度">
				<i-rate :value="basicInfo.match_progress" allow-half />
			</i-form-item>
			<i-form-item label="内部结论" style="width: 98%;word-break: break-all;">
				<span class="g-c-black2">{{ basicInfo.inner_conclusion }}</span>
			</i-form-item>
			<i-form-item label="得分情况">
				<div 
					v-for="(item, index) in basicInfo.dimensions" 
					:key="index"
					class="g-c-black2"
				>
					<span>{{ item.dimension_name + '：' }}</span>
					<span>{{ item.self_score + '分/' + item.score + '分' }}</span>
				</div>
			</i-form-item>
		</i-form>
	</div>
</template>
<script>
import { Form, FormItem, Rate } from 'iview';
import { getItem } from "@utils/utils";

export default {
	name: 'oa-paper-result',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-rate': Rate
	},
	data() {
		return {
			basicInfo: JSON.parse(getItem(`paper-result${this.$global.version}`)) || {}
		};
	}
};

export const RecruitPaperResult = module.exports.default;
</script>
<style lang="scss">
.v-hr-recruit-paper-result {
	.ivu-form-item {
		margin-bottom: 10px!important;
	}
}
</style>
