<template>
	<set-title title="素材管理" class="g-flex g-tabs-card">
		<div class="g-flex  _academy-support-tool-manage">
			<div class="_left" @mouseenter="showScroll" @mouseleave="hideScroll">
				<oa-tree @handleClassList="handleClassList" @handleIsRender="handleIsRender"/>
			</div>
			<div class="_right">
				<oa-filter :class-list="classList"/>
				<img v-if="!isRender" :src="nodataUrl" class="__no-centent" alt="">
				<oa-list v-if="isRender" :class-list="classList"/>
			</div>
		</div>
	</set-title>
</template>

<script>
import List from '@components/academy/support-tool-manage/list';
import Filter from '@components/academy/support-tool-manage/filter';
import Tree from '@components/academy/support-tool-manage/tree';
import navigator from '@extends/mixins/navigator';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: 'oa-academy-support-tool-manage',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
		"oa-tree": Tree
	},
	mixins: [navigator('ACADEMY_SUPPORT_TOOL_MANAGE')],
	data() {
		return {
			classList: [],
			isRender: false,
			isScroll: false,
			nodataUrl: OSS_SEARCH_EMPTY
		};
	},
	created() {
	},
	methods: {
		handleClassList(res) {
			this.classList = res;
		},
		handleIsRender(res) {
			this.isRender = res;
		},
		showScroll() {
			this.isScroll = true;
		},
		hideScroll() {
			this.isScroll = false;
		}
	},
};
</script>

<style lang="scss">
._academy-support-tool-manage{
	position: relative;
	height: 100%;
	width: 100%;
	min-width: 1064px;
	padding: 20px 0 0 20px;
	background: #fafafa;
	._left {
		width: 327px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
		overflow-y: hidden;
		box-sizing: border-box;
		&:hover{
			overflow-y: auto;
		}
	}
	._right{
		// position: relative;
		width: calc(100% - 220px);
		padding: 20px;
		margin-left: 10px;
		background: #fff;
		overflow-y: auto;
		.__no-centent{
			position: absolute;
			left: 60%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>
