<template>
	<div style="width: 100%" class="hr-leadin-edit g-flex g-fd-c">
		<div class="g-flex g-jc-sb g-ai-c _header">
			<div>
				共导入
				<span style="color:#ed4014">{{ total - error }}</span>
				条数据，其中
				<span style="color:#ed4014">{{ error }}</span>
				条数据有问题。点击表格即可进行编辑修改。
			</div>
		</div>
		<div class="g-flex g-fd-c" style="flex: 1">
			<div class="g-m-t-10 g-flex">
				<oa-table 
					ref="table"
					:lists="lists"
					:errs="errs"
					:cate="cate"
					@jump="(msg) => this.$emit('jump', msg)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { Input } from 'iview';
import Table from './table/table';

export default {
	name: '',
	components: {
		'i-input': Input,
		'oa-table': Table
	},
	props: {
		list: Array,
		errors: Array,
		cate: String,
		msg: String,
		total: Number,
		error: Number
	},
	data() {
		return {
			lists: this.list,
			errs: this.errors
		};
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.hr-leadin-edit {
	height: inherit;

	._header {
		padding: 10px;
		background: #f1f1f1;
		margin-bottom: 20px;
	}
}
</style>

