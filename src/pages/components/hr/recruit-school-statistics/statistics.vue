<template>
	<div class="v-hr-recruit-school-statistics-content g-flex-ac g-fw-w g-m-t-20">
		<div
			v-for="(item, index) in items"
			:key="index"
			:class="index < items.length - 1 ? '_static-item' : ''"
			class="g-flex-cc g-fd-c g-col"
			style="min-width: 120px"
		>
			<p class="g-fs-14">
				{{ item.label }}
				<oa-explain
					v-if="item.explain"
					:title="item.title"
					:content="item.content"
					:width="item.width"
				/>
			</p>
			<p class="g-c-black1 g-fs-24">{{ data[item.key] }}</p>
		</div>
	</div>
</template>

<script>
import Explain from '@components/_common/explain/explain';

export default {
	name: 'oa-hr-recruit-statistics',
	components: {
		'oa-explain': Explain
	},
	props: {
		data: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			items: [
				{
					label: "招聘会数量",
					key: 'all_meeting_count',
				},
				{
					label: "已回复人数",
					key: 'all_reply_students_count',
					explain: true,
					title: '已回复代表已经给予我们明确的报到时间',
					content: '例如，应届生A已经明确表示在11月1号会来我方公司报到，那应届生A就算已回复人数'
				},
				{
					label: "报到人数",
					key: 'all_register_students_count',
					explain: true,
					content: '报到人数即指实际的报到人数，以对方实际来到我方公司报到为准。'
				},
				{
					label: "入职人数",
					key: 'all_entry_students_count',
					explain: true,
					content: '真实的入职人数，以实际入职为准'
				},
				{
					label: "1月内流失人数",
					key: 'all_lose_students_three_count'
				},
				{
					label: "1-3个月流失人数",
					key: 'all_lose_students_three_six_count'
				},
				{
					label: "报到率",
					key: 'register_percent',
					explain: true,
					content: '报到人数/回复人数',
					width: 150
				},
				{
					label: "留下率",
					key: 'at_percent',
					explain: true,
					content: '入职人数/报到人数',
					width: 150
				}
			]
		};
	},
	computed: {
		// statistics() {
		// 	return this.$store.state.hrRecruitSchoolStatistics.listInfo.count || {};
		// }
	},
};
</script>

<style lang="scss">
.v-hr-recruit-school-statistics-content {
	padding: 36px 0;
	background-color: #f5f5f6;
	._static-item {
		height: 87px;
		border-right: 1px solid #d4d7db;
	}
}
</style>

