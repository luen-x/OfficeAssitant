<template>
	<div class="v-hr-main-todo g-flex-cc g-fd-c">
		<div :class="todoList.length === 0 && 'g-flex-cc'" class="_content g-col">
			<oa-todo-list 
				v-if="todoList.length > 0"
				:data-source="todoList"
				:on-refresh="onRefresh"
			/>
			<div v-else class="g-tc" >
				<img :src="OSS_EMPTY" style="max-width: 300px; width: 100%" >
				<p style="color: #8181794" class="g-fs-12">今天没有待办事项哦</p>
			</div>
		</div>
		<div class="g-m-tb-10">
			<router-link class="g-gray-btn-dash" to="/hr/main/schedule">查看本月安排</router-link>
		</div>
	</div>
</template>

<script>
import { Button, Poptip } from 'iview';
import { OSS_EMPTY } from '@constants/constants';
import TodoList from '../_common/todo-list';
import TipItem from '../_common/tip-item';

export default {
	name: 'v-hr-main-todo',
	components: {
		'oa-todo-list': TodoList,
		'i-button': Button,
		'i-poptip': Poptip,
		'i-tip-item': TipItem,
	},
	props: {
		onRefresh: Function
	},
	data() {
		return {
			OSS_EMPTY
		};
	},
	computed: {
		todoList() {
			return this.$store.state.hrMain.data.left_info || [];
		},
	},
	methods: {
		handleClose() {

		},
		handleEdit() {

		},
		handleComplete() {

		}
	}
};
</script>

<style lang="scss">
.v-hr-main-todo {
	position: relative;
	height: 362px;
	box-sizing: border-box;
	padding-top: 20px;
	overflow-y: auto;
	._content {
		width: 100%;
		overflow-y: auto;
		box-sizing: border-box;
		padding-bottom: 10px; 
	}
}
</style>


