<template>
	<set-title title="素材库" style="padding: 20px">
		<div class="g-flex satoolkit-manage">
			<div class="_left" @mouseenter="showScroll" @mouseleave="hideScroll">
				<oa-tree ref="leftTree" @handleClassList="handleClassList" @handleIsRender="handleIsRender"/>
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
import List from '@components/content/config-material-bank/list';
import Filter from '@components/content/config-material-bank/filter';
import navigator from '@extends/mixins/navigator';
import Tree from '@components/content/config-material-bank/tree';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: 'oa-content-config-material-bank',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
		"oa-tree": Tree,
	},
	mixins: [navigator('CONTENT_CONFIG_MATERIAL_BANK')],
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
.satoolkit-manage{
	position: relative;
	height: 100%;
	width: 100%;
	min-width: 1064px;
	padding: 20px 0 0 20px;
	background: #fafafa;
	._left {
		width: 327px;
		height: 100%;
		padding: 0 0 13px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #fff;
		overflow-y: hidden;
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
