<template>
	<set-title title="bug管理" class="g-flex g-tabs-card g-of-h">
		<div class="g-flex v-worksheet-control-bug">
			<div class="_left">
				<oa-left @handleIsRender="handleIsRender" @handleClickItem="handleClickItem"/>
			</div>
			<div class="_right g-pd-20">
				<oa-filter :system="system_id" />
				<img v-if="!isRender" :src="nodataUrl" class="__no-centent" alt="">
				<oa-tabs-list v-if="isRender" :syetem="system_id"/>
			</div>
		</div>
	</set-title>
</template>

<script>
import TabsList from '@components/worksheet/control-bug/tabs-list';
import Filter from '@components/worksheet/control-bug/filter';
import Left from '@components/worksheet/control-bug/left';
import navigator from '@extends/mixins/navigator';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: 'oa-worksheet-control-bug',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
		"oa-left": Left,
	},
	mixins: [navigator('WORKSHEET_CONTROL_BUG')],
	data() {
		return {
			isRender: false,
			nodataUrl: OSS_SEARCH_EMPTY,
			system_id: 0
		};
	},
	created() {
	},
	methods: {
		handleIsRender(res) {
			this.isRender = res;
		},
		handleClickItem(res) {
			this.system_id = res;
		}
	},
};
</script>

<style lang="scss">
.v-worksheet-control-bug {
	position: relative;
	height: 100%;
	width: 100%;
	min-width: 1064px;
	background: #fff;
	._left {
		width: 240px;
		box-shadow:1px 0px 3px 0px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow-y: auto;
	}
	._right {
		width: calc(100% - 240px);
		.__no-centent{
			position: absolute;
			left: 60%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.vc-paging .__footer {
		width: 100% !important;
	}
}
</style>
