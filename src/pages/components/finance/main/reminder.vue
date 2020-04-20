<template>
	<div class="v-finance-main-todo g-flex-cc g-fd-c">
		<div class="_content g-col">
			<oa-todo-list 
				v-if="todoList.length > 0"
				:data-source="todoList"
				:on-refresh="onRefresh"
				:fetch-data="fetchData"
			/>
			<div v-else class="g-tc">
				<img :src="OSS_EMPTY" style="max-width: 300px; width: 100%" >
				<p style="color: #8181794" class="g-fs-12">今天没有待办事项哦</p>
			</div>
		</div>
		<div class="g-m-tb-10">
			<router-link class="g-gray-btn-dash" to="/finance/main/schedule">查看本月安排</router-link>
		</div>
	</div>
</template>

<script>
import { Button, Poptip } from 'iview';
import { OSS_EMPTY } from '@constants/constants';
import TodoList from '../_common/todo/todo-list';

export default {
	name: 'v-finance-main-todo',
	components: {
		'oa-todo-list': TodoList,
		'i-button': Button,
		'i-poptip': Poptip,
	},
	props: {
		onRefresh: Function,
		todoList: Array,
		fetchData: Function,
	},
	data() {
		return {
			OSS_EMPTY
		};
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.v-finance-main-todo {
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


