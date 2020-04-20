<template>
	<div class="v-hr-tool-workflow-item">
		<div :style="{backgroundColor: info.color}" class="g-flex-ac _head">
			<p class="__title">{{ info.title }}</p>
		</div>
		<div class="g-pd-lr-20 g-fs-14 g-c-black2">
			<div class="g-pd-tb-20 g-bb">
				{{ info.intro }}
			</div>
			<div class="g-pd-tb-20 g-bb" style="height:227px">
				<div class="g-fs-14 g-c-black2">
					适配部门
				</div>
				<div class="g-m-t-5" style="height: 170px; overflow-y: auto">
					<div class="g-flex g-fw-w">
						<div 
							v-for="(item, index) in info.depart"
							:key="index"
							:class="index < info.depart.length - 1 ? 'g-m-r-10' : ''"
							class="_depart-item g-m-b-10"
						>
							{{ item.depart_name }}
						</div>
					</div>
				</div>
			</div>
			<div class="g-pd-tb-20">
				<div class="g-flex-ac g-jc-sb">
					<span class="g-fs-14 g-c-black2">单据匹配</span>
					<span v-if="$auth[286]" class="g-operation" @click="handleSetting">设置</span>
				</div>
				<div 
					class="g-m-t-10 g-flex-ac g-fd-c" 
					style="height: 180px; overflow-y: auto"
				>
					<div 
						v-for="(item, index) in info.link_document_name"
						:key="index"
						:class="index < info.link_document_name.length - 1 ? 'g-m-b-20' : ''"
						class="_link-item"
					>
						{{ item }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { WorkflowSettingModal } from './popup/setting';

export default {
	name: 'hr-tool-workflow-item',
	props: {
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		handleSetting() {
			WorkflowSettingModal.popup({
				title: this.info.title,
				scenario: this.info.scenario
			}).then((res) => {

			}).catch((err) => {

			});
		}
	}
};
</script>

<style lang="scss">
.v-hr-tool-workflow-item {
	width: 315px;
	height: 600px;
	background-color: #fafafa;
	box-shadow: 0 0 6px #6666664f;
	border-radius: 10px;
	overflow: hidden;
	._head {
		height: 46px;
		padding: 0 20px;
		color: #ffffff;
		.__title {
			border-left: 2px solid #ffffff;
			padding-left: 10px;
			line-height: 14px;
			font-size: 14px;
			font-weight: 500
		}
	}
	._depart-item {
		border: 1px solid #eaeef1;
		background-color: #ffffff;
		color: #333333;
		border-radius: 4px;
		padding: 5px 20px;
		font-size: 12px;
	}
	._link-item {
		width: 220px;
		text-align: center;
		border: 1px solid #eaeef1;
		border-radius: 4px;
		background-color: #ffffff;
		color: #333333;
		padding: 5px 0;
		font-size: 12px;
	}
}
</style>


