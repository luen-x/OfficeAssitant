<template>
	<div class="v-material-view g-relative">
		<oa-loading v-if="loading"/>
		<div v-if="file.text" class="g-flex g-fd-c" style="height: 100%;">
			<div class="g-fs-18 g-c-black2 g-m-b-10 g-pd-l-15" style="margin-top: 18px;">{{ file.title }}</div>
			<div class="g-fs-12 g-pd-l-15" style="color: #666666;">
				发布时间：{{ file.create_time }}
			</div>
			<oa-editor-preview
				:content="file.text"
				class="g-col"
				max-height="88%"
				style="margin-top: 20px;margin-left: 15px;"
			/>
		</div>
		<div v-else class="g-flex g-flex-cc" style="height: 100%;">
			<div>
				<img :src="OSS_NO_MESSAGE08" alt="" style="width: 230px;">
				<div class="g-fs-14 g-m-t-10 g-tc">
					点击左侧导航查看详细内容
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { OSS_NO_MESSAGE08 } from "@constants/constants";
import EditorPreview from '@common/editor-preview/editor-preview';

export default {
	name: 'oa-material-view',
	components: {
		'oa-editor-preview': EditorPreview
	},
	props: {
		data: {
			type: Object,
			default: () => ({})
		},
		formater: Function
	},
	data() {
		return {
			OSS_NO_MESSAGE08,
			loading: false
		};
	},
	computed: {
		file() {
			if (this.formater) {
				return this.formater(this.data);
			}
			return this.data;
		}
	}
};
</script>
<style lang="scss">
.v-material-view {
	background-color: #fff;
}
</style>
