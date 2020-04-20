<template>
	<div class="v-notice">
		<i-drawer
			v-model="visible"
			:loading="true"
			:mask="false"
			:mask-closable="false"
			class="g-flex v-notice">

			<div v-if="data && !data.type" slot="header" class="_title">{{ all }}</div>
			<div v-else slot="header" class="_title">
				<span class="__back" @click="handleClearData">
					{{ detail }}
					<span class="g-m-lr-5">|</span>
				</span>
				<span>
					{{ data && data.type_name ? data.type_name : '' }}
					<span style="color: #da4b56">（{{ count }}）</span>
				</span>
			</div>

			<notice v-if="data && !data.type" @save="handleSaveData"/>
			<notice-detail
				v-else
				:data="data"
				@clear="handleClearData"
				@save="handleSaveCount"
				@close="handleOk"
			/>
		</i-drawer>
	</div>
</template>

<script>
import { CreatePortal } from "wya-vc";
import { Drawer } from "iview";
import allNoticeContent from './all-notice-content.vue';
import noticeContentDetail from './notice-content-detail.vue';

export default {
	name: "v-notice",
	components: {
		"i-drawer": Drawer,
		"notice": allNoticeContent,
		"notice-detail": noticeContentDetail
	},
	data() {
		return {
			visible: false,
			show: true,
			data: {},
			count: 0,
			all: '全部通知',
			detail: '返回'
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleSaveData(info) {
			this.data = info;
		},
		handleClearData() {
			this.data = {};
		},
		handleSaveCount(num) {
			this.count = num;
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		}
	}
};
export const noticeDrawer = CreatePortal({ alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-notice {
	.ivu-drawer-content {
		.ivu-drawer-body {
			padding: 0;
		}
	}
	._title {
		height: 31px;
		line-height: 31px;
		color: #4b4f57;
		font-size: 16px;
		padding-left: 4px;
		.__back {
			color: #818794;
		}
		.__back:hover {
			cursor: pointer;
		}
	}
}
</style>
