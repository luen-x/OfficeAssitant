<template>
	<div class="g-flex g-ai-c g-fd-c" style="height: inherit; overflow: auto">
		<oa-step 
			:current="current"
			:data-source="data"
			style="margin: 40px 0 70px 0"
		/>
		<oa-leadin 
			v-if="current === 0"
			:cate="cate"
			@jump="handleJump"/>
		<oa-edit 
			v-if="current === 1"
			:cate="cate"
			:list="list"
			:msg="msg"
			:total="total_count"
			:error="error_count"
			:errors="errors"
			@jump="handleEditJump"
		/>
		<oa-result 
			v-if="current === 2"
			:total="total_count"
			:error="error_count"
			:msg="msg"
		/>
	</div>
</template>

<script>
import Leadin from './step/lead-in';
import Result from './step/result';
import Edit from './step/edit';
import Step from './step/step';

export default {
	name: '',
	components: {
		'oa-leadin': Leadin,
		'oa-result': Result,
		'oa-edit': Edit,
		'oa-step': Step
	},
	props: {
		cate: String
	},
	data() {
		return {
			current: 0,
			list: [],
			errors: [],
			msg: '',
			total_count: 0,
			error_count: 0,
			data: ['下载模板/上传文件', '在线编辑', '导入结果']
		};
	},
	methods: {
		handleJump({ target, list, errors, msg, total_count, error_count }) {
			this.current = target;
			this.list = list;
			this.errors = errors;
			this.msg = msg;
			this.total_count = total_count;
			this.error_count = error_count;
		},
		handleEditJump({ total_count, error_count }) {
			this.current = 2;
			this.total_count = total_count;
			this.error_count = error_count;
		}
	}
};
</script>

<style lang="scss">

</style>


