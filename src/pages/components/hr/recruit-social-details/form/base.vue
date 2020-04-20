<template>
	<div v-if="disabled" class="v-hr-recruit-social-detail-base">
		<span class="g-fs-16">{{ info.applicant_name }}</span>
		<i
			:class="info.sex == 0 ? 'icon-sexm g-c-blue-mid' : 'icon-sex g-c-pink'"
			class="iconfont g-fs-16 g-m-l-10"
		/>
		<span v-if="info.age" class="g-c-black4">{{ info.age }}岁</span>
		<span v-if="$auth[190] && info.editable&&listType" class="g-fr g-operation" @click="handleEdit">编辑</span>
	</div>
</template>

<script>
export default {
	name: 'oa-hr-recruit-social-detail-base',
	model: {
		prop: 'disabled',
		event: 'change'
	},
	props: {
		disabled: Boolean,
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		const { query = {} } = this.$route;
		return {
			listType: query.type !== 'social-statistics',
		};
	},
	methods: {
		handleEdit() {
			this.$emit('change');
		}
	}
};
</script>

<style lang="scss">
.v-hr-recruit-social-detail-base {
	box-shadow: 0 0 10px #e9e9e9;
	padding: 0 20px;
	height: 100px;
	line-height: 100px;
}
</style>

