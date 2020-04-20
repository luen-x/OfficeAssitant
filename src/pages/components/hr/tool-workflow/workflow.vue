<template>
	<div class="v-hr-tool-workflow g-pd-20 g-relative">
		<!-- <div class="g-tr" style="margin-top: -10px; margin-bottom: 10px">
			<span class="g-c-black4">如何用好工具管理？</span>
			<span class="g-operation" @click="handleWatchVideo">视频教程</span>
		</div> -->
		<div v-if="!loading" class="g-flex-ac g-fw-w">

			<oa-item
				v-for="(item, index) in list"
				:key="item.scenario"
				:info="item"
				:class="index < list.length - 1 ? 'g-m-r-30' : ''"
				class="g-m-b-30"
			/>
		</div>
		<div v-else class="g-flex-cc v-hr-tool-workflow-loading">
			<i-spin/>
		</div>
	</div>
</template>

<script>
import { Spin } from 'iview';
import API_ROOT from '@stores/apis/root';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import Item from './item';

export default {
	name: 'oa-tpl',
	components: {
		'i-spin': Spin,
		'oa-item': Item
	},
	data() {
		return {
			loading: false
		};
	},
	computed: {
		list() {
			return this.$store.state.hrToolWorkflow.list;
		},
		isFetched() {
			return this.$store.state.hrToolWorkflow.isFetched;
		}
	},
	watch: {
		'$store.state.hrToolWorkflow.isFetched': function (newVal, oldVal) {
			if (!newVal) {
				this.loadData();
			}
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loading = true;
			this.request({
				url: 'HR_TOOL_WORKFLOW_GET', // eslint-disable-line
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.loading = false;
			}).catch((error) => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		handleWatchVideo() {
			VideoModal.popup({
				title: '流程管理',
				urlType: 'HR_TOOL_WORKFLOW_VIDEO'
			}).then((res) => {

			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-tool-workflow-loading {
	background: #ffffff22;
	width: 100%;
	height: 450px;
}
</style>
