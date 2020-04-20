<template>
	<div class="v-hr-main-todolist">
		<div 
			class="_item"
		>
			ssss
		</div>
	</div>
</template>

<script>

export default {
	name: "hr-main-todo-list",
	components: {
	},

	props: {
		dataSource: {
			type: Array || Object,
			default() {
				return [];
			}
		},
		onRefresh: Function
	},

	methods: {
		handleClose() {},
		handleEdit() {},
		handleComplete() {},

		// 刷新数据
		handleRefresh() {
			this.onRefresh && this.onRefresh();
		}
	}
};
</script>

<style lang="scss">
.v-hr-main-todolist {
    ._item {
			color: #000;
			width: 100%;
			font-size: 12px;
			margin-bottom: 10px;
			margin-top: 5px;
			text-align: center;
			border-radius: 2px;
			background-color: #E9F4FE;
	}
}
</style>

<style lang="scss" scoped>
.v-hr-main-todolist {
	/deep/ .ivu-poptip {
		margin-top: 10px;
		display: block;
	}
}
</style>