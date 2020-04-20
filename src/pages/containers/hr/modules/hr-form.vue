<template>
	<set-title
		:routes="$route.path === '/hr/recruit/social/summary/interview-read-only' ? routes : []"
		:title="typeName"
		class="v-hr-form">
		<oa-interview
			v-if="type === 'interview'"
		/>
		<oa-enter-register
			v-if="type === 'enter-register'"
		/>
		<oa-enter-talk
			v-if="type === 'enter-talk'"
		/>
		<oa-regular-apply
			v-if="type === 'regular-apply'"
		/>
		<oa-regular-talk
			v-if="type === 'regular-talk'"
		/>
		<oa-dimission-apply
			v-if="type === 'dimission-apply'"
		/>
		<oa-dimission-talk
			v-if="type === 'dimission-talk'"
		/>
		<oa-interview-read-only
			v-if="$route.path === '/hr/recruit/social/summary/interview-read-only'"
		/>
	</set-title>
</template>

<script>
import Interview from '@components/hr/form/interview';
import InterviewReadOnly from '@components/hr/form/interview-read-only';
import EnterRegoster from '@components/hr/form/enter-register';
import EnterTalk from '@components/hr/form/enter-talk';
import RegularApply from '@components/hr/form/regular-apply';
import RegularTalk from '@components/hr/form/regular-talk';
import DimissionApply from '@components/hr/form/dimission-apply';
import DimissionTalk from '@components/hr/form/dimission-talk';

const typeNames = {
	'interview': "面试",
	'enter-register': '入职资料',
	'enter-talk': '入职面谈',
	'regular-apply': '转正申请单',
	'regular-talk': '转正面谈单',
	'dimission-apply': '离职申请',
	'dimission-talk': '离职面谈',
};

export default {
	name: 'oa-hr-form',
	components: {
		'oa-interview': Interview,
		'oa-enter-register': EnterRegoster,
		'oa-enter-talk': EnterTalk,
		'oa-regular-apply': RegularApply,
		'oa-regular-talk': RegularTalk,
		'oa-dimission-apply': DimissionApply,
		'oa-dimission-talk': DimissionTalk,
		'oa-interview-read-only': InterviewReadOnly,

	},
	data() {
		return {
			type: this.$route.params.type,
			routes: [
				{
					path: '/hr/recruit/social/summary',
					name: '社招跟进'
				},
				{
					path: '',
					name: '面试记录单'
				}
			]
		};
	},
	computed: {
		typeName() {
			return typeNames[this.type] || '';

		}
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss">
.v-hr-form {
	._form {
		padding: 40px 20px 60px 20px;
		min-width: 500px;
		width: 1000px;
		margin-right: 20px;
		.ivu-radio-wrapper:first-child {
			margin-right: 60px;
		}
		.__title {
			color: #e74854;
			border-left: 2px solid #e74854;
			padding-left: 10px;
			font-size: 14px;
			line-height: 14px;
			font-weight: 400;
			margin-bottom: 10px;
			margin-left: 50px;
		}
	}
	.ivu-form .ivu-form-item-label {
		color: #333333 !important;
	}
	.ivu-checkbox-wrapper {
		color: #333333 !important;
	}
	.ivu-checkbox-group-item {
		width: 180px;
	}
	.ivu-radio-group {
		vertical-align: baseline !important;
	}
	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
}
</style>
