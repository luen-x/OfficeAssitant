<template>
	<set-title title="功能解读" class="g-flex g-tabs-card">
		<div class="g-flex setoolkit-manage">
			<div class="_left" @mouseenter="showScroll" @mouseleave="hideScroll">
				<oa-tree @handleClassList="handleClassList" @handleIsRender="handleIsRender"/>
			</div>
			<div class="_right">
				<oa-filter :class-list="classList"/>
				<img v-if="!isRender" :src="nodataUrl" class="__no-centent" alt="">
				<oa-tabs-list v-if="isRender" :class-list="classList"/>
			</div>
		</div>
	</set-title>
</template>

<script>
import TabsList from '@components/tech/project-publish-document/tabs-list';
import Filter from '@components/tech/project-publish-document/filter';
import navigator from '@extends/mixins/navigator';
import Tree from '@components/tech/project-publish-document/tree';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: 'oa-tech-project-publish-document',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
		"oa-tree": Tree
	},
	mixins: [navigator('TECH_PROJECT_PUBLISH_DOCUMENT')],
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

<style lang="scss" scoped>
.setoolkit-manage{
	position: relative;
	height: 100%;
	width: 100%;
	min-width: 1064px;
	padding: 20px 0 0 20px;
	background: #fafafa;
	._left {
		width: 327px;
		height: 100%;
		padding: 13px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
		overflow-y: hidden;
		overflow-x: hidden;
		box-sizing: border-box;
		&:hover{
			overflow-y: auto;
		}
		.__menu-active {
			background-color: rgb(129,135,149);
			color: #fff;
			i {
				color: #fff;
			}
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
.v-setoolkit-box ._left .__menu-active {
    background-color: #818795;
	color: #fff;
}
</style>
